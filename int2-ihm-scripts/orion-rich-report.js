const fs = require('fs');
const path = require('path');
const PptxGenJS = require('pptxgenjs');

const rootDir = path.resolve(__dirname, '..');
const pipelineDir = path.join(rootDir, 'int2-ihm-recordings', 'orion-pipeline');
const resultDir = path.join(rootDir, process.env.ORION_RESULT_DIR || 'int2-ihm-test-results/orion-pipeline-headed');
const deliverableDir = path.join(rootDir, 'mon-espace', 'recette-sprints-11-12-13', 'livrables-opencode');
const journeyDir = path.join(pipelineDir, 'journeys');

const C = { navy: '17324D', blue: '246BCE', cyan: '3CBCC3', green: '2E9D69', orange: 'F29F3D', gold: 'E0B000', red: 'D9534F', ink: '243447', muted: '65758B', pale: 'EEF4F8', line: 'D8E4EC', white: 'FFFFFF' };
const SEVC = { bloquant: C.red, moyen: C.orange, mineur: C.gold };

const readJson = (p, fb) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fb; } };
const safe = (s) => String(s).replace(/[^\w.-]/g, '_');

function nextVersion(prefix, ext) {
  fs.mkdirSync(deliverableDir, { recursive: true });
  const re = new RegExp(`^${prefix}_v(\\d+)\\.${ext}$`);
  const v = fs.readdirSync(deliverableDir).map((n) => Number((n.match(re) || [])[1] || 0));
  return path.join(deliverableDir, `${prefix}_v${Math.max(0, ...v) + 1}.${ext}`);
}

// ─── Fusion des 3 sources : catalogue (Excel) + résultats Playwright + journeys ───
function buildHybrid() {
  const catalog = readJson(path.join(pipelineDir, 'test-catalog.json'), { cases: [] });
  const bugCat = readJson(path.join(pipelineDir, 'bug-catalog.json'), { bugs: [] });
  const bugByCanon = new Map(bugCat.bugs.map((b) => [b.canonicalId, b]));
  const rows = catalog.cases.map((c) => {
    const j = readJson(path.join(journeyDir, `${safe(c.canonicalId)}.json`), {});
    const bug = bugByCanon.get(c.canonicalId) || null;
    const moduleTop = (c.module || '').split('>')[0].trim();
    return {
      canonicalId: c.canonicalId, issueKey: c.issueKey, caseId: c.caseId, module: c.module, moduleTop,
      priority: c.priority, type: c.type, scenario: c.scenario, rules: c.confluence.rules || [],
      status: j.status || 'non-exécuté',
      reachedRecord: !!j.reachedRecord, fieldsFilled: j.fieldsFilled || 0,
      progressedSteps: j.progressedSteps || 0, totalSteps: j.totalSteps || (c.steps || []).length,
      assertMet: (j.assertion || {}).met || 0, assertTotal: (j.assertion || {}).total || 0,
      blocker: j.blocker || null, severity: bug ? bug.severity : null, bug,
    };
  });
  return { catalog, rows, bugs: bugCat.bugs };
}

const theme = (pptx) => { pptx.layout = 'LAYOUT_WIDE'; pptx.author = 'Orion Playwright Pipeline'; pptx.company = 'Atos'; pptx.lang = 'fr-FR'; pptx.theme = { headFontFace: 'Aptos Display', bodyFontFace: 'Aptos', lang: 'fr-FR' }; };
function header(pptx, s, eyebrow, title, sub) {
  s.background = { color: C.white };
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 0.16, fill: { color: C.cyan }, line: { color: C.cyan } });
  s.addText(eyebrow.toUpperCase(), { x: 0.6, y: 0.42, w: 8, h: 0.25, fontFace: 'Aptos', fontSize: 10, bold: true, color: C.blue, charSpacing: 1.4, margin: 0 });
  s.addText(title, { x: 0.6, y: 0.74, w: 12.1, h: 0.7, fontFace: 'Aptos Display', fontSize: 32, bold: true, color: C.navy, margin: 0, fit: 'shrink' });
  if (sub) s.addText(sub, { x: 0.6, y: 1.42, w: 12.1, h: 0.35, fontFace: 'Aptos', fontSize: 12, color: C.muted, margin: 0 });
}
function metric(pptx, s, x, y, val, lab, col) {
  s.addShape(pptx.ShapeType.roundRect, { x, y, w: 2.35, h: 1.15, rectRadius: 0.08, fill: { color: C.pale }, line: { color: C.line, width: 1 } });
  s.addText(String(val), { x: x + 0.1, y: y + 0.12, w: 2.15, h: 0.5, fontFace: 'Aptos Display', fontSize: 26, bold: true, color: col, align: 'center', margin: 0, fit: 'shrink' });
  s.addText(lab, { x: x + 0.1, y: y + 0.72, w: 2.15, h: 0.3, fontFace: 'Aptos', fontSize: 9.5, color: C.muted, align: 'center', margin: 0, fit: 'shrink' });
}
const footer = (s, t) => s.addText(t, { x: 0.6, y: 7.15, w: 12.1, h: 0.2, fontFace: 'Aptos', fontSize: 8, color: '8290A3', align: 'right', margin: 0 });

