const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const BASE_URL = process.env.INT2_BASE_URL || 'https://orion-int2.itsap.net';
const START_PATH = process.env.INT2_START_PATH || '/gestion-admin/pages/collaborateur';
const MAX_PAGES = Number(process.env.INT2_DISCOVERY_MAX_PAGES || '220');
const MAX_INTERACTIONS_PER_PAGE = Number(process.env.INT2_DEEP_MAX_INTERACTIONS || '20');
const INCLUDE_DOC_ROUTES = process.env.INT2_INCLUDE_DOC_ROUTES !== 'false';

const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous');
const outGraph = path.join(outDir, 'state-graph.json');
const docsDir = path.join(rootDir, 'docs');

function toAbsolute(href) {
  if (!href) return null;
  if (href.startsWith('http://') || href.startsWith('https://')) return href;
  if (!href.startsWith('/')) return null;
  return `${BASE_URL}${href}`;
}

function isAllowedUrl(url) {
  try {
    const u = new URL(url);
    if (u.origin !== BASE_URL) return false;
    if (!u.pathname.startsWith('/')) return false;
    if (/\/logout/i.test(u.pathname)) return false;
    return true;
  } catch {
    return false;
  }
}

function collectDocRouteSeeds() {
  if (!INCLUDE_DOC_ROUTES || !fs.existsSync(docsDir)) return [];

  const seeds = new Set();
  const files = fs.readdirSync(docsDir).filter((f) => f.endsWith('.md'));
  const routeRegex = /\/(?:[a-z0-9-]+\/)+pages\/[a-z0-9-\/]+/gi;

  for (const fileName of files) {
    const content = fs.readFileSync(path.join(docsDir, fileName), 'utf8');
    const matches = content.match(routeRegex) || [];
    for (const m of matches) {
      const cleaned = String(m).replace(/[)\]>'".,;:!?]+$/g, '');
      if (cleaned.startsWith('/')) seeds.add(cleaned);
    }
  }

  return Array.from(seeds);
}

function normalizedLabel(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function isSafeExplorerAction(label) {
  const text = normalizedLabel(label).toLowerCase();
  if (!text) return false;
  if (text.length > 70) return false;

  const blocked = [
    /enregistrer|save|valider|soumettre|submit|supprimer|delete|confirmer|import csv|export csv/,
    /ajouter$/,
    /^oui$|^non$/,
  ];
  if (blocked.some((r) => r.test(text))) return false;

  const preferred = [
    /creer|create|menu|catalogue|configuration|structure|profils|clients|collaborateurs|partenariats|facturation|habilitations|dmn|agence|pages?|navigation/,
    /keyboard_arrow_(down|up|right|left)/,
  ];
  return preferred.some((r) => r.test(text));
}

async function retryGoto(page, url, retries = 2) {
  let lastError;
  for (let i = 0; i <= retries; i += 1) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});
      return;
    } catch (error) {
      lastError = error;
      if (i < retries) await page.waitForTimeout(800);
    }
  }
  throw lastError;
}

async function closeOverlays(page) {
  const candidates = [
    page.getByRole('button', { name: /Fermer|Close|Annuler|Quitter sans enregistrer/i }).first(),
    page.locator('[role="dialog"] button:has-text("Fermer")').first(),
  ];
  for (const c of candidates) {
    if (await c.isVisible().catch(() => false)) {
      await c.click().catch(() => {});
      await page.waitForTimeout(250);
    }
  }
  await page.keyboard.press('Escape').catch(() => {});
}

async function extractSemantics(page) {
  return page.evaluate(() => {
    const visibleElements = (selector) =>
      Array.from(document.querySelectorAll(selector)).filter((el) => {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
      });

    const text = (el) => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
    const headings = visibleElements('h1, h2, h3').map(text).filter(Boolean);
    const buttons = visibleElements('button, [role="button"], [role="menuitem"]').map(text).filter(Boolean);

    return {
      pageTitle: document.title || '',
      headings: headings.slice(0, 16),
      buttonLabels: buttons.slice(0, 24),
      counters: {
        buttons: buttons.length,
        forms: document.querySelectorAll('form').length,
        tables: document.querySelectorAll('table').length,
        searchboxes: document.querySelectorAll('input[type="search"], [role="searchbox"], input[placeholder*="Rechercher" i]').length,
        dialogs: document.querySelectorAll('[role="dialog"], dialog').length,
      },
    };
  });
}

async function collectTargets(page) {
  const items = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a[href]'));
    return anchors.map((a) => ({
      href: a.getAttribute('href') || '',
      label: (a.textContent || '').replace(/\s+/g, ' ').trim(),
    }));
  });

  const out = [];
  const seen = new Set();
  for (const item of items) {
    const abs = toAbsolute(item.href);
    if (!abs || !isAllowedUrl(abs)) continue;
    const key = new URL(abs).pathname;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ url: abs, label: item.label || key });
  }
  return out;
}

