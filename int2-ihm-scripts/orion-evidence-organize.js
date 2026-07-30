const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const resultDir = path.join(rootDir, process.env.ORION_RESULT_DIR || 'int2-ihm-test-results/orion-pipeline-headed');
const pipelineDir = path.join(rootDir, 'int2-ihm-recordings', 'orion-pipeline');
const journeyDir = path.join(pipelineDir, 'journeys');
const preuvesDir = path.join(rootDir, 'mon-espace', 'recette-sprints-11-12-13', 'livrables-opencode', 'preuves');
const playwrightPath = path.join(resultDir, 'playwright-results.json');

// Charte Atos (sévérités)
const SEV = {
  bloquant: { color: '#D9534F', label: 'BLOQUANT' },
  moyen:    { color: '#F29F3D', label: 'MOYEN' },
  mineur:   { color: '#E0B000', label: 'MINEUR' },
};
const FONT = '/System/Library/Fonts/Supplemental/Arial Bold.ttf';
const FONTR = '/System/Library/Fonts/Supplemental/Arial.ttf';

function sh(cmd) { try { execSync(cmd, { stdio: 'ignore' }); return true; } catch { return false; } }
function readJson(p, fb) { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fb; } }
function safe(s) { return String(s).replace(/[^\w.-]/g, '_'); }

function collect(suites, parent = [], out = []) {
  for (const s of suites || []) {
    const t = s.title ? [...parent, s.title] : parent;
    for (const spec of s.specs || []) {
      for (const test of spec.tests || []) {
        const results = test.results || [];
        if (!results.length) continue;
        const latest = results.at(-1) || {};
        const title = [...t, spec.title].filter(Boolean).join(' > ');
        const m = title.match(/(ORI-\d+)\s*-\s*(CT-[A-Z0-9-]+)\s*\[R(\d+)\]/);
        out.push({
          title,
          issueKey: m ? m[1] : '',
          caseId: m ? m[2] : '',
          canonicalId: m ? `${m[1]}::${m[2]}::R${m[3]}` : '',
          status: latest.status || (test.status === 'skipped' ? 'skipped' : 'unknown'),
          outcome: test.status,
          durationMs: results.reduce((a, r) => a + Number(r.duration || 0), 0),
          attachments: (latest.attachments || []),
        });
      }
    }
    collect(s.suites, t, out);
  }
  return out;
}

