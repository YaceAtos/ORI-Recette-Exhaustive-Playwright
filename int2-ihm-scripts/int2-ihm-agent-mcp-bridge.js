const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous');
const outManifest = path.join(outDir, 'mcp-tools-manifest.json');
const outContracts = path.join(outDir, 'MCP_TOOLS_CONTRACTS.md');

const tools = [
  {
    name: 'int2.search',
    description: 'Query the INT2 retrieval index and return ranked page routes.',
    command: 'npm run agent:int2:search -- "<query>"',
    inputs: ['query(string)', 'topK(number, optional)'],
    output: 'int2-ihm-recordings/int2-autonomous/search-results.json',
  },
  {
    name: 'int2.knowledge.search',
    description: 'Query only ingested knowledge sources (local knowledge + external loop-engineering docs).',
    command: 'npm run agent:int2:knowledge:search -- "<query>"',
    inputs: ['query(string)', 'topK(number, optional)'],
    output: 'int2-ihm-recordings/int2-autonomous/knowledge-search-results.json',
  },
  {
    name: 'int2.retrieval.reindex',
    description: 'Rebuild retrieval index from discovery graph and page agent extracts.',
    command: 'npm run agent:int2:retrieval:index',
    inputs: [],
    output: 'int2-ihm-recordings/int2-autonomous/retrieval-index.json',
  },
  {
    name: 'int2.popup.qa_loop',
    description: 'Run deep popup QA loop: inspect each action button, open dialogs, fill real-like data, and validate evidence.',
    command: 'npm run agent:int2:popup:qa',
    inputs: ['strict(boolean, optional)', 'allowSubmit(boolean, optional)'],
    output: 'int2-ihm-recordings/int2-autonomous/popup-qa-loop-report.json',
  },
  {
    name: 'int2.coverage.diff',
    description: 'Compare expected routes from docs against discovered routes from graph.',
    command: 'npm run agent:int2:coverage:diff',
    inputs: [],
    output: 'int2-ihm-recordings/int2-autonomous/coverage-diff.json',
  },
  {
    name: 'int2.dataset.quality_gate',
    description: 'Validate dataset quality and fail pipeline when thresholds are not met.',
    command: 'npm run agent:int2:dataset:quality',
    inputs: [],
    output: 'int2-ihm-recordings/int2-autonomous/dataset-quality-gate.json',
  },
  {
    name: 'int2.repair.plan',
    description: 'Analyze manifests and graph errors, then generate autonomous repair plan.',
    command: 'npm run agent:int2:repair',
    inputs: [],
    output: 'int2-ihm-recordings/int2-autonomous/autonomous-repair-plan.json',
  },
  {
    name: 'int2.learning.refresh',
    description: 'Learn from semantic profiles and extraction artifacts to suggest new aliases.',
    command: 'npm run agent:int2:learning',
    inputs: [],
    output: 'int2-ihm-recordings/int2-autonomous/continuous-learning-report.json',
  },
];

const manifest = {
  generatedAt: new Date().toISOString(),
  namespace: 'int2',
  mode: 'stdio-mcp-runtime',
  server: {
    command: 'npm run agent:int2:mcp:server',
    transport: 'stdio',
  },
  tools,
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outManifest, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

const lines = [];
lines.push('# INT2 MCP Tools Contracts');
lines.push('');
lines.push(`- Generated at: ${manifest.generatedAt}`);
lines.push('- Namespace: int2');
lines.push('- Mode: stdio-mcp-runtime');
lines.push('- Server command: npm run agent:int2:mcp:server');
lines.push('');
lines.push('| Tool | Description | Input Contract | Command | Output Artifact |');
lines.push('|---|---|---|---|---|');
for (const tool of tools) {
  lines.push(`| ${tool.name} | ${tool.description} | ${tool.inputs.join(', ') || 'none'} | ${tool.command} | ${tool.output} |`);
}
lines.push('');
lines.push('## Notes');
lines.push('');
lines.push('- This bridge is backed by a real local MCP stdio runtime.');
lines.push('- Any MCP-compatible client can connect via stdio using the server command listed above.');

fs.writeFileSync(outContracts, `${lines.join('\n')}\n`, 'utf8');

console.log(`INT2 MCP bridge manifest generated: ${outManifest}`);
console.log(`INT2 MCP contracts generated: ${outContracts}`);