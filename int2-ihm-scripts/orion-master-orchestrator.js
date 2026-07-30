const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const masterLog = path.join(rootDir, 'int2-ihm-recordings', 'orion-pipeline', 'MASTER_ORCHESTRATION.log');
fs.mkdirSync(path.dirname(masterLog), { recursive: true });
fs.writeFileSync(masterLog, '');

function log(msg) {
  const line = `[${new Date().toLocaleTimeString('fr-FR')}] ${msg}\n`;
  fs.appendFileSync(masterLog, line);
  process.stdout.write(line);
}
function phase(n, title) { log(`\n========== PHASE ${n} — ${title} ==========`); }
function runStep(agent, cmd, args, opts = {}) {
  log(`▶ AGENT: ${agent}`);
  const t0 = Date.now();
  const r = spawnSync(cmd, args, { cwd: rootDir, env: { ...process.env, ...(opts.env || {}) }, encoding: 'utf8', timeout: opts.timeout || 0 });
  const dt = Math.round((Date.now() - t0) / 1000);
  const tail = ((r.stdout || '') + (r.stderr || '')).trim().split('\n').slice(-3).join(' | ');
  log(`  ${r.status === 0 ? '✅' : '⚠️'} ${agent} terminé en ${dt}s · ${tail.slice(0, 200)}`);
  return r.status === 0;
}