function tableSlide(pptx, prs, eyebrow, title, sub, headRow, bodyRows, colW, footerTxt) {
  const s = prs.addSlide();
  header(pptx, s, eyebrow, title, sub);
  const head = headRow.map((h) => ({ text: h, options: { bold: true, color: C.white, fill: { color: C.navy }, fontSize: 10, align: 'left', valign: 'middle' } }));
  const body = bodyRows.map((r, i) => r.map((cell) => {
    const val = typeof cell === 'object' ? cell : { text: String(cell) };
    return { text: val.text, options: { color: val.color || C.ink, fill: { color: i % 2 ? 'F7FAFC' : C.white }, fontSize: 9, align: val.align || 'left', valign: 'middle', bold: val.bold || false } };
  }));
  s.addTable([head, ...body], { x: 0.6, y: 1.95, w: 12.13, colW, border: { type: 'solid', color: C.line, pt: 0.5 }, rowH: 0.3, autoPage: false });
  footer(s, footerTxt);
  return s;
}

async function buildRichReport(target) {
  const { catalog, rows, bugs } = buildHybrid();
  const pptx = new PptxGenJS(); theme(pptx);
  pptx.title = 'Bilan de recette Orion - Sprints 11 12 13';

  const passed = rows.filter((r) => r.status === 'passed').length;
  const blockedFlow = rows.filter((r) => r.status === 'blocked-flow').length;
  const blockedData = rows.filter((r) => r.status === 'blocked-data').length;
  const assertLow = rows.filter((r) => r.status === 'assertion-low').length;
  const sev = bugs.reduce((a, b) => { a[b.severity] = (a[b.severity] || 0) + 1; return a; }, {});

  // 1. COUVERTURE
  let s = pptx.addSlide();
  s.background = { color: C.navy };
  s.addShape(pptx.ShapeType.rect, { x: 0.7, y: 0.8, w: 0.12, h: 5.4, fill: { color: C.cyan }, line: { color: C.cyan } });
  s.addText('ATOS · ORION · RECETTE ASSISTEE PAR IA', { x: 1.1, y: 1.1, w: 10, h: 0.3, fontFace: 'Aptos', fontSize: 12, bold: true, color: '8DE1E4', charSpacing: 1.2, margin: 0 });
  s.addText('Bilan de recette\nSprints 11, 12 et 13', { x: 1.1, y: 1.7, w: 11, h: 1.7, fontFace: 'Aptos Display', fontSize: 40, bold: true, color: C.white, margin: 0 });
  s.addText(`INT2 · ${catalog.count} cas de test · ${catalog.issueKeys.length} tickets ORI · ${catalog.rules.length} règles RG · preuves vidéo MP4`, { x: 1.1, y: 3.75, w: 11, h: 0.4, fontFace: 'Aptos', fontSize: 15, color: 'C8D8E8', margin: 0 });
  s.addText(`Généré le ${new Date().toLocaleString('fr-FR')} · Exécution Playwright headed, données réelles par ticket`, { x: 1.1, y: 5.7, w: 11, h: 0.35, fontFace: 'Aptos', fontSize: 10, color: '9FB2C6', margin: 0 });
  footer(s, 'Bilan de recette Orion');

  // 2. SYNTHESE KPI
  s = pptx.addSlide();
  header(pptx, s, 'Synthèse', 'Résultats consolidés de l\'exécution', 'Fusion des 3 rapports : Playwright (exécution) · Xray (références) · Hybride (concordance Excel).');
  metric(pptx, s, 0.6, 2.0, catalog.count, 'Cas exécutés', C.blue);
  metric(pptx, s, 3.05, 2.0, passed, 'Passés', C.green);
  metric(pptx, s, 5.5, 2.0, blockedFlow + assertLow, 'Bloqués flux', C.orange);
  metric(pptx, s, 7.95, 2.0, blockedData, 'Bloqués données', C.muted);
  metric(pptx, s, 10.4, 2.0, bugs.length, 'Bugs détectés', C.red);
  s.addText('Répartition des bugs par sévérité', { x: 0.6, y: 3.6, w: 8, h: 0.3, fontFace: 'Aptos Display', fontSize: 16, bold: true, color: C.navy, margin: 0 });
  metric(pptx, s, 0.6, 4.05, sev.bloquant || 0, 'Bloquants (rouge)', C.red);
  metric(pptx, s, 3.05, 4.05, sev.moyen || 0, 'Moyens (orange)', C.orange);
  metric(pptx, s, 5.5, 4.05, sev.mineur || 0, 'Mineurs (jaune)', C.gold);
  s.addText('Chaque cas dispose d\'une vidéo MP4 du parcours réel et d\'une capture. Les bugs sont annotés visuellement (cercle/cadre coloré) sur l\'IHM.', { x: 8.1, y: 4.05, w: 4.6, h: 1.15, fontFace: 'Aptos', fontSize: 11, color: C.ink, margin: 0.05, valign: 'top' });
  footer(s, 'TE-LOCAL-INT2-SPRINT-11-12-13');

  // 3. COUVERTURE PAR MODULE
  const mods = {};
  for (const r of rows) { const k = r.moduleTop || '—'; (mods[k] = mods[k] || []).push(r); }
  const modRows = Object.entries(mods).sort().map(([k, list]) => [
    k, String(list.length),
    { text: String(list.filter((x) => x.status === 'passed').length), color: C.green },
    { text: String(list.filter((x) => /blocked-flow|assertion-low/.test(x.status)).length), color: C.orange },
    { text: String(list.filter((x) => x.status === 'blocked-data').length), color: C.muted },
    { text: String(list.filter((x) => x.severity).length), color: C.red },
  ]);
  tableSlide(pptx, pptx, 'Couverture', 'Couverture par module (MP)', 'Données réelles issues de l\'exécution headed sur INT2.',
    ['Module', 'Cas', 'Passés', 'Bloqués flux', 'Bloqués données', 'Bugs'], modRows, [3.6, 1.5, 1.8, 2.2, 2.4, 1.63], 'Couverture par module');

  // 4. SYNTHESE PAR TICKET (paginée)
  const jira = new Map((catalog.cases || []).map((c) => [c.issueKey, c.atlassian && c.atlassian.jira ? c.atlassian.jira.summary : '']));
  const byTicket = {};
  for (const r of rows) (byTicket[r.issueKey] = byTicket[r.issueKey] || []).push(r);
  const ticketRows = Object.entries(byTicket).sort((a, b) => Number(a[0].split('-')[1]) - Number(b[0].split('-')[1])).map(([k, list]) => [
    k, { text: String(jira.get(k) || '').slice(0, 52) }, String(list.length),
    { text: String(list.filter((x) => x.status === 'passed').length), color: C.green },
    { text: String(list.filter((x) => /blocked|assertion/.test(x.status)).length), color: C.orange },
    { text: String(list.filter((x) => x.severity).length), color: C.red },
  ]);
  const perPage = 15;
  for (let i = 0; i < ticketRows.length; i += perPage) {
    tableSlide(pptx, pptx, 'Tickets', `Synthèse par ticket ORI (${i + 1}-${Math.min(i + perPage, ticketRows.length)}/${ticketRows.length})`, 'Concordance Excel ↔ Jira ↔ exécution.',
      ['ORI', 'Résumé Jira', 'Cas', 'Passés', 'Bloqués', 'Bugs'], ticketRows.slice(i, i + perPage), [1.4, 6.4, 1.0, 1.1, 1.1, 1.13], 'Synthèse par ticket');
  }

  // 5. GALERIE DES BUGS (screenshot annoté + descriptions)
  const gallery = bugs.filter((b) => fs.existsSync(path.join(rootDir, b.preuve))).slice(0, 24);
  for (const b of gallery) {
    const gs = pptx.addSlide();
    header(pptx, gs, `Bug · ${b.severity}`, `${b.issueKey} — ${b.caseId}`, String(b.scenario).slice(0, 90));
    gs.addImage({ path: path.join(rootDir, b.preuve), x: 0.6, y: 1.95, w: 7.4, h: 4.16, sizing: { type: 'contain', w: 7.4, h: 4.16 } });
    gs.addShape(pptx.ShapeType.roundRect, { x: 8.2, y: 1.95, w: 4.5, h: 0.5, rectRadius: 0.06, fill: { color: SEVC[b.severity] || C.orange }, line: { color: SEVC[b.severity] || C.orange } });
    gs.addText(`SÉVÉRITÉ : ${String(b.severity).toUpperCase()}`, { x: 8.3, y: 2.03, w: 4.3, h: 0.34, fontFace: 'Aptos Display', fontSize: 15, bold: true, color: C.white, margin: 0 });
    gs.addText([
      { text: 'Description fonctionnelle\n', options: { bold: true, color: C.navy, fontSize: 12 } },
      { text: `${String(b.descriptionFonctionnelle).slice(0, 200)}\n\n`, options: { color: C.ink, fontSize: 10.5 } },
      { text: 'Constat technique\n', options: { bold: true, color: C.navy, fontSize: 12 } },
      { text: `${String(b.descriptionTechnique).slice(0, 200)}\n\n`, options: { color: C.ink, fontSize: 10.5 } },
      { text: 'Règles concernées : ', options: { bold: true, color: C.navy, fontSize: 11 } },
      { text: `${b.rg || '—'}`, options: { color: C.muted, fontSize: 10 } },
    ], { x: 8.2, y: 2.65, w: 4.5, h: 3.5, margin: 0.05, valign: 'top' });
    footer(gs, `Preuve : ${path.basename(b.preuve)} · Vidéo : ${path.basename(b.video)}`);
  }

  // 6. ANNEXE : détail des 252 cas (paginée)
  const caseRows = rows.map((r) => [
    r.issueKey, r.caseId,
    { text: r.status, color: r.status === 'passed' ? C.green : /blocked-data/.test(r.status) ? C.muted : C.orange },
    `${r.progressedSteps}/${r.totalSteps}`, `${r.assertMet}/${r.assertTotal}`,
    { text: r.severity || '—', color: r.severity ? (SEVC[r.severity] || C.orange) : C.muted },
  ]);
  const cp = 18;
  for (let i = 0; i < caseRows.length; i += cp) {
    tableSlide(pptx, pptx, 'Annexe', `Détail exhaustif des cas (${i + 1}-${Math.min(i + cp, caseRows.length)}/${caseRows.length})`, 'Traçabilité par cas : statut, progression, assertions, sévérité.',
      ['ORI', 'Cas', 'Statut', 'Étapes', 'Assert.', 'Sévérité'], caseRows.slice(i, i + cp), [1.4, 3.2, 2.2, 1.6, 1.6, 2.13], 'Annexe détail des cas');
  }

  await pptx.writeFile({ fileName: target });
  return { passed, blockedFlow, blockedData, bugs: bugs.length, sev };
}

