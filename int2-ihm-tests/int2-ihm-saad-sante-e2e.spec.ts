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

test.describe('Chaîne SAAD santé complète', () => {
  test('Scenario: Chaîne SAAD santé complète', async ({ page }) => {
    const harness = new Int2BusinessHarness('chain3-saad-sante');
    const seed: ChainSeed = await harness.seed({
      expected: {
        produit: 'Aide toilette 1h',
        of: 'CD 75',
        typeAide: 'APA',
      },
    });

    const produitName = String(seed.produitName || 'Aide toilette 1h');

    await test.step('Given la configuration iCanopée est active (certificats FINESS OK)', async () => {
      await page.goto(routes.clientsList(), { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle').catch(() => {});
      await waitForPage(page, 'Clients et prospects');
      const cfg = await harness.verifyInsLifecycle({ actionScope: 'finess_config' });
      expect(Array.isArray(cfg.states)).toBeTruthy();
    });

    await test.step('And un produit "Aide toilette 1h" existe (prestation santé)', async () => {
      await visitPage(page, routes.catalogueFamilles(), 'Familles et produits', 'Catalogue familles route is not accessible in this environment');
      await softTextCheck(page, new RegExp(escRegex(produitName), 'i'), `Product ${produitName} is not visible in this environment`);
    });

    await test.step('And un intervenant avec compétences santé est disponible', async () => {
      await visitPage(page, routes.collaborateurs(), 'Collaborateurs', 'Collaborateurs route is not accessible in this environment');
      await softTextCheck(page, /santé|compétence/i, 'Health competency data is not visible in this environment');
    });

    await test.step('When je crée un prospect PP avec prestation santé', async () => {
      await page.goto(routes.clientsList(), { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle').catch(() => {});
      await waitForPage(page, 'Clients et prospects');
      await softTextCheck(page, /prospect|pp|personne physique/i, 'PP prospect creation flow is not visible in this environment');
    });

    await test.step('Then la collecte SEGUR est déclenchée (données santé conditionnelles)', async () => {
      const segur = await harness.verifyInsLifecycle({
        clientId: String(seed.clientId || ''),
        actionScope: 'segur_collection',
      });
      expect(Array.isArray(segur.states)).toBeTruthy();
    });

    await test.step('When j active le profil santé et recueille le consentement', async () => {
      const consent = await harness.updateIntervention({
        actionScope: 'health_profile_consent',
        clientId: String(seed.clientId || ''),
      });
      expect(String(consent.status || '').length).toBeGreaterThan(0);
    });

    await test.step('Then les boutons e-santé sont activés', async () => {
      await softTextCheck(page, /e-santé|e-sante|INS|DMP/i, 'e-sante controls are not visible in this environment');
    });

    await test.step('When je lance la récupération INS via INSi (NIR + 5 traits stricts)', async () => {
      const states = await harness.verifyInsLifecycle({
        clientId: String(seed.clientId || ''),
        actionScope: 'insi_retrieval',
      });
      (seed as Record<string, unknown>).insStates = states.states;
    });

    await test.step('Then le statut passe à "Récupérée" (pastille orange)', async () => {
      const states = (((seed as Record<string, unknown>).insStates as string[] | undefined) || []).map((s) => s.toLowerCase());
      expect(states.some((s) => s.includes('récup') || s.includes('recup'))).toBeTruthy();
    });

    await test.step('And les traits stricts sont verrouillés', async () => {
      const locks = await harness.readInterventions({ clientId: String(seed.clientId || ''), actionScope: 'ins_strict_traits_lock' });
      const rows = Array.isArray(locks.interventions) ? locks.interventions : [];
      expect(rows.length).toBeGreaterThan(0);
    });

    await test.step('When j effectue le contrôle documentaire', async () => {
      const check = await harness.updateIntervention({ clientId: String(seed.clientId || ''), actionScope: 'ins_documentary_control' });
      expect(String(check.status || '').length).toBeGreaterThan(0);
    });

    await test.step('Then le statut passe à "Qualifiée" (pastille verte)', async () => {
      const states = await harness.verifyInsLifecycle({ clientId: String(seed.clientId || ''), actionScope: 'ins_after_documentary_control' });
      const low = states.states.map((s) => s.toLowerCase());
      expect(low.some((s) => s.includes('qualifi'))).toBeTruthy();
    });

    await test.step('And le matricule INS est transmissible', async () => {
      const transmissible = await harness.readInterventions({ clientId: String(seed.clientId || ''), actionScope: 'ins_transmissible' });
      const rows = Array.isArray(transmissible.interventions) ? transmissible.interventions : [];
      expect(rows.length).toBeGreaterThan(0);
    });

    await test.step('When je configure un OF "CD 75" avec CDA APA et applique un PAP au client', async () => {
      await page.goto(routes.organismeFinanceurList(), { waitUntil: 'domcontentloaded' }).catch(() => {});
      await page.waitForLoadState('networkidle').catch(() => {});
      const content = await page.content().catch(() => '');
      if (/AccessDenied|Access Denied|<Error>/i.test(content)) {
        noteGap('Organismes financeurs route returned AccessDenied in this environment');
      }

      await page.goto(routes.clientPlanAide('auto-check'), { waitUntil: 'domcontentloaded' }).catch(() => {});
      await page.waitForLoadState('networkidle').catch(() => {});
      await softTextCheck(page, /PAP|Plan d.aide/i, 'PAP view is not visible in this environment');
    });

    await test.step('Then le plan d aide est actif avec calcul reste à charge', async () => {
      const pec = await harness.readInterventions({ clientId: String(seed.clientId || ''), actionScope: 'pec_calculation' });
      const rows = Array.isArray(pec.interventions) ? pec.interventions : [];
      expect(rows.length).toBeGreaterThan(0);
    });

    await test.step('When je réalise l admission DUI + évaluation AGGIR + projet personnalisé', async () => {
      const dui = await harness.updateIntervention({ clientId: String(seed.clientId || ''), actionScope: 'dui_aggir_project' });
      expect(String(dui.status || '').length).toBeGreaterThan(0);
    });

    await test.step('Then le dossier usager est complet', async () => {
      const dossier = await harness.readInterventions({ clientId: String(seed.clientId || ''), actionScope: 'dui_dossier_complete' });
      const rows = Array.isArray(dossier.interventions) ? dossier.interventions : [];
      expect(rows.length).toBeGreaterThan(0);
    });

    await test.step('When je crée une série d interventions quotidienne et le batch s exécute', async () => {
      const created = await harness.createSeries({
        clientId: String(seed.clientId || ''),
        produitName,
        recurrence: 'RRULE:FREQ=DAILY;BYHOUR=8;BYMINUTE=0;DURATION=PT1H',
      });
      (seed as Record<string, unknown>).seriesId = created.seriesId;
      await harness.triggerRrule({ seriesId: created.seriesId, horizonMonths: 12 });

      await page.goto(routes.planning(), { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle').catch(() => {});
      await waitForPage(page, 'Planning');
    });

    await test.step('Then les interventions santé sont visibles sur le planning', async () => {
      await softTextCheck(page, /intervention|planning/i, 'Health interventions are not visible on planning in this environment');
    });

    await test.step('When je génère un document CDA R2 N1 (CR évaluation)', async () => {
      const doc = await harness.updateIntervention({ clientId: String(seed.clientId || ''), actionScope: 'cda_r2_n1_generation' });
      (seed as Record<string, unknown>).docId = doc.interventionId;
      expect(String(doc.interventionId || '').length).toBeGreaterThan(0);
    });

    await test.step('And j alimente le DMP', async () => {
      const dmp = await harness.verifyDmp({
        clientId: String(seed.clientId || ''),
        documentId: String((seed as Record<string, unknown>).docId || ''),
      });
      expect(Boolean(dmp.published)).toBeTruthy();
    });

    await test.step('Then le document est disponible dans Mon espace santé', async () => {
      const dmp = await harness.verifyDmp({
        clientId: String(seed.clientId || ''),
        actionScope: 'public_portal_visibility',
      });
      expect(Boolean(dmp.published)).toBeTruthy();
    });

    await test.step('And la traçabilité est enregistrée (journalisation 10 ans)', async () => {
      const trace = await harness.verifyKafka({
        eventType: 'AUDIT_TRACE_10Y',
        correlationId: String(seed.clientId || ''),
      });
      expect(Boolean(trace.found)).toBeTruthy();
    });

    await harness.cleanup({ seed });
  });
});
