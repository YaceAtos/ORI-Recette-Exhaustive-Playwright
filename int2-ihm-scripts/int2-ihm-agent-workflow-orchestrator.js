const { execSync } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const gateCommand = process.env.INT2_JDD_GATE_CMD || 'node int2-ihm-scripts/int2-ihm-agent-jdd-gate.js';
const reportCommand = process.env.INT2_REPORT_CMD || 'npm run report:int2:functional:strict10';

function run(command) {
  console.log(`\n>>> ${command}`);
  execSync(command, { cwd: rootDir, stdio: 'inherit' });
}

run('node int2-ihm-scripts/int2-ihm-agent-semantic-extractor.js');
run('node int2-ihm-scripts/int2-ihm-agent-discovery.js');
run('node int2-ihm-scripts/int2-ihm-agent-scenarios-synthesizer.js');
run('node int2-ihm-scripts/int2-ihm-agent-dataset-manager.js');
run('node int2-ihm-scripts/int2-ihm-agent-scenarios-builder.js');
run('node int2-ihm-scripts/int2-ihm-agent-creation-profiler.js');
run('node int2-ihm-scripts/int2-ihm-agent-form-semantics.js');
run(gateCommand);
run('npm run test:full:exhaustive');
run(reportCommand);

console.log('\nINT2 agent workflow completed successfully.');
