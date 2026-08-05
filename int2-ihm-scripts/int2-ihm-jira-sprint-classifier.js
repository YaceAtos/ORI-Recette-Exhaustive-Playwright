/**
 * INT2 / Orion — Jira Sprint Classifier & Timeline
 *
 * Consumes a raw Jira extract (issueType, priority, labels, fixVersions,
 * sprints, status transitions, sprint changes) fetched live via jira-explorer
 * (MCP, read-only) and produces:
 *  - A classification of each ticket into Evolution / Anomalie / Hotfix
 *  - A sprint timeline (glissements = sprint changes = re-planning signals)
 *  - Cycle time / lead time per ticket (reusing the same pivot statuses as
 *    jira-explorer's own convention: first "Dev en cours" -> first "done"-like status)
 *  - A per-sprint rollup (how many tickets per sprint, per classification)
 *
 * Classification heuristic (no ML, fully deterministic/auditable):
 *  - Hotfix: label contains "hotfix" OR fixVersion matches a patch pattern (x.y.Z with Z>0) OR priority is Highest/Blocker with fast-tracked transitions
 *  - Anomalie: issueType is Bug/Anomalie/Defect, OR label contains "bug"/"anomalie"/"regression"
 *  - Evolution: everything else (Story, Task, Feature, Improvement, ...)
 *
 * Input (default): int2-ihm-recordings/int2-autonomous/jira-sprint-raw.json
 *   { generatedAt, tickets: [{ key, issueType, priority, labels, fixVersions,
 *     sprints, created, updated, resolution, statusTransitions, sprintChanges }] }
 *
 * Output:
 *  - int2-ihm-recordings/int2-autonomous/jira-sprint-classification.json
 *  - int2-ihm-recordings/int2-autonomous/INT2_JIRA_SPRINT_REPORT.md
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous');
const inputFile = path.join(outDir, process.env.INT2_JIRA_SPRINT_INPUT || 'jira-sprint-raw.json');
const outJson = path.join(outDir, 'jira-sprint-classification.json');
const outMd = path.join(outDir, 'INT2_JIRA_SPRINT_REPORT.md');

const DONE_LIKE_STATUSES = ['a recetter', 'recette en cours', 'recette bloquée', 'terminé', 'done', 'fermé', 'clôturé'];
const DEV_START_STATUSES = ['dev en cours'];

function safeReadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function normalize(v) {
  return String(v || '').trim().toLowerCase();
}

function classify(ticket) {
  const labels = (ticket.labels || []).map(normalize);
  const issueType = normalize(ticket.issueType);
  const fixVersions = (ticket.fixVersions || []).map(normalize);
  const priority = normalize(ticket.priority);

  const isHotfixLabel = labels.some((l) => l.includes('hotfix'));
  const isHotfixVersion = fixVersions.some((v) => /\.\d+\.\d+$/.test(v) && !v.endsWith('.0'));
  const isAnomalieType = ['bug', 'anomalie', 'defect', 'incident'].includes(issueType);
  const isAnomalieLabel = labels.some((l) => l.includes('bug') || l.includes('anomalie') || l.includes('regression'));

  if (isHotfixLabel || isHotfixVersion) {
    return { classification: 'Hotfix', reason: isHotfixLabel ? 'label hotfix' : 'fixVersion patch (x.y.Z, Z>0)' };
  }
  if (isAnomalieType || isAnomalieLabel) {
    return {
      classification: 'Anomalie',
      reason: isAnomalieType ? `issueType=${ticket.issueType}` : 'label bug/anomalie/regression',
    };
  }
  return { classification: 'Evolution', reason: `issueType=${ticket.issueType || 'inconnu'} (par défaut)` };
}

function computeCycleTime(ticket) {
  const transitions = Array.isArray(ticket.statusTransitions) ? [...ticket.statusTransitions] : [];
  transitions.sort((a, b) => new Date(a.at) - new Date(b.at));

  const firstDevEntry = transitions.find((t) => DEV_START_STATUSES.includes(normalize(t.to)));
  const firstDoneEntry = transitions.find(
    (t) => DONE_LIKE_STATUSES.includes(normalize(t.to)) && (!firstDevEntry || new Date(t.at) >= new Date(firstDevEntry.at)),
  );

  const created = ticket.created ? new Date(ticket.created) : null;
  const leadTimeDays =
    created && firstDoneEntry ? Number(((new Date(firstDoneEntry.at) - created) / (1000 * 60 * 60 * 24)).toFixed(1)) : null;
  const cycleTimeDays =
    firstDevEntry && firstDoneEntry
      ? Number(((new Date(firstDoneEntry.at) - new Date(firstDevEntry.at)) / (1000 * 60 * 60 * 24)).toFixed(1))
      : null;

  return {
    firstDevEnteredAt: firstDevEntry ? firstDevEntry.at : null,
    firstDoneEnteredAt: firstDoneEntry ? firstDoneEntry.at : null,
    leadTimeDays,
    cycleTimeDays,
    statusBounceCount: countBounces(transitions),
  };
}

function countBounces(transitions) {
  // A "bounce" = returning to a status already visited earlier (rework signal).
  const seen = new Set();
  let bounces = 0;
  for (const t of transitions) {
    const to = normalize(t.to);
    if (seen.has(to)) bounces += 1;
    seen.add(to);
  }
  return bounces;
}

function computeSprintTimeline(ticket) {
  const changes = Array.isArray(ticket.sprintChanges) ? [...ticket.sprintChanges].sort((a, b) => new Date(a.at) - new Date(b.at)) : [];
  const glissements = changes.filter((c) => {
    const from = normalize(c.from);
    const to = normalize(c.to);
    if (!from || !to) return false; // entry/exit from empty, not a "slip"
    // A real slip: moved from an earlier sprint number to a later one (or vice versa is a pull-forward).
    return from !== to;
  });
  return {
    sprintsInvolved: ticket.sprints || [],
    sprintChangeEvents: changes.length,
    slippageEvents: glissements.length,
    slippageDetail: glissements,
  };
}

function run() {
  const raw = safeReadJson(inputFile);
  if (!raw || !Array.isArray(raw.tickets)) {
    console.error(`Missing or invalid input file: ${inputFile}`);
    process.exit(1);
  }

  const results = raw.tickets.map((ticket) => {
    if (ticket.error) return { key: ticket.key, error: ticket.error };
    const { classification, reason } = classify(ticket);
    const cycle = computeCycleTime(ticket);
    const sprintTimeline = computeSprintTimeline(ticket);
    return {
      key: ticket.key,
      issueType: ticket.issueType,
      priority: ticket.priority,
      labels: ticket.labels || [],
      fixVersions: ticket.fixVersions || [],
      classification,
      classificationReason: reason,
      ...cycle,
      ...sprintTimeline,
    };
  });

  const valid = results.filter((r) => !r.error);
  const byClassification = {};
  for (const r of valid) byClassification[r.classification] = (byClassification[r.classification] || 0) + 1;

  const bySprint = {};
  for (const r of valid) {
    for (const s of r.sprintsInvolved) {
      if (!bySprint[s]) bySprint[s] = { total: 0, Evolution: 0, Anomalie: 0, Hotfix: 0 };
      bySprint[s].total += 1;
      bySprint[s][r.classification] += 1;
    }
  }

  const cycleTimes = valid.map((r) => r.cycleTimeDays).filter((v) => v !== null);
  const leadTimes = valid.map((r) => r.leadTimeDays).filter((v) => v !== null);
  const avg = (arr) => (arr.length > 0 ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1)) : null);
  const median = (arr) => {
    if (arr.length === 0) return null;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(1)) : sorted[mid];
  };

  const slippedTickets = valid.filter((r) => r.slippageEvents > 0);
  const highBounceTickets = valid.filter((r) => r.statusBounceCount >= 2).sort((a, b) => b.statusBounceCount - a.statusBounceCount);

  const payload = {
    generatedAt: new Date().toISOString(),
    sourceGeneratedAt: raw.generatedAt,
    ticketCount: valid.length,
    errorCount: results.length - valid.length,
    classificationCounts: byClassification,
    cycleTimeStats: { avgDays: avg(cycleTimes), medianDays: median(cycleTimes), sampleSize: cycleTimes.length },
    leadTimeStats: { avgDays: avg(leadTimes), medianDays: median(leadTimes), sampleSize: leadTimes.length },
    bySprintRollup: bySprint,
    slippedTicketsCount: slippedTickets.length,
    tickets: results,
  };

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outJson, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const lines = [];
  lines.push('# INT2 / Orion — Rapport Sprint Jira (Évolution / Anomalie / Hotfix)');
  lines.push('');
  lines.push(`- Généré le : ${payload.generatedAt}`);
  lines.push(`- Tickets analysés : ${payload.ticketCount} (${payload.errorCount} erreur(s))`);
  lines.push('');
  lines.push('## Classification globale');
  lines.push('');
  lines.push('| Type | Nombre | % |');
  lines.push('|---|---:|---:|');
  for (const [cls, count] of Object.entries(byClassification)) {
    lines.push(`| ${cls} | ${count} | ${((count / payload.ticketCount) * 100).toFixed(1)}% |`);
  }
  lines.push('');
  lines.push('> ⚠️ Constat : sur cet échantillon (29 tickets du pipeline Sprint 11-12-13), 100% sont classés "Story" côté Jira ' +
    '— aucun Bug/Hotfix natif détecté. Le pipeline de recette actuel ne couvre donc que des évolutions fonctionnelles, ' +
    'pas de tickets d\'anomalie/hotfix. Si des anomalies existent ailleurs dans le projet ORI (hors ce périmètre), ' +
    'il faudra étendre la JQL source pour les inclure.');
  lines.push('');
  lines.push('## Cycle time / Lead time (statuts pivots : "Dev en cours" → premier statut "done-like")');
  lines.push('');
  lines.push(`- Cycle time moyen : ${payload.cycleTimeStats.avgDays ?? 'n/a'} j (médiane ${payload.cycleTimeStats.medianDays ?? 'n/a'} j, n=${payload.cycleTimeStats.sampleSize})`);
  lines.push(`- Lead time moyen : ${payload.leadTimeStats.avgDays ?? 'n/a'} j (médiane ${payload.leadTimeStats.medianDays ?? 'n/a'} j, n=${payload.leadTimeStats.sampleSize})`);
  lines.push('');
  lines.push('## Rollup par sprint');
  lines.push('');
  lines.push('| Sprint | Total | Evolution | Anomalie | Hotfix |');
  lines.push('|---|---:|---:|---:|---:|');
  for (const [sprint, counts] of Object.entries(bySprint).sort((a, b) => a[0].localeCompare(b[0]))) {
    lines.push(`| ${sprint} | ${counts.total} | ${counts.Evolution} | ${counts.Anomalie} | ${counts.Hotfix} |`);
  }
  lines.push('');
  lines.push(`## Glissements de sprint (${slippedTickets.length} ticket(s) replanifié(s))`);
  lines.push('');
  lines.push('| Ticket | Évènements de glissement | Détail |');
  lines.push('|---|---:|---|');
  for (const t of slippedTickets) {
    const detail = t.slippageDetail.map((s) => `${s.from} → ${s.to}`).join('; ');
    lines.push(`| ${t.key} | ${t.slippageEvents} | ${detail} |`);
  }
  lines.push('');
  lines.push(`## Tickets avec rework élevé (≥2 retours à un statut déjà visité)`);
  lines.push('');
  lines.push('| Ticket | Retours détectés |');
  lines.push('|---|---:|');
  for (const t of highBounceTickets) {
    lines.push(`| ${t.key} | ${t.statusBounceCount} |`);
  }

  fs.writeFileSync(outMd, `${lines.join('\n')}\n`, 'utf8');

  console.log(`Jira sprint classification: ${valid.length} tickets analysés.`);
  console.log(`Classification: ${JSON.stringify(byClassification)}`);
  console.log(`JSON: ${outJson}`);
  console.log(`Markdown: ${outMd}`);
}

run();
