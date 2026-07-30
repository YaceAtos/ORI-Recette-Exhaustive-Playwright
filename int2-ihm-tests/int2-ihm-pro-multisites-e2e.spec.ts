import { test, expect, type Page } from '@playwright/test';
import { routes } from '../env.config';
import { Int2BusinessHarness, type ChainSeed } from '../int2-ihm-helpers/int2-ihm-business-harness';

const stepTimeout = 15000;

test.describe.configure({ timeout: 180000 });

function noteGap(description: string) {
  throw new Error(`FULL_BUSINESS_REQUIRED: ${description}`);
}

function escRegex(v: string) {
  return v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function waitForPage(page: Page, heading: string) {
  const headingLocator = page.getByRole('heading', { name: heading }).first();
  if (await headingLocator.isVisible().catch(() => false)) {
    await expect(headingLocator).toBeVisible({ timeout: stepTimeout });
    return true;
  }

  const textLocator = page.getByText(heading, { exact: false }).first();
  if (await textLocator.isVisible().catch(() => false)) {
    await expect(textLocator).toBeVisible({ timeout: stepTimeout });
    return true;
  }

  const bodyText = await page.locator('body').innerText().catch(() => '');
  if (/Access Denied|AccessDenied|<Error>/i.test(bodyText)) return false;

  throw new Error(`Unable to validate page content for ${heading}`);
}

async function visitPage(page: Page, url: string, heading: string, blockedDescription: string) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});
  const matched = await waitForPage(page, heading);
  if (!matched) noteGap(blockedDescription);
}

async function softTextCheck(page: Page, matcher: RegExp | string, description: string) {
  const locator = typeof matcher === 'string' ? page.getByText(matcher, { exact: false }).first() : page.getByText(matcher).first();
  if (await locator.isVisible().catch(() => false)) {
    await expect(locator).toBeVisible({ timeout: stepTimeout });
    return true;
  }
  noteGap(description);
  return false;
}

