const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const pipelineDir = path.join(rootDir, 'int2-ihm-recordings', 'orion-pipeline');
const catalogPath = path.join(pipelineDir, 'test-catalog.json');
const traceabilityPath = path.join(pipelineDir, 'traceability.json');

function fail(message) {
  console.error(`Validation Orion: ${message}`);
  process.exitCode = 1;
}

if (!fs.existsSync(catalogPath)) {
  fail(`catalogue absent: ${catalogPath}`);
} else {
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const cases = Array.isArray(catalog.cases) ? catalog.cases : [];
  const canonicalIds = new Set();
  const localRefs = new Set();

  if (catalog.schemaVersion !== '1.0') fail('schemaVersion doit valoir 1.0.');
  if (catalog.mode !== 'local-only') fail('mode doit valoir local-only.');
  if (catalog.count !== cases.length) fail(`count=${catalog.count} mais ${cases.length} cas trouves.`);
  if (cases.length === 0) fail('aucun cas exploitable.');

  for (const testCase of cases) {
    if (!/^ORI-\d+$/.test(testCase.issueKey || '')) fail(`issueKey invalide ligne ${testCase.sourceRow}.`);
    if (!/^CT-/.test(testCase.caseId || '')) fail(`caseId invalide ligne ${testCase.sourceRow}.`);
    if (!testCase.scenario) fail(`scenario vide pour ${testCase.canonicalId}.`);
    if (canonicalIds.has(testCase.canonicalId)) fail(`canonicalId duplique: ${testCase.canonicalId}.`);
    canonicalIds.add(testCase.canonicalId);

    const localRef = testCase.references?.testCase;
    if (!localRef) fail(`reference TC absente pour ${testCase.canonicalId}.`);
    if (localRefs.has(localRef)) fail(`reference TC dupliquee: ${localRef}.`);
    localRefs.add(localRef);
  }

  if (!fs.existsSync(traceabilityPath)) fail('matrice de tracabilite absente.');
  if (!process.exitCode) {
    console.log(`Validation Orion OK: ${cases.length} cas, ${catalog.issueKeys.length} tickets, ${catalog.rules.length} regles.`);
  }
}
