const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const rootDir = path.resolve(__dirname, '..');
const graphFile = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'state-graph.json');
const outDir = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous');
const outFile = path.join(outDir, 'create-flow-profile.json');
const NODE_TIMEOUT_MS = Number(process.env.INT2_CREATION_PROFILE_NODE_TIMEOUT_MS || '45000');
const MAX_NODES = Number(process.env.INT2_CREATION_PROFILE_MAX_NODES || '0');

function loadGraph() {
  if (!fs.existsSync(graphFile)) {
    throw new Error(`Missing discovery graph: ${graphFile}`);
  }
  return JSON.parse(fs.readFileSync(graphFile, 'utf8'));
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function hasCreate(node) {
  const labels = node?.semantic?.buttonLabels || [];
  return labels.some((b) => /creer|create/i.test(normalizeText(b)));
}

async function closeDialog(page) {
  const closeCandidates = [
    page.getByRole('button', { name: /Fermer|Retour|Annuler|close/i }).first(),
    page.locator('button:has-text("Fermer"),button:has-text("Retour"),button:has-text("Annuler")').first(),
  ];
  for (const c of closeCandidates) {
    if (await c.isVisible().catch(() => false)) {
      await c.click().catch(() => {});
      await page.waitForTimeout(400);
      return;
    }
  }
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(300);
}

async function extractFields(page) {
  return page.evaluate(() => {
    const isVisible = (el) => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };

    const toText = (v) => (v || '').toString().trim().replace(/\s+/g, ' ');

    const inputs = Array.from(document.querySelectorAll('input, textarea, select, [role="combobox"]'))
      .filter(isVisible)
      .slice(0, 50)
      .map((el) => {
        const label =
          el.getAttribute('aria-label') ||
          el.getAttribute('placeholder') ||
          (el.id ? (document.querySelector(`label[for="${el.id}"]`)?.textContent || '') : '') ||
          '';
        const type = el.getAttribute('type') || el.tagName.toLowerCase();
        const required =
          el.hasAttribute('required') ||
          el.getAttribute('aria-required') === 'true' ||
          (el.closest('mat-form-field')?.textContent || '').includes('*');
        const disabled = el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true';
        const name = el.getAttribute('name') || '';
        return {
          label: toText(label),
          name: toText(name),
          type: toText(type),
          required,
          disabled,
        };
      });

    const buttons = Array.from(document.querySelectorAll('button, [role="button"]'))
      .filter(isVisible)
      .map((el) => toText(el.innerText || el.textContent || ''))
      .filter(Boolean)
      .slice(0, 40);

    const headings = Array.from(document.querySelectorAll('h1,h2,h3'))
      .filter(isVisible)
      .map((el) => toText(el.textContent || ''))
      .filter(Boolean)
      .slice(0, 10);

    return {
      fields: inputs,
      buttons,
      headings,
      hasDialog: !!document.querySelector('[role="dialog"], dialog'),
    };
  });
}

async function main() {
  const graph = loadGraph();
  let createNodes = (graph.nodes || []).filter((n) => !n.error && n.url && hasCreate(n));
  if (MAX_NODES > 0) {
    createNodes = createNodes.slice(0, MAX_NODES);
  }

  console.log(`INT2 creation profiler: nodes=${createNodes.length}, nodeTimeoutMs=${NODE_TIMEOUT_MS}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  const profiles = [];
  for (let idx = 0; idx < createNodes.length; idx += 1) {
    const n = createNodes[idx];
    const item = { url: n.url, id: n.id, status: 'unknown' };

    console.log(`[creation-profile] ${idx + 1}/${createNodes.length} ${n.id}`);

    const runProfile = async () => {
      await page.goto(n.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});

      const createBtn = page.getByRole('button', { name: /Créer|Create/i }).first();
      if (!(await createBtn.isVisible().catch(() => false))) {
        item.status = 'create-not-visible';
        return;
      }

      await createBtn.click().catch(() => {});
      await page.waitForTimeout(900);

      item.createOpened = true;
      item.container = (await page.getByRole('dialog').first().isVisible().catch(() => false)) ? 'dialog' : 'page';

      const extracted = await extractFields(page);
      item.fieldCount = extracted.fields.length;
      item.requiredCount = extracted.fields.filter((f) => f.required && !f.disabled).length;
      item.fields = extracted.fields;
      item.buttons = extracted.buttons;
      item.headings = extracted.headings;
      item.hasDialog = extracted.hasDialog;
      item.status = 'profiled';

      await closeDialog(page);
    };

    try {
      await Promise.race([
        runProfile(),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error(`node-timeout>${NODE_TIMEOUT_MS}ms`)), NODE_TIMEOUT_MS);
        }),
      ]);
    } catch (error) {
      item.status = 'error';
      item.error = String(error && error.message ? error.message : error);
      await closeDialog(page).catch(() => {});
    }

    profiles.push(item);
  }

  await context.close();
  await browser.close();

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    outFile,
    `${JSON.stringify({ generatedAt: new Date().toISOString(), total: profiles.length, profiles }, null, 2)}\n`,
    'utf8'
  );
  const profiled = profiles.filter((p) => p.status === 'profiled').length;
  const failed = profiles.filter((p) => p.status === 'error').length;
  console.log(`INT2 creation profile summary: profiled=${profiled}, errors=${failed}, total=${profiles.length}`);
  console.log(`INT2 creation flow profile generated: ${outFile}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
