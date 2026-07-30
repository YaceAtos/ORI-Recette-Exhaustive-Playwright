const fs = require('fs');
const path = require('path');
const PptxGenJS = require('pptxgenjs');

const rootDir = path.resolve(__dirname, '..');
const pipelineDir = path.join(rootDir, 'int2-ihm-recordings', 'orion-pipeline');
const resultDir = path.join(rootDir, process.env.ORION_RESULT_DIR || 'int2-ihm-test-results/orion-pipeline');
const deliverableDir = path.join(rootDir, 'mon-espace', 'recette-sprints-11-12-13', 'livrables-opencode');
const catalogPath = path.join(pipelineDir, 'test-catalog.json');
const traceabilityPath = path.join(pipelineDir, 'traceability.json');
const playwrightPath = path.join(resultDir, 'playwright-results.json');

const colors = {
  navy: '17324D',
  blue: '246BCE',
  cyan: '3CBCC3',
  green: '2E9D69',
  orange: 'F29F3D',
  red: 'D9534F',
  ink: '243447',
  muted: '65758B',
  pale: 'EEF4F8',
  white: 'FFFFFF',
};

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function csvValue(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

function writeCsv(filePath, headers, rows) {
  const lines = [headers.map(csvValue).join(',')];
  for (const row of rows) lines.push(headers.map((header) => csvValue(row[header])).join(','));
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`, 'utf8');
}

function collectSpecs(suites, parentTitles = [], output = []) {
  for (const suite of suites || []) {
    const titles = suite.title ? [...parentTitles, suite.title] : parentTitles;
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        const results = test.results || [];
        if (results.length === 0) continue;
        const latest = results.at(-1) || {};
        const fullTitle = [...titles, spec.title].filter(Boolean).join(' > ');
        const issueKey = (fullTitle.match(/\bORI-\d+\b/) || [])[0] || '';
        output.push({
          issueKey,
          title: fullTitle,
          status: latest.status || (test.status === 'skipped' ? 'skipped' : 'unknown'),
          outcome: test.status || '',
          expectedStatus: test.expectedStatus || '',
          durationMs: results.reduce((sum, result) => sum + Number(result.duration || 0), 0),
          retries: Math.max(0, results.length - 1),
          error: latest.error?.message || latest.error?.value || '',
          attachments: (latest.attachments || []).map((attachment) => attachment.path || attachment.name).filter(Boolean).join(' | '),
        });
      }
    }
    collectSpecs(suite.suites, titles, output);
  }
  return output;
}

function nextVersionedPath(prefix, extension) {
  fs.mkdirSync(deliverableDir, { recursive: true });
  const pattern = new RegExp(`^${prefix}_v(\\d+)\\.${extension}$`);
  const versions = fs.readdirSync(deliverableDir).map((name) => Number(name.match(pattern)?.[1] || 0));
  return path.join(deliverableDir, `${prefix}_v${Math.max(0, ...versions) + 1}.${extension}`);
}

function addHeader(pptx, slide, eyebrow, title, subtitle) {
  slide.background = { color: colors.white };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 0.16, fill: { color: colors.cyan }, line: { color: colors.cyan } });
  slide.addText(eyebrow.toUpperCase(), { x: 0.65, y: 0.48, w: 5.5, h: 0.25, fontFace: 'Aptos', fontSize: 10, bold: true, color: colors.blue, charSpacing: 1.4, margin: 0 });
  slide.addText(title, { x: 0.65, y: 0.82, w: 12, h: 0.7, fontFace: 'Aptos Display', fontSize: 36, bold: true, color: colors.navy, margin: 0, fit: 'shrink' });
  if (subtitle) slide.addText(subtitle, { x: 0.65, y: 1.48, w: 12, h: 0.4, fontFace: 'Aptos', fontSize: 13, color: colors.muted, margin: 0 });
}

function addMetric(pptx, slide, x, y, value, label, color = colors.blue) {
  slide.addShape(pptx.ShapeType.roundRect, { x, y, w: 2.75, h: 1.2, rectRadius: 0.08, fill: { color: colors.pale }, line: { color: 'D8E4EC', width: 1 } });
  slide.addText(String(value), { x: x + 0.2, y: y + 0.12, w: 2.35, h: 0.48, fontFace: 'Aptos Display', fontSize: 24, bold: true, color, margin: 0, align: 'center', fit: 'shrink' });
  slide.addText(label, { x: x + 0.15, y: y + 0.72, w: 2.45, h: 0.22, fontFace: 'Aptos', fontSize: 10, color: colors.muted, margin: 0, align: 'center', fit: 'shrink' });
}

function addFooter(slide, text) {
  slide.addText(text, { x: 0.65, y: 7.1, w: 12, h: 0.2, fontFace: 'Aptos', fontSize: 8, color: '8290A3', margin: 0, align: 'right' });
}

function addFlow(pptx, slide, labels) {
  labels.forEach((label, index) => {
    const x = 0.65 + index * 2.48;
    slide.addShape(pptx.ShapeType.roundRect, { x, y: 2.55, w: 1.95, h: 0.9, fill: { color: index === labels.length - 1 ? colors.navy : colors.pale }, line: { color: index === labels.length - 1 ? colors.navy : 'C8D9E5' } });
    slide.addText(label, { x: x + 0.1, y: 2.82, w: 1.75, h: 0.22, fontFace: 'Aptos', fontSize: 11, bold: true, color: index === labels.length - 1 ? colors.white : colors.ink, align: 'center', margin: 0 });
    if (index < labels.length - 1) slide.addShape(pptx.ShapeType.chevron, { x: x + 2.02, y: 2.83, w: 0.3, h: 0.3, fill: { color: colors.cyan }, line: { color: colors.cyan } });
  });
}

async function buildStrategy(catalog, traceability, target) {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'Orion Playwright Pipeline';
  pptx.subject = 'Strategie de test locale Orion';
  pptx.title = 'Strategie de test Orion - Sprints 11, 12 et 13';
  pptx.company = 'Orion';
  pptx.lang = 'fr-FR';
  pptx.theme = { headFontFace: 'Aptos Display', bodyFontFace: 'Aptos', lang: 'fr-FR' };

  let slide = pptx.addSlide();
  slide.background = { color: colors.navy };
  slide.addShape(pptx.ShapeType.rect, { x: 0.7, y: 0.7, w: 0.12, h: 5.75, fill: { color: colors.cyan }, line: { color: colors.cyan } });
  slide.addText('ORION / QUALITE ASSISTEE', { x: 1.1, y: 1.05, w: 5.5, h: 0.3, fontFace: 'Aptos', fontSize: 12, bold: true, color: '8DE1E4', charSpacing: 1.4, margin: 0 });
  slide.addText('Strategie de test\nPlaywright autonome', { x: 1.1, y: 1.65, w: 9.7, h: 1.65, fontFace: 'Aptos Display', fontSize: 38, bold: true, color: colors.white, margin: 0 });
  slide.addText('Sprints 11, 12 et 13 | INT2 | Execution et preuves locales', { x: 1.1, y: 3.65, w: 9.7, h: 0.4, fontFace: 'Aptos', fontSize: 17, color: 'C8D8E8', margin: 0 });
  slide.addText('Confluence + Jira/Xray en lecture et references locales uniquement. Aucune ecriture distante.', { x: 1.1, y: 5.55, w: 10.5, h: 0.35, fontFace: 'Aptos', fontSize: 11, color: '9FB2C6', margin: 0 });
  slide.addNotes('Presenter le principe local-first et rappeler que Playwright est le moteur d execution. Aucune publication distante n est incluse.');
  addFooter(slide, new Date().toISOString());

  slide = pptx.addSlide();
  addHeader(pptx, slide, 'Vision', 'Une chaine auditable, pilotee par Playwright', 'Le classeur fixe le perimetre. Les sources Atlassian enrichissent la tracabilite. Playwright porte l execution.');
  addFlow(pptx, slide, ['Excel', 'Confluence', 'Jira / Xray', 'Playwright', 'Rapports']);
  slide.addText('Regles de gouvernance', { x: 0.75, y: 4.05, w: 3.2, h: 0.3, fontFace: 'Aptos Display', fontSize: 18, bold: true, color: colors.navy, margin: 0 });
  slide.addText('1:1 entre cas canonique et reference TC locale\nFail-safe : une couverture ticket ne vaut pas couverture exacte\nLocal-first : aucune publication distante implicite', { x: 0.75, y: 4.5, w: 11.7, h: 1.1, fontFace: 'Aptos', fontSize: 15, color: colors.ink, margin: 0.05, breakLine: false });
  addFooter(slide, 'Strategie de test Orion');
  slide.addNotes('Expliquer la chaine de tracabilite et la difference entre une couverture exacte et une simple correspondance au ticket Jira.');

  slide = pptx.addSlide();
  addHeader(pptx, slide, 'Perimetre', 'Base de recette et couverture initiale', 'Mesures derivees du classeur et du depot, sans extrapolation.');
  addMetric(pptx, slide, 0.75, 2.25, catalog.count, 'Cas de test', colors.blue);
  addMetric(pptx, slide, 3.55, 2.25, catalog.issueKeys.length, 'Tickets ORI', colors.cyan);
  addMetric(pptx, slide, 6.35, 2.25, catalog.rules.length, 'Regles RG', colors.green);
  addMetric(pptx, slide, 9.15, 2.25, traceability.coverageLevels.exacte || 0, 'Couvertures exactes', colors.orange);
  slide.addText('Criteres de sortie', { x: 0.75, y: 4.15, w: 3, h: 0.3, fontFace: 'Aptos Display', fontSize: 18, bold: true, color: colors.navy, margin: 0 });
  slide.addText('• Tous les P1 executes ou explicitement bloques\n• Resultats JSON, JUnit et HTML disponibles\n• Preuves conservees pour chaque echec\n• Aucun cas manquant transforme artificiellement en succes', { x: 0.75, y: 4.55, w: 11.5, h: 1.35, fontFace: 'Aptos', fontSize: 15, color: colors.ink, breakLine: false, margin: 0.03 });
  addFooter(slide, 'Perimetre automatise');
  slide.addNotes('Commenter les volumes extraits du classeur et utiliser ces chiffres comme baseline de pilotage.');

  await pptx.writeFile({ fileName: target });
}

async function buildPlan(catalog, traceability, target) {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'Orion Playwright Pipeline';
  pptx.title = 'Plan de test Orion - Sprints 11, 12 et 13';
  pptx.lang = 'fr-FR';
  pptx.theme = { headFontFace: 'Aptos Display', bodyFontFace: 'Aptos', lang: 'fr-FR' };

  let slide = pptx.addSlide();
  addHeader(pptx, slide, 'Plan', 'Plan de test local INT2', 'References: TP-LOCAL-SPRINT-11-12-13 / TE-LOCAL-INT2-SPRINT-11-12-13');
  addMetric(pptx, slide, 0.75, 2.2, catalog.count, 'TC locaux', colors.blue);
  addMetric(pptx, slide, 3.55, 2.2, catalog.issueKeys.length, 'TS par ticket ORI', colors.cyan);
  addMetric(pptx, slide, 6.35, 2.2, catalog.cases.filter((item) => item.priority === 'P1').length, 'Priorite P1', colors.red);
  addMetric(pptx, slide, 9.15, 2.2, catalog.cases.filter((item) => item.confluence.requiresConfirmation).length, 'Sources a confirmer', colors.orange);
  slide.addText('Ordonnancement', { x: 0.75, y: 4.05, w: 2.5, h: 0.3, fontFace: 'Aptos Display', fontSize: 18, bold: true, color: colors.navy, margin: 0 });
  slide.addText('1. Gate catalogue et fixtures\n2. P1 IHM et integration automatisables\n3. P2 et variantes\n4. Cas back via hooks dedies\n5. Consolidation, analyse et reexecution ciblee', { x: 0.75, y: 4.5, w: 6, h: 1.45, fontFace: 'Aptos', fontSize: 15, color: colors.ink, breakLine: false, margin: 0.03 });
  slide.addText('Couverture actuelle', { x: 7.2, y: 4.05, w: 2.8, h: 0.3, fontFace: 'Aptos Display', fontSize: 18, bold: true, color: colors.navy, margin: 0 });
  slide.addText(`Exacte : ${traceability.coverageLevels.exacte || 0}\nTicket seulement : ${traceability.coverageLevels['ticket-seulement'] || 0}\nManquante : ${traceability.coverageLevels.manquante || 0}`, { x: 7.2, y: 4.5, w: 4.6, h: 1.2, fontFace: 'Aptos', fontSize: 16, color: colors.ink, breakLine: false, margin: 0.03 });
  addFooter(slide, 'Plan de test Orion');
  slide.addNotes('Presenter les references locales TP, TE, TS et TC ainsi que l ordre d execution propose.');

  slide = pptx.addSlide();
  addHeader(pptx, slide, 'Execution', 'Contrat d execution Playwright', 'Un run local produit les memes preuves, quel que soit son statut final.');
  addFlow(pptx, slide, ['Gate', 'Selection', 'Execution', 'Preuves', 'Synthese']);
  slide.addText('Artefacts attendus', { x: 0.75, y: 4.15, w: 2.8, h: 0.3, fontFace: 'Aptos Display', fontSize: 18, bold: true, color: colors.navy, margin: 0 });
  slide.addText('playwright-results.json  |  playwright-results.xml  |  rapport HTML\ntraces, captures et videos sur echec  |  execution-results.csv  |  PPTX bilan', { x: 0.75, y: 4.65, w: 11.6, h: 0.8, fontFace: 'Aptos', fontSize: 15, color: colors.ink, margin: 0.03, align: 'center' });
  addFooter(slide, 'Contrat local Playwright');
  slide.addNotes('Decrire les gates, les preuves Playwright et la garantie de rapport meme en cas d echec.');

  await pptx.writeFile({ fileName: target });
}

async function buildExecution(catalog, traceability, results, target) {
  const totals = results.reduce((acc, result) => {
    acc[result.status] = (acc[result.status] || 0) + 1;
    acc.durationMs += result.durationMs;
    return acc;
  }, { durationMs: 0 });
  const executed = results.length;
  const failed = (totals.failed || 0) + (totals.timedOut || 0) + (totals.interrupted || 0);
  const passed = totals.passed || 0;

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'Orion Playwright Pipeline';
  pptx.title = 'Bilan execution Playwright Orion';
  pptx.lang = 'fr-FR';
  pptx.theme = { headFontFace: 'Aptos Display', bodyFontFace: 'Aptos', lang: 'fr-FR' };

  let slide = pptx.addSlide();
  addHeader(pptx, slide, 'Bilan', 'Execution Playwright locale', executed ? 'Resultats consolides depuis le reporter JSON Playwright.' : 'Aucune execution Playwright detectee. Le bilan reste en statut NON EXECUTE.');
  addMetric(pptx, slide, 0.75, 2.15, executed, 'Tests executes', colors.blue);
  addMetric(pptx, slide, 3.55, 2.15, passed, 'Passes', colors.green);
  addMetric(pptx, slide, 6.35, 2.15, failed, 'Echecs', colors.red);
  addMetric(pptx, slide, 9.15, 2.15, `${Math.round(totals.durationMs / 1000)} s`, 'Duree cumulee', colors.orange);
  const status = !executed ? 'NON EXECUTE' : failed ? 'ECHEC' : 'SUCCES';
  const statusColor = !executed ? colors.orange : failed ? colors.red : colors.green;
  slide.addShape(pptx.ShapeType.roundRect, { x: 3.6, y: 4.25, w: 6.1, h: 1.15, fill: { color: statusColor }, line: { color: statusColor } });
  slide.addText(status, { x: 3.8, y: 4.48, w: 5.7, h: 0.55, fontFace: 'Aptos Display', fontSize: 24, bold: true, color: colors.white, align: 'center', margin: 0, fit: 'shrink' });
  addFooter(slide, 'TE-LOCAL-INT2-SPRINT-11-12-13');
  slide.addNotes('Presenter le statut reel du run. En mode prepare, le statut doit rester NON EXECUTE.');

  slide = pptx.addSlide();
  addHeader(pptx, slide, 'Tracabilite', 'Couverture et ecarts', 'La couverture exacte exige la reference du cas Excel dans le test Playwright.');
  addMetric(pptx, slide, 0.75, 2.15, traceability.coverageLevels.exacte || 0, 'Exacte', colors.green);
  addMetric(pptx, slide, 3.55, 2.15, traceability.coverageLevels['ticket-seulement'] || 0, 'Ticket seulement', colors.orange);
  addMetric(pptx, slide, 6.35, 2.15, traceability.coverageLevels.manquante || 0, 'Manquante', colors.red);
  addMetric(pptx, slide, 9.15, 2.15, catalog.count, 'Catalogue total', colors.blue);
  const topFailures = results.filter((result) => /failed|timedOut|interrupted/.test(result.status)).slice(0, 6);
  slide.addText('Echecs prioritaires', { x: 0.75, y: 4.05, w: 4, h: 0.3, fontFace: 'Aptos Display', fontSize: 18, bold: true, color: colors.navy, margin: 0 });
  const failLine = (r) => `• ${r.issueKey || 'sans ORI'} — ${String(r.title).replace(/^.*›\s*/, '').slice(0, 70)}`;
  slide.addText(topFailures.length ? topFailures.map(failLine).join('\n') : '• Aucun echec Playwright structure disponible.', { x: 0.75, y: 4.5, w: 11.9, h: 2.4, fontFace: 'Aptos', fontSize: 12, color: colors.ink, breakLine: false, margin: 0.03, valign: 'top', fit: 'shrink' });
  addFooter(slide, 'Couverture et analyse');
  slide.addNotes('Insister sur les ecarts de couverture et prioriser la reference explicite des IDs CT dans les tests Playwright.');

  await pptx.writeFile({ fileName: target });
}

async function main() {
  if (!fs.existsSync(catalogPath)) throw new Error('Catalogue absent. Executer d abord npm run orion:pipeline:catalog.');
  const catalog = readJson(catalogPath, null);
  const traceability = readJson(traceabilityPath, { coverageLevels: {}, coverage: [] });
  const playwright = process.env.ORION_REPORT_IGNORE_RESULTS === 'true'
    ? { suites: [] }
    : readJson(playwrightPath, { suites: [] });
  const results = collectSpecs(playwright.suites || []);

  fs.mkdirSync(pipelineDir, { recursive: true });
  fs.mkdirSync(deliverableDir, { recursive: true });
  writeCsv(path.join(pipelineDir, 'execution-results.csv'), ['issueKey', 'title', 'status', 'expectedStatus', 'durationMs', 'retries', 'error', 'attachments'], results);
  fs.writeFileSync(path.join(pipelineDir, 'execution-results.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), count: results.length, results }, null, 2)}\n`, 'utf8');

  const strategyPath = nextVersionedPath('strategie_test_orion', 'pptx');
  const planPath = nextVersionedPath('plan_test_orion', 'pptx');
  const executionPath = nextVersionedPath('bilan_execution_playwright_orion', 'pptx');
  await buildStrategy(catalog, traceability, strategyPath);
  await buildPlan(catalog, traceability, planPath);
  await buildExecution(catalog, traceability, results, executionPath);

  const executionSummary = [
    '# Bilan execution Playwright Orion',
    '',
    `- Genere le : ${new Date().toISOString()}`,
    `- Tests executes : ${results.length}`,
    `- Passes : ${results.filter((result) => result.status === 'passed').length}`,
    `- Echecs : ${results.filter((result) => /failed|timedOut|interrupted/.test(result.status)).length}`,
    `- Ignored/skipped : ${results.filter((result) => /skipped/.test(result.status)).length}`,
    `- Rapport HTML : ${path.relative(rootDir, path.join(resultDir, 'html', 'index.html'))}`,
    '',
    results.length ? '' : '> Statut : NON EXECUTE. Aucun resultat Playwright JSON disponible.',
  ];
  fs.writeFileSync(path.join(pipelineDir, 'EXECUTION_SUMMARY.md'), `${executionSummary.join('\n')}\n`, 'utf8');
  console.log(`Rapports locaux generes: ${path.relative(rootDir, strategyPath)}, ${path.relative(rootDir, planPath)}, ${path.relative(rootDir, executionPath)}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