// ─── 3 rapports : Xray (exécution CSV), Playwright (déjà HTML/JSON), Hybride (JSON + MD) ───
function build3Reports(hybrid) {
  const { rows } = hybrid;
  // Xray execution results CSV
  const xh = ['Test Case Identifier', 'Test Execution', 'Status', 'Comment', 'Requirement'];
  const xrows = rows.map((r) => [
    `TC-${r.issueKey}-${r.caseId}`, 'TE-LOCAL-INT2-SPRINT-11-12-13',
    r.status === 'passed' ? 'PASS' : r.status === 'blocked-data' ? 'BLOCKED' : 'FAIL',
    (r.blocker && r.blocker.reason) || `étapes ${r.progressedSteps}/${r.totalSteps}, assertions ${r.assertMet}/${r.assertTotal}`,
    r.issueKey,
  ]);
  fs.writeFileSync(path.join(pipelineDir, 'xray-execution-results.csv'),
    [xh.join(',')].concat(xrows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))).join('\n') + '\n');

  // Hybride JSON + Markdown
  fs.writeFileSync(path.join(pipelineDir, 'hybrid-report.json'), JSON.stringify({ generatedAt: new Date().toISOString(), rows }, null, 2));
  const md = ['# Rapport hybride Orion — concordance Excel ↔ Playwright ↔ Xray', '',
    `Généré : ${new Date().toISOString()}`, '',
    '| ORI | Cas | Module | Statut | Étapes | Assert | Sévérité |', '|---|---|---|---|---|---|---|',
    ...rows.map((r) => `| ${r.issueKey} | ${r.caseId} | ${r.moduleTop} | ${r.status} | ${r.progressedSteps}/${r.totalSteps} | ${r.assertMet}/${r.assertTotal} | ${r.severity || '—'} |`)];
  fs.writeFileSync(path.join(pipelineDir, 'RAPPORT_HYBRIDE.md'), md.join('\n') + '\n');
}

async function main() {
  const hybrid = buildHybrid();
  build3Reports(hybrid);
  const target = nextVersion('bilan_recette_orion', 'pptx');
  const r = await buildRichReport(target);
  console.log(`Rapport riche généré : ${path.relative(rootDir, target)}`);
  console.log(`  Passés=${r.passed} · Bloqués flux=${r.blockedFlow} · Bloqués données=${r.blockedData} · Bugs=${r.bugs} (bloquant=${r.sev.bloquant||0}, moyen=${r.sev.moyen||0}, mineur=${r.sev.mineur||0})`);
  console.log('3 rapports : xray-execution-results.csv · hybrid-report.json + RAPPORT_HYBRIDE.md · Playwright HTML/JSON');
}

main().catch((e) => { console.error(e); process.exit(1); });
