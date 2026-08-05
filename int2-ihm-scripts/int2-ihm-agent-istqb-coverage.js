/**
 * INT2 / Orion — ISTQB Coverage Module (degraded mode: no live Confluence)
 *
 * Applies formal ISTQB test-design techniques classification to every
 * business rule (RG_*) already captured in the local hybrid-report.json
 * (Excel <-> Playwright <-> Xray traceability), and computes a coverage
 * completeness score per rule and per technique.
 *
 * IMPORTANT — scope limitation (must stay visible in the report):
 * This module can only reason about RG codes that are ALREADY present in
 * hybrid-report.json (i.e. already extracted into the Sprint 11-12-13 Excel
 * and wired into Playwright). It CANNOT discover RG codes that exist only in
 * Confluence and were never captured in the Excel, because live Confluence
 * access is currently blocked (see docs/INDEX.md — Orion space not granted
 * to this account). Once Confluence access is restored, this module should
 * be re-run against the full RG universe crawled from Confluence, not just
 * the Excel-derived subset.
 *
 * ISTQB technique classification heuristic (deterministic, auditable):
 *  - Boundary/Equivalence  : mentions of obligatoire/format/bornes/min/max/longueur/unicité/plafond/seuil
 *  - Decision Table        : scenario combines multiple conditions (CA01+CA02 style, "si ... et ...", "selon")
 *  - State Transition      : mentions statut/transition/actif/inactif/annule/workflow/passe de/bascule
 *  - Use Case / Scenario   : default fallback (nominal flow narrative)
 *
 * Completion score per RG = average of (progressedSteps/totalSteps) and
 * (assertMet/assertTotal) across all test case rows referencing that RG,
 * weighted down if status is blocked-flow/blocked-data (execution never
 * reached full verification even if test design exists).
 *
 * Output:
 *  - int2-ihm-recordings/int2-autonomous/istqb-coverage.json
 *  - int2-ihm-recordings/int2-autonomous/INT2_ISTQB_COVERAGE_REPORT.md
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const hybridReportFile = path.join(rootDir, 'int2-ihm-recordings', 'orion-pipeline', 'hybrid-report.json');
const outDir = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous');
const outJson = path.join(outDir, 'istqb-coverage.json');
const outMd = path.join(outDir, 'INT2_ISTQB_COVERAGE_REPORT.md');

function safeReadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function normalize(v) {
  return String(v || '').toLowerCase();
}

const TECHNIQUE_KEYWORDS = {
  'Boundary/Equivalence': [
    'obligatoire', 'format', 'borne', 'bornes', 'min', 'max', 'longueur', 'unicite', 'unicité',
    'plafond', 'seuil', 'null', 'vide', 'blocage', 'controle', 'contrôle', 'validation',
  ],
  'Decision Table': [
    'et ', ' ou ', 'selon', 'combinaison', 'cas ', 'si ', 'condition', 'dependance', 'dépendance',
  ],
  'State Transition': [
    'statut', 'transition', 'actif', 'inactif', 'annule', 'annulé', 'workflow', 'passe de',
    'bascule', 'etat', 'état', 'cycle de vie', 'archivage',
  ],
};

function classifyTechnique(scenarioText) {
  const text = normalize(scenarioText);
  const scores = {};
  for (const [technique, keywords] of Object.entries(TECHNIQUE_KEYWORDS)) {
    scores[technique] = keywords.reduce((acc, kw) => acc + (text.includes(kw) ? 1 : 0), 0);
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  if (best && best[1] > 0) return best[0];
  return 'Use Case / Scenario';
}

function computeRowCompletion(row) {
  const stepRatio = row.totalSteps > 0 ? row.progressedSteps / row.totalSteps : 0;
  const assertRatio = row.assertTotal > 0 ? row.assertMet / row.assertTotal : row.assertTotal === 0 ? 1 : 0;
  let score = (stepRatio + assertRatio) / 2;

  // Penalize rows that never reached a verifiable state (design exists, execution blocked).
  if (row.status === 'blocked-flow') score *= 0.5;
  if (row.status === 'blocked-data') score *= 0.3;
  if (row.status === 'passed') score = Math.max(score, 0.95);

  return Number(score.toFixed(3));
}

function run() {
  const hybrid = safeReadJson(hybridReportFile);
  const rows = Array.isArray(hybrid?.rows) ? hybrid.rows : [];
  if (rows.length === 0) {
    console.error(`No rows found in ${hybridReportFile}. Run the pipeline execution first.`);
    process.exit(1);
  }

  const byRg = new Map();

  for (const row of rows) {
    const rules = Array.isArray(row.rules) && row.rules.length > 0 ? row.rules : ['(RG non identifiée)'];
    const technique = classifyTechnique(row.scenario);
    const completion = computeRowCompletion(row);

    for (const rg of rules) {
      if (!byRg.has(rg)) {
        byRg.set(rg, { rg, module: row.moduleTop || row.module, techniques: new Set(), rows: [] });
      }
      const entry = byRg.get(rg);
      entry.techniques.add(technique);
      entry.rows.push({
        issueKey: row.issueKey,
        caseId: row.caseId,
        technique,
        scenario: row.scenario,
        status: row.status,
        completion,
      });
    }
  }

  const rgEntries = Array.from(byRg.values()).map((e) => {
    const avgCompletion = e.rows.reduce((a, r) => a + r.completion, 0) / e.rows.length;
    return {
      rg: e.rg,
      module: e.module,
      techniqueCount: e.techniques.size,
      techniques: Array.from(e.techniques),
      testCaseCount: e.rows.length,
      avgCompletionScore: Number(avgCompletion.toFixed(3)),
      minCompletionScore: Number(Math.min(...e.rows.map((r) => r.completion)).toFixed(3)),
      rows: e.rows,
    };
  });

  rgEntries.sort((a, b) => a.avgCompletionScore - b.avgCompletionScore);

  const techniqueCounts = {};
  for (const row of rows) {
    const t = classifyTechnique(row.scenario);
    techniqueCounts[t] = (techniqueCounts[t] || 0) + 1;
  }

  const singleTechniqueRgs = rgEntries.filter((e) => e.techniqueCount === 1);
  const lowCompletionRgs = rgEntries.filter((e) => e.avgCompletionScore < 0.5);
  const wellCoveredRgs = rgEntries.filter((e) => e.avgCompletionScore >= 0.8 && e.techniqueCount >= 2);

  const globalAvgCompletion = Number((rgEntries.reduce((a, e) => a + e.avgCompletionScore, 0) / rgEntries.length).toFixed(3));

  const payload = {
    generatedAt: new Date().toISOString(),
    scopeWarning:
      'Analyse limitée aux RG déjà présentes dans hybrid-report.json (Excel Sprint 11-12-13 → Playwright). ' +
      'Accès Confluence live actuellement bloqué (espace Orion non autorisé) : impossible de vérifier l\'exhaustivité ' +
      'par rapport à l\'univers complet des RG définies fonctionnellement. À relancer en mode complet dès accès restauré.',
    totalRules: rgEntries.length,
    totalTestCases: rows.length,
    globalAvgCompletionScore: globalAvgCompletion,
    techniqueDistribution: techniqueCounts,
    singleTechniqueRuleCount: singleTechniqueRgs.length,
    lowCompletionRuleCount: lowCompletionRgs.length,
    wellCoveredRuleCount: wellCoveredRgs.length,
    rules: rgEntries,
  };

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outJson, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const lines = [];
  lines.push('# INT2 / Orion — Rapport de couverture ISTQB (mode dégradé)');
  lines.push('');
  lines.push('> ⚠️ **Limite de scope** — ' + payload.scopeWarning);
  lines.push('');
  lines.push(`- Généré le : ${payload.generatedAt}`);
  lines.push(`- Règles de gestion (RG) analysées : ${payload.totalRules}`);
  lines.push(`- Cas de test analysés : ${payload.totalTestCases}`);
  lines.push(`- Score de complétude moyen (toutes RG) : ${(globalAvgCompletion * 100).toFixed(1)}%`);
  lines.push('');
  lines.push('## Distribution par technique ISTQB');
  lines.push('');
  lines.push('| Technique | Cas de test | % |');
  lines.push('|---|---:|---:|');
  for (const [technique, count] of Object.entries(techniqueCounts).sort((a, b) => b[1] - a[1])) {
    lines.push(`| ${technique} | ${count} | ${((count / rows.length) * 100).toFixed(1)}% |`);
  }
  lines.push('');
  lines.push(`## Règles couvertes par une seule technique (${singleTechniqueRgs.length}) — risque d'angle mort`);
  lines.push('');
  lines.push('> Ces RG ne sont vérifiées que sous UN seul angle (ex: partition seule, sans table de décision ni transition d\'état). ' +
    'Recommandation ISTQB : croiser au moins 2 techniques pour les RG à enjeu (obligatoire + combinaison de conditions par exemple).');
  lines.push('');
  lines.push('| RG | Module | Technique unique | Cas de test | Complétude |');
  lines.push('|---|---|---|---:|---:|');
  for (const e of singleTechniqueRgs.slice(0, 30)) {
    lines.push(`| ${e.rg} | ${e.module || '-'} | ${e.techniques[0]} | ${e.testCaseCount} | ${(e.avgCompletionScore * 100).toFixed(0)}% |`);
  }
  if (singleTechniqueRgs.length > 30) lines.push(`\n_... et ${singleTechniqueRgs.length - 30} de plus, voir istqb-coverage.json_`);
  lines.push('');
  lines.push(`## Règles à faible complétude (< 50%, ${lowCompletionRgs.length})`);
  lines.push('');
  lines.push('| RG | Module | Complétude moyenne | Cas bloquants |');
  lines.push('|---|---|---:|---|');
  for (const e of lowCompletionRgs.slice(0, 30)) {
    const blockers = e.rows.filter((r) => r.status?.startsWith('blocked')).map((r) => `${r.issueKey}/${r.caseId}`).slice(0, 3).join(', ');
    lines.push(`| ${e.rg} | ${e.module || '-'} | ${(e.avgCompletionScore * 100).toFixed(0)}% | ${blockers || '-'} |`);
  }
  if (lowCompletionRgs.length > 30) lines.push(`\n_... et ${lowCompletionRgs.length - 30} de plus, voir istqb-coverage.json_`);
  lines.push('');
  lines.push(`## Règles bien couvertes (≥80% complétude, ≥2 techniques croisées, ${wellCoveredRgs.length})`);
  lines.push('');
  lines.push('| RG | Module | Techniques | Complétude |');
  lines.push('|---|---|---|---:|');
  for (const e of wellCoveredRgs.slice(0, 15)) {
    lines.push(`| ${e.rg} | ${e.module || '-'} | ${e.techniques.join(' + ')} | ${(e.avgCompletionScore * 100).toFixed(0)}% |`);
  }

  fs.writeFileSync(outMd, `${lines.join('\n')}\n`, 'utf8');

  console.log(`ISTQB coverage: ${rgEntries.length} RG analysées, complétude moyenne ${(globalAvgCompletion * 100).toFixed(1)}%.`);
  console.log(`Techniques uniques (angle mort potentiel): ${singleTechniqueRgs.length}`);
  console.log(`JSON: ${outJson}`);
  console.log(`Markdown: ${outMd}`);
}

run();
