/**
 * INT2 / Orion — Hybrid Playwright x Xray PDF Report
 *
 * Renders a single, self-contained PDF report combining:
 *  - Global execution KPIs (passed / blocked-flow / blocked-data / assertion-low / failed)
 *  - Per-module (MP1..MP6) breakdown table
 *  - Full Excel <-> Playwright <-> Xray traceability table (from hybrid-report.json)
 *  - Bug catalog section with embedded (base64) annotated screenshots when available
 *
 * Rendering is done with a headless Chromium instance (Playwright, already a
 * project dependency) via page.pdf(), so no extra PDF library is required.
 *
 * Sources read (all optional/best-effort):
 *  - int2-ihm-recordings/orion-pipeline/hybrid-report.json
 *  - int2-ihm-recordings/orion-pipeline/bug-catalog.json
 *  - int2-ihm-recordings/orion-pipeline/traceability.json
 *  - int2-ihm-recordings/orion-pipeline/CATALOG_SUMMARY.md (for header context)
 *
 * Output:
 *  - int2-ihm-recordings/orion-pipeline/RAPPORT_HYBRIDE.pdf
 *
 * Usage:
 *   node int2-ihm-scripts/int2-ihm-hybrid-pdf-report.js
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const pipelineDir = path.join(rootDir, 'int2-ihm-recordings', 'orion-pipeline');
const hybridReportFile = path.join(pipelineDir, 'hybrid-report.json');
const bugCatalogFile = path.join(pipelineDir, 'bug-catalog.json');
const traceabilityFile = path.join(pipelineDir, 'traceability.json');
const outPdf = path.join(pipelineDir, 'RAPPORT_HYBRIDE.pdf');

function safeReadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function esc(v) {
  return String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function imageToBase64DataUri(filePath) {
  const abs = path.isAbsolute(filePath) ? filePath : path.join(rootDir, filePath);
  if (!fs.existsSync(abs)) return null;
  try {
    const buf = fs.readFileSync(abs);
    const ext = path.extname(abs).slice(1).toLowerCase() || 'png';
    return `data:image/${ext === 'jpg' ? 'jpeg' : ext};base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
}

const STATUS_COLORS = {
  passed: '#1e8e3e',
  'blocked-flow': '#e8710a',
  'blocked-data': '#b06000',
  'assertion-low': '#f9ab00',
  failed: '#d93025',
};

function computeSummary(rows) {
  const byStatus = {};
  const byModule = {};
  for (const r of rows) {
    byStatus[r.status] = (byStatus[r.status] || 0) + 1;
    const mod = r.moduleTop || r.module || 'N/A';
    if (!byModule[mod]) byModule[mod] = {};
    byModule[mod][r.status] = (byModule[mod][r.status] || 0) + 1;
  }
  return { byStatus, byModule, total: rows.length };
}

function renderStatusBadge(status) {
  const color = STATUS_COLORS[status] || '#5f6368';
  return `<span class="badge" style="background:${color}22;color:${color};border:1px solid ${color}55;">${esc(status || 'n/a')}</span>`;
}

function buildHtml({ hybrid, bugCatalog, traceability }) {
  const rows = Array.isArray(hybrid?.rows) ? hybrid.rows : [];
  const summary = computeSummary(rows);
  const modules = Object.keys(summary.byModule).sort();
  const statuses = ['passed', 'assertion-low', 'blocked-flow', 'blocked-data', 'failed'];

  const generatedAt = hybrid?.generatedAt || new Date().toISOString();

  const kpiCards = statuses
    .map((s) => {
      const count = summary.byStatus[s] || 0;
      const pct = summary.total > 0 ? ((count / summary.total) * 100).toFixed(1) : '0.0';
      return `<div class="kpi-card">
        <div class="kpi-value" style="color:${STATUS_COLORS[s] || '#5f6368'}">${count}</div>
        <div class="kpi-label">${esc(s)}</div>
        <div class="kpi-pct">${pct}%</div>
      </div>`;
    })
    .join('\n');

  const moduleRows = modules
    .map((mod) => {
      const counts = summary.byModule[mod];
      const total = Object.values(counts).reduce((a, b) => a + b, 0);
      const cells = statuses.map((s) => `<td>${counts[s] || 0}</td>`).join('');
      return `<tr><td class="mono">${esc(mod)}</td>${cells}<td><strong>${total}</strong></td></tr>`;
    })
    .join('\n');

  const detailRows = rows
    .map((r) => {
      const rgList = Array.isArray(r.rules) ? r.rules.join(', ') : '';
      return `<tr>
        <td class="mono">${esc(r.issueKey)}</td>
        <td class="mono">${esc(r.caseId)}</td>
        <td>${esc(r.module)}</td>
        <td>${renderStatusBadge(r.status)}</td>
        <td>${esc(r.progressedSteps)}/${esc(r.totalSteps)}</td>
        <td>${esc(r.assertMet)}/${esc(r.assertTotal)}</td>
        <td class="mono small">${esc(rgList)}</td>
      </tr>`;
    })
    .join('\n');

  const bugs = Array.isArray(bugCatalog?.bugs) ? bugCatalog.bugs : [];
  const bugSections = bugs
    .map((b, i) => {
      const imgDataUri = b.preuve ? imageToBase64DataUri(b.preuve) : null;
      return `<div class="bug-card">
        <h3>#${i + 1} — ${esc(b.issueKey)} / ${esc(b.caseId)} <span class="badge" style="background:#d9302522;color:#d93025;border:1px solid #d9302555;">${esc(b.severity || 'n/a')}</span></h3>
        <p><strong>Module:</strong> ${esc(b.module)} &nbsp;|&nbsp; <strong>RG:</strong> ${esc(b.rg)}</p>
        <p><strong>Scenario:</strong> ${esc(b.scenario)}</p>
        <p><strong>Description fonctionnelle:</strong> ${esc(b.descriptionFonctionnelle)}</p>
        <p><strong>Description technique:</strong> ${esc(b.descriptionTechnique)}</p>
        <p class="mono small"><strong>Vidéo:</strong> ${esc(b.video || 'n/a')}</p>
        ${imgDataUri ? `<img class="evidence" src="${imgDataUri}" alt="evidence" />` : '<p class="mono small">(capture non disponible)</p>'}
      </div>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<title>Rapport Hybride Orion — Playwright x Xray</title>
<style>
  @page { margin: 18mm 14mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif; color: #202124; font-size: 11px; }
  h1 { font-size: 22px; margin-bottom: 2px; }
  h2 { font-size: 16px; margin-top: 28px; border-bottom: 2px solid #eee; padding-bottom: 4px; page-break-after: avoid; }
  h3 { font-size: 13px; margin: 0 0 6px 0; }
  .subtitle { color: #5f6368; margin-top: 0; margin-bottom: 18px; }
  .mono { font-family: "SFMono-Regular", Consolas, Menlo, monospace; }
  .small { font-size: 9.5px; color: #5f6368; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th, td { border: 1px solid #e0e0e0; padding: 4px 6px; text-align: left; vertical-align: top; }
  th { background: #f1f3f4; font-size: 10px; text-transform: uppercase; letter-spacing: 0.03em; }
  tr:nth-child(even) { background: #fafafa; }
  .kpi-row { display: flex; gap: 10px; margin-top: 10px; }
  .kpi-card { flex: 1; border: 1px solid #e0e0e0; border-radius: 8px; padding: 10px; text-align: center; }
  .kpi-value { font-size: 22px; font-weight: 700; }
  .kpi-label { font-size: 10px; text-transform: uppercase; color: #5f6368; margin-top: 2px; }
  .kpi-pct { font-size: 10px; color: #80868b; }
  .badge { display: inline-block; padding: 1px 6px; border-radius: 10px; font-size: 9.5px; font-weight: 600; }
  .bug-card { border: 1px solid #f0c2be; border-radius: 8px; padding: 12px; margin-top: 12px; page-break-inside: avoid; background: #fff8f7; }
  .bug-card p { margin: 3px 0; }
  .evidence { max-width: 100%; border: 1px solid #ddd; border-radius: 6px; margin-top: 8px; }
  .cover { text-align: center; padding-top: 60px; page-break-after: always; }
  .cover .env-badge { display: inline-block; margin-top: 10px; padding: 4px 12px; border-radius: 14px; background: #e8f0fe; color: #1a73e8; font-weight: 600; }
  .footer-note { margin-top: 30px; font-size: 9.5px; color: #80868b; }
</style>
</head>
<body>

<div class="cover">
  <h1>Rapport Hybride Orion</h1>
  <p class="subtitle">Concordance Excel &harr; Playwright &harr; Xray — Environnement INT2</p>
  <div class="env-badge">Sprint 11 / 12 / 13 &mdash; Release v0.2.0 &mdash; INT2</div>
  <p class="small" style="margin-top: 40px;">Généré le ${esc(generatedAt)}</p>
  <p class="small">${summary.total} cas de test &middot; ${bugs.length} bug(s) catalogué(s) &middot; ${traceability?.issueCount ?? '-'} tickets ORI &middot; ${traceability?.ruleCount ?? '-'} règles RG</p>
</div>

<h2>Synthèse globale</h2>
<div class="kpi-row">
${kpiCards}
</div>

<h2>Répartition par module</h2>
<table>
  <thead><tr><th>Module</th>${statuses.map((s) => `<th>${esc(s)}</th>`).join('')}<th>Total</th></tr></thead>
  <tbody>
    ${moduleRows}
  </tbody>
</table>

<h2>Détail complet des cas de test (Excel &harr; Playwright &harr; Xray)</h2>
<table>
  <thead><tr><th>ORI</th><th>Cas</th><th>Module</th><th>Statut</th><th>Étapes</th><th>Assert</th><th>Règles RG</th></tr></thead>
  <tbody>
    ${detailRows}
  </tbody>
</table>

<h2>Catalogue des bugs (${bugs.length})</h2>
${bugs.length > 0 ? bugSections : '<p class="small">Aucun bug catalogué sur cette exécution.</p>'}

<p class="footer-note">Rapport généré localement (aucun appel Jira, Confluence ou Xray distant). Pipeline: orion-playwright-pipeline.</p>

</body>
</html>`;
}

async function run() {
  const hybrid = safeReadJson(hybridReportFile);
  if (!hybrid) {
    console.error(`Missing hybrid-report.json at ${hybridReportFile}. Run the pipeline execution first.`);
    process.exit(1);
  }
  const bugCatalog = safeReadJson(bugCatalogFile);
  const traceability = safeReadJson(traceabilityFile);

  const html = buildHtml({ hybrid, bugCatalog, traceability });

  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    await page.pdf({
      path: outPdf,
      format: 'A4',
      printBackground: true,
      margin: { top: '10mm', bottom: '14mm', left: '10mm', right: '10mm' },
      displayHeaderFooter: true,
      footerTemplate: `<div style="font-size:8px; width:100%; text-align:center; color:#999;">Rapport Hybride Orion — Page <span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
      headerTemplate: '<div></div>',
    });
  } finally {
    await browser.close();
  }

  console.log(`Hybrid PDF report generated: ${outPdf}`);
}

run().catch((err) => {
  console.error('Hybrid PDF report generation failed:', err);
  process.exit(1);
});
