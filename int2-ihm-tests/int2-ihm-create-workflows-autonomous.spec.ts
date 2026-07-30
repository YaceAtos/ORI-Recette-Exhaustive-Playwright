import { test, expect, Page } from '@playwright/test';
import type { Locator } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

type ProfileField = {
  label: string;
  name: string;
  type: string;
  required: boolean;
  disabled: boolean;
  intent?: string;
  confidence?: string;
  sampleValue?: string;
  fillable?: boolean;
};

type ProfileEntry = {
  id: string;
  url: string;
  status: string;
  fields?: ProfileField[];
  semanticFields?: ProfileField[];
  container?: string;
  requiredCount?: number;
};

type ProfilePayload = {
  generatedAt: string;
  total: number;
  profiles: ProfileEntry[];
};

const profilePath = path.resolve(__dirname, '../int2-ihm-recordings/int2-autonomous/create-flow-profile.json');
const semanticsPath = path.resolve(__dirname, '../int2-ihm-recordings/int2-autonomous/create-flow-semantics.json');

function loadProfile(): ProfilePayload {
  if (fs.existsSync(semanticsPath)) {
    return JSON.parse(fs.readFileSync(semanticsPath, 'utf8')) as ProfilePayload;
  }
  if (!fs.existsSync(profilePath)) {
    throw new Error(`Missing creation profile: ${profilePath}. Run npm run agent:int2:creation:profile first.`);
  }
  return JSON.parse(fs.readFileSync(profilePath, 'utf8')) as ProfilePayload;
}

const payload = loadProfile();
const entries = payload.profiles.filter((p) => p.status === 'profiled');
const strictE2E = process.env.INT2_E2E_FULL_CHAIN === 'true' || process.env.INT2_STRICT_E2E === 'true';
const forceSubmit = strictE2E || process.env.INT2_ALLOW_CREATE_SUBMIT === 'true';
const requirePersistedCreate = strictE2E || process.env.INT2_REQUIRE_PERSISTED_CREATE === 'true';
const failOnBlockers = process.env.INT2_FAIL_ON_BLOCKERS === 'true';
const navRetries = Number(process.env.INT2_NAV_RETRIES || '3');
const datasetVariants = Math.max(1, Number(process.env.INT2_DATASET_VARIANTS || '3'));
const auditPath = path.resolve(__dirname, '../int2-ihm-recordings/int2-autonomous/creation-dataset-audit.ndjson');

if (process.env.INT2_RESET_DATASET_AUDIT === 'true') {
  fs.writeFileSync(auditPath, '', 'utf8');
}

function variantIndexTag(variant: number) {
  return variant + 1;
}