async function collectActionLabels(page) {
  const labels = await page.evaluate(() => {
    const candidates = Array.from(document.querySelectorAll('button, [role="button"], [role="menuitem"]'));
    const visible = candidates.filter((el) => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
    });
    return visible.map((el) => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim()).filter(Boolean);
  });

  const unique = [];
  const seen = new Set();
  for (const label of labels) {
    const n = normalizedLabel(label);
    if (!n || seen.has(n)) continue;
    seen.add(n);
    unique.push(n);
  }
  return unique;
}

async function exploreActions(page, currentPath) {
  const discovered = [];
  const labels = await collectActionLabels(page);

  let interactions = 0;
  for (const label of labels) {
    if (interactions >= MAX_INTERACTIONS_PER_PAGE) break;
    if (!isSafeExplorerAction(label)) continue;

    const pathBefore = new URL(page.url()).pathname;
    const button = page.getByRole('button', { name: label }).first();
    const menuItem = page.getByRole('menuitem', { name: label }).first();

    let clicked = false;
    if (await button.isVisible().catch(() => false)) {
      await button.click().catch(() => {});
      clicked = true;
    } else if (await menuItem.isVisible().catch(() => false)) {
      await menuItem.click().catch(() => {});
      clicked = true;
    } else {
      const fallback = page.locator(`button:has-text("${label}"), [role="button"]:has-text("${label}"), [role="menuitem"]:has-text("${label}")`).first();
      if (await fallback.isVisible().catch(() => false)) {
        await fallback.click().catch(() => {});
        clicked = true;
      }
    }

    if (!clicked) continue;

    interactions += 1;
    await page.waitForTimeout(350);
    await page.waitForLoadState('domcontentloaded').catch(() => {});

    const pathAfter = new URL(page.url()).pathname;
    if (pathAfter !== pathBefore && isAllowedUrl(page.url())) {
      discovered.push({
        url: page.url(),
        label,
        from: currentPath,
      });
    }

    const extra = await collectTargets(page);
    for (const t of extra) {
      discovered.push({ url: t.url, label: t.label || label, from: currentPath });
    }

    await closeOverlays(page);
  }

  return discovered;
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  const seedUrl = `${BASE_URL}${START_PATH}`;
  const queue = [{ url: seedUrl, from: null, via: 'seed' }];
  const queued = new Set([START_PATH]);

  const docSeeds = collectDocRouteSeeds();
  for (const pathSeed of docSeeds) {
    if (queued.has(pathSeed)) continue;
    queued.add(pathSeed);
    queue.push({ url: `${BASE_URL}${pathSeed}`, from: null, via: 'docs-seed' });
  }
  const visited = new Set();
  const nodes = [];
  const edges = [];

  while (queue.length > 0 && visited.size < MAX_PAGES) {
    const current = queue.shift();
    const pathId = new URL(current.url).pathname;
    if (visited.has(pathId)) continue;

    try {
      await retryGoto(page, current.url, 2);

      const semantic = await extractSemantics(page);
      nodes.push({
        id: pathId,
        url: current.url,
        discoveredFrom: current.from,
        discoveredVia: current.via,
        semantic,
      });

      if (current.from) edges.push({ from: current.from, to: pathId, via: current.via });
      visited.add(pathId);

      const linkTargets = await collectTargets(page);
      const actionTargets = await exploreActions(page, pathId);
      const allTargets = [...linkTargets.map((t) => ({ ...t, from: pathId })), ...actionTargets];

      for (const t of allTargets) {
        if (!isAllowedUrl(t.url)) continue;
        const tPath = new URL(t.url).pathname;
        if (visited.has(tPath) || queued.has(tPath)) continue;
        queued.add(tPath);
        queue.push({ url: t.url, from: t.from || pathId, via: t.label || tPath });
      }
    } catch (error) {
      nodes.push({
        id: pathId,
        url: current.url,
        discoveredFrom: current.from,
        discoveredVia: current.via,
        error: String(error && error.message ? error.message : error),
      });
      visited.add(pathId);
    }
  }

  await context.close();
  await browser.close();

  const payload = {
    generatedAt: new Date().toISOString(),
    mode: 'deep-navigation',
    baseUrl: BASE_URL,
    startPath: START_PATH,
    includeDocRoutes: INCLUDE_DOC_ROUTES,
    docSeedCount: docSeeds.length,
    maxPages: MAX_PAGES,
    maxInteractionsPerPage: MAX_INTERACTIONS_PER_PAGE,
    discoveredPages: nodes.length,
    discoveredEdges: edges.length,
    nodes,
    edges,
  };

  fs.writeFileSync(outGraph, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`INT2 deep autonomous state graph generated: ${outGraph}`);
  console.log(`Discovered pages: ${nodes.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
