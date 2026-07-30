const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const datasetFile = path.join(rootDir, 'fixtures', 'scenarios', 'int2', 'collaborateur-search-terms.generated.json');
const graphFile = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'state-graph.json');
const profileFile = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'create-flow-profile.json');
const extractedJddFile = path.join(rootDir, 'int2-ihm-recordings', 'JDD_ORION_source_extracted.txt');
const manifestSourceMode = String(process.env.INT2_GATE_MANIFEST_SOURCE || 'auto').toLowerCase();

const minSearchTerms = Number(process.env.INT2_JDD_MIN_SEARCH_TERMS || '30');
const minProfiledUrls = Number(process.env.INT2_JDD_MIN_PROFILED_URLS || '10');
const minDiscoveredPages = Number(process.env.INT2_JDD_MIN_DISCOVERED_PAGES || '15');
const minManifests = Number(process.env.INT2_MATRIX_MIN_MANIFESTS || '10');

function readJsonOrNull(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function listManifestFiles() {
  const exhaustiveDir = path.join(rootDir, 'int2-ihm-recordings', 'exhaustive');
  if (manifestSourceMode === 'exhaustive' || manifestSourceMode === 'auto') {
    if (fs.existsSync(exhaustiveDir)) {
      const exhaustive = fs.readdirSync(exhaustiveDir)
        .filter((entry) => entry.toLowerCase().endsWith('__video.json'))
        .map((entry) => path.join(exhaustiveDir, entry));
      if (manifestSourceMode === 'exhaustive' || exhaustive.length > 0) {
        return exhaustive;
      }
    }
  }

  const dirs = [
    path.join(rootDir, 'int2-ihm-recordings', 'chains'),
    path.join(rootDir, 'int2-ihm-recordings', 'working'),
  ];

  const out = [];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      if (!entry.toLowerCase().endsWith('.json')) continue;
      const low = entry.toLowerCase();
      if (dir.endsWith('chains') && !low.startsWith('chains-exhaustive-')) continue;
      if (dir.endsWith('working') && !low.startsWith('int2-collaborateur-')) continue;
      if (low.includes('demo-annulation')) continue;
      out.push(path.join(dir, entry));
    }
  }

  return out;
}

function ensurePositiveNumbers(obj, keys) {
  return keys.every((k) => Number.isFinite(Number(obj?.[k])) && Number(obj[k]) > 0);
}

function fail(msg) {
  console.error(`INT2 JDD gate failed: ${msg}`);
  process.exit(1);
}

const dataset = readJsonOrNull(datasetFile);
if (!dataset) fail(`missing or invalid dataset file: ${path.relative(rootDir, datasetFile)}`);

const terms = Array.isArray(dataset.searchTerms)
  ? dataset.searchTerms.filter((v) => typeof v === 'string' && v.trim().length > 0)
  : [];
if (terms.length < minSearchTerms) {
  fail(`search terms too low (${terms.length} < ${minSearchTerms})`);
}

const runtimeTerms = Number(dataset?.searchPlan?.maxRuntimeTerms || 0);
if (!Number.isFinite(runtimeTerms) || runtimeTerms <= 0 || runtimeTerms > terms.length) {
  fail(`invalid searchPlan.maxRuntimeTerms (${runtimeTerms}) for term count ${terms.length}`);
}

const requiredVolumeKeys = ['mp1', 'sp15', 'mp2', 'mp3', 'mp4', 'mp5', 'mp6', 'mp7'];
if (!dataset.baselineVolumes || !requiredVolumeKeys.every((k) => dataset.baselineVolumes[k])) {
  fail('baselineVolumes block is missing required module sections');
}

const volumeChecks = [
  ensurePositiveNumbers(dataset.baselineVolumes.mp1, ['marques', 'societes', 'agences']),
  ensurePositiveNumbers(dataset.baselineVolumes.sp15, ['profils', 'utilisateurs']),
  ensurePositiveNumbers(dataset.baselineVolumes.mp2, ['categories', 'familles', 'produits']),
  ensurePositiveNumbers(dataset.baselineVolumes.mp3, ['intervenants', 'contrats']),
  ensurePositiveNumbers(dataset.baselineVolumes.mp4, ['clients', 'prospects', 'devis']),
  ensurePositiveNumbers(dataset.baselineVolumes.mp5, ['interventions', 'tournes']),
  ensurePositiveNumbers(dataset.baselineVolumes.mp6, ['organismesFinanceurs', 'cda', 'pap']),
  ensurePositiveNumbers(dataset.baselineVolumes.mp7, ['pointages', 'exportPaieLots']),
];
if (volumeChecks.some((ok) => !ok)) {
  fail('baselineVolumes contains missing or non-positive numeric values');
}

if (!fs.existsSync(extractedJddFile)) {
  fail(`missing extracted Orion JDD source file: ${path.relative(rootDir, extractedJddFile)}`);
}

const graph = readJsonOrNull(graphFile);
if (!graph) fail(`missing or invalid discovery graph: ${path.relative(rootDir, graphFile)}`);
const discoveredPages = Number(graph.discoveredPages || 0);
if (discoveredPages < minDiscoveredPages) {
  fail(`discovered pages too low (${discoveredPages} < ${minDiscoveredPages})`);
}

const profile = readJsonOrNull(profileFile);
if (!profile) fail(`missing or invalid creation profile: ${path.relative(rootDir, profileFile)}`);
const profiles = Array.isArray(profile.profiles) ? profile.profiles : [];
if (profiles.length < minProfiledUrls) {
  fail(`profiled create URLs too low (${profiles.length} < ${minProfiledUrls})`);
}

const manifestCount = listManifestFiles().length;
if (manifestCount < minManifests) {
  fail(`recording manifest count too low (${manifestCount} < ${minManifests})`);
}

console.log('INT2 JDD gate passed.');
console.log(`- searchTerms: ${terms.length}`);
console.log(`- maxRuntimeTerms: ${runtimeTerms}`);
console.log(`- discoveredPages: ${discoveredPages}`);
console.log(`- profiledCreateUrls: ${profiles.length}`);
console.log(`- manifests: ${manifestCount}`);
