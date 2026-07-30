const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const graphFile = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'state-graph.json');
const outDir = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous');
const outJson = path.join(outDir, 'autonomous-repair-plan.json');
const outMd = path.join(outDir, 'INT2_AUTONOMOUS_REPAIR_PLAN.md');

const manifestDirs = [
  path.join(rootDir, 'int2-ihm-recordings', 'exhaustive'),
  path.join(rootDir, 'int2-ihm-recordings', 'chains'),
  path.join(rootDir, 'int2-ihm-recordings', 'working'),
];

function safeReadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function listJsonFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath)
    .filter((f) => f.toLowerCase().endsWith('.json'))
    .map((f) => path.join(dirPath, f));
}

function classifyError(text) {
  const value = String(text || '').toLowerCase();
  if (!value) return 'unknown';
  if (value.includes('timeout')) return 'timeout';
  if (value.includes('locator') || value.includes('strict mode violation')) return 'selector';
  if (value.includes('navigation') || value.includes('net::')) return 'navigation';
  if (value.includes('detached') || value.includes('not visible')) return 'stability';
  return 'other';
}

function recommendationFor(kind) {
  const map = {
    timeout: 'Increase focused timeout and add route-level wait policy (domcontentloaded + bounded networkidle).',
    selector: 'Introduce semantic selector fallback chain (role, label, placeholder) and avoid brittle text-only locators.',
    navigation: 'Add retry wrapper for navigation and check route guard readiness before interactions.',
    stability: 'Use explicit visibility assertions and short recoverable retry around transient UI transitions.',
    other: 'Capture trace/video and add targeted assertion guard for this route.',
    unknown: 'Add structured error capture to manifests to improve automatic repair hints.',
  };
  return map[kind] || map.unknown;
}

const graph = safeReadJson(graphFile) || { nodes: [] };
const graphErrors = Array.isArray(graph.nodes)
  ? graph.nodes
      .filter((n) => n && n.error)
      .map((n) => ({ route: n.id || 'unknown', error: String(n.error) }))
  : [];

const manifestIssues = [];
for (const dirPath of manifestDirs) {
  for (const filePath of listJsonFiles(dirPath)) {
    const payload = safeReadJson(filePath);
    if (!payload) {
      manifestIssues.push({ file: path.relative(rootDir, filePath), route: 'unknown', error: 'invalid json manifest' });
      continue;
    }

    if (Array.isArray(payload.errors) && payload.errors.length > 0) {
      for (const e of payload.errors) {
        manifestIssues.push({ file: path.relative(rootDir, filePath), route: payload.route || payload.page || 'unknown', error: String(e) });
      }
    }

    if (typeof payload.error === 'string' && payload.error.trim().length > 0) {
      manifestIssues.push({ file: path.relative(rootDir, filePath), route: payload.route || payload.page || 'unknown', error: payload.error });
    }
  }
}

const combined = [
  ...graphErrors.map((e) => ({ source: 'graph', file: 'state-graph.json', route: e.route, error: e.error })),
  ...manifestIssues.map((e) => ({ source: 'manifest', file: e.file, route: e.route, error: e.error })),
];

const byClass = {};
for (const issue of combined) {
  const cls = classifyError(issue.error);
  if (!byClass[cls]) byClass[cls] = [];
  byClass[cls].push(issue);
}

const actions = Object.entries(byClass).map(([kind, issues]) => ({
  kind,
  count: issues.length,
  recommendation: recommendationFor(kind),
  examples: issues.slice(0, 5),
})).sort((a, b) => b.count - a.count);

const payload = {
  generatedAt: new Date().toISOString(),
  issueCount: combined.length,
  classCount: actions.length,
  actions,
  strictFailure: process.env.INT2_REPAIR_STRICT === 'true' && combined.length > 0,
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outJson, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

const lines = [];
lines.push('# INT2 Autonomous Repair Plan');
lines.push('');
lines.push(`- Generated at: ${payload.generatedAt}`);
lines.push(`- Total issues found: ${payload.issueCount}`);
lines.push(`- Issue classes: ${payload.classCount}`);
lines.push('');
lines.push('| Class | Count | Recommended Repair Action |');
lines.push('|---|---:|---|');
for (const action of actions) {
  lines.push(`| ${action.kind} | ${action.count} | ${action.recommendation} |`);
}

lines.push('');
lines.push('## Sample Issues');
lines.push('');
if (combined.length === 0) {
  lines.push('- No blocking issue detected from graph and manifests.');
} else {
  for (const issue of combined.slice(0, 20)) {
    lines.push(`- [${issue.source}] ${issue.file} :: ${issue.route} :: ${issue.error}`);
  }
}

fs.writeFileSync(outMd, `${lines.join('\n')}\n`, 'utf8');

console.log(`INT2 autonomous repair plan generated: ${outJson}`);
console.log(`INT2 autonomous repair report generated: ${outMd}`);

if (payload.strictFailure) {
  console.error('INT2_REPAIR_STRICT=true and issues found. Failing run.');
  process.exit(1);
}