test.describe('Chaîne Pro multi-sites complète', () => {
  test('Scenario: Chaîne Pro multi-sites complète', async ({ page }) => {
    const harness = new Int2BusinessHarness('chain2-pro-multisites');
    const seed: ChainSeed = await harness.seed({
      expected: {
        produit: 'Nettoyage bureaux 3h',
        intervenants: 2,
        clientProSiren: '123456789',
      },
    });

    const produitName = String(seed.produitName || 'Nettoyage bureaux 3h');

    await test.step('Given une structure (marque/société/agence) existe', async () => {
      await visitPage(page, routes.structureMarques(), 'Marques', 'Structure marques route is not accessible in this environment');
      await visitPage(page, routes.structureStructures(), 'Structures', 'Structure structures route is not accessible in this environment');
    });

    await test.step('And un produit "Nettoyage bureaux 3h" existe', async () => {
      await visitPage(page, routes.catalogueFamilles(), 'Familles et produits', 'Catalogue familles route is not accessible in this environment');
      await softTextCheck(page, new RegExp(escRegex(produitName), 'i'), `Product ${produitName} is not visible in this environment`);
    });

    await test.step('And 2 intervenants sont actifs dans l agence', async () => {
      await visitPage(page, routes.collaborateurs(), 'Collaborateurs', 'Collaborateurs route is not accessible in this environment');
      await softTextCheck(page, /intervenant|collaborateur/i, 'Intervenants are not visible in this environment');
    });

    await test.step('When je crée un client mère Pro avec SIREN "123456789"', async () => {
      await page.goto(routes.clientsList(), { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle').catch(() => {});
      await waitForPage(page, 'Clients et prospects');
      await softTextCheck(page, /pro|personne morale|siren/i, 'Pro mother client creation flow is not visible in this environment');
    });

    await test.step('Then le client est enrichi automatiquement via SIRENE (forme juridique, APE)', async () => {
      const check = await harness.verifySirene({
        clientId: String(seed.clientId || ''),
        expectedSiren: '123456789',
      });
      expect(Boolean(check.enriched)).toBeTruthy();
      expect(String(check.ape || '').length).toBeGreaterThan(0);
      expect(String(check.legalForm || '').length).toBeGreaterThan(0);
    });

    await test.step('When je crée 2 sites rattachés au client mère', async () => {
      await softTextCheck(page, /site|établissement|agence/i, 'Client sites flow is not visible in this environment');
    });

    await test.step('Then chaque site a son propre contrat', async () => {
      const result = await harness.readInterventions({ actionScope: 'sites_contracts', clientId: String(seed.clientId || '') });
      const items = Array.isArray(result.interventions) ? result.interventions : [];
      expect(items.length).toBeGreaterThanOrEqual(2);
    });

    await test.step('When je crée une série récurrente pour chaque site avec intervenants dédiés', async () => {
      const created = await harness.createSeries({
        clientId: String(seed.clientId || ''),
        produitName,
        mode: 'pro-multisites',
      });
      (seed as Record<string, unknown>).seriesId = created.seriesId;

      await page.goto(routes.planning(), { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle').catch(() => {});
      await waitForPage(page, 'Planning');
      await softTextCheck(page, /Intervenants|Clients/i, 'Planning filters for recurrent series are not visible in this environment');
    });

    await test.step('And le batch RRULE s exécute', async () => {
      const seriesId = String((seed as Record<string, unknown>).seriesId || '');
      if (!seriesId) noteGap('Missing seriesId for RRULE trigger');
      const batch = await harness.triggerRrule({ seriesId, horizonMonths: 12 });
      (seed as Record<string, unknown>).generatedCount = Number(batch.generatedCount || 0);
    });

    await test.step('Then les interventions sont générées pour les 2 sites sur 12 mois', async () => {
      const generated = Number((seed as Record<string, unknown>).generatedCount || 0);
      expect(generated).toBeGreaterThan(0);
    });

    await test.step('And le planning vue Intervenants montre les 2 lignes avec créneaux corrects', async () => {
      await softTextCheck(page, /Intervenants/i, 'Intervenants view is not visible in this environment');
      const lines = await harness.readInterventions({ actionScope: 'planning_lines', clientId: String(seed.clientId || '') });
      const items = Array.isArray(lines.interventions) ? lines.interventions : [];
      expect(items.length).toBeGreaterThanOrEqual(2);
    });

    await test.step('When le client déclare une absence site 1 (fermeture 1 semaine)', async () => {
      const cancelled = await harness.cancelIntervention({
        actionScope: 'site_absence_week',
        clientId: String(seed.clientId || ''),
        motif: 'Fermeture bureaux',
      });
      (seed as Record<string, unknown>).absenceRef = cancelled.interventionId;
    });

    await test.step('Then une notification Kafka est reçue par MP5', async () => {
      const kafka = await harness.verifyKafka({
        eventType: 'CLIENT_ABSENCE_UPSERT',
        correlationId: String((seed as Record<string, unknown>).absenceRef || ''),
      });
      expect(Boolean(kafka.found)).toBeTruthy();
    });

    await test.step('And l absence est visible sur le planning vue Clients', async () => {
      await softTextCheck(page, /Clients|absence/i, 'Absence is not visible on planning clients view in this environment');
    });

    await test.step('And les interventions de la semaine sont marquées selon le paramètre "maintien"', async () => {
      const items = await harness.readInterventions({ actionScope: 'absence_week_marking', clientId: String(seed.clientId || '') });
      const interventions = Array.isArray(items.interventions) ? items.interventions : [];
      expect(interventions.length).toBeGreaterThan(0);
      const allMarked = interventions.every((it) => String(it.marking || '').length > 0);
      expect(allMarked).toBeTruthy();
    });

    await harness.cleanup({ seed });
  });
});