async function main() {
  const startedAt = Date.now();
  log('🚀 ORCHESTRATEUR MAÎTRE ORION — démarrage. Dashboard: http://127.0.0.1:8099/orion-dashboard.html?live');

  // PHASE 0 — serveur dashboard (persistant, non bloquant)
  phase(0, 'Serveur dashboard + API (persistant)');
  spawnSync('bash', ['-lc', 'lsof -ti:8099 | xargs kill 2>/dev/null; sleep 1'], { cwd: rootDir });
  const server = spawn(process.execPath, [path.join(__dirname, 'orion-dashboard-server.js')], { cwd: rootDir, env: process.env, detached: true, stdio: 'ignore' });
  server.unref();
  log('  ✅ serveur dashboard lancé (PID ' + server.pid + ')');

  // PHASE 1 — Agent retrieval : moisson des vraies données INT2
  phase(1, 'Agent retrieval — moisson données réelles INT2 (nomenclature, doublons, JDD)');
  runStep('int2-data-harvester', process.execPath, ['int2-ihm-scripts/orion-int2-data-harvester.js'], { timeout: 180000 });

  // PHASE 2 — Préparation catalogue + contrats
  phase(2, 'Ingestion Excel → catalogue canonique + validation');
  runStep('orion-local-catalog', process.execPath, ['int2-ihm-scripts/orion-local-catalog.js']);
  runStep('orion-local-validate', process.execPath, ['int2-ihm-scripts/orion-local-validate.js']);

  // PHASE 3 — Watcher live (parallèle) + Run complet 252 headless (le gros œuvre ~45 min)
  phase(3, 'Exécution autonome 252 tickets (headless) + watcher live (dashboard temps réel)');
  fs.writeFileSync(path.join(rootDir, 'int2-ihm-recordings', 'orion-pipeline', '.live-stop'), '');
  fs.unlinkSync(path.join(rootDir, 'int2-ihm-recordings', 'orion-pipeline', '.live-stop'));
  const watcher = spawn(process.execPath, [path.join(__dirname, 'orion-live-watch.js')], { cwd: rootDir, env: { ...process.env, ORION_DASH_LIVE: '1', ORION_LIVE_MAX_MIN: '90' }, detached: true, stdio: 'ignore' });
  watcher.unref();
  log('  ✅ watcher live lancé (PID ' + watcher.pid + ') — dashboard mis à jour toutes les 25s');
  runStep('playwright-run-252 (orion-autonomous-catalog)', 'npm', ['run', 'orion:pipeline:run:headed'],
    { env: { ORION_VIEW: 'headless', ORION_SLOWMO: '0', ORION_TYPE_MIN: '6', ORION_TYPE_MAX: '16', ORION_DASH_LIVE: '1' }, timeout: 3600000 });
  try { fs.writeFileSync(path.join(rootDir, 'int2-ihm-recordings', 'orion-pipeline', '.live-stop'), 'stop'); } catch {}
  try { process.kill(watcher.pid); } catch {}

  // PHASE 4 — Consolidation preuves + rapports (au cas où)
  phase(4, 'Consolidation : preuves MP4 + bugs annotés + 3 rapports + PPTX riche + dashboard');
  runStep('orion-evidence-organize', process.execPath, ['int2-ihm-scripts/orion-evidence-organize.js'], { env: { ORION_RESULT_DIR: 'int2-ihm-test-results/orion-pipeline-headed' } });
  runStep('orion-rich-report', process.execPath, ['int2-ihm-scripts/orion-rich-report.js'], { env: { ORION_RESULT_DIR: 'int2-ihm-test-results/orion-pipeline-headed' } });
  runStep('orion-dashboard', process.execPath, ['int2-ihm-scripts/orion-dashboard.js'], { env: { ORION_DASH_LIVE: '1' } });

  // PHASE 5 — Agents d'analyse INT2 (sémantique, couverture, dataset, réparation, apprentissage)
  phase(5, 'Agents d\'analyse INT2 (sémantique · couverture · qualité JDD · réparation · apprentissage)');
  runStep('agent semantic-extractor', 'npm', ['run', 'agent:int2:semantic'], { timeout: 120000 });
  runStep('agent dataset-manager', 'npm', ['run', 'agent:int2:dataset'], { timeout: 120000 });
  runStep('agent dataset-quality-gate', 'npm', ['run', 'agent:int2:dataset:quality'], { timeout: 120000 });
  runStep('agent coverage-diff', 'npm', ['run', 'agent:int2:coverage:diff'], { timeout: 120000 });
  runStep('agent autonomous-repair', 'npm', ['run', 'agent:int2:repair'], { timeout: 120000 });
  runStep('agent continuous-learning', 'npm', ['run', 'agent:int2:learning'], { timeout: 120000 });

  // PHASE 6 — Audit codebase (syntaxe de tous les scripts)
  phase(6, 'Audit codebase — vérification syntaxe de tous les scripts');
  const scripts = fs.readdirSync(path.join(rootDir, 'int2-ihm-scripts')).filter((f) => f.endsWith('.js'));
  let ok = 0, ko = 0;
  for (const s of scripts) { const r = spawnSync(process.execPath, ['--check', path.join('int2-ihm-scripts', s)], { cwd: rootDir }); if (r.status === 0) ok++; else { ko++; log(`  ❌ syntaxe: ${s}`); } }
  log(`  Audit: ${ok} scripts OK · ${ko} KO sur ${scripts.length}`);

  // PHASE 7 — Git local (dépôt dédié, self-contained)
  phase(7, 'Git — dépôt local dédié + commit complet');
  runStep('git init/add/commit', 'bash', ['-lc',
    'if [ ! -d .git ]; then git init -q && git symbolic-ref HEAD refs/heads/main; fi; ' +
    'git add -A 2>/dev/null; ' +
    'GIT_AUTHOR_NAME="Orion Pipeline" GIT_AUTHOR_EMAIL="orion@local" GIT_COMMITTER_NAME="Orion Pipeline" GIT_COMMITTER_EMAIL="orion@local" ' +
    'git commit -q -m "Pipeline recette Orion complet : 252 cas, preuves MP4, bugs annotes, dashboard, rapports" 2>&1 | tail -1 || echo "rien a committer"; ' +
    'git log --oneline -1 2>/dev/null']);

  // PHASE 8 — Zip exhaustif local
  phase(8, 'Zip exhaustif local (source + livrables + preuves, hors node_modules)');
  const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '');
  const zipName = `orion-recette-complet_${stamp}.zip`;
  runStep('zip exhaustif', 'bash', ['-lc',
    `rm -f "${zipName}"; zip -r -q "${zipName}" . ` +
    `-x 'node_modules/*' -x 'external-repos/*' -x 'int2-ihm-test-results/*' ` +
    `-x '.git/*' -x '*.log' -x '__MACOSX/*' -x 'workspace-archives/*' ` +
    `-x 'int2-ihm-recordings/int2/*' -x 'int2-ihm-recordings/exhaustive/*' -x 'int2-ihm-recordings/chains/*' -x 'int2-ihm-recordings/working/*'; ` +
    `du -h "${zipName}" | cut -f1`], { timeout: 300000 });

  const mins = Math.round((Date.now() - startedAt) / 60000);
  phase('FIN', `Orchestration terminée en ${mins} min`);
  const journeys = fs.existsSync(path.join(rootDir, 'int2-ihm-recordings', 'orion-pipeline', 'journeys')) ? fs.readdirSync(path.join(rootDir, 'int2-ihm-recordings', 'orion-pipeline', 'journeys')).length : 0;
  const videos = spawnSync('bash', ['-lc', "find mon-espace/recette-sprints-11-12-13/livrables-opencode/preuves -name '*.mp4' 2>/dev/null | wc -l"], { cwd: rootDir, encoding: 'utf8' }).stdout.trim();
  log(`📦 Livrables : ${journeys} parcours · ${videos} vidéos MP4 · zip ${zipName}`);
  log(`📊 Dashboard : http://127.0.0.1:8099/orion-dashboard.html?live (serveur laissé actif)`);
  log('✅ TOUTES LES TÂCHES TERMINÉES.');
}

main().catch((e) => { log('ERREUR ORCHESTRATEUR: ' + e.message); process.exit(1); });
