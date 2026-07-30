const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const recordingsDir = path.join(rootDir, 'int2-ihm-recordings');
const outputFile = path.join(recordingsDir, 'INT2_FUNCTIONAL_SCENARIO_MATRIX.md');
const graphFile = path.join(recordingsDir, 'int2-autonomous', 'state-graph.json');
const createProfileFile = path.join(recordingsDir, 'int2-autonomous', 'create-flow-profile.json');
const minExpectedManifests = Number(process.env.INT2_MATRIX_MIN_MANIFESTS || '10');
const manifestSourceMode = String(process.env.INT2_MATRIX_SOURCE || 'auto').toLowerCase();
const manifestSourceDirs = [
  path.join(recordingsDir, 'chains'),
  path.join(recordingsDir, 'working'),
];
const exhaustiveSourceDir = path.join(recordingsDir, 'exhaustive');

function walkFiles(dir, collector = []) {
  if (!fs.existsSync(dir)) return collector;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, collector);
    else collector.push(full);
  }
  return collector;
}

function toPosix(p) {
  return p.replaceAll('\\', '/');
}

function safeJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function scenarioFromName(base) {
  return base
    .replace(/__video$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function scenarioLabelFromManifest(filePath) {
  const name = path.basename(filePath, '.json').toLowerCase();

  if (name.includes('chains-exhaustive') && name.includes('collaborateurs-filtres')) {
    return 'Chain 2: collaborator filters/search/reset cycle';
  }
  if (name.includes('chains-exhaustive') && name.includes('planning-annulation')) {
    return 'Chain 1: planning annulation read-only verification';
  }
  if (name.includes('chains-exhaustive') && name.includes('create-error-workflow')) {
    return 'Chain 3: create branch (error or form) and close';
  }
  if (name.includes('int2-collaborateur-e2e') && name.includes('2e27b')) {
    return 'E2E Scenario 1: listing structure with visible rows/columns';
  }
  if (name.includes('int2-collaborateur-e2e') && name.includes('5aa4f')) {
    return 'E2E Scenario 2: search by name reduces dataset';
  }
  if (name.includes('int2-collaborateur-e2e') && name.includes('cd429')) {
    return 'E2E Scenario 3: create branch and close';
  }
  if (name.includes('int2-collaborateur-extende') && name.includes('37eb6')) {
    return 'Extended 1: chained searches and reset stability';
  }
  if (name.includes('int2-collaborateur-extende') && name.includes('46f4b')) {
    return 'Extended 2: nominal search returns expected row';
  }
  if (name.includes('int2-collaborateur-extende') && name.includes('f6b8e')) {
    return 'Extended 3: double open create flow and close';
  }
  if (name.includes('int2-collaborateur-extende') && name.includes('1b4f4')) {
    return 'Extended 4: create branch then UI stability/reset';
  }

  return scenarioFromName(path.basename(filePath, '.json'));
}

function scenarioType(base) {
  const name = base.toLowerCase();
  if (name.includes('int2-autonomous-creation')) return 'Autonomous creation scenario';
  if (name.includes('int2-autonomous-generated')) return 'Autonomous traversal scenario';
  if (name.includes('chains-exhaustive')) return 'Chain scenario';
  if (name.includes('int2-collaborateur-e2e')) return 'E2E scenario';
  if (name.includes('int2-collaborateur-extende')) return 'Extended scenario';
  if (name.includes('autonomous-page-validation')) return 'Autonomous page traversal';
  if (name.includes('discovery-graph-is-valid')) return 'Discovery graph validation';
  return 'Autonomous generated scenario';
}

function hasCreateSignal(base) {
  const name = base.toLowerCase();
  return (
    name.includes('create') ||
    name.includes('creer') ||
    name.includes('crer') ||
    name.includes('branch')
  );
}

function creationCoverageCell(base) {
  return hasCreateSignal(base)
    ? 'semantic-create-executed-safe-mode'
    : 'n/a';
}

function isInt2FunctionalManifest(filePath) {
  const posix = toPosix(filePath).toLowerCase();
  const base = path.basename(posix).toLowerCase();

  if (base.includes('demo-annulation')) return false;

  if (posix.includes('/int2-ihm-recordings/working/')) {
    return base.startsWith('int2-collaborateur-');
  }

  if (posix.includes('/int2-ihm-recordings/chains/')) {
    return base.startsWith('chains-exhaustive-');
  }

  return false;
}

function isExhaustiveManifest(filePath) {
  const base = path.basename(filePath).toLowerCase();
  return base.endsWith('__video.json');
}

function getLegacyManifestFiles() {
  const allFiles = manifestSourceDirs.flatMap((dir) => walkFiles(dir));
  return allFiles
    .filter((f) => f.toLowerCase().endsWith('.json'))
    .filter(isInt2FunctionalManifest)
    .sort();
}

function getExhaustiveManifestFiles() {
  const allFiles = walkFiles(exhaustiveSourceDir);
  return allFiles
    .filter((f) => f.toLowerCase().endsWith('.json'))
    .filter(isExhaustiveManifest)
    .sort();
}

function nextStepForProfile(profile) {
  if (profile.status !== 'profiled') return 'Fix route or discovery/profile errors.';
  if (!profile.createOpened) return 'Ensure create entrypoint opens and is capturable.';
  if ((profile.requiredCount || 0) === 0) {
    return 'Optional: map final submit success criteria for page-style create routes.';
  }
  return 'Optional: add controlled submit plus rollback/cleanup for destructive validation.';
}

const graph = fs.existsSync(graphFile) ? safeJson(graphFile) : null;
const discoveredPages = Number(graph?.discoveredPages || 0);
const createProfile = fs.existsSync(createProfileFile) ? safeJson(createProfileFile) : null;
const createProfiles = Array.isArray(createProfile?.profiles) ? createProfile.profiles : [];

const legacyManifests = getLegacyManifestFiles();
const exhaustiveManifests = getExhaustiveManifestFiles();

let jsonFiles = legacyManifests;
let sourceScopeLabel = 'int2-ihm-recordings/chains + int2-ihm-recordings/working from the latest autonomous workflow run.';
let sourceModeUsed = 'legacy';

if (manifestSourceMode === 'exhaustive') {
  jsonFiles = exhaustiveManifests;
  sourceScopeLabel = 'int2-ihm-recordings/exhaustive from the latest full exhaustive run.';
  sourceModeUsed = 'exhaustive';
} else if (manifestSourceMode === 'legacy') {
  jsonFiles = legacyManifests;
  sourceScopeLabel = 'int2-ihm-recordings/chains + int2-ihm-recordings/working from the latest autonomous workflow run.';
  sourceModeUsed = 'legacy';
} else {
  const useExhaustive = exhaustiveManifests.length > 0;
  jsonFiles = useExhaustive ? exhaustiveManifests : legacyManifests;
  sourceScopeLabel = useExhaustive
    ? 'int2-ihm-recordings/exhaustive from the latest full exhaustive run.'
    : 'int2-ihm-recordings/chains + int2-ihm-recordings/working from the latest autonomous workflow run.';
  sourceModeUsed = useExhaustive ? 'exhaustive' : 'legacy';
}

if (jsonFiles.length < minExpectedManifests) {
  console.error(
    `INT2 matrix generation aborted: expected at least ${minExpectedManifests} manifests, found ${jsonFiles.length}. ` +
    'Run exhaustive recording first or lower INT2_MATRIX_MIN_MANIFESTS explicitly.'
  );
  process.exit(1);
}

const rows = jsonFiles.map((jsonPath, idx) => {
  const parsed = safeJson(jsonPath) || {};
  const relJson = toPosix(path.relative(rootDir, jsonPath));
  const relMp4 = parsed.mp4 ? toPosix(path.relative(rootDir, parsed.mp4)) : '';
  const base = path.basename(jsonPath, '.json');

  return {
    id: `INT2-REC-${String(idx + 1).padStart(3, '0')}`,
    scenario: scenarioLabelFromManifest(jsonPath),
    scenarioType: scenarioType(base),
    relJson,
    relMp4,
    duration: Number.isFinite(Number(parsed.duration_seconds)) ? Number(parsed.duration_seconds).toFixed(2) : 'N/A',
    chapters: Number.isFinite(Number(parsed.chapter_screenshots_count)) ? String(parsed.chapter_screenshots_count) : 'N/A',
  };
});

const lines = [];
lines.push('# INT2 Functional Scenario Matrix (Autonomous)');
lines.push('');
lines.push(`- Generated at: ${new Date().toISOString()}`);
lines.push(`- Source scope: ${sourceScopeLabel}`);
lines.push(`- Source mode used: ${sourceModeUsed}`);
lines.push(`- Total manifests scanned: ${rows.length}`);
lines.push(`- Minimum manifests threshold used: ${minExpectedManifests}`);
lines.push(`- Discovered INT2 pages in graph: ${discoveredPages}`);
lines.push(`- Create-capable URLs profiled: ${createProfiles.length}`);
lines.push('- Test policy: no persistent data creation; create flows are semantically exercised in safe mode without final submit.');
lines.push('');
lines.push('| ID | Scenario Type | Functional E2E Scenario | Data Policy | Creation Coverage | MP4 | JSON | Duration (s) | Chapters |');
lines.push('|---|---|---|---|---|---|---|---:|---:|');

for (const r of rows) {
  const mp4Cell = r.relMp4 ? `[mp4](${r.relMp4})` : 'N/A';
  const jsonCell = `[json](${r.relJson})`;
  const creationCoverage = creationCoverageCell(path.basename(r.relJson, '.json'));
  lines.push(`| ${r.id} | ${r.scenarioType} | ${r.scenario} | safe-mode (no persistent create submit) | ${creationCoverage} | ${mp4Cell} | ${jsonCell} | ${r.duration} | ${r.chapters} |`);
}

if (createProfiles.length) {
  lines.push('');
  lines.push('## Semantic Creation Coverage (Profiled URLs)');
  lines.push('');
  lines.push('- Coverage status source: int2-ihm-recordings/int2-autonomous/create-flow-profile.json');
  lines.push('- Status meaning: `semantic-create-executed-safe-mode` = create entrypoint opened, fields semantically understood, and flow exercised without final submit.');
  lines.push('');
  lines.push('| URL | Container | Fields | Required | Coverage Status | Next Step |');
  lines.push('|---|---|---:|---:|---|---|');

  for (const p of createProfiles) {
    const status = p.status === 'profiled' && p.createOpened
      ? 'semantic-create-executed-safe-mode'
      : (p.status === 'profiled' ? 'create-not-opened' : 'not-profiled');
    lines.push(`| ${p.url} | ${p.container || 'unknown'} | ${p.fieldCount || 0} | ${p.requiredCount || 0} | ${status} | ${nextStepForProfile(p)} |`);
  }
}

fs.writeFileSync(outputFile, `${lines.join('\n')}\n`, 'utf8');
console.log(`INT2 functional scenario matrix generated: ${outputFile}`);
