import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { searchFirstWorkingTerm } from '../int2-ihm-helpers/int2-ihm-dataset';

type NodeSemantic = {
  pageTitle?: string;
  headings?: string[];
  buttonLabels?: string[];
  counters?: {
    buttons?: number;
    forms?: number;
    tables?: number;
    searchboxes?: number;
    dialogs?: number;
  };
};

type GraphNode = {
  id: string;
  url: string;
  semantic?: NodeSemantic;
  error?: string;
};

type GraphPayload = {
  generatedAt: string;
  baseUrl: string;
  discoveredPages: number;
  nodes: GraphNode[];
};

const strictE2E = process.env.INT2_E2E_FULL_CHAIN === 'true' || process.env.INT2_STRICT_E2E === 'true';

function isRunnablePath(pathname: string) {
  // Skip known parent/navigation routes that are not executable end-to-end pages.
  if (pathname === '/sap/' || pathname.endsWith('/pages')) return false;
  return pathname.includes('/pages/');
}

const graphPath = path.resolve(__dirname, '../int2-ihm-recordings/int2-autonomous/state-graph.json');

function loadGraph(): GraphPayload {
  if (!fs.existsSync(graphPath)) {
    throw new Error(`Missing discovery graph: ${graphPath}. Run npm run agent:int2:discover first.`);
  }

  const parsed = JSON.parse(fs.readFileSync(graphPath, 'utf8')) as GraphPayload;
  if (!Array.isArray(parsed.nodes) || parsed.nodes.length === 0) {
    throw new Error('Discovery graph contains no nodes.');
  }
  return parsed;
}

const graph = loadGraph();
const nodes = graph.nodes.filter((n) => {
  if (n.error || typeof n.url !== 'string' || n.url.length === 0) return false;
  try {
    const pathname = new URL(n.url).pathname;
    if (!isRunnablePath(pathname)) return false;
  } catch {
    return false;
  }
  const semantic = n.semantic;
  const headingCount = Array.isArray(semantic?.headings) ? semantic.headings.length : 0;
  const counters = semantic?.counters || {};
  const interactiveCount =
    Number(counters.buttons || 0) +
    Number(counters.forms || 0) +
    Number(counters.tables || 0) +
    Number(counters.searchboxes || 0);
  return headingCount > 0 || interactiveCount > 0;
});

async function closeDialogIfAny(page: Parameters<typeof test>[0]['page']) {
  const dialog = page.getByRole('dialog').first();
  const isVisible = await dialog.isVisible().catch(() => false);
  if (!isVisible) return;

  const closeCandidates = [
    page.getByRole('button', { name: 'Fermer' }).first(),
    page.getByRole('button', { name: 'Retour' }).first(),
    page.getByRole('button', { name: 'close' }).first(),
  ];

  for (const candidate of closeCandidates) {
    if (await candidate.isVisible().catch(() => false)) {
      await candidate.click();
      await page.waitForTimeout(400);
      return;
    }
  }

  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(300);
}

function toScenarioName(url: string) {
  try {
    const u = new URL(url);
    return `${u.pathname.replace(/\//g, ' > ')}`;
  } catch {
    return url;
  }
}

test.describe('INT2 Autonomous E2E - Real Page Traversal', () => {
  test('Discovery graph is valid for autonomous E2E generation', async () => {
    expect(nodes.length).toBeGreaterThan(0);
    expect(graph.baseUrl).toContain('orion-int2.itsap.net');
  });

  for (const node of nodes) {
    test(`Autonomous page validation: ${toScenarioName(node.url)}`, async ({ page }) => {
      try {
        await page.goto(node.url, { waitUntil: 'domcontentloaded' });
      } catch (error) {
        const message = String(error && (error as Error).message ? (error as Error).message : error);
        if (/ERR_ADDRESS_INVALID|net::ERR_/i.test(message)) {
          if (strictE2E) {
            throw new Error(`Strict E2E: non-routable runtime URL: ${node.url}`);
          }
          test.skip(true, `Non-routable runtime URL: ${node.url}`);
        }
        throw error;
      }
      await page.waitForLoadState('networkidle').catch(() => {});

      const semantic = node.semantic || {};
      const expectedHeading = semantic.headings?.[0];
      const anyHeading = page.locator('h1, h2, h3').first();
      const shellAnchor = page.getByRole('link', { name: 'Menu' }).first();
      const headingVisible = await anyHeading.isVisible().catch(() => false);
      const shellVisible = await shellAnchor.isVisible().catch(() => false);

      if (expectedHeading) {
        await expect(page.getByRole('heading', { name: expectedHeading }).first()).toBeVisible({ timeout: 15000 });
      } else if (!headingVisible) {
        if (!shellVisible) {
          if (strictE2E) {
            throw new Error(`Strict E2E: non-actionable runtime route: ${node.url}`);
          }
          test.skip(true, `Non-actionable runtime route: ${node.url}`);
        }
      }

      const visibleButtons = page.locator('button:visible, [role="button"]:visible');
      const tables = page.locator('table');
      const forms = page.locator('form');
      const searchboxes = page.locator('[role="searchbox"], input[type="search"], input[placeholder*="Rechercher" i]');

      const buttonCount = await visibleButtons.count();
      const tableCount = await tables.count();
      const formCount = await forms.count();
      const searchCount = await searchboxes.count();

      expect(buttonCount + tableCount + formCount + searchCount).toBeGreaterThan(0);

      if (searchCount > 0) {
        const result = await searchFirstWorkingTerm(page, { waitMs: 900 });
        test.info().annotations.push({
          type: 'jdd-search-term',
          description: `${result.term}:${result.count}`,
        });
      }

      const createButton = page.getByRole('button', { name: /Créer|Create/i }).first();
      if (await createButton.isVisible().catch(() => false)) {
        await createButton.click();
        await page.waitForTimeout(900);
        await closeDialogIfAny(page);
      }

      await closeDialogIfAny(page);

      if (expectedHeading) {
        await expect(page.getByRole('heading', { name: expectedHeading }).first()).toBeVisible({ timeout: 15000 });
      } else {
        const headingBackVisible = await page.locator('h1, h2, h3').first().isVisible().catch(() => false);
        const shellBackVisible = await shellAnchor.isVisible().catch(() => false);
        if (!headingBackVisible && shellBackVisible) {
          await expect(shellAnchor).toBeVisible({ timeout: 15000 });
        }
      }
    });
  }
});
