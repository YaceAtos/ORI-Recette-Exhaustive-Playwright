const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const datasetFile = path.join(rootDir, 'fixtures', 'scenarios', 'int2', 'collaborateur-search-terms.generated.json');
const semanticsFile = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'create-flow-semantics.json');
const outDir = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous');
const outJson = path.join(outDir, 'dataset-quality-gate.json');
const outMd = path.join(outDir, 'INT2_DATASET_QUALITY_GATE.md');

const minTerms = Number(process.env.INT2_QG_MIN_TERMS || '30');
const minUniqueRatio = Number(process.env.INT2_QG_MIN_UNIQUE_RATIO || '0.9');
const minSemanticProfiles = Number(process.env.INT2_QG_MIN_SEMANTIC_PROFILES || '10');

function safeReadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function normalizeTerm(v) {
  return String(v || '').trim().toUpperCase();
}

function checkDataset(dataset) {
  const terms = Array.isArray(dataset?.searchTerms)
    ? dataset.searchTerms.filter((x) => typeof x === 'string' && x.trim().length > 0)
    : [];

  const normalized = terms.map((t) => normalizeTerm(t));
  const unique = new Set(normalized);
  const uniqueRatio = terms.length > 0 ? unique.size / terms.length : 0;

  const invalidTerms = normalized.filter((t) => t.length < 1 || t.length > 24 || /[^A-Z0-9\-_' ]/.test(t));

  return {
    termsCount: terms.length,
    uniqueCount: unique.size,
    uniqueRatio: Number(uniqueRatio.toFixed(4)),
    invalidTerms: invalidTerms.slice(0, 20),
    sampleTerms: terms.slice(0, 20),
  };
}

function passFail(condition, label, details) {
  return {
    label,
    passed: Boolean(condition),
    details,
  };
}

const dataset = safeReadJson(datasetFile);
if (!dataset) {
  throw new Error(`Missing or invalid dataset file: ${datasetFile}`);
}

const semantics = safeReadJson(semanticsFile);
const semanticProfiles = Array.isArray(semantics?.profiles) ? semantics.profiles.length : 0;

const stats = checkDataset(dataset);

const checks = [
  passFail(stats.termsCount >= minTerms, 'min_terms', `${stats.termsCount} >= ${minTerms}`),
  passFail(stats.uniqueRatio >= minUniqueRatio, 'min_unique_ratio', `${stats.uniqueRatio} >= ${minUniqueRatio}`),
  passFail(stats.invalidTerms.length === 0, 'invalid_terms', `${stats.invalidTerms.length} invalid term(s)`),
  passFail(semanticProfiles >= minSemanticProfiles, 'min_semantic_profiles', `${semanticProfiles} >= ${minSemanticProfiles}`),
];

const failed = checks.filter((c) => !c.passed);

const payload = {
  generatedAt: new Date().toISOString(),
  thresholds: {
    minTerms,
    minUniqueRatio,
    minSemanticProfiles,
  },
  stats: {
    ...stats,
    semanticProfiles,
  },
  checks,
  status: failed.length === 0 ? 'pass' : 'fail',
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outJson, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

const lines = [];
lines.push('# INT2 Dataset Quality Gate');
lines.push('');
lines.push(`- Generated at: ${payload.generatedAt}`);
lines.push(`- Status: ${payload.status}`);
lines.push(`- Terms: ${stats.termsCount}`);
lines.push(`- Unique ratio: ${stats.uniqueRatio}`);
lines.push(`- Semantic profiles: ${semanticProfiles}`);
lines.push('');
lines.push('| Check | Passed | Details |');
lines.push('|---|---|---|');
for (const c of checks) {
  lines.push(`| ${c.label} | ${c.passed ? 'yes' : 'no'} | ${c.details} |`);
}

if (stats.invalidTerms.length > 0) {
  lines.push('');
  lines.push('## Invalid Terms (sample)');
  lines.push('');
  for (const t of stats.invalidTerms) lines.push(`- ${t}`);
}

fs.writeFileSync(outMd, `${lines.join('\n')}\n`, 'utf8');

console.log(`INT2 dataset quality gate generated: ${outJson}`);
console.log(`INT2 dataset quality report generated: ${outMd}`);

if (payload.status === 'fail') {
  console.error('INT2 dataset quality gate failed.');
  process.exit(1);
}
