const { spawnSync } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const mode = process.argv.includes('--run') ? 'run' : 'prepare';
const grepIndex = process.argv.indexOf('--grep');
const grep = grepIndex >= 0 ? process.argv[grepIndex + 1] : process.env.ORION_PIPELINE_GREP;

function run(command, args, options = {}) {
  console.log(`\n>>> ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, {
    cwd: rootDir,
    stdio: 'inherit',
    env: process.env,
    ...options,
  });
  return result.status ?? 1;
}

let exitCode = run(process.execPath, ['int2-ihm-scripts/orion-local-catalog.js']);
if (exitCode === 0) exitCode = run(process.execPath, ['int2-ihm-scripts/orion-local-validate.js']);

if (exitCode === 0 && mode === 'run') {
  const config = process.env.ORION_PLAYWRIGHT_CONFIG || 'playwright.orion.pipeline.config.ts';
  const args = ['playwright', 'test', `--config=${config}`];
  if (grep) args.push('--grep', grep);
  exitCode = run('npx', args);
}

const reportCode = run(process.execPath, ['int2-ihm-scripts/orion-local-report.js'], {
  env: {
    ...process.env,
    ORION_REPORT_IGNORE_RESULTS: mode === 'prepare' ? 'true' : 'false',
  },
});
if (exitCode === 0 && reportCode !== 0) exitCode = reportCode;

// En mode run : organiser les preuves (MP4 + réorg + bugs annotés) puis rapport riche + 3 rapports.
if (mode === 'run') {
  run(process.execPath, ['int2-ihm-scripts/orion-evidence-organize.js']);
  run(process.execPath, ['int2-ihm-scripts/orion-rich-report.js']);
}
// Dashboard front-end (toujours régénéré, même en prepare).
run(process.execPath, ['int2-ihm-scripts/orion-dashboard.js']);

console.log(`\nPipeline Orion local termine en mode ${mode} avec le code ${exitCode}.`);
process.exit(exitCode);
