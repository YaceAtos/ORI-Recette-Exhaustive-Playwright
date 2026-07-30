const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const outputFile = path.join(rootDir, 'int2-ihm-recordings', 'INT2_EXHAUSTIVE_SCENARIO_BLUEPRINT.md');
const graphFile = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'state-graph.json');

if (!fs.existsSync(graphFile)) {
  throw new Error(`Missing autonomous graph file: ${graphFile}`);
}

const graph = JSON.parse(fs.readFileSync(graphFile, 'utf8'));
const nodes = Array.isArray(graph.nodes) ? graph.nodes.filter((n) => !n.error && n.url) : [];

const rows = nodes.map((node) => ({
  page: node.id,
  url: node.url,
  scenario: `Autonomous traversal on ${node.id}`,
  actions: ['navigate', 'validate heading', 'probe search if present', 'probe create and close dialog if present'],
}));

const lines = [];
lines.push('# INT2 Exhaustive Scenario Blueprint');
lines.push('');
lines.push(`- Generated at: ${new Date().toISOString()}`);
lines.push(`- Total autonomous scenarios detected: ${rows.length}`);
lines.push('- Output target: MP4 + JSON for each detected scenario during full exhaustive run.');
lines.push('- Functional policy: no persistent data creation, semi-autonomous interactions only.');
lines.push('');
lines.push('| ID | Page | Scenario | Actions | Execution Policy |');
lines.push('|---|---|---|---|---|');

rows.forEach((row, idx) => {
  lines.push(`| INT2-SCN-${String(idx + 1).padStart(3, '0')} | ${row.page} | ${row.scenario} | ${row.actions.join(' -> ')} | Record MP4 and JSON, no final creation submit |`);
});

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, `${lines.join('\n')}\n`, 'utf8');
console.log(`INT2 scenario blueprint generated: ${outputFile}`);
