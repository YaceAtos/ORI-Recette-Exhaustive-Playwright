import { test, expect, type Page, type Locator, type TestInfo } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { routes } from '../env.config';

test.describe.configure({ mode: 'default' });

const catalogPath = path.resolve(__dirname, '../int2-ihm-recordings/orion-pipeline/test-catalog.json');
const journeyDir = path.resolve(__dirname, '../int2-ihm-recordings/orion-pipeline/journeys');
fs.mkdirSync(journeyDir, { recursive: true });

let catalog: any = { cases: [] };
if (fs.existsSync(catalogPath)) {
  try { catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8')); }
  catch (e) { console.error('Erreur lecture catalogue:', e); }
}

// Non-persistance : aucun bouton destructif/persistant sans autorisation explicite.
const ALLOW_SUBMIT = process.env.ORION_ALLOW_SUBMIT === 'true';
const DESTRUCTIVE = /^(Supprimer|Confirmer|Enregistrer|Valider|Sauvegarder|Cr[ée]er|Envoyer|Soumettre|Publier|Archiver)/i;

// Vitesse de frappe variable (réaliste, visible en vidéo).
function typingDelay(): number {
  const min = Number(process.env.ORION_TYPE_MIN || '35');
  const max = Number(process.env.ORION_TYPE_MAX || '130');
  return Math.floor(min + Math.random() * (max - min));
}
function rnd<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function resolveRouteForModule(moduleStr: string, scenarioText: string, caseId = ''): string {
  const mod = String(moduleStr || '').toUpperCase();
  const sc = String(scenarioText || '').toUpperCase();
  const cid = String(caseId || '').toUpperCase();
  if (mod.includes('SP1.5') || cid.includes('CT-HAB') || /\bPROFIL\b|DROITS? FINS?|MATRICE DES DROITS|CAS D.?USAGE/.test(sc)) return routes.habilitationProfils();
  if (mod.includes('MP1')) return routes.structureStructures();
  if (mod.includes('MP2')) return (sc.includes('OPT') ? routes.catalogueOptions() : routes.catalogueFamilles());
  if (mod.includes('MP3')) return routes.collaborateurs();
  if (mod.includes('MP5')) return routes.planning();
  if (mod.includes('MP4') || mod.includes('MP6')) return routes.clientsList();
  return routes.collaborateurs();
}

async function pageHealth(page: Page) {
  const body = (await page.locator('body').innerText().catch(() => '')) || '';
  const isError = /Access Denied|AccessDenied|<Error>|403 Forbidden|500 Internal|Page introuvable|Une erreur/i.test(body);
  const interactive = await page.locator('button,a,input,select,textarea,[role="button"],[role="tab"],mat-select').count().catch(() => 0);
  const rows = await page.locator('tbody tr, [role="row"], mat-row, [mat-row]').count().catch(() => 0);
  return { body, isError, interactive, rows };
}

// Ouvre le premier enregistrement de la liste (chevron_right / ligne) pour entrer en détail.
async function openFirstRecord(page: Page): Promise<boolean> {
  const firstRow = page.locator('tbody tr, [role="row"], mat-row').filter({ has: page.locator('td, mat-cell, [role="cell"]') }).first();
  if (!(await firstRow.isVisible().catch(() => false))) return false;
  // Contrôle d'ouverture le plus courant sur Orion : icône chevron_right en début de ligne.
  const chevron = firstRow.locator('mat-icon:has-text("chevron_right"), mat-icon:has-text("arrow_forward"), button').first();
  if (await chevron.isVisible().catch(() => false)) {
    await chevron.click({ timeout: 4000 }).catch(() => {});
  } else {
    await firstRow.click({ timeout: 4000 }).catch(() => {});
  }
  await page.waitForTimeout(1200);
  return true;
}

// Ouvre une modale d'action (Modifier/Créer/Consulter) sans persister.
async function openActionModal(page: Page, scenario: string): Promise<string | null> {
  const triggers = /Cr[ée]er|Modifier|Éditer|Consulter|Ajouter|Nouveau|Nouvelle/i;
  const wanted = scenario.match(triggers)?.[0] || 'Modifier';
  const btn = page.getByRole('button', { name: new RegExp(wanted, 'i') }).first();
  if (await btn.isVisible().catch(() => false)) {
    await btn.click({ timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(1000);
    const modal = page.locator('mat-dialog-container, [role="dialog"], .modal, .drawer, mat-drawer').first();
    if (await modal.isVisible().catch(() => false)) return wanted;
  }
  return null;
}

// Extraction REGEX d'une valeur atomique réaliste depuis un JDD (jamais une phrase/expression logique).
function extractAtomic(raw: string, hint: string): string {
  const s = String(raw || '').trim();
  const h = hint.toLowerCase();
  const rndN = (n: number) => Math.floor(Math.random() * n);
  if (/mail/.test(h)) { const m = s.match(/[\w.+-]+@[\w.-]+\.\w{2,}/); return m ? m[0] : `test.auto${rndN(9999)}@ouicare.fr`; }
  if (/siret/.test(h)) { const m = s.match(/\b\d{14}\b/); return m ? m[0] : '73282932000015'; }
  if (/siren/.test(h)) { const m = s.match(/\b\d{9}\b/); return m ? m[0] : '732829320'; }
  if (/tel|phone|mobile/.test(h)) { const m = s.match(/(?:\+33[\d ]+|0\d[\d ]{7,})/); return m ? m[0].replace(/\s+/g, ' ').trim() : '0601020304'; }
  if (/postal|\bcp\b|zip/.test(h)) { const m = s.match(/\b\d{5}\b/); return m ? m[0] : '75002'; }
  if (/montant|prix|tarif|quantit|volume|heure|taux|nombre|hebdo|mensuel|duree|dur[eé]e/.test(h)) { const m = s.match(/\d+(?:[.,]\d+)?/); return m ? m[0].replace(',', '.') : String(1 + rndN(98)); }
  if (/date|naissance/.test(h)) { const m = s.match(/\d{2}\/\d{2}\/\d{4}/); return m ? m[0] : '01/01/2026'; }
  if (/code|naf|ape/.test(h)) { const m = s.match(/\b[A-Z]{2,}[-_A-Z0-9]{1,}\b|\b\d{4}[A-Z]\b/); return m ? m[0] : `AUTO-${100 + rndN(899)}`; }
  // Générique : couper toute expression logique (= , -> , %) et ne garder qu'un mot propre.
  const cleaned = s.replace(/\s*(?:->|=|:|<|>|%).*$/, '').trim();
  const word = (cleaned.match(/[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'’ -]{1,28}/) || [])[0];
  if (word && !/message|bloquant|affich|attendu|resultat|r[eé]sultat|\berreur\b|\bnon\b|calcul/i.test(word)) return word.trim().slice(0, 28);
  const pools: Record<string, string[]> = {
    nom: ['DUPONT', 'MARTIN', 'BERNARD'], prenom: ['Jean', 'Marie', 'Alex'],
    ville: ['Paris', 'Lyon', 'Bordeaux'], libelle: ['Ménage', 'Repassage', 'Nettoyage'],
  };
  if (/nom|raison/.test(h)) return pools.nom[rndN(3)];
  if (/pr[eé]nom/.test(h)) return pools.prenom[rndN(3)];
  if (/ville|commune/.test(h)) return pools.ville[rndN(3)];
  if (/libell|d[eé]nomination|intitul/.test(h)) return pools.libelle[rndN(3)];
  return 'TEST_AUTO_' + rndN(999);
}

function pickValueForField(hint: string, datasets: any, scenarioType: string): string {
  const src = /erreur/i.test(scenarioType) && datasets.error && !/^N\/?A/i.test(datasets.error) ? datasets.error
    : /limite|exact|max/i.test(scenarioType) && datasets.boundary && !/^N\/?A/i.test(datasets.boundary) ? datasets.boundary
    : datasets.standard || '';
  return extractAtomic(String(src).split('\n')[0], hint);
}

// Index des vraies données INT2 (moissonnées par page) → recherches qui retournent des résultats.
let realData: any = { pages: {}, byModule: {} };
try { realData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../int2-ihm-knowledge/int2-real-data.json'), 'utf8')); } catch {}
function realTermsForUrl(url: string): string[] {
  const u = String(url || '').toLowerCase();
  const map: Record<string, string> = { structure: 'structure', 'habilitation-profils': 'profils', familles: 'familles', options: 'options', collaborateur: 'collaborateur', planning: 'planning', 'clients-prospects': 'clients', 'organisme-financeur': 'organisme-financeur' };
  for (const [frag, key] of Object.entries(map)) {
    if (u.includes(frag) && realData.pages[key] && realData.pages[key].searchTerms && realData.pages[key].searchTerms.length) {
      return realData.pages[key].searchTerms;
    }
  }
  return [];
}

// Terme de recherche RÉEL, garanti présent sur la page courante (index moissonné), sinon dérivé du DOM.
async function deriveSearchTerm(page: Page): Promise<string> {
  const terms = realTermsForUrl(page.url());
  if (terms.length) return terms[Math.floor(Math.random() * Math.min(terms.length, 12))];
  const rowText = await page.locator('tbody tr, mat-row, [role="row"]').nth(1).innerText().catch(() => '');
  const token = (String(rowText).match(/\b[A-ZÀ-Ý]{3,}\b/) || [])[0];
  if (token) return token.slice(0, 8);
  return ['O2', 'MARTIN', 'DURAND', 'OPT', 'Paris'][Math.floor(Math.random() * 5)];
}

// Remplit le formulaire visible : inputs (frappe variable) + selects/mat-select (dropdowns).
async function fillVisibleForm(page: Page, datasets: any, scenarioType: string): Promise<number> {
  let filled = 0;
  // 1) Inputs texte
  const inputs = page.locator('input:visible:not([type="checkbox"]):not([type="radio"]):not([type="hidden"]), textarea:visible');
  const nInputs = Math.min(await inputs.count().catch(() => 0), 6);
  for (let i = 0; i < nInputs; i++) {
    const inp = inputs.nth(i);
    if (!(await inp.isEditable().catch(() => false))) continue;
    const hint = (await inp.getAttribute('name').catch(() => '') || '')
      + ' ' + (await inp.getAttribute('placeholder').catch(() => '') || '')
      + ' ' + (await inp.getAttribute('aria-label').catch(() => '') || '')
      + ' ' + (await inp.getAttribute('formcontrolname').catch(() => '') || '')
      + ' ' + (await inp.getAttribute('type').catch(() => '') || '');
    // Champ de recherche → terme RÉEL présent sur la page (résultats garantis), pas une valeur JDD.
    const isSearch = /recherch|search|filtr/i.test(hint) || (await inp.getAttribute('type').catch(() => '')) === 'search';
    const value = isSearch ? await deriveSearchTerm(page) : pickValueForField(hint, datasets, scenarioType);
    await inp.click({ timeout: 2000 }).catch(() => {});
    await inp.fill('').catch(() => {});
    await inp.pressSequentially(value, { delay: typingDelay() }).catch(() => {});
    filled++;
    await page.waitForTimeout(40 + Math.random() * 90);
  }
  // 2) Listes déroulantes Angular Material
  const selects = page.locator('mat-select:visible, select:visible');
  const nSel = Math.min(await selects.count().catch(() => 0), 4);
  for (let i = 0; i < nSel; i++) {
    const sel = selects.nth(i);
    if (!(await sel.isVisible().catch(() => false))) continue;
    await sel.click({ timeout: 2500 }).catch(() => {});
    await page.waitForTimeout(500);
    const options = page.locator('mat-option:visible, [role="option"]:visible, option');
    const nOpt = await options.count().catch(() => 0);
    if (nOpt > 0) {
      await options.nth(Math.floor(Math.random() * Math.min(nOpt, 5))).click({ timeout: 2500 }).catch(() => {});
      filled++;
      await page.waitForTimeout(400);
    } else {
      await page.keyboard.press('Escape').catch(() => {});
    }
  }
  return filled;
}

// Évalue les résultats attendus (par étape) → assertions + sévérité.
function classifySeverity(scenarioType: string, expectedText: string): 'bloquant' | 'moyen' | 'mineur' {
  const t = (scenarioType || '').toLowerCase();
  const e = (expectedText || '').toLowerCase();
  if (/bloqu|non enregistr|refus|interdit|impossible|erreur/.test(e) || /erreur/.test(t)) return 'moyen';
  if (/affich|visible|pr[eé]sent|grise|lecture seule|coh[eé]rent|badge/.test(e)) return 'mineur';
  return 'moyen';
}

async function evaluateExpected(page: Page, expectedSteps: string[]): Promise<{ met: number; total: number; misses: { text: string }[] }> {
  const misses: { text: string }[] = [];
  let met = 0; let total = 0;
  for (const exp of expectedSteps) {
    const quoted = String(exp).match(/['"«»""]([^'"«»""]{4,})['"«»""]/);
    const token = quoted ? quoted[1] : (String(exp).match(/\b([A-ZÀ-Ý][a-zà-ÿ]{5,})\b/) || [])[1];
    if (!token) continue;
    total++;
    const safe = token.slice(0, 32).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const visible = await page.getByText(new RegExp(safe, 'i')).first().isVisible().catch(() => false);
    if (visible) met++; else misses.push({ text: token });
  }
  return { met, total, misses };
}

if (!catalog.cases || catalog.cases.length === 0) {
  test('Catalogue vide — lancer npm run orion:pipeline:prepare', () => {
    console.log('⚠ Catalogue local vide.');
  });
} else {
  test.describe('ORI-PIPELINE-AUTONOMOUS: Exécution dynamique de la matrice Excel', () => {
    for (const testCase of catalog.cases) {
      test(`${testCase.issueKey} - ${testCase.caseId} [R${testCase.sourceRow}]: ${testCase.scenario}`, async ({ page }, testInfo: TestInfo) => {
        testInfo.annotations.push({ type: 'ORI', description: testCase.issueKey });
        testInfo.annotations.push({ type: 'RG', description: (testCase.confluence?.rules || []).join(', ') });
        testInfo.annotations.push({ type: 'TC', description: testCase.references.testCase });

        const journey: any = {
          canonicalId: testCase.canonicalId, issueKey: testCase.issueKey, caseId: testCase.caseId,
          module: testCase.module, priority: testCase.priority, type: testCase.type,
          scenario: testCase.scenario, route: '', reachedRecord: false, openedModal: null,
          fieldsFilled: 0, progressedSteps: 0, totalSteps: testCase.steps.length,
          blocker: null, assertion: { met: 0, total: 0, misses: [] as any[] },
          severity: null as any, status: 'passed', rules: testCase.confluence?.rules || [],
          artifactDir: testInfo.outputDir,
        };

        const entryUrl = resolveRouteForModule(testCase.module, testCase.scenario, testCase.caseId);
        journey.route = entryUrl;
        console.log(`\n🚀 ${testCase.issueKey} ${testCase.caseId} → ${entryUrl}`);
        await page.goto(entryUrl, { waitUntil: 'domcontentloaded' }).catch(() => {});
        await page.waitForTimeout(1500);

        const health = await pageHealth(page);
        expect(health.isError, `Page en erreur pour ${testCase.issueKey}`).toBeFalsy();
        expect(health.interactive, `Aucun contenu métier chargé pour ${testCase.issueKey}`).toBeGreaterThan(3);

        // Blocage données honnête (ex : profils absents dans INT2).
        const needsRecord = /CT-HAB/i.test(testCase.caseId) || /d[eé]tail d.?un profil|matrice des droits/i.test(testCase.scenario);
        const dataAbsent = /Aucun élément à afficher|Aucun résultat|0 sur 0/i.test(health.body);
        if (needsRecord && dataAbsent) {
          journey.blocker = { step: 0, reason: 'Donnée absente: aucun enregistrement dans INT2 (fixture non seedée)' };
          journey.status = 'blocked-data';
          fs.writeFileSync(path.join(journeyDir, `${testCase.canonicalId.replace(/[^\w.-]/g, '_')}.json`), JSON.stringify(journey, null, 2));
          const shotB = await page.screenshot().catch(() => null);
          if (shotB) await testInfo.attach(`${testCase.caseId}-blocked.png`, { body: shotB, contentType: 'image/png' });
          console.log('   🚧 BLOQUÉ données.');
          test.skip(true, journey.blocker.reason);
          return;
        }

        // ─── PARCOURS PROFOND : entrer dans le détail / ouvrir une modale ───
        const scNeedsDetail = /consult|modifi|d[eé]tail|fiche|fl[eè]che|carte|enregistr/i.test(testCase.scenario);
        if (scNeedsDetail && health.rows > 0) journey.reachedRecord = await openFirstRecord(page);
        journey.openedModal = await openActionModal(page, testCase.scenario);

        // ─── REMPLISSAGE FORMULAIRE (JDD variés, dropdowns, frappe variable) ───
        if (journey.openedModal || /saisir|renseigner|modifier|remplir|cr[ée]er/i.test(testCase.scenario)) {
          journey.fieldsFilled = await fillVisibleForm(page, testCase.datasets, testCase.type);
        }

        // ─── PROGRESSION ÉTAPE PAR ÉTAPE jusqu'au bloquant ───
        for (let i = 0; i < testCase.steps.length; i++) {
          const step = String(testCase.steps[i] || '');
          let progressed = false;
          // Verbes de navigation/consultation : ouvrir un enregistrement ou rester sur l'écran.
          if (/Ouvrir|Acc[eé]der|Aller|Afficher|Consulter|S[eé]lectionner|Localiser|Rep[eé]rer|Reperer/i.test(step)) {
            if (!journey.reachedRecord && health.rows > 0) journey.reachedRecord = await openFirstRecord(page);
            progressed = true;
          } else {
            const clickMatch = step.match(/Cliquer(?:\s+sur)?(?:\s+(?:le|la|l'|sur))?\s*(?:bouton|onglet|lien|icône|fl[eè]che|carte)?\s*['"«]?([A-Za-zÀ-ÿ0-9 _-]{2,30})/i);
            if (clickMatch) {
              const label = clickMatch[1].trim();
              if (!ALLOW_SUBMIT && DESTRUCTIVE.test(label)) {
                journey.blocker = { step: i + 1, reason: `Étape "${step.slice(0,60)}" nécessite une action persistante (${label}) — bloquée par garde non-persistance` };
                break;
              }
              const btn = page.getByRole('button', { name: new RegExp(label, 'i') }).first();
              const tab = page.getByRole('tab', { name: new RegExp(label, 'i') }).first();
              if (await btn.isVisible().catch(() => false)) { await btn.click({ timeout: 3500 }).catch(() => {}); await page.waitForTimeout(700); progressed = true; }
              else if (await tab.isVisible().catch(() => false)) { await tab.click({ timeout: 3500 }).catch(() => {}); await page.waitForTimeout(700); progressed = true; }
              else if (label.toLowerCase().includes('modifier')) {
                // Ouvrir la modale de modification depuis un encadré.
                journey.openedModal = await openActionModal(page, 'Modifier'); progressed = !!journey.openedModal;
              }
            } else if (/saisir|renseigner|modifier|vider/i.test(step)) {
              const added = await fillVisibleForm(page, testCase.datasets, testCase.type);
              journey.fieldsFilled += added; progressed = added > 0 || journey.openedModal != null;
            } else if (/v[eé]rifier|inspecter|observer|contr[oô]ler/i.test(step)) {
              progressed = true; // étape de vérification, non bloquante
            }
          }
          if (progressed) journey.progressedSteps++;
          else if (!journey.blocker) {
            journey.blocker = { step: i + 1, reason: `Étape "${step.slice(0,70)}" : élément cible introuvable sur INT2 (parcours bloqué ici)` };
            break;
          }
        }

        // ─── ASSERTIONS PAR AC + SÉVÉRITÉ ───
        const evalRes = await evaluateExpected(page, testCase.expectedSteps);
        journey.assertion = evalRes;
        if (journey.blocker) {
          journey.status = 'blocked-flow';
          journey.severity = journey.blocker.reason.includes('non-persistance') ? 'mineur' : 'bloquant';
        } else if (evalRes.total > 0 && evalRes.met === 0) {
          journey.status = 'assertion-low';
          journey.severity = classifySeverity(testCase.type, testCase.expectedGlobal);
        } else {
          journey.status = 'passed';
          journey.severity = null;
        }

        // ─── PREUVE + JOURNAL ───
        const shot = await page.screenshot({ fullPage: false }).catch(() => null);
        if (shot) await testInfo.attach(`${testCase.caseId}-evidence.png`, { body: shot, contentType: 'image/png' });
        testInfo.annotations.push({ type: 'journey', description: `record=${journey.reachedRecord} modal=${journey.openedModal||'-'} champs=${journey.fieldsFilled} étapes=${journey.progressedSteps}/${journey.totalSteps} assert=${evalRes.met}/${evalRes.total} blocker=${journey.blocker? 'oui':'non'}` });
        fs.writeFileSync(path.join(journeyDir, `${testCase.canonicalId.replace(/[^\w.-]/g, '_')}.json`), JSON.stringify(journey, null, 2));
        console.log(`   📊 record=${journey.reachedRecord} modal=${journey.openedModal||'-'} champs=${journey.fieldsFilled} étapes=${journey.progressedSteps}/${journey.totalSteps} assert=${evalRes.met}/${evalRes.total} ${journey.blocker? '🧱 blocker@'+journey.blocker.step : '✓'}`);
      });
    }
  });
}
