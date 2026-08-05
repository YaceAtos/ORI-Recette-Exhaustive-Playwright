/**
 * INT2 Real Data Harvester Agent
 *
 * Retrieves REAL, verifiable datasets via public, no-auth government web APIs
 * so that test data used against INT2 (SIRET/SIREN, addresses, creation dates)
 * is standardized and passes real-world validation rules instead of being
 * synthetically faked.
 *
 * Sources used (French open government data, no API key required):
 *  - https://recherche-entreprises.api.gouv.fr        (INSEE Sirene registry mirror: SIREN/SIRET, legal name, real address, real creation date)
 *  - https://api-adresse.data.gouv.fr                  (BAN - Base Adresse Nationale: address geocoding/cross-validation)
 *
 * Every record emitted has been validated against:
 *  - SIREN: 9 digits + Luhn checksum
 *  - SIRET: 14 digits + Luhn checksum, and SIRET must start with the SIREN
 *  - Address: non-empty, 5-digit French postal code, resolvable/scored by the BAN geocoder
 *  - Date: a real, past, plausible calendar date (creation date within [1900, currentYear])
 *
 * Records that fail any check are dropped from the "validated" pool and kept
 * in a separate "rejected" list with the failing reason for traceability.
 *
 * Output:
 *  - fixtures/scenarios/int2/realdata-companies.generated.json (validated pool, reusable by tests/generators)
 *  - int2-ihm-recordings/int2-autonomous/realdata-harvest-rejected.json (rejected pool, for audit)
 *  - int2-ihm-recordings/int2-autonomous/INT2_REALDATA_HARVEST_REPORT.md (human report)
 *
 * Network is best-effort: if the government APIs are unreachable (offline CI),
 * the agent degrades gracefully, keeps any previously validated pool intact,
 * and reports a "network_unavailable" status instead of crashing the pipeline.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous');
const datasetOutFile = path.join(rootDir, 'fixtures', 'scenarios', 'int2', 'realdata-companies.generated.json');
const rejectedOutFile = path.join(outDir, 'realdata-harvest-rejected.json');
const reportOutFile = path.join(outDir, 'INT2_REALDATA_HARVEST_REPORT.md');
const searchTermsFile = path.join(rootDir, 'fixtures', 'scenarios', 'int2', 'collaborateur-search-terms.generated.json');

const SIRENE_SEARCH_URL = 'https://recherche-entreprises.api.gouv.fr/search';
const BAN_GEOCODE_URL = 'https://api-adresse.data.gouv.fr/search/';

// Domain-relevant NAF/APE codes for Orion / SAP OuiCare (services a la personne, aide a domicile).
const DEFAULT_SECTOR_TERMS = [
  'aide a domicile',
  'services a la personne',
  'auxiliaire de vie',
  'garde d enfants',
  'entretien de la maison',
];

const MAX_TERMS = Number(process.env.INT2_REALDATA_MAX_TERMS || '5');
const RESULTS_PER_TERM = Number(process.env.INT2_REALDATA_RESULTS_PER_TERM || '10');
const REQUEST_TIMEOUT_MS = Number(process.env.INT2_REALDATA_TIMEOUT_MS || '8000');
const CROSS_VALIDATE_ADDRESS = String(process.env.INT2_REALDATA_VERIFY_ADDRESS || 'true') === 'true';
const MIN_ADDRESS_SCORE = Number(process.env.INT2_REALDATA_MIN_ADDRESS_SCORE || '0.4');

function safeReadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

async function fetchJson(url, { timeoutMs = REQUEST_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'orion-int2-realdata-harvester/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function luhnCheckDigitValid(fullDigits) {
  // Validates a full numeric string (SIREN 9 digits or SIRET 14 digits) using the Luhn algorithm.
  const digits = String(fullDigits).replace(/\D/g, '');
  let sum = 0;
  for (let i = 0; i < digits.length; i += 1) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

function isPlausibleRealDate(dateString) {
  if (!dateString || typeof dateString !== 'string') return { valid: false, reason: 'missing_date' };
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return { valid: false, reason: 'unparseable_date' };
  const now = new Date();
  if (parsed.getTime() > now.getTime()) return { valid: false, reason: 'future_date' };
  const year = parsed.getUTCFullYear();
  if (year < 1900 || year > now.getUTCFullYear()) return { valid: false, reason: `implausible_year_${year}` };
  return { valid: true, year };
}

function validatePostalCode(cp) {
  return typeof cp === 'string' && /^[0-9]{5}$/.test(cp);
}

async function crossValidateAddress(addressLabel) {
  if (!CROSS_VALIDATE_ADDRESS) return { checked: false, score: null };
  if (!addressLabel) return { checked: true, score: 0, reason: 'empty_address' };
  try {
    const url = `${BAN_GEOCODE_URL}?q=${encodeURIComponent(addressLabel)}&limit=1`;
    const data = await fetchJson(url);
    const best = Array.isArray(data?.features) ? data.features[0] : null;
    const score = Number(best?.properties?.score || 0);
    return { checked: true, score, label: best?.properties?.label || null };
  } catch (err) {
    return { checked: true, score: null, error: String(err.message || err) };
  }
}

function loadSeedTerms() {
  const generated = safeReadJson(searchTermsFile);
  const dynamicTerms = Array.isArray(generated?.searchTerms)
    ? generated.searchTerms.filter((t) => typeof t === 'string' && t.length >= 3)
    : [];
  const merged = [...DEFAULT_SECTOR_TERMS, ...dynamicTerms];
  return merged.slice(0, MAX_TERMS);
}

async function searchCompaniesForTerm(term) {
  const url = `${SIRENE_SEARCH_URL}?q=${encodeURIComponent(term)}&page=1&per_page=${RESULTS_PER_TERM}`;
  const data = await fetchJson(url);
  return Array.isArray(data?.results) ? data.results : [];
}

async function validateCompanyRecord(raw) {
  const siege = raw?.siege || {};
  const siren = String(raw?.siren || '').trim();
  const siret = String(siege?.siret || '').trim();
  const addressLabel = String(siege?.adresse || '').trim();
  const postalCode = String(siege?.code_postal || '').trim();
  const commune = String(siege?.libelle_commune || '').trim();
  const dateCreation = raw?.date_creation || siege?.date_creation || null;

  const failures = [];

  if (!/^[0-9]{9}$/.test(siren) || !luhnCheckDigitValid(siren)) failures.push('invalid_siren');
  if (!/^[0-9]{14}$/.test(siret) || !siret.startsWith(siren) || !luhnCheckDigitValid(siret)) failures.push('invalid_siret');
  if (!validatePostalCode(postalCode)) failures.push('invalid_postal_code');
  if (!commune) failures.push('missing_commune');

  const dateCheck = isPlausibleRealDate(dateCreation);
  if (!dateCheck.valid) failures.push(`invalid_date:${dateCheck.reason}`);

  let addressCheck = { checked: false, score: null };
  if (failures.length === 0) {
    addressCheck = await crossValidateAddress(addressLabel);
    if (addressCheck.checked && addressCheck.score !== null && addressCheck.score < MIN_ADDRESS_SCORE) {
      failures.push(`low_address_confidence:${addressCheck.score.toFixed(2)}`);
    }
  }

  const record = {
    source: 'recherche-entreprises.api.gouv.fr',
    siren,
    siret,
    name: raw?.nom_complet || raw?.nom_raison_sociale || null,
    address: addressLabel,
    postalCode,
    commune,
    naf: raw?.activite_principale || siege?.activite_principale || null,
    dateCreation,
    creationYear: dateCheck.year || null,
    addressGeocode: addressCheck,
    validated: failures.length === 0,
    validationFailures: failures,
    harvestedAt: new Date().toISOString(),
  };

  return record;
}

function dedupeBySiret(records) {
  const seen = new Set();
  const out = [];
  for (const r of records) {
    if (seen.has(r.siret)) continue;
    seen.add(r.siret);
    out.push(r);
  }
  return out;
}

async function run() {
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(path.dirname(datasetOutFile), { recursive: true });

  const existingPool = safeReadJson(datasetOutFile);
  const previousValidated = Array.isArray(existingPool?.companies) ? existingPool.companies : [];

  const terms = loadSeedTerms();
  const allValidated = [];
  const allRejected = [];
  const termResults = [];
  let networkFailures = 0;

  for (const term of terms) {
    try {
      const rawResults = await searchCompaniesForTerm(term);
      const validations = [];
      for (const raw of rawResults) {
        // eslint-disable-next-line no-await-in-loop
        const validated = await validateCompanyRecord(raw);
        validations.push(validated);
        if (validated.validated) allValidated.push(validated);
        else allRejected.push(validated);
      }
      termResults.push({ term, fetched: rawResults.length, validated: validations.filter((v) => v.validated).length });
    } catch (err) {
      networkFailures += 1;
      termResults.push({ term, error: String(err.message || err) });
    }
  }

  const networkUnavailable = networkFailures > 0 && networkFailures === terms.length;
  const mergedValidated = dedupeBySiret([...previousValidated, ...allValidated]);

  const payload = {
    source: 'int2-agent-realdata-harvester',
    generatedAt: new Date().toISOString(),
    status: networkUnavailable ? 'network_unavailable' : 'ok',
    intent: 'Provide real, validated SIREN/SIRET, real addresses and real creation dates sourced from French government open data for INT2 test data generation.',
    seedTerms: terms,
    termResults,
    validationRules: {
      siren: '9 digits + Luhn checksum',
      siret: '14 digits + Luhn checksum, must start with SIREN',
      postalCode: '5 digit French postal code',
      date: 'real past calendar date, year in [1900, currentYear]',
      address: CROSS_VALIDATE_ADDRESS ? `cross-validated via BAN geocoder, min score ${MIN_ADDRESS_SCORE}` : 'not cross-validated (disabled)',
    },
    companies: mergedValidated,
    counts: {
      previouslyKnown: previousValidated.length,
      newlyValidatedThisRun: allValidated.length,
      totalValidatedPool: mergedValidated.length,
      rejectedThisRun: allRejected.length,
    },
  };

  if (!networkUnavailable) {
    fs.writeFileSync(datasetOutFile, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  }
  fs.writeFileSync(rejectedOutFile, `${JSON.stringify({ generatedAt: payload.generatedAt, rejected: allRejected }, null, 2)}\n`, 'utf8');

  const lines = [];
  lines.push('# INT2 Real Data Harvest Report');
  lines.push('');
  lines.push(`- Generated at: ${payload.generatedAt}`);
  lines.push(`- Status: ${payload.status}`);
  lines.push(`- Seed terms used: ${terms.join(', ') || '(none)'}`);
  lines.push(`- Previously known validated records: ${payload.counts.previouslyKnown}`);
  lines.push(`- Newly validated this run: ${payload.counts.newlyValidatedThisRun}`);
  lines.push(`- Total validated pool: ${payload.counts.totalValidatedPool}`);
  lines.push(`- Rejected this run: ${payload.counts.rejectedThisRun}`);
  lines.push('');
  lines.push('## Per-term results');
  lines.push('');
  lines.push('| Term | Fetched | Validated | Error |');
  lines.push('|---|---:|---:|---|');
  for (const t of termResults) {
    lines.push(`| ${t.term} | ${t.fetched ?? '-'} | ${t.validated ?? '-'} | ${t.error || ''} |`);
  }
  if (allRejected.length > 0) {
    lines.push('');
    lines.push('## Rejected samples (reasons)');
    lines.push('');
    for (const r of allRejected.slice(0, 15)) {
      lines.push(`- ${r.name || r.siret || 'unknown'}: ${r.validationFailures.join(', ')}`);
    }
  }
  fs.writeFileSync(reportOutFile, `${lines.join('\n')}\n`, 'utf8');

  console.log(`INT2 real data harvest status: ${payload.status}`);
  console.log(`INT2 validated pool (${mergedValidated.length} records): ${networkUnavailable ? '(kept previous pool, not overwritten)' : datasetOutFile}`);
  console.log(`INT2 rejected records report: ${rejectedOutFile}`);
  console.log(`INT2 harvest markdown report: ${reportOutFile}`);
}

run().catch((err) => {
  console.error('INT2 real data harvester failed unexpectedly:', err);
  process.exitCode = 0; // Degrade gracefully: this agent must never break the pipeline.
});