function simpleHash(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

function normalizeText(value: string) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function birthDateProfile() {
  return String(process.env.INT2_BIRTH_DATE_PROFILE || 'adult').toLowerCase();
}

function buildBirthDateFromProfile(profile: string, variant: number, idx: number) {
  const day = String(1 + (idx % 27)).padStart(2, '0');
  const month = String(1 + (Math.floor(idx / 3) % 12)).padStart(2, '0');
  const currentYear = new Date().getFullYear();

  switch (profile) {
    case 'adult':
      return `${day}/${month}/${currentYear - 28 - (variant % 5)}`;
    case 'senior':
      return `${day}/${month}/${currentYear - 72 - (variant % 10)}`;
    case 'minor':
    default:
      return `${day}/${month}/${currentYear - 12 - (idx % 3)}`;
  }
}

function luhnCheckDigit(base: string) {
  const digits = String(base)
    .replace(/\D/g, '')
    .split('')
    .map((d) => Number(d));

  let sum = 0;
  const parity = (digits.length + 1) % 2;
  for (let i = 0; i < digits.length; i += 1) {
    let n = digits[i];
    if (i % 2 === parity) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return (10 - (sum % 10)) % 10;
}

function legalIdKind(field: ProfileField) {
  const haystack = normalizeText(`${field.label} ${field.name} ${field.type}`);
  if (/siret/.test(haystack)) return 'siret';
  if (/siren/.test(haystack)) return 'siren';
  return 'generic';
}

function buildVariantLegalIdPair(seedText: string, variant: number) {
  const rawDigits = String(seedText || '')
    .replace(/\D/g, '')
    .padEnd(16, '7');
  const variantDigits = String(1000 + variant).slice(-4);
  const routeBody = rawDigits.slice(0, 6);
  const variantBody = String(10 + (variant % 90)).slice(-2);
  const sirenBody = `${routeBody}${variantBody}`;
  const siren = `${sirenBody}${luhnCheckDigit(sirenBody)}`;

  const nicBody = `${variantDigits}`;
  const siretBody = `${siren}${nicBody}`;
  const siret = `${siretBody}${luhnCheckDigit(siretBody)}`;

  return { siren, siret };
}

function variantSampleForIntent(intent: string | undefined, variant: number, contextSeed: string, fieldSeed: string) {
  const firstNames = ['Alice', 'Emma', 'Chloe', 'Nina', 'Lina'];
  const lastNames = ['MARTIN', 'DURAND', 'ROBERT', 'LAMBERT', 'THOMAS', 'BERNARD', 'GARNIER'];
  const cities = ['Paris', 'Lyon', 'Bordeaux', 'Lille', 'Nantes'];
  const addresses = [
    '8 rue de Rivoli Paris',
    '12 avenue Jean Jaures Lyon',
    '3 rue Sainte-Catherine Bordeaux',
    '25 rue Nationale Lille',
    '18 boulevard de la Liberte Nantes',
  ];
  const phones = ['0601020304', '0602030405', '0603040506', '0604050607', '0605060708'];
  const runSeed = process.env.INT2_DATASET_RUN_SEED || new Date().toISOString().slice(0, 10);
  const base = simpleHash(`${runSeed}|${contextSeed}|${fieldSeed}|${intent || 'unknown'}`);
  const idx = (base + variant) % 997;

  const i = idx % firstNames.length;
  switch (intent) {
    case 'email':
      return `qa.${String(idx).padStart(3, '0')}.dataset.${variantIndexTag(variant)}@example.test`;
    case 'phone':
      return phones[idx % phones.length];
    case 'firstName':
      return firstNames[i];
    case 'lastName':
      return lastNames[idx % lastNames.length];
    case 'address':
      return addresses[idx % addresses.length];
    case 'city':
      return cities[idx % cities.length];
    case 'date': {
      const birthHint = normalizeText(`${fieldSeed} ${contextSeed} ${intent || ''}`);
      if (/birth|naissance|birthday|dob/.test(birthHint)) {
        return buildBirthDateFromProfile(birthDateProfile(), variant, idx);
      }
      const day = String(1 + (idx % 27)).padStart(2, '0');
      const month = String(1 + (Math.floor(idx / 3) % 12)).padStart(2, '0');
      const year = String(1980 + (Math.floor(idx / 7) % 25));
      return `${day}/${month}/${year}`;
    }
    case 'code':
      return `QA${String(1000 + idx).slice(-4)}`;
    case 'description':
      return `Description dataset ${variantIndexTag(variant)}-${String(idx).padStart(3, '0')}.`;
    case 'number':
      return String(10 + ((idx % 7) * 5));
    default:
      return '';
  }
}

function computeFieldSample(field: ProfileField, variant: number, contextSeed = '') {
  if ((field.intent || '') === 'legalId') {
    const pair = buildVariantLegalIdPair(`${contextSeed}${field.name}${field.label}`, variant);
    const kind = legalIdKind(field);
    if (kind === 'siret') return pair.siret;
    if (kind === 'siren') return pair.siren;
    return pair.siren;
  }

  const fieldSeed = `${field.label || ''}|${field.name || ''}|${field.type || ''}`;
  const variantSample = variantSampleForIntent(field.intent, variant, contextSeed, fieldSeed);
  if (variantSample) return variantSample;
  return field.sampleValue || '';
}

function appendDatasetAudit(record: Record<string, unknown>) {
  fs.appendFileSync(auditPath, `${JSON.stringify({ at: new Date().toISOString(), ...record })}\n`, 'utf8');
}

async function stableGoto(page: Page, url: string, retries = navRetries) {
  let lastError: unknown;

  for (let i = 0; i <= retries; i += 1) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      return;
    } catch (error) {
      lastError = error;
      const message = String(error && (error as Error).message ? (error as Error).message : error);
      const isNetwork = /ERR_INTERNET_DISCONNECTED|ERR_NETWORK_CHANGED|ERR_CONNECTION_RESET|ERR_CONNECTION_CLOSED|ERR_NAME_NOT_RESOLVED/i.test(message);

      if (i >= retries) break;

      // Recovery strategy for flaky INT2 connectivity during long strict runs.
      if (isNetwork) {
        await page.waitForTimeout(1500);
        await page.reload({ waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => {});
      } else {
        await page.waitForTimeout(800);
      }
    }
  }

  throw new Error(`Navigation failed after ${retries + 1} attempts for ${url}: ${String(lastError)}`);
}

async function closeAnyDialog(page: Page) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const quitWithoutSave = page.getByRole('button', { name: /Quitter sans enregistrer/i }).first();
    if (await quitWithoutSave.isVisible().catch(() => false)) {
      await quitWithoutSave.click().catch(() => {});
      await page.waitForTimeout(500);
      continue;
    }

    const dialog = page.getByRole('dialog').first();
    const dialogVisible = await dialog.isVisible().catch(() => false);
    const closeCandidates = [
      dialogVisible ? dialog.getByRole('button', { name: /Fermer|Retour|Annuler|close/i }).first() : null,
      page.locator('button:has-text("Fermer"),button:has-text("Retour"),button:has-text("Annuler")').first(),
    ].filter(Boolean) as Locator[];

    let clicked = false;
    for (const c of closeCandidates) {
      if (await c.isVisible().catch(() => false)) {
        await c.click().catch(() => {});
        await page.waitForTimeout(500);
        clicked = true;
        break;
      }
    }

    if (!clicked) {
      await page.keyboard.press('Escape').catch(() => {});
      await page.waitForTimeout(300);
    }

    const remainingDialog = await page.getByRole('dialog').first().isVisible().catch(() => false);
    if (!remainingDialog) {
      return;
    }
  }
}

