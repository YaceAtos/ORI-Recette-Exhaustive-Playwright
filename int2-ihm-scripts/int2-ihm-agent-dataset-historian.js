/**
 * INT2 Dataset Historian Agent ("the scribe")
 *
 * Does NOT fetch anything new. Instead it reads across every dataset already
 * produced by the other agents/tests over time and writes them into a single
 * append-only, deduplicated historical archive so that:
 *  - future test runs can reuse previously-validated real data instead of
 *    re-querying government APIs every time,
 *  - we keep a persistent memory of what data was actually accepted
 *    (persisted:true) vs rejected/bounced by the INT2 application itself,
 *  - regressions in data quality over time become visible (growth, success rate).
 *
 * Sources scribed from (all optional, best-effort):
 *  - fixtures/scenarios/int2/realdata-companies.generated.json   (real-data-harvester output: real SIREN/SIRET/address/date)
 *  - int2-ihm-knowledge/int2-real-data.json                      (real data scraped directly from INT2 pages: agencies, SIREN, etc.)
 *  - int2-ihm-recordings/int2-autonomous/creation-dataset-audit.ndjson (execution outcomes: was a submitted dataset persisted or not)
 *  - int2-ihm-recordings/int2-autonomous/create-flow-profile.json (form field profiles seen during creation flows)
 *
 * Output:
 *  - int2-ihm-knowledge/historical/dataset-history.ndjson   (append-only, deduped by content hash, one JSON object per line)
 *  - int2-ihm-recordings/int2-autonomous/dataset-historian-report.json
 *  - int2-ihm-recordings/int2-autonomous/INT2_DATASET_HISTORIAN_REPORT.md
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = path.resolve(__dirname, '..');
const outRecordingsDir = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous');
const historyDir = path.join(rootDir, 'int2-ihm-knowledge', 'historical');
const historyFile = path.join(historyDir, 'dataset-history.ndjson');
const reportJsonFile = path.join(outRecordingsDir, 'dataset-historian-report.json');
const reportMdFile = path.join(outRecordingsDir, 'INT2_DATASET_HISTORIAN_REPORT.md');

const realdataFile = path.join(rootDir, 'fixtures', 'scenarios', 'int2', 'realdata-companies.generated.json');
const int2RealDataFile = path.join(rootDir, 'int2-ihm-knowledge', 'int2-real-data.json');
const auditNdjsonFile = path.join(outRecordingsDir, 'creation-dataset-audit.ndjson');
const createFlowProfileFile = path.join(outRecordingsDir, 'create-flow-profile.json');

function safeReadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function safeReadNdjson(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const lines = fs.readFileSync(filePath, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean);
  const out = [];
  for (const line of lines) {
    try {
      out.push(JSON.parse(line));
    } catch {
      // skip malformed line
    }
  }
  return out;
}

function contentHash(entry) {
  const canonical = JSON.stringify(entry.data ?? entry, Object.keys(entry.data ?? entry).sort());
  return crypto.createHash('sha1').update(`${entry.kind}::${canonical}`).digest('hex');
}

function loadExistingHistory() {
  const entries = safeReadNdjson(historyFile);
  const byHash = new Map();
  for (const e of entries) {
    if (e && e.hash) byHash.set(e.hash, e);
  }
  return byHash;
}

function scribeRealdataCompanies() {
  const payload = safeReadJson(realdataFile);
  const companies = Array.isArray(payload?.companies) ? payload.companies : [];
  return companies
    .filter((c) => c.validated)
    .map((c) => ({
      kind: 'real_company',
      scribedAt: new Date().toISOString(),
      data: {
        siren: c.siren,
        siret: c.siret,
        name: c.name,
        address: c.address,
        postalCode: c.postalCode,
        commune: c.commune,
        dateCreation: c.dateCreation,
      },
      provenance: c.source || 'realdata-harvester',
    }));
}

function scribeInt2ScrapedAgencies() {
  const payload = safeReadJson(int2RealDataFile);
  const structurePage = payload?.pages?.structure;
  if (!structurePage || !Array.isArray(structurePage.columns?.Nom)) return [];
  const names = structurePage.columns.Nom;
  const out = [];
  for (const raw of names) {
    const match = String(raw).match(/([0-9]{9,14})\s*$/);
    if (!match) continue;
    const idNumber = match[1];
    const label = String(raw).replace(idNumber, '').replace(/^chevron_right\s*home_work\s*/, '').trim();
    out.push({
      kind: 'int2_scraped_agency',
      scribedAt: new Date().toISOString(),
      data: {
        label,
        legalId: idNumber,
        legalIdLength: idNumber.length,
      },
      provenance: `int2-real-data:${payload.base || 'unknown'}`,
    });
  }
  return out;
}

