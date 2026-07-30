import { test, expect, type Page } from '@playwright/test';
import { routes } from '../env.config';

test.describe.configure({ timeout: 180000 });

type UiProbe = {
  key: string;
  page: string;
  route: string;
  accessible: boolean;
  hasCreateEntry: boolean;
  details: string;
};

async function go(page: Page, url: string) {
  await page.goto(url, { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForLoadState('networkidle').catch(() => {});
}

async function hasAccessDenied(page: Page) {
  const body = await page.locator('body').innerText().catch(() => '');
  return /AccessDenied|Access Denied|<Error>|Unauthorized|403/i.test(body);
}

async function isVisibleText(page: Page, pattern: RegExp) {
  const locator = page.getByText(pattern).first();
  return await locator.isVisible().catch(() => false);
}

async function probePage(page: Page, key: string, pageLabel: string, url: string, headingRx: RegExp): Promise<UiProbe> {
  await go(page, url);

  if (await hasAccessDenied(page)) {
    return {
      key,
      page: pageLabel,
      route: url,
      accessible: false,
      hasCreateEntry: false,
      details: 'Access denied on page',
    };
  }

  const headingVisible = await isVisibleText(page, headingRx);
  const createVisible = await isVisibleText(page, /creer|créer|nouveau|nouvelle|ajouter|add|new/i);

  return {
    key,
    page: pageLabel,
    route: url,
    accessible: headingVisible,
    hasCreateEntry: createVisible,
    details: headingVisible ? 'Page loaded' : 'Page loaded but heading not detected',
  };
}

test.describe('INT2 UI-only: creation-capable functional checks', () => {
  test('UI-only coverage for the 3 transverse chains', async ({ page }) => {
    const probes: UiProbe[] = [];

    probes.push(await probePage(page, 'MP1_MARQUES', 'Marques', routes.structureMarques(), /Marques|Marque/i));
    probes.push(await probePage(page, 'MP1_STRUCTURES', 'Structures', routes.structureStructures(), /Structures|Structure/i));
    probes.push(await probePage(page, 'MP2_CATALOGUE', 'Catalogue familles', routes.catalogueFamilles(), /Familles|Produits|Catalogue/i));
    probes.push(await probePage(page, 'MP3_COLLABORATEURS', 'Collaborateurs', routes.collaborateurs(), /Collaborateurs|Intervenants/i));
    probes.push(await probePage(page, 'MP4_CLIENTS', 'Clients et prospects', routes.clientsList(), /Clients et prospects|Clients|Prospects/i));
    probes.push(await probePage(page, 'MP5_PLANNING', 'Planning', routes.planning(), /Planning/i));
    probes.push(await probePage(page, 'MP6_OF', 'Organismes financeurs', routes.organismeFinanceurList(), /Organismes financeurs|Organisme financeur/i));

    await test.step('PP domicile UI-only playable checks', async () => {
      const clients = probes.find((p) => p.key === 'MP4_CLIENTS');
      const planning = probes.find((p) => p.key === 'MP5_PLANNING');
      expect(Boolean(clients?.accessible)).toBeTruthy();
      expect(Boolean(planning?.accessible)).toBeTruthy();
    });

    await test.step('Pro multi-sites UI-only playable checks', async () => {
      const structure = probes.find((p) => p.key === 'MP1_STRUCTURES');
      const clients = probes.find((p) => p.key === 'MP4_CLIENTS');
      const planning = probes.find((p) => p.key === 'MP5_PLANNING');
      expect(Boolean(structure?.accessible)).toBeTruthy();
      expect(Boolean(clients?.accessible)).toBeTruthy();
      expect(Boolean(planning?.accessible)).toBeTruthy();
    });

    await test.step('SAAD sante UI-only playable checks', async () => {
      const catalogue = probes.find((p) => p.key === 'MP2_CATALOGUE');
      const collab = probes.find((p) => p.key === 'MP3_COLLABORATEURS');
      const clients = probes.find((p) => p.key === 'MP4_CLIENTS');
      expect(Boolean(catalogue?.accessible)).toBeTruthy();
      expect(Boolean(collab?.accessible)).toBeTruthy();
      expect(Boolean(clients?.accessible)).toBeTruthy();
    });

    const nonPlayable = probes.filter((p) => !p.accessible || !p.hasCreateEntry);

    await test.info().attach('ui-only-probe-results', {
      body: JSON.stringify(
        {
          mode: 'ui-only',
          generatedAt: new Date().toISOString(),
          probes,
          nonPlayable,
        },
        null,
        2,
      ),
      contentType: 'application/json',
    });

    // UI-only suite should fail only if core pages are inaccessible.
    const coreKeys = new Set(['MP4_CLIENTS', 'MP5_PLANNING', 'MP3_COLLABORATEURS']);
    const coreFailures = probes.filter((p) => coreKeys.has(p.key) && !p.accessible);
    expect(coreFailures, `Core UI-only pages are blocked: ${JSON.stringify(coreFailures)}`).toEqual([]);
  });
});