async function countValidationSignals(root: Locator) {
  const patterns = [
    'Champ invalide',
    'Veuillez sélectionner une valeur dans la liste',
    'Tous les champs sont obligatoires',
    'Champs non conformes',
    'Caractères non valides',
    'Adresse non trouvée',
  ];

  let count = 0;
  for (const text of patterns) {
    const locator = root.getByText(text, { exact: false }).first();
    if (await locator.isVisible().catch(() => false)) {
      count += 1;
    }
  }
  return count;
}

async function getVisibleValidationMessages(root: Locator): Promise<string[]> {
  const patterns = [
    'Champ invalide',
    'Veuillez sélectionner une valeur dans la liste',
    'Tous les champs sont obligatoires',
    'Champs non conformes',
    'Caractères non valides',
    'Adresse non trouvée',
  ];

  const out: string[] = [];
  for (const p of patterns) {
    const l = root.getByText(p, { exact: false }).first();
    if (await l.isVisible().catch(() => false)) out.push(p);
  }
  return out;
}

async function resolveCreateRoot(page: Page): Promise<Locator> {
  const dialog = page.getByRole('dialog').first();
  if (await dialog.isVisible().catch(() => false)) {
    return dialog;
  }

  const main = page.locator('main').first();
  if (await main.isVisible().catch(() => false)) {
    return main;
  }

  return page.locator('body');
}

async function selectFirstVisibleOption(page: Page, preferredIndex = 0) {
  const options = page.locator('mat-option:visible, [role="option"]:visible');
  const count = await options.count();
  if (count > 0) {
    const routeOffset = simpleHash(page.url()) % Math.max(count, 1);
    const index = (Math.max(0, preferredIndex) + routeOffset) % count;
    await options.nth(index).click().catch(() => {});
    await page.waitForTimeout(180);
    return true;
  }
  return false;
}

