const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const pipelineDir = path.join(rootDir, 'int2-ihm-recordings', 'orion-pipeline');
const journeyDir = path.join(pipelineDir, 'journeys');
const preuvesDir = path.join(rootDir, 'mon-espace', 'recette-sprints-11-12-13', 'livrables-opencode', 'preuves');
const stopFile = path.join(pipelineDir, '.live-stop');

const SEV = {
  bloquant: '#D9534F', moyen: '#F29F3D', mineur: '#E0B000',
};
const FONT = '/System/Library/Fonts/Supplemental/Arial Bold.ttf';
const FONTR = '/System/Library/Fonts/Supplemental/Arial.ttf';
const sh = (c) => { try { execSync(c, { stdio: 'ignore' }); return true; } catch { return false; } };
const readJson = (p) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } };

function severityOf(j) {
  if (j.status === 'blocked-flow') return j.severity || 'bloquant';
  if (j.status === 'assertion-low') return j.severity || 'moyen';
  return null;
}
function annotate(src, dst, sev, cap) {
  const col = SEV[sev] || SEV.moyen;
  const c = String(cap).replace(/"/g, "'").replace(/[\\]/g, '').slice(0, 120);
  return sh(['magick', `"${src}"`, '-bordercolor', `"${col}"`, '-border', '16',
    '-fill', 'none', '-stroke', `"${col}"`, '-strokewidth', '7', '-draw', '"ellipse 1416,166 90,90 0,360"',
    '-gravity', 'North', '-fill', '"#17324D"', '-draw', '"rectangle 0,0 100000,54"',
    '-font', `"${FONT}"`, '-pointsize', '26', '-fill', 'white', '-annotate', '+0+14', `"ORION - ANOMALIE ${sev.toUpperCase()}"`,
    '-gravity', 'South', '-background', '"#17324D"', '-splice', '0x76',
    '-font', `"${FONTR}"`, '-pointsize', '21', '-fill', 'white', '-annotate', '+0+22', `"${c}"`, `"${dst}"`].join(' '));
}

function organizeOne(j) {
  if (!j.issueKey || !j.caseId) return false;
  const dest = path.join(preuvesDir, j.issueKey, j.caseId);
  const mp4 = path.join(dest, 'journey.mp4');
  if (!j.artifactDir || !fs.existsSync(j.artifactDir)) return false;
  const webm = fs.readdirSync(j.artifactDir).find((f) => f.endsWith('.webm'));
  if (!webm) return false;
  // Régénérer si la vidéo source (webm) est plus récente que le MP4 déjà produit (évite les vidéos périmées).
  if (fs.existsSync(mp4)) {
    const webmTime = fs.statSync(path.join(j.artifactDir, webm)).mtimeMs;
    const mp4Time = fs.statSync(mp4).mtimeMs;
    if (mp4Time >= webmTime) return false; // déjà à jour
  }
  fs.mkdirSync(dest, { recursive: true });
  const ok = sh(`ffmpeg -y -i "${path.join(j.artifactDir, webm)}" -c:v libx264 -preset veryfast -crf 26 -pix_fmt yuv420p -movflags +faststart "${mp4}"`);
  const png = fs.readdirSync(j.artifactDir).filter((f) => f.endsWith('.png')).pop();
  if (png) {
    const shot = path.join(dest, 'screenshot.png');
    fs.copyFileSync(path.join(j.artifactDir, png), shot);
    const sev = severityOf(j);
    if (sev) annotate(shot, path.join(dest, 'screenshot-annotated.png'), sev, (j.blocker && j.blocker.reason) || j.caseId);
  }
  fs.writeFileSync(path.join(dest, 'journey.json'), JSON.stringify(j, null, 2));
  return ok;
}

function tick() {
  const files = fs.existsSync(journeyDir) ? fs.readdirSync(journeyDir).filter((f) => f.endsWith('.json')) : [];
  let neww = 0;
  for (const f of files) { const j = readJson(path.join(journeyDir, f)); if (j && organizeOne(j)) neww++; }
  // Régénérer bug-catalog minimal + dashboard live
  spawnSync(process.execPath, [path.join(__dirname, 'orion-dashboard.js')], { cwd: rootDir, stdio: 'ignore', env: { ...process.env, ORION_DASH_LIVE: '1' } });
  console.log(`[live] journeys=${files.length} · nouvelles vidéos=${neww} · dashboard régénéré`);
}

async function main() {
  try { fs.unlinkSync(stopFile); } catch {}
  const maxMin = Number(process.env.ORION_LIVE_MAX_MIN || '75');
  const end = Date.now() + maxMin * 60000;
  console.log(`[live] watcher démarré (max ${maxMin} min). Créer ${path.relative(rootDir, stopFile)} pour arrêter.`);
  while (Date.now() < end) {
    if (fs.existsSync(stopFile)) { console.log('[live] stop demandé.'); break; }
    tick();
    await new Promise((r) => setTimeout(r, 25000));
  }
  tick();
  console.log('[live] watcher terminé.');
}
main();
