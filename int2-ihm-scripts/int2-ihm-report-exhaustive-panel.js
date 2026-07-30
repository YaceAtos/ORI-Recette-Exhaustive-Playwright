const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const recordingsDir = path.join(rootDir, 'int2-ihm-recordings');
const outputFile = path.join(rootDir, 'int2-ihm-recordings', 'chains', 'PANNEAU_EXHAUSTIF_CAS_DE_TEST.md');

function walkFiles(dir, collector = []) {
  if (!fs.existsSync(dir)) return collector;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, collector);
    } else {
      collector.push(full);
    }
  }
  return collector;
}

function toPosix(p) {
  return p.replaceAll('\\\\', '/');
}

function suiteFromRel(relPath) {
  const parts = toPosix(relPath).split('/');
  if (parts.length < 2) return 'unknown';
  return parts[1];
}

function scenarioFromBaseName(name) {
  return name
    .replace(/__video$/i, '')
    .replace(/[-_]+/g, ' ')
    .trim();
}

const allFiles = walkFiles(recordingsDir);
const mp4Files = allFiles.filter((f) => f.toLowerCase().endsWith('.mp4')).sort();
const jsonFiles = allFiles.filter((f) => f.toLowerCase().endsWith('.json')).sort();

const jsonByBase = new Map();
for (const json of jsonFiles) {
  const base = path.basename(json, '.json');
  jsonByBase.set(base, json);
}

const rows = mp4Files.map((mp4Path, idx) => {
  const base = path.basename(mp4Path, '.mp4');
  const relMp4 = toPosix(path.relative(rootDir, mp4Path));
  const jsonPath = jsonByBase.get(base);
  const relJson = jsonPath ? toPosix(path.relative(rootDir, jsonPath)) : '';
  let duration = '';
  let chapters = '';

  if (jsonPath) {
    try {
      const parsed = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      if (Number.isFinite(Number(parsed.duration_seconds))) {
        duration = Number(parsed.duration_seconds).toFixed(2);
      }
      if (Number.isFinite(Number(parsed.chapter_screenshots_count))) {
        chapters = String(parsed.chapter_screenshots_count);
      }
    } catch {
      // Ignore invalid JSON and keep empty fields.
    }
  }

  const suite = suiteFromRel(relMp4);
  const status = jsonPath ? 'VALIDE_ENREGISTRE' : 'VIDEO_SANS_MANIFEST';

  return {
    id: `TC-${String(idx + 1).padStart(3, '0')}`,
    suite,
    scenario: scenarioFromBaseName(base),
    relMp4,
    relJson,
    duration,
    chapters,
    status,
  };
});

const suites = rows.reduce((acc, r) => {
  acc[r.suite] = (acc[r.suite] || 0) + 1;
  return acc;
}, {});

const withManifest = rows.filter((r) => r.relJson).length;
const withoutManifest = rows.length - withManifest;

const now = new Date().toISOString();

const lines = [];
lines.push('# Panneau Exhaustif des Cas de Test');
lines.push('');
lines.push(`- Date de generation: ${now}`);
lines.push(`- Total cas avec video MP4: ${rows.length}`);
lines.push(`- Cas avec manifest JSON: ${withManifest}`);
lines.push(`- Cas sans manifest JSON: ${withoutManifest}`);
lines.push(`- Repartition par suite: ${Object.entries(suites).map(([k, v]) => `${k}=${v}`).join(', ') || 'N/A'}`);
lines.push('');
lines.push('## Matrice des Cas (Video + Manifest + Statut)');
lines.push('');
lines.push('| ID | Suite | Scenario | MP4 | JSON | Duree (s) | Chapitres | Statut |');
lines.push('|---|---|---|---|---|---:|---:|---|');

for (const r of rows) {
  const mp4Cell = `[mp4](${toPosix(r.relMp4)})`;
  const jsonCell = r.relJson ? `[json](${toPosix(r.relJson)})` : 'N/A';
  lines.push(`| ${r.id} | ${r.suite} | ${r.scenario} | ${mp4Cell} | ${jsonCell} | ${r.duration || 'N/A'} | ${r.chapters || 'N/A'} | ${r.status} |`);
}

lines.push('');
lines.push('## Cas Bloquants Connus (Hors Videos Stables)');
lines.push('');
lines.push('- MP6 / OF -> PAP: AccessDenied observe sur certains parcours transverses complets.');
lines.push('- Flux dependants de connecteurs externes (RRULE, Kafka, SIRENE, INS, DUI, DMP) non validables localement.');
lines.push('');
lines.push('## Commandes de Regeneration');
lines.push('');
lines.push('- `npm run test:exhaustive:mp4`');
lines.push('- `npm run test:full:exhaustive`');
lines.push('- `npm run report:panel:exhaustive`');
lines.push('- `npm run report:pptx:exhaustive`');

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, `${lines.join('\n')}\n`, 'utf8');

console.log(`Panneau exhaustif genere: ${outputFile}`);