function annotate(srcPng, dstPng, sev, caption, focus) {
  const s = SEV[sev] || SEV.moyen;
  const cap = String(caption).replace(/"/g, "'").replace(/[\\]/g, '').slice(0, 120);
  // Zone de focus (cercle) : coords du dernier élément visé si dispo, sinon zone d'action haut-droite.
  const cx = focus && focus.x ? Math.round(focus.x) : 1400;
  const cy = focus && focus.y ? Math.round(focus.y) : 150;
  const r = focus && focus.r ? Math.round(focus.r) : 90;
  const cmd = [
    'magick', `"${srcPng}"`,
    // Cadre couleur sévérité
    '-bordercolor', `"${s.color}"`, '-border', '16',
    // Cercle sur la zone KO
    '-fill', 'none', '-stroke', `"${s.color}"`, '-strokewidth', '7',
    '-draw', `"ellipse ${cx + 16},${cy + 16} ${r},${r} 0,360"`,
    // Bandeau haut (titre)
    '-gravity', 'North', '-fill', '"#17324D"', '-draw', '"rectangle 0,0 100000,54"',
    '-font', `"${FONT}"`, '-pointsize', '26', '-fill', 'white', '-annotate', '+0+14', `"ORION - ANOMALIE ${s.label}"`,
    // Badge sévérité (pastille) haut-droite
    '-gravity', 'NorthEast', '-fill', `"${s.color}"`, '-draw', '"roundrectangle 24,70 320,132 14,14"',
    '-font', `"${FONT}"`, '-pointsize', '30', '-fill', 'white', '-annotate', '+52+84', `"${s.label}"`,
    // Bandeau bas (constat)
    '-gravity', 'South', '-background', '"#17324D"', '-splice', '0x76',
    '-font', `"${FONTR}"`, '-pointsize', '21', '-fill', 'white', '-annotate', '+0+22', `"${cap}"`,
    `"${dstPng}"`,
  ].join(' ');
  return sh(cmd);
}

function main() {
  const pw = readJson(playwrightPath, { suites: [] });
  const tests = collect(pw.suites || []);
  fs.mkdirSync(preuvesDir, { recursive: true });

  const bugs = [];
  let videos = 0, annotated = 0, organized = 0;

  for (const t of tests) {
    if (!t.issueKey || !t.caseId) continue;
    const dest = path.join(preuvesDir, t.issueKey, t.caseId);
    fs.mkdirSync(dest, { recursive: true });
    organized++;

    // journey.json
    const jPath = path.join(journeyDir, `${safe(t.canonicalId)}.json`);
    const journey = readJson(jPath, {});
    if (fs.existsSync(jPath)) fs.copyFileSync(jPath, path.join(dest, 'journey.json'));

    // Vidéo webm → mp4
    const video = t.attachments.find((a) => (a.contentType || '').includes('video') || /\.webm$/.test(a.path || ''));
    if (video && video.path && fs.existsSync(video.path)) {
      const mp4 = path.join(dest, 'journey.mp4');
      if (sh(`ffmpeg -y -i "${video.path}" -c:v libx264 -preset veryfast -crf 26 -pix_fmt yuv420p -movflags +faststart "${mp4}"`)) videos++;
    }
    // Trace
    const trace = t.attachments.find((a) => /\.zip$/.test(a.path || '') || (a.name || '') === 'trace');
    if (trace && trace.path && fs.existsSync(trace.path)) fs.copyFileSync(trace.path, path.join(dest, 'trace.zip'));

    // Screenshot (preuve) — la dernière capture png
    const shot = [...t.attachments].reverse().find((a) => /\.png$/.test(a.path || '') || (a.contentType || '').includes('png'));
    let shotDst = null;
    if (shot && shot.path && fs.existsSync(shot.path)) {
      shotDst = path.join(dest, 'screenshot.png');
      fs.copyFileSync(shot.path, shotDst);
    }

    // Classification bug
    const st = journey.status || t.status;
    let severity = null;
    if (st === 'blocked-flow') severity = journey.severity || 'bloquant';
    else if (st === 'assertion-low') severity = journey.severity || 'moyen';
    else if (t.status === 'failed' || t.status === 'timedOut') severity = 'bloquant';
    // blocked-data = manque de données, pas un bug applicatif → info, pas annoté en rouge

    if (severity && shotDst) {
      const caption = (journey.blocker && journey.blocker.reason)
        || `Assertion non satisfaite (${(journey.assertion||{}).met||0}/${(journey.assertion||{}).total||0}) - ${t.caseId}`;
      const annPath = path.join(dest, 'screenshot-annotated.png');
      if (annotate(shotDst, annPath, severity, caption)) annotated++;
      bugs.push({
        issueKey: t.issueKey, caseId: t.caseId, canonicalId: t.canonicalId,
        module: journey.module || '', priority: journey.priority || '', scenario: journey.scenario || '',
        severity, statut: st,
        blockerStep: journey.blocker ? journey.blocker.step : null,
        descriptionFonctionnelle: journey.scenario || t.title,
        descriptionTechnique: (journey.blocker && journey.blocker.reason) || `Étapes ${journey.progressedSteps||0}/${journey.totalSteps||0}, assertions ${(journey.assertion||{}).met||0}/${(journey.assertion||{}).total||0}`,
        rg: (journey.rules || []).join(', '),
        preuve: path.relative(rootDir, path.join(dest, 'screenshot-annotated.png')),
        video: path.relative(rootDir, path.join(dest, 'journey.mp4')),
      });
    }
  }

  // Catalogue de bugs
  const order = { bloquant: 0, moyen: 1, mineur: 2 };
  bugs.sort((a, b) => (order[a.severity] - order[b.severity]) || a.issueKey.localeCompare(b.issueKey));
  fs.writeFileSync(path.join(pipelineDir, 'bug-catalog.json'), JSON.stringify({ generatedAt: new Date().toISOString(), total: bugs.length, bugs }, null, 2));

  const headers = ['issueKey', 'caseId', 'severity', 'statut', 'module', 'priority', 'scenario', 'descriptionTechnique', 'rg', 'preuve', 'video'];
  const csv = [headers.join(',')].concat(bugs.map((b) => headers.map((h) => `"${String(b[h] ?? '').replace(/"/g, '""')}"`).join(',')));
  fs.writeFileSync(path.join(pipelineDir, 'bug-catalog.csv'), csv.join('\n') + '\n');

  const bySev = bugs.reduce((a, b) => { a[b.severity] = (a[b.severity] || 0) + 1; return a; }, {});
  console.log(`Preuves organisées: ${organized} cas · MP4: ${videos} · annotées: ${annotated}`);
  console.log(`Bugs: ${bugs.length} (bloquant=${bySev.bloquant||0}, moyen=${bySev.moyen||0}, mineur=${bySev.mineur||0})`);
}

main();