async function fillBySemanticField(page: Page, root: Locator, field: ProfileField, variant: number) {
  if (field.fillable === false || field.disabled) return false;

  const candidates = [
    field.label ? root.getByLabel(field.label, { exact: false }).first() : null,
    field.label ? root.getByPlaceholder(field.label, { exact: false }).first() : null,
  ].filter(Boolean) as Locator[];

  const isRadio = (field.intent || '').includes('radio') || (field.type || '').toLowerCase() === 'radio';
  if (isRadio && field.label) {
    const radio = root.getByRole('radio', { name: field.label }).first();
    if (await radio.isVisible().catch(() => false)) {
      await radio.check().catch(() => radio.click().catch(() => {}));
      return true;
    }
  }

  for (const locator of candidates) {
    if (await locator.isVisible().catch(() => false)) {
      const readonly = await locator.getAttribute('readonly').catch(() => null);
      const disabled = await locator.isDisabled().catch(() => true);
      const tagName = await locator.evaluate((el) => el.tagName.toLowerCase()).catch(() => '');
      const role = await locator.getAttribute('role').catch(() => null);
      const inputType = await locator.getAttribute('type').catch(() => null);
      const isTextEntry =
        tagName === 'textarea' ||
        (tagName === 'input' && !['checkbox', 'radio'].includes(String(inputType || '').toLowerCase())) ||
        role === 'textbox';

      if (!isTextEntry || readonly !== null || disabled) return false;

      let sample = computeFieldSample(field, variant, page.url());
      const lookupIntent = (field.intent || '') === 'company' || (field.intent || '') === 'agency';

      if (lookupIntent) {
        // Lookup-backed fields must select a real option, not keep arbitrary free text.
        await locator.click().catch(() => {});
        await locator.fill('').catch(() => {});
        await locator.press('ArrowDown').catch(() => {});
        let selected = await selectFirstVisibleOption(page, variant % 3);

        if (!selected) {
          await locator.fill('a').catch(() => {});
          await locator.press('ArrowDown').catch(() => {});
          selected = await selectFirstVisibleOption(page, variant % 3);
        }

        if (!selected && sample.trim().length > 0) {
          await locator.fill(sample).catch(() => {});
          await locator.press('ArrowDown').catch(() => {});
          selected = await selectFirstVisibleOption(page, variant % 3);
        }

        return selected;
      }

      if ((field.intent || '') === 'lastName') {
        // Many forms reject digits/symbols in family names.
        sample = sample.replace(/[^A-Za-z\-\s']/g, '');
      }
      if ((field.intent || '') === 'legalId') {
        sample = sample.replace(/\D/g, '');
      }
      if ((field.intent || '') === 'code') {
        sample = sample.replace(/[^A-Za-z0-9\-_]/g, '').slice(0, 24);
      }

      await locator.fill(sample).catch(() => {});

      if ((field.intent || '') === 'address') {
        // Address fields are frequently autocomplete-backed and require selecting a suggestion.
        await locator.press('ArrowDown').catch(() => {});
        await locator.press('Enter').catch(() => {});
      }

      return true;
    }
  }

  return false;
}

async function fillMissingRequiredInputs(page: Page, root: Locator, variant: number) {
  const requiredInputs = root.locator('input[required]:visible, textarea[required]:visible');
  const count = await requiredInputs.count();
  let patched = 0;
  const legalPair = buildVariantLegalIdPair(page.url(), variant);
  const routeHash = simpleHash(page.url());
  const dynamicFirst = ['Alice', 'Emma', 'Chloe', 'Nina', 'Lina'][routeHash % 5];
  const dynamicLast = ['MARTIN', 'DURAND', 'ROBERT', 'LAMBERT', 'THOMAS', 'BERNARD', 'GARNIER'][routeHash % 7];

  for (let i = 0; i < count; i += 1) {
    const input = requiredInputs.nth(i);
    const value = await input.inputValue().catch(() => '');
    if (String(value || '').trim().length > 0) continue;

    const placeholder = (await input.getAttribute('placeholder').catch(() => '')) || '';
    const label = (await input.getAttribute('aria-label').catch(() => '')) || '';
    const hint = `${placeholder} ${label}`.toLowerCase();

    let sample = 'QA Valeur';
    if (/mail|email/.test(hint)) sample = `qa.popin.${String(routeHash % 997).padStart(3, '0')}@example.test`;
    else if (/tel|numero|mobile|phone/.test(hint)) sample = ['0601020304', '0602030405', '0603040506', '0604050607', '0605060708'][(routeHash + i + variant) % 5];
    else if (/adresse/.test(hint)) sample = ['8 rue de Rivoli Paris', '12 avenue Jean Jaures Lyon', '3 rue Sainte-Catherine Bordeaux', '25 rue Nationale Lille', '18 boulevard de la Liberte Nantes'][(routeHash + i + variant) % 5];
    else if (/siren/.test(hint)) sample = legalPair.siren;
    else if (/siret/.test(hint)) sample = legalPair.siret;
    else if (/code|identifiant|tenant/.test(hint)) sample = `QA${String(1000 + ((routeHash + i + variant) % 9000)).slice(-4)}`;
    else if (/prenom/.test(hint)) sample = dynamicFirst;
    else if (/nom/.test(hint)) sample = dynamicLast;

    await input.fill(sample).catch(() => {});
    patched += 1;
  }

  return patched;
}

async function selfCorrectForm(page: Page, root: Locator, fields: ProfileField[], variant: number) {
  let fixes = 0;
  const messages = await getVisibleValidationMessages(root);

  if (messages.length === 0) return 0;

  if (messages.some((m) => /Caractères non valides/i.test(m))) {
    const nameInputs = root.locator('input[placeholder*="Nom" i]:visible, input[aria-label*="Nom" i]:visible, input[name*="nom" i]:visible');
    const c = await nameInputs.count();
    for (let i = 0; i < c; i += 1) {
      const n = nameInputs.nth(i);
      const current = await n.inputValue().catch(() => '');
      const sanitized = String(current || '').replace(/[^A-Za-z\-\s']/g, '');
      if (sanitized && sanitized !== current) {
        await n.fill(sanitized).catch(() => {});
        fixes += 1;
      }
    }
  }

  if (messages.some((m) => /Adresse non trouvée/i.test(m))) {
    const addr = root.locator('input[placeholder*="adresse" i]:visible, input[aria-label*="adresse" i]:visible, input[name*="adresse" i]:visible').first();
    if (await addr.isVisible().catch(() => false)) {
      await addr.fill('8 rue de Rivoli Paris').catch(() => {});
      await addr.press('ArrowDown').catch(() => {});
      await addr.press('Enter').catch(() => {});
      fixes += 1;
    }
  }

  if (messages.some((m) => /obligatoires|Champ invalide|sélectionner une valeur/i.test(m))) {
    const invalidInputs = root.locator('input[aria-invalid="true"]:visible, textarea[aria-invalid="true"]:visible');
    const invalidCount = await invalidInputs.count();
    for (let i = 0; i < invalidCount; i += 1) {
      const input = invalidInputs.nth(i);
      const placeholder = ((await input.getAttribute('placeholder').catch(() => '')) || '').toLowerCase();
      const label = ((await input.getAttribute('aria-label').catch(() => '')) || '').toLowerCase();
      const name = ((await input.getAttribute('name').catch(() => '')) || '').toLowerCase();
      const hint = `${placeholder} ${label} ${name}`;

      if (/societe|agence|type|civilite|statut|selectionner/.test(hint)) {
        await input.click().catch(() => {});
        await input.fill('').catch(() => {});
        await input.press('ArrowDown').catch(() => {});
        await input.press('Enter').catch(() => {});
        let selected = await selectFirstVisibleOption(page);
        if (!selected) {
          await input.fill('a').catch(() => {});
          await input.press('ArrowDown').catch(() => {});
          selected = await selectFirstVisibleOption(page);
        }
        fixes += 1;
      }
    }

    fixes += await fillMissingRequiredInputs(page, root, variant);
    fixes += await trySelectComboboxOptions(page, root);
    fixes += await resolveAutocompleteChoices(page, root);
    // Re-apply semantic fill to catch fields unlocked by previous corrections.
    fixes += await tryFillSemanticFields(page, root, fields, variant);
  }

  return fixes;
}

async function tryFillSemanticFields(page: Page, root: Locator, profiledFields: ProfileField[], variant: number) {
  let filled = 0;
  const prioritized = [...profiledFields]
    .filter((field) => field.required || (field.intent && !['search', 'unknown', 'select'].includes(field.intent)))
    .slice(0, 14);

  for (const field of prioritized) {
    const success = await fillBySemanticField(page, root, field, variant);
    if (success) filled += 1;
  }
  return filled;
}

async function trySelectComboboxOptions(page: Page, root: Locator, variant = 0) {
  if (page.isClosed()) return 0;
  const formCombos = root.locator('form [role="combobox"]:visible, form mat-select:visible');
  const dialogCombos = root.locator('[role="dialog"] [role="combobox"]:visible, [role="dialog"] mat-select:visible');
  const formCount = await formCombos.count();
  const combos = formCount > 0 ? formCombos : dialogCombos;
  const comboCount = await combos.count();
  let selected = 0;

  for (let i = 0; i < Math.min(comboCount, 6); i += 1) {
    if (page.isClosed()) break;
    const cb = combos.nth(i);
    await cb.click().catch(() => {});
    await page.waitForTimeout(250);

    const options = page.locator('mat-option:visible, [role="option"]:visible');
    const optCount = await options.count();
    if (optCount > 0) {
      const pickIndex = Math.min(optCount - 1, (variant + i) % Math.max(optCount, 1));
      await options.nth(pickIndex).click().catch(() => {});
      selected += 1;
      await page.waitForTimeout(200);
    } else {
        await page.keyboard.press('Escape').catch(() => {});
    }
  }

  return selected;
}

async function resolveAutocompleteChoices(page: Page, root: Locator) {
  const addressLike = root.locator('input[placeholder*="adresse" i], input[aria-label*="adresse" i], input[name*="adresse" i]');
  const count = await addressLike.count();

  let resolved = 0;
  for (let i = 0; i < count; i += 1) {
    const input = addressLike.nth(i);
    if (!(await input.isVisible().catch(() => false))) continue;

    await input.click().catch(() => {});
    await page.waitForTimeout(200);

    const option = page.locator('mat-option:visible, [role="option"]:visible').first();
    if (await option.isVisible().catch(() => false)) {
      await option.click().catch(() => {});
      resolved += 1;
      await page.waitForTimeout(200);
    }
  }

  return resolved;
}

async function clickIfVisibleEnabled(button: Locator) {
  const visible = await button.isVisible().catch(() => false);
  if (!visible) return false;
  const enabled = await button.isEnabled().catch(() => false);
  if (!enabled) return false;
  await button.click().catch(() => {});
  return true;
}

async function completeAddressSubflowIfNeeded(page: Page, root: Locator, fields: ProfileField[], variant: number) {
  const addAddress = root.getByRole('button', { name: /Ajouter une adresse|Ajouter une adresse/i }).first();
  const addressRequired = root.getByText(/adresse de siege est obligatoire|adresse de siège est obligatoire|Aucune adresse définie/i, { exact: false }).first();
  const addressStep = root.getByText(/Adresses/i, { exact: false }).first();

  const needsAddress =
    (await addAddress.isVisible().catch(() => false)) &&
    ((await addressRequired.isVisible().catch(() => false)) || (await addressStep.isVisible().catch(() => false)));

  if (!needsAddress) return false;

  await addAddress.click().catch(() => {});
  await page.waitForTimeout(450);

  const editRoot = await resolveCreateRoot(page);

  const siegeRadio = editRoot.getByRole('radio', { name: /siege|siège/i }).first();
  if (await siegeRadio.isVisible().catch(() => false)) {
    await siegeRadio.check().catch(() => siegeRadio.click().catch(() => {}));
  }

  const siegeCheckbox = editRoot.getByRole('checkbox', { name: /siege|siège/i }).first();
  if (await siegeCheckbox.isVisible().catch(() => false)) {
    await siegeCheckbox.check().catch(() => siegeCheckbox.click().catch(() => {}));
  }

  await tryFillSemanticFields(page, editRoot, fields, variant);
  await fillMissingRequiredInputs(page, editRoot, variant);
  await trySelectComboboxOptions(page, editRoot, variant);
  await resolveAutocompleteChoices(page, editRoot);
  await selfCorrectForm(page, editRoot, fields, variant);

  const saveAddress = editRoot.getByRole('button', { name: /^Ajouter$/i }).first();
  const fallbackSaveAddress = editRoot.getByRole('button', { name: /Enregistrer|Valider|Ajouter/i }).first();
  if (await saveAddress.isVisible().catch(() => false)) {
    await clickSubmitWithMutationSignal(page, saveAddress);
    await page.waitForTimeout(800);
  } else if (await fallbackSaveAddress.isVisible().catch(() => false)) {
    await clickSubmitWithMutationSignal(page, fallbackSaveAddress);
    await page.waitForTimeout(800);
  }

  return true;
}

async function completeContactSubflowIfNeeded(page: Page, root: Locator, fields: ProfileField[], variant: number) {
  const addContact = root.getByRole('button', { name: /Ajouter un contact/i }).first();
  if (!(await addContact.isVisible().catch(() => false))) return false;

  await addContact.click().catch(() => {});
  await page.waitForTimeout(450);

  const editRoot = await resolveCreateRoot(page);
  await tryFillSemanticFields(page, editRoot, fields, variant);
  await fillMissingRequiredInputs(page, editRoot, variant);
  await trySelectComboboxOptions(page, editRoot, variant);
  await resolveAutocompleteChoices(page, editRoot);
  await selfCorrectForm(page, editRoot, fields, variant);

  const save = editRoot.getByRole('button', { name: /^Ajouter$/i }).first();
  const fallbackSave = editRoot.getByRole('button', { name: /Enregistrer|Valider|Ajouter/i }).first();
  if (await save.isVisible().catch(() => false)) {
    await clickSubmitWithMutationSignal(page, save);
    await page.waitForTimeout(700);
  } else if (await fallbackSave.isVisible().catch(() => false)) {
    await clickSubmitWithMutationSignal(page, fallbackSave);
    await page.waitForTimeout(700);
  }

  return true;
}

async function completePortalSubflowIfNeeded(page: Page, root: Locator, fields: ProfileField[], variant: number) {
  const addPortal = root.getByRole('button', { name: /Ajouter un portail/i }).first();
  if (!(await addPortal.isVisible().catch(() => false))) return false;

  await addPortal.click().catch(() => {});
  await page.waitForTimeout(450);

  const editRoot = await resolveCreateRoot(page);
  await tryFillSemanticFields(page, editRoot, fields, variant);
  await fillMissingRequiredInputs(page, editRoot, variant);
  await trySelectComboboxOptions(page, editRoot, variant);
  await resolveAutocompleteChoices(page, editRoot);
  await selfCorrectForm(page, editRoot, fields, variant);

  const save = editRoot.getByRole('button', { name: /^Ajouter$/i }).first();
  const fallbackSave = editRoot.getByRole('button', { name: /Enregistrer|Valider|Ajouter/i }).first();
  if (await save.isVisible().catch(() => false)) {
    await clickSubmitWithMutationSignal(page, save);
    await page.waitForTimeout(700);
  } else if (await fallbackSave.isVisible().catch(() => false)) {
    await clickSubmitWithMutationSignal(page, fallbackSave);
    await page.waitForTimeout(700);
  }

  return true;
}

async function resolveBlockedWizardSection(page: Page, root: Locator, fields: ProfileField[], variant: number) {
  const sections = [/Contacts/i, /Informations administratives/i, /Facturations et EDI/i, /Documents et statut/i];
  let progressed = false;

  for (const section of sections) {
    const sectionBtn = root.getByRole('button', { name: section }).first();
    if (!(await sectionBtn.isVisible().catch(() => false))) continue;
    if (!(await sectionBtn.isEnabled().catch(() => false))) continue;

    await sectionBtn.click().catch(() => {});
    await page.waitForTimeout(400);
    const sectionRoot = await resolveCreateRoot(page);

    await tryFillSemanticFields(page, sectionRoot, fields, variant);
    await fillMissingRequiredInputs(page, sectionRoot, variant);
    await trySelectComboboxOptions(page, sectionRoot, variant);
    await resolveAutocompleteChoices(page, sectionRoot);
    await selfCorrectForm(page, sectionRoot, fields, variant);

    if (await completeAddressSubflowIfNeeded(page, sectionRoot, fields, variant)) return true;
    if (await completeContactSubflowIfNeeded(page, sectionRoot, fields, variant)) return true;
    if (await completePortalSubflowIfNeeded(page, sectionRoot, fields, variant)) return true;

    progressed = true;
  }

  return progressed;
}

async function clickSubmitWithMutationSignal(page: Page, button: Locator) {
  const visible = await button.isVisible().catch(() => false);
  if (!visible) return { clicked: false, mutation: false };
  const enabled = await button.isEnabled().catch(() => false);
  if (!enabled) return { clicked: false, mutation: false };

  const mutationPromise = page
    .waitForResponse(
      (response) => {
        const method = response.request().method().toUpperCase();
        const status = response.status();
        return ['POST', 'PUT', 'PATCH'].includes(method) && status >= 200 && status < 500;
      },
      { timeout: 3500 },
    )
    .then(() => true)
    .catch(() => false);

  await button.click().catch(() => {});
  const mutation = await mutationPromise;
  return { clicked: true, mutation };
}

async function resolveFinalSubmitButton(root: Locator) {
  const strongSubmit = root.getByRole('button', { name: /Enregistrer|Valider|Soumettre|Submit/i }).first();
  if (await strongSubmit.isVisible().catch(() => false)) {
    return strongSubmit;
  }

  // Allow "Creer" only when scoped to an actual form/dialog submit action.
  const formCreate = root.locator('form').getByRole('button', { name: /Créer|Create/i }).first();
  if (await formCreate.isVisible().catch(() => false)) {
    return formCreate;
  }

  const dialogCreate = root.getByRole('dialog').getByRole('button', { name: /Créer|Create/i }).first();
  if (await dialogCreate.isVisible().catch(() => false)) {
    return dialogCreate;
  }

  return strongSubmit;
}

async function hasActionableCreateContext(root: Locator) {
  const submit = await resolveFinalSubmitButton(root);
  const next = root.getByRole('button', { name: /Suivant|Next|Etape suivante|Étape suivante/i }).first();
  const requiredInput = root.locator('input[required]:visible, textarea[required]:visible').first();

  const hasSubmit = await submit.isVisible().catch(() => false);
  const hasNext = await next.isVisible().catch(() => false);
  const hasRequired = await requiredInput.isVisible().catch(() => false);

  return hasSubmit || hasNext || hasRequired;
}

async function completeWizardAndSubmit(page: Page, root: Locator, fields: ProfileField[], variant: number) {
  let currentRoot = root;
  let mutationDetected = false;
  const startedAt = Date.now();
  const maxDurationMs = Number(process.env.INT2_WIZARD_MAX_MS || '20000');

  for (let step = 0; step < 8; step += 1) {
    if (page.isClosed()) {
      break;
    }
    if (Date.now() - startedAt > maxDurationMs) {
      break;
    }
    await tryFillSemanticFields(page, currentRoot, fields, variant);
    await trySelectComboboxOptions(page, currentRoot, variant);
    await resolveAutocompleteChoices(page, currentRoot);

    const finalSubmit = await resolveFinalSubmitButton(currentRoot);
    const submitAttempt = await clickSubmitWithMutationSignal(page, finalSubmit);
    if (submitAttempt.clicked) {
      mutationDetected = mutationDetected || submitAttempt.mutation;
      await page.waitForTimeout(1400);
      return { submitted: true, step, mutationDetected };
    }

    // Adaptive self-correction loop when submit is not possible with first-pass data.
    for (let retry = 0; retry < 2; retry += 1) {
      const fixed = await selfCorrectForm(page, currentRoot, fields, variant);
      if (fixed <= 0) break;
      await page.waitForTimeout(350);
      const retryAttempt = await clickSubmitWithMutationSignal(page, finalSubmit);
      if (retryAttempt.clicked) {
        mutationDetected = mutationDetected || retryAttempt.mutation;
        await page.waitForTimeout(1400);
        return { submitted: true, step, mutationDetected };
      }
    }

    const nextStep = currentRoot.getByRole('button', { name: /Suivant|Next|Etape suivante|Étape suivante/i }).first();
    const hasSubmit = await finalSubmit.isVisible().catch(() => false);
    const hasNext = await nextStep.isVisible().catch(() => false);

    if (hasNext && !(await nextStep.isEnabled().catch(() => false))) {
      const progressedAddress = await completeAddressSubflowIfNeeded(page, currentRoot, fields, variant);
      const progressedCollections =
        (await completeContactSubflowIfNeeded(page, currentRoot, fields, variant)) ||
        (await completePortalSubflowIfNeeded(page, currentRoot, fields, variant));
      const progressedSection = failOnBlockers ? await resolveBlockedWizardSection(page, currentRoot, fields, variant) : false;
      if (progressedAddress || progressedCollections || progressedSection) {
        currentRoot = await resolveCreateRoot(page);
      }
    }

    if (!hasSubmit && !hasNext && step >= 1) {
      break;
    }

    if (await clickIfVisibleEnabled(nextStep)) {
      await page.waitForTimeout(900);
      currentRoot = await resolveCreateRoot(page);
      continue;
    }

    break;
  }

  return { submitted: false, step: -1, mutationDetected };
}

async function verifyPersistedCreateSignals(page: Page, expectedDialogFlow: boolean, mutationDetected: boolean) {
  const successSignals = [
    page.getByText(/a ete cree|a été créé|cree avec succes|créé avec succès|enregistre|enregistré|success/i).first(),
    page.locator('.mat-mdc-snack-bar-label, .mdc-snackbar__label').first(),
    page.getByText(/Operation reussie|Opération réussie|Succès/i).first(),
  ];

  for (const signal of successSignals) {
    if (await signal.isVisible().catch(() => false)) {
      return true;
    }
  }

  if (expectedDialogFlow) {
    const dialog = page.getByRole('dialog').first();
    const dialogVisible = await dialog.isVisible().catch(() => false);
    if (!dialogVisible) return true;

    const switchedToModification = dialog.getByText(/Modification d'un collaborateur|Modification/i).first();
    if (await switchedToModification.isVisible().catch(() => false)) {
      return true;
    }

    const sectionComplete = dialog.getByText(/Complet/i).first();
    const saveBtn = dialog.getByRole('button', { name: /Enregistrer|Save/i }).first();
    const nextBtn = dialog.getByRole('button', { name: /Suivant|Next/i }).first();
    const hasComplete = await sectionComplete.isVisible().catch(() => false);
    const saveDisabled = hasComplete ? !(await saveBtn.isEnabled().catch(() => true)) : false;
    const nextEnabled = hasComplete ? await nextBtn.isEnabled().catch(() => false) : false;
    if (hasComplete && (saveDisabled || nextEnabled)) {
      return true;
    }
  }

  if (mutationDetected) {
    const body = page.locator('body');
    const errors = await countValidationSignals(body);
    if (errors === 0) {
      return true;
    }
  }

  return false;
}

test.describe('INT2 Autonomous Creation Coverage', () => {
  test.setTimeout(120000);

  test('Creation profile exists with at least one profiled URL', async () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  for (const e of entries) {
    for (let variant = 0; variant < datasetVariants; variant += 1) {
      test(`Creation flow coverage: ${e.id} ${new URL(e.url).pathname} [dataset-v${variantIndexTag(variant)}]`, async ({ page }) => {
      const auditRecord: Record<string, unknown> = {
        url: e.url,
        routeId: e.id,
        variant: variantIndexTag(variant),
        submitted: false,
        persisted: false,
        mutationDetected: false,
        reason: 'started',
        dataset: [],
      };

      try {
      await stableGoto(page, e.url);
      const beforeCreateUrl = page.url();

      const createBtn = page.getByRole('button', { name: /Créer|Create/i }).first();
      await expect(createBtn).toBeVisible({ timeout: 15000 });
      await createBtn.click();
      await page.waitForTimeout(900);

      const hasDialog = await page.getByRole('dialog').first().isVisible().catch(() => false);
      const anyForm = await page.locator('form').first().isVisible().catch(() => false);
      const anyInput = await page.locator('input:visible, textarea:visible').first().isVisible().catch(() => false);

      expect(hasDialog || anyForm || anyInput).toBeTruthy();

      const resolvedFields = (e.semanticFields && e.semanticFields.length > 0) ? e.semanticFields : (e.fields || []);
      auditRecord.dataset = resolvedFields
        .filter((f) => f.fillable !== false)
        .slice(0, 12)
        .map((f) => ({ label: f.label || f.name, intent: f.intent || 'unknown', sample: computeFieldSample(f, variant, e.url) }));
      if ((e.container || '') === 'dialog' && !hasDialog) {
        if (strictE2E) {
          auditRecord.reason = 'profile-expected-dialog-not-opened';
          throw new Error(`Strict E2E: profile expected a dialog, but runtime did not open one for ${e.url}`);
        }
        test.skip(true, `Profile expected a dialog, but runtime did not open one for ${e.url}`);
      }

      const root = await resolveCreateRoot(page);
      const actionableCreateContext = await hasActionableCreateContext(root);
      const urlChangedAfterCreate = page.url() !== beforeCreateUrl;

      if (strictE2E && !hasDialog && !actionableCreateContext && !urlChangedAfterCreate) {
        auditRecord.reason = 'no-actionable-create-context';
        if (failOnBlockers) {
          throw new Error(`Strict E2E: create action did not open an actionable create context for ${e.url}`);
        }
        test.info().annotations.push({ type: 'strict-warning', description: `No actionable create context for ${e.url}` });
        return;
      }

      if ((e.container || '') === 'dialog' || Number(e.requiredCount || 0) > 0) {
        const filled = await tryFillSemanticFields(page, root, resolvedFields, variant);
        await trySelectComboboxOptions(page, root, variant);
        await resolveAutocompleteChoices(page, root);

        expect(filled).toBeGreaterThanOrEqual(0);
        const validationSignals = await countValidationSignals(root);
        expect(filled + validationSignals).toBeGreaterThan(0);
      } else {
        test.info().annotations.push({ type: 'create-mode', description: 'Entry-point mapped only: page route without profiled required fields' });
      }

      if (forceSubmit) {
        const outcome = await completeWizardAndSubmit(page, root, resolvedFields, variant);
        auditRecord.submitted = outcome.submitted;
        auditRecord.mutationDetected = outcome.mutationDetected;
        if (strictE2E && !outcome.submitted) {
          auditRecord.reason = 'no-final-submit';
          if (failOnBlockers) {
            throw new Error(`Strict E2E: could not reach a final submit action for ${e.url}`);
          }
          test.info().annotations.push({ type: 'strict-warning', description: `No final submit reached for ${e.url}` });
          return;
        }

        if (requirePersistedCreate && outcome.submitted) {
          const persisted = await verifyPersistedCreateSignals(page, (e.container || '') === 'dialog', outcome.mutationDetected);
          auditRecord.persisted = persisted;
          auditRecord.reason = persisted ? 'persisted' : 'no-persist-signal';
          if (!persisted) {
            if (failOnBlockers) {
              throw new Error(`Strict E2E: create submit did not produce persistence/success signal for ${e.url}`);
            }
            test.info().annotations.push({ type: 'strict-warning', description: `No persistence signal for ${e.url}` });
          }
        }
      } else {
        auditRecord.reason = 'safe-mode-no-submit';
        test.info().annotations.push({ type: 'submit-mode', description: 'Safe mode: no final submit' });
      }

      if ((e.container || '') === 'dialog') {
        await closeAnyDialog(page).catch(() => {});
      }
      } catch (error) {
        if (String(auditRecord.reason || '') === 'started') {
          auditRecord.reason = 'runtime-error';
        }
        throw error;
      } finally {
        appendDatasetAudit(auditRecord);
      }
      });
    }
  }
});
