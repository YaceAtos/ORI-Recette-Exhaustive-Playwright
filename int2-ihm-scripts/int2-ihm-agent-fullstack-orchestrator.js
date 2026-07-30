const { execSync } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const useDeepDiscovery = process.env.INT2_USE_DEEP_DISCOVERY === 'true';

function run(command) {
  console.log(`\n>>> ${command}`);
  execSync(command, { cwd: rootDir, stdio: 'inherit' });
}

if (useDeepDiscovery) {
  run('npm run agent:int2:discover:deep');
  run('npm run agent:int2:synthesize');
}

run('npm run agent:int2:workflow:autonomous');
run('npm run agent:int2:popup:qa');
run('npm run agent:int2:extract:multi-agent');
run('npm run agent:int2:retrieval:index');
run('npm run agent:int2:coverage:diff');
run('npm run agent:int2:dataset:quality');
run('npm run agent:int2:learning');
run('npm run agent:int2:mcp:bridge');
run('npm run agent:int2:repair');

console.log('\nINT2 full-stack autonomous multi-agent pipeline completed successfully.');
