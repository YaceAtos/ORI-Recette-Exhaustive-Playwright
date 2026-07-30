const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const webRoot = path.join(rootDir, 'mon-espace', 'recette-sprints-11-12-13', 'livrables-opencode');
const journeyDir = path.join(rootDir, 'int2-ihm-recordings', 'orion-pipeline', 'journeys');
const logFile = path.join(rootDir, 'int2-ihm-recordings', 'orion-pipeline', '.dashboard-run.log');
const PORT = Number(process.env.ORION_DASH_PORT || '8099');

let run = null; // { child, watcher, grep, view, startedAt }

const MIME = { '.html': 'text/html; charset=utf-8', '.json': 'application/json; charset=utf-8', '.mp4': 'video/mp4', '.png': 'image/png', '.webm': 'video/webm', '.css': 'text/css', '.js': 'text/javascript', '.zip': 'application/zip' };

function regenDashboard() {
  spawnSync(process.execPath, [path.join(__dirname, 'orion-dashboard.js')], { cwd: rootDir, stdio: 'ignore', env: { ...process.env, ORION_DASH_LIVE: '1' } });
}

function serveStatic(req, res) {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/' ) rel = '/orion-dashboard.html';
  const filePath = path.join(webRoot, path.normalize(rel));
  if (!filePath.startsWith(webRoot) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404); return res.end('Not found');
  }
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';
  const size = fs.statSync(filePath).size;
  const range = req.headers.range;
  if (range && /^bytes=/.test(range)) { // Support seek (206)
    const [s, e] = range.replace('bytes=', '').split('-');
    const start = parseInt(s, 10) || 0;
    const end = e ? parseInt(e, 10) : size - 1;
    res.writeHead(206, { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1, 'Cache-Control': 'no-store' });
    return fs.createReadStream(filePath, { start, end }).pipe(res);
  }
  res.writeHead(200, { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Length': size, 'Cache-Control': 'no-store' });
  fs.createReadStream(filePath).pipe(res);
}

function status() {
  const journeys = fs.existsSync(journeyDir) ? fs.readdirSync(journeyDir).filter((f) => f.endsWith('.json')).length : 0;
  let last = '', done = false;
  try { const log = fs.readFileSync(logFile, 'utf8'); const m = [...log.matchAll(/ORI-\d+ CT-[A-Z0-9-]+/g)]; last = m.length ? m[m.length - 1][0] : ''; done = /termine en mode run|Rapport riche/.test(log.slice(-2000)); } catch {}
  return { running: !!run, grep: run ? run.grep : null, view: run ? run.view : null, startedAt: run ? run.startedAt : null, journeys, last, done };
}

function startRun(grep, view) {
  if (run) return { ok: false, error: 'Un run est déjà en cours.' };
  const busy = spawnSync('pgrep', ['-f', 'playwright.orion'], { encoding: 'utf8' });
  if (busy.stdout && busy.stdout.trim()) return { ok: false, error: 'Un run Playwright tourne déjà (externe).' };
  try { fs.writeFileSync(logFile, ''); } catch {}
  const out = fs.openSync(logFile, 'a');
  const env = { ...process.env, ORION_VIEW: view || 'headless', ORION_SLOWMO: view === 'headed' ? '250' : '0', ORION_TYPE_MIN: '6', ORION_TYPE_MAX: '16', ORION_DASH_LIVE: '1' };
  const args = ['run', 'orion:pipeline:run:headed'];
  if (grep) { args.push('--', '--grep', grep); }
  const child = spawn('npm', args, { cwd: rootDir, env, stdio: ['ignore', out, out] });
  const watcher = spawn(process.execPath, [path.join(__dirname, 'orion-live-watch.js')], { cwd: rootDir, env, stdio: 'ignore' });
  run = { child, watcher, grep: grep || 'TOUT (252 cas)', view: view || 'headless', startedAt: new Date().toISOString() };
  child.on('close', () => { try { watcher.kill(); } catch {} regenDashboard(); run = null; });
  return { ok: true, ...status() };
}

function stopRun() {
  if (!run) return { ok: true, running: false };
  try { run.child.kill('SIGTERM'); } catch {}
  try { run.watcher.kill('SIGTERM'); } catch {}
  spawnSync('pkill', ['-f', 'playwright.orion'], { stdio: 'ignore' });
  run = null; regenDashboard();
  return { ok: true, running: false };
}

function body(req) { return new Promise((r) => { let d = ''; req.on('data', (c) => d += c); req.on('end', () => { try { r(JSON.parse(d || '{}')); } catch { r({}); } }); }); }

const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0];
  if (url === '/api/status') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify(status())); }
  if (url === '/api/run' && req.method === 'POST') { const b = await body(req); const r = startRun(b.grep || null, b.view || 'headless'); res.writeHead(r.ok ? 200 : 409, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify(r)); }
  if (url === '/api/stop' && req.method === 'POST') { const r = stopRun(); res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify(r)); }
  return serveStatic(req, res);
});

regenDashboard();
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Orion dashboard server: http://127.0.0.1:${PORT}/orion-dashboard.html?live`);
  console.log('  API: POST /api/run {grep,view} · GET /api/status · POST /api/stop · vidéos avec seek (206).');
});