function scribeExecutionAudits() {
  const entries = safeReadNdjson(auditNdjsonFile);
  return entries.map((e) => ({
    kind: 'execution_audit',
    scribedAt: new Date().toISOString(),
    data: {
      at: e.at,
      routeId: e.routeId,
      submitted: Boolean(e.submitted),
      persisted: Boolean(e.persisted),
      mutationDetected: Boolean(e.mutationDetected),
      reason: e.reason || null,
      fieldCount: Array.isArray(e.dataset) ? e.dataset.length : 0,
    },
    provenance: 'creation-dataset-audit.ndjson',
  }));
}

function scribeCreationFlowProfiles() {
  const payload = safeReadJson(createFlowProfileFile);
  const profiles = Array.isArray(payload?.profiles) ? payload.profiles : [];
  return profiles.map((p) => ({
    kind: 'creation_flow_profile',
    scribedAt: new Date().toISOString(),
    data: {
      id: p.id || p.url || 'unknown',
      fieldCount: Array.isArray(p.fields) ? p.fields.length : 0,
      fieldLabels: Array.isArray(p.fields) ? p.fields.map((f) => f.label).filter(Boolean).slice(0, 30) : [],
    },
    provenance: 'create-flow-profile.json',
  }));
}

function run() {
  fs.mkdirSync(historyDir, { recursive: true });
  fs.mkdirSync(outRecordingsDir, { recursive: true });

  const existingByHash = loadExistingHistory();
  const sizeBefore = existingByHash.size;

  const candidates = [
    ...scribeRealdataCompanies(),
    ...scribeInt2ScrapedAgencies(),
    ...scribeExecutionAudits(),
    ...scribeCreationFlowProfiles(),
  ];

  const newEntries = [];
  for (const c of candidates) {
    const hash = contentHash(c);
    if (existingByHash.has(hash)) continue;
    const entry = { ...c, hash };
    existingByHash.set(hash, entry);
    newEntries.push(entry);
  }

  if (newEntries.length > 0) {
    const lines = newEntries.map((e) => JSON.stringify(e)).join('\n');
    fs.appendFileSync(historyFile, `${lines}\n`, 'utf8');
  } else if (!fs.existsSync(historyFile)) {
    fs.writeFileSync(historyFile, '', 'utf8');
  }

  const allEntries = Array.from(existingByHash.values());
  const byKind = {};
  for (const e of allEntries) {
    byKind[e.kind] = (byKind[e.kind] || 0) + 1;
  }

  const executionAudits = allEntries.filter((e) => e.kind === 'execution_audit');
  const persistedCount = executionAudits.filter((e) => e.data.persisted).length;
  const successRate = executionAudits.length > 0 ? persistedCount / executionAudits.length : null;

  const report = {
    generatedAt: new Date().toISOString(),
    historyFile: path.relative(rootDir, historyFile),
    totalEntriesBefore: sizeBefore,
    totalEntriesAfter: allEntries.length,
    newEntriesThisRun: newEntries.length,
    countsByKind: byKind,
    executionSuccessRate: successRate !== null ? Number(successRate.toFixed(4)) : null,
    reusablePool: {
      realCompanies: byKind.real_company || 0,
      scrapedAgencies: byKind.int2_scraped_agency || 0,
    },
  };

  fs.writeFileSync(reportJsonFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  const lines = [];
  lines.push('# INT2 Dataset Historian Report');
  lines.push('');
  lines.push(`- Generated at: ${report.generatedAt}`);
  lines.push(`- History archive: ${report.historyFile}`);
  lines.push(`- Total entries before this run: ${report.totalEntriesBefore}`);
  lines.push(`- New entries scribed this run: ${report.newEntriesThisRun}`);
  lines.push(`- Total entries after this run: ${report.totalEntriesAfter}`);
  lines.push(
    `- Execution success rate (persisted / submitted, from audits): ${
      report.executionSuccessRate !== null ? `${(report.executionSuccessRate * 100).toFixed(1)}%` : 'n/a (no audits found)'
    }`,
  );
  lines.push('');
  lines.push('## Entries by kind');
  lines.push('');
  lines.push('| Kind | Count |');
  lines.push('|---|---:|');
  for (const [kind, count] of Object.entries(byKind).sort((a, b) => b[1] - a[1])) {
    lines.push(`| ${kind} | ${count} |`);
  }
  fs.writeFileSync(reportMdFile, `${lines.join('\n')}\n`, 'utf8');

  console.log(`INT2 dataset historian: ${newEntries.length} new entries scribed (${allEntries.length} total in archive).`);
  console.log(`INT2 historical archive: ${historyFile}`);
  console.log(`INT2 historian report: ${reportJsonFile}`);
}

run();
