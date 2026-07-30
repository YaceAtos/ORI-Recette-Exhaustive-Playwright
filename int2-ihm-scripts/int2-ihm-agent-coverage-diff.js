const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');
const graphFile = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'state-graph.json');
const outDir = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous');
const outJson = path.join(outDir, 'coverage-diff.json');
const outMd = path.join(outDir, 'INT2_COVERAGE_DIFF.md');

function safeReadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function collectExpectedRoutes() {
  const out = new Set();
  if (!fs.existsSync(docsDir)) return out;

  const files = fs.readdirSync(docsDir).filter((f) => f.endsWith('.md'));
  const regex = /\/(?:[a-z0-9-]+\/)+pages\/[a-z0-9-/]+/gi;

  for (const fileName of files) {
    const content = fs.readFileSync(path.join(docsDir, fileName), 'utf8');
    const matches = content.match(regex) || [];
    for (const match of matches) {
      const route = String(match).replace(/[)\]>'\".,;:!?]+$/g, '');
      if (route.startsWith('/')) out.add(route);
    }
  }
  return out;
}

function sortAlpha(values) {
  return Array.from(values).sort((a, b) => a.localeCompare(b));
}

const graph = safeReadJson(graphFile);
if (!graph || !Array.isArray(graph.nodes)) {
  throw new Error(`Missing or invalid discovery graph: ${graphFile}`);
}

const expected = collectExpectedRoutes();
const discovered = new Set(graph.nodes.filter((n) => n && !n.error && n.id).map((n) => n.id));

const missing = sortAlpha(new Set([...expected].filter((x) => !discovered.has(x))));
const discoveredPagesRoutes = new Set([...discovered].filter((x) => x.includes('/pages/')));
const unexpected = sortAlpha(new Set([...discoveredPagesRoutes].filter((x) => !expected.has(x))));

const expectedCount = expected.size;
const discoveredCount = discoveredPagesRoutes.size;
const matchedCount = expectedCount - missing.length;
const coverageRate = expectedCount > 0 ? (matchedCount / expectedCount) * 100 : 100;

const payload = {
  generatedAt: new Date().toISOString(),
  expectedCount,
  discoveredCount,
  matchedCount,
  missingCount: missing.length,
  unexpectedCount: unexpected.length,
  coverageRate: Number(coverageRate.toFixed(2)),
  missing,
  unexpected,
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outJson, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

const lines = [];
lines.push('# INT2 Coverage Diff');
lines.push('');
lines.push(`- Generated at: ${payload.generatedAt}`);
lines.push(`- Expected routes from docs: ${expectedCount}`);
lines.push(`- Discovered /pages/ routes: ${discoveredCount}`);
lines.push(`- Matched routes: ${matchedCount}`);
lines.push(`- Missing routes: ${payload.missingCount}`);
lines.push(`- Unexpected routes: ${payload.unexpectedCount}`);
lines.push(`- Coverage rate: ${payload.coverageRate}%`);
lines.push('');

lines.push('## Missing Routes');
lines.push('');
if (missing.length === 0) {
  lines.push('- none');
} else {
  for (const route of missing) lines.push(`- ${route}`);
}

lines.push('');
lines.push('## Unexpected Discovered Routes');
lines.push('');
if (unexpected.length === 0) {
  lines.push('- none');
} else {
  for (const route of unexpected) lines.push(`- ${route}`);
}

fs.writeFileSync(outMd, `${lines.join('\n')}\n`, 'utf8');

console.log(`INT2 coverage diff generated: ${outJson}`);
console.log(`INT2 coverage diff report generated: ${outMd}`);
console.log(`Coverage rate: ${payload.coverageRate}%`);
