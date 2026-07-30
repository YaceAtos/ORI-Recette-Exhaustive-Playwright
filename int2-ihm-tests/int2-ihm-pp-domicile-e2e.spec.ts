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
  if (/Access Denied|AccessDenied|<Error>/i.test(bodyText)) {
    return false;
  }

  throw new Error(`Unable to validate page content for ${heading}`);
}

async function visitPage(page: Page, url: string, heading: string, blockedDescription: string) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});
  const matched = await waitForPage(page, heading);
  if (!matched) {
    noteGap(blockedDescription);
    return;
  }
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

test.describe('Chaîne PP domicile complète', () => {
  test('Scenario: Chaîne PP domicile complète', async ({ page }) => {
    const harness = new Int2BusinessHarness('chain1-pp-domicile');
    const seed: ChainSeed = await harness.seed({
      expected: {
        agence: 'Test Auto',
        produit: 'Ménage 2h',
        intervenant: 'Jean Dupont',
        client: 'Marie Martin',
        of: 'CAF Test',
      },
    });

    const agenceName = String(seed.agenceName || 'Test Auto');
    const produitName = String(seed.produitName || 'Ménage 2h');
    const intervenantName = String(seed.intervenantName || 'Jean Dupont');
    const clientName = String(seed.clientName || 'Marie Martin');
    const clientId = String(seed.clientId || '').trim();
    const ofName = String(seed.ofName || 'CAF Test');

    await test.step('Given une agence "Test Auto" existe dans la structure', async () => {
      await visitPage(page, routes.structureMarques(), 'Marques', 'Structure marques route is not accessible in this environment');
      await visitPage(page, routes.structureStructures(), 'Structures', 'Structure structures route is not accessible in this environment');
      await softTextCheck(page, new RegExp(escRegex(agenceName), 'i'), `Agence ${agenceName} is not visible in structure pages`);
    });

    await test.step('And un produit "Ménage 2h" existe dans le catalogue', async () => {
      await visitPage(page, routes.catalogueFamilles(), 'Familles et produits', 'Catalogue familles route is not accessible in this environment');
      await softTextCheck(page, new RegExp(escRegex(produitName), 'i'), `Produit ${produitName} is not visible in catalog`);
    });

    await test.step('And un intervenant "Jean Dupont" est rattaché à l agence avec dispos lundi 8h-18h', async () => {
      await visitPage(page, routes.collaborateurs(), 'Collaborateurs', 'Collaborateurs route is not accessible in this environment');
      await softTextCheck(page, new RegExp(escRegex(intervenantName), 'i'), `Intervenant ${intervenantName} is not visible in collaborateurs`);
    });

    await test.step('And un client PP "Marie Martin" est créé avec besoin qualifié', async () => {
      await page.goto(routes.clientsList(), { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle').catch(() => {});
      await waitForPage(page, 'Clients et prospects');
      await softTextCheck(page, new RegExp(escRegex(clientName), 'i'), `Client ${clientName} is not visible on clients page`);
    });

    await test.step('And un devis ménage est créé pour ce client', async () => {
      if (!clientId) {
        noteGap('Missing seeded clientId for client fiche/devis verification');
      }
      await page.goto(routes.clientFiche(clientId), { waitUntil: 'domcontentloaded' }).catch(() => {});
      await page.waitForLoadState('networkidle').catch(() => {});
      await softTextCheck(page, /devis|quote|dev/i, 'Devis ménage is not visible in this environment');
    });

    await test.step('And un OF "CAF Test" avec CDA ménage est configuré', async () => {
      await page.goto(routes.organismeFinanceurList(), { waitUntil: 'domcontentloaded' }).catch(() => {});
      await page.waitForLoadState('networkidle').catch(() => {});
      const content = await page.content().catch(() => '');
      if (/AccessDenied|Access Denied|<Error>/i.test(content)) {
        noteGap('Organismes financeurs route returned AccessDenied in this environment');
        return;
      }
      await waitForPage(page, 'Organismes financeurs').catch(() => noteGap('Organismes financeurs heading is not visible in this environment'));
      await softTextCheck(page, new RegExp(escRegex(ofName), 'i'), `OF ${ofName} is not visible in this environment`);
    });

    await test.step('And un PAP est appliqué au client', async () => {
      if (!clientId) {
        noteGap('Missing seeded clientId for PAP verification');
      }
      await page.goto(routes.clientPlanAide(clientId), { waitUntil: 'domcontentloaded' }).catch(() => {});
      await page.waitForLoadState('networkidle').catch(() => {});
      await softTextCheck(page, /PAP|Plan d.aide/i, 'PAP is not visible in this environment');
    });

    await test.step('When je crée une série d interventions récurrente (lundi 9h-11h, intervenant Jean)', async () => {
      const created = await harness.createSeries({
        clientId,
        clientName,
        intervenantName,
        produitName,
        recurrence: 'RRULE:FREQ=WEEKLY;BYDAY=MO;BYHOUR=9;BYMINUTE=0;DURATION=PT2H',
      });
      (seed as Record<string, unknown>).seriesId = created.seriesId;
      (seed as Record<string, unknown>).seriesStatus = created.status || 'Planifiée';

      await page.goto(routes.planning(), { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle').catch(() => {});
      await waitForPage(page, 'Planning');
    });

    await test.step('Then la série est en statut "Planifiée"', async () => {
      const status = String((seed as Record<string, unknown>).seriesStatus || '');
      expect(status.toLowerCase()).toContain('planifi');
      await softTextCheck(page, /Planifiée/i, 'Series status Planifiée is not visible in UI after creation');
    });

    await test.step('When le batch RRULE s exécute', async () => {
      const seriesId = String((seed as Record<string, unknown>).seriesId || '');
      if (!seriesId) noteGap('Missing seriesId for RRULE trigger');
      const batch = await harness.triggerRrule({ seriesId, horizonMonths: 12 });
      (seed as Record<string, unknown>).rruleGeneratedCount = Number(batch.generatedCount || 0);
    });

    await test.step('Then des interventions sont créées sur 12 mois glissants', async () => {
      const generated = Number((seed as Record<string, unknown>).rruleGeneratedCount || 0);
      expect(generated).toBeGreaterThan(0);

      const seriesId = String((seed as Record<string, unknown>).seriesId || '');
      const list = await harness.readInterventions({ seriesId, windowMonths: 12 });
      const interventions = Array.isArray(list.interventions) ? list.interventions : [];
      expect(interventions.length).toBeGreaterThan(0);
      (seed as Record<string, unknown>).interventions = interventions;
    });

    await test.step('And chaque intervention est en statut "Pourvue"', async () => {
      const interventions = ((seed as Record<string, unknown>).interventions as Array<Record<string, unknown>> | undefined) || [];
      expect(interventions.length).toBeGreaterThan(0);
      const allPourvue = interventions.every((it) => String(it.status || '').toLowerCase().includes('pourvu'));
      expect(allPourvue).toBeTruthy();
    });

    await test.step('When je consulte le planning vue Clients pour "Marie Martin"', async () => {
      await page.goto(routes.planning(), { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle').catch(() => {});
      await waitForPage(page, 'Planning');
      await softTextCheck(page, /Clients/i, 'Planning clients view is not visible in this environment');
      await softTextCheck(page, new RegExp(escRegex(clientName), 'i'), `${clientName} is not visible in planning clients view`);
    });

    await test.step('Then les interventions ménage sont visibles sur les lundis', async () => {
      await softTextCheck(page, /Lundi|lundis/i, 'Monday interventions are not visible in this environment');
    });

    await test.step('When je modifie l intervention du lundi suivant (9h-11h → 10h-12h)', async () => {
      const interventions = ((seed as Record<string, unknown>).interventions as Array<Record<string, unknown>> | undefined) || [];
      const target = interventions[0];
      if (!target?.id) noteGap('No intervention id available for update');
      const updated = await harness.updateIntervention({
        interventionId: target.id,
        startTime: '10:00',
        endTime: '12:00',
      });
      (seed as Record<string, unknown>).updatedIntervention = updated;
    });

    await test.step('Then l intervention est mise à jour', async () => {
      const updated = (seed as Record<string, unknown>).updatedIntervention as Record<string, unknown> | undefined;
      expect(String(updated?.status || '').length).toBeGreaterThan(0);
    });

    await test.step('And une notification est émise', async () => {
      const updated = (seed as Record<string, unknown>).updatedIntervention as Record<string, unknown> | undefined;
      const kafka = await harness.verifyKafka({
        eventType: 'INTERVENTION_UPDATED',
        correlationId: String(updated?.interventionId || ''),
      });
      expect(Boolean(kafka.found)).toBeTruthy();
    });

    await test.step('When j annule l intervention du lundi d après avec motif "Absence client" et délai respecté', async () => {
      const interventions = ((seed as Record<string, unknown>).interventions as Array<Record<string, unknown>> | undefined) || [];
      const target = interventions[1] || interventions[0];
      if (!target?.id) noteGap('No intervention id available for cancellation');
      const cancelled = await harness.cancelIntervention({
        interventionId: target.id,
        motif: 'Absence client',
      });
      (seed as Record<string, unknown>).cancelledIntervention = cancelled;
    });

    await test.step('Then l intervention passe en statut "Annulée"', async () => {
      const cancelled = (seed as Record<string, unknown>).cancelledIntervention as Record<string, unknown> | undefined;
      expect(String(cancelled?.status || '').toLowerCase()).toContain('annul');
    });

    await test.step('And l état de facturation est "Non facturée"', async () => {
      const cancelled = (seed as Record<string, unknown>).cancelledIntervention as Record<string, unknown> | undefined;
      expect(String(cancelled?.billingState || '').toLowerCase()).toContain('non factur');
    });

    await test.step('And l intervention est affichée en transparence sur le planning', async () => {
      await page.goto(routes.planning(), { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle').catch(() => {});
      await softTextCheck(page, /Annulée|Annulee/i, 'Cancelled intervention visual state is not visible in planning');
    });

    await harness.cleanup({ seed });
  });
});
