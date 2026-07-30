const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const recordingsDir = path.join(rootDir, 'int2-ihm-recordings', 'chains');
const outputFile = path.join(recordingsDir, 'RAPPORT_COUVERTURE_BLOQUANTS_KPI.md');

const manifestFiles = fs
  .readdirSync(recordingsDir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => path.join(recordingsDir, f))
  .sort();

if (manifestFiles.length === 0) {
  console.error('Aucun manifest JSON trouve dans int2-ihm-recordings/chains.');
  process.exit(1);
}

const manifests = manifestFiles.map((file) => {
  const raw = fs.readFileSync(file, 'utf8');
  return JSON.parse(raw);
});

const totalDuration = manifests.reduce((acc, m) => acc + Number(m.duration_seconds || 0), 0);
const totalChapters = manifests.reduce((acc, m) => acc + Number(m.chapter_screenshots_count || 0), 0);
const avgDuration = manifests.length > 0 ? totalDuration / manifests.length : 0;

const strictDone = 3;
const strictTotal = 45;
const strictPct = ((strictDone / strictTotal) * 100).toFixed(2);

const scenarioName = (mp4Path) => {
  const lower = mp4Path.toLowerCase();
  if (lower.includes('planning-annulation')) return 'Chaine 1 - PP domicile (planning + annulation)';
  if (lower.includes('collaborateurs-filtres')) return 'Chaine 2 - Pro multi-sites (collaborateurs + filtres)';
  if (lower.includes('create-error-workflow')) return 'Chaine 3 - SAAD transverse (create + error recovery)';
  return 'Scenario non mappe';
};

const lines = [];
lines.push('# Rapport Couverture, Bloquants et KPI');
lines.push('');
lines.push(`Date: ${new Date().toISOString()}`);
lines.push('');
lines.push('## Synthese Executive');
lines.push('');
lines.push(`- Scenarios executes: ${manifests.length}/3`);
lines.push(`- Duree video totale (sec): ${totalDuration.toFixed(2)}`);
lines.push(`- Duree video moyenne (sec): ${avgDuration.toFixed(2)}`);
lines.push(`- Captures chapitres totales: ${totalChapters}`);
lines.push(`- Couverture stricte matrice metier: ${strictDone}/${strictTotal} (${strictPct}%)`);
lines.push('');
lines.push('## KPI Par Scenario (Lie Aux MP4)');
lines.push('');
lines.push('| Scenario | MP4 | Duree (sec) | Chapitres | Manifest |');
lines.push('|---|---|---:|---:|---|');

for (const m of manifests) {
  const mp4Rel = m.mp4.replaceAll('\\', '/');
  const jsonName = path.basename(mp4Rel).replace('.mp4', '.json');
  const jsonRel = `int2-ihm-recordings/chains/${jsonName}`;
  lines.push(`| ${scenarioName(mp4Rel)} | [${path.basename(mp4Rel)}](${mp4Rel}) | ${Number(m.duration_seconds || 0).toFixed(2)} | ${Number(m.chapter_screenshots_count || 0)} | [${jsonName}](${jsonRel}) |`);
}

lines.push('');
lines.push('## Lecture Visuelle (Ce Qui A Ete Montre)');
lines.push('');
lines.push('- Chaine 1: navigation planning, ouverture intervention, annulation, choix de motif, retour planning.');
lines.push('- Chaine 2: recherche collaborateurs multi-passes, verification lignes, reset filtres, stabilite listing.');
lines.push('- Chaine 3: ouverture create, visualisation erreur backend, fermeture, reprise actions utilisateur.');
lines.push('');
lines.push('## Couverture Reelle Vs Cible');
lines.push('');
lines.push('- Cible demandee: 45 etapes metier (3 chaines).');
lines.push('- Execute et valide en automation stable: 3 etapes strictes equivalentes.');
lines.push(`- Couverture globale: ${strictPct}%.`);
lines.push('');
lines.push('## Bloquants Constates');
lines.push('');
lines.push('1. AccessDenied sur le module OF (MP6) pour creation/verification complete.');
lines.push('2. Derive de donnees/acces sur certaines routes plan-aide dev1.');
lines.push('3. Absence de connecteurs/harness dans ce repo pour RRULE batch, Kafka, SIRENE, INS/DUI/DMP/iCanopee.');
lines.push('');
lines.push('## Commande De Reproduction');
lines.push('');
lines.push('```bash');
lines.push('npm run test:full:exhaustive');
lines.push('```');

fs.writeFileSync(outputFile, lines.join('\n') + '\n', 'utf8');
console.log(`Rapport genere: ${outputFile}`);
