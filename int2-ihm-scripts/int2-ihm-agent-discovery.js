const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const BASE_URL = process.env.INT2_BASE_URL || 'https://orion-int2.itsap.net';
const START_PATH = process.env.INT2_START_PATH || '/gestion-admin/pages/collaborateur';
const MAX_PAGES = Number(process.env.INT2_DISCOVERY_MAX_PAGES || 18);

const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous');
const outGraph = path.join(outDir, 'state-graph.json');

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
    if (u.pathname.includes('/logout')) return false;
    return true;
  } catch {
    return false;
  }
}

async function retryGoto(page, url, retries = 2) {
  let lastError;
  for (let i = 0; i <= retries; i += 1) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      return;
    } catch (error) {
      lastError = error;
      if (i < retries) await page.waitForTimeout(800);
    }
  }
  throw lastError;
}

async function extractSemantics(page) {
  return page.evaluate(() => {
    const visibleText = (el) => {
      const text = (el.innerText || el.textContent || '').trim();
      return text.replace(/\s+/g, ' ');
    };

    const visibleElements = (selector) =>
      Array.from(document.querySelectorAll(selector)).filter((el) => {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
      });

    const headings = visibleElements('h1, h2, h3').map((el) => visibleText(el)).filter(Boolean);
    const buttons = visibleElements('button, [role="button"]').map((el) => visibleText(el)).filter(Boolean);
    const searchboxes = visibleElements('input[type="search"], [role="searchbox"], input[placeholder*="Rechercher" i]').length;

    return {
      pageTitle: document.title || '',
      headings: headings.slice(0, 10),
      buttonLabels: buttons.slice(0, 14),
      counters: {
        buttons: buttons.length,
        forms: document.querySelectorAll('form').length,
        tables: document.querySelectorAll('table').length,
        searchboxes,
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
      label: (a.textContent || '').trim().replace(/\s+/g, ' '),
    }));
  });

  const mapped = [];
  const seen = new Set();
  for (const item of items) {
    const abs = toAbsolute(item.href);
    if (!abs || !isAllowedUrl(abs)) continue;
    const key = new URL(abs).pathname;
    if (seen.has(key)) continue;
    seen.add(key);
    mapped.push({ url: abs, label: item.label || key });
  }
  return mapped;
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  const startUrl = `${BASE_URL}${START_PATH}`;
  const queue = [{ url: startUrl, from: null, via: 'seed' }];
  const queuedPaths = new Set([START_PATH]);
  const visited = new Set();
  const nodes = [];
  const edges = [];

  while (queue.length > 0 && visited.size < MAX_PAGES) {
    const current = queue.shift();
    const pathname = new URL(current.url).pathname;
    if (visited.has(pathname)) continue;

    try {
      await retryGoto(page, current.url, 2);
      const semantic = await extractSemantics(page);
      const targets = await collectTargets(page);

      nodes.push({
        id: pathname,
        url: current.url,
        discoveredFrom: current.from,
        discoveredVia: current.via,
        semantic,
      });

      if (current.from) {
        edges.push({ from: current.from, to: pathname, via: current.via });
      }

      visited.add(pathname);

      for (const t of targets) {
        const tPath = new URL(t.url).pathname;
        if (visited.has(tPath) || queuedPaths.has(tPath)) continue;
        queue.push({ url: t.url, from: pathname, via: t.label });
        queuedPaths.add(tPath);
      }
    } catch (error) {
      nodes.push({
        id: pathname,
        url: current.url,
        discoveredFrom: current.from,
        discoveredVia: current.via,
        error: String(error && error.message ? error.message : error),
      });
      visited.add(pathname);
    }
  }

  await context.close();
  await browser.close();

  const payload = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    startPath: START_PATH,
    maxPages: MAX_PAGES,
    discoveredPages: nodes.length,
    discoveredEdges: edges.length,
    nodes,
    edges,
  };

  fs.writeFileSync(outGraph, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`INT2 autonomous state graph generated: ${outGraph}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
