const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const PptxGenJS = require('pptxgenjs');

const rootDir = path.resolve(__dirname, '..');
const recordingsRoot = path.join(rootDir, 'int2-ihm-recordings');
const recordingsDir = path.join(recordingsRoot, 'chains');
const outputPptx = path.join(recordingsDir, 'ORION_EXHAUSTIVE_E2E_REPORT_FR.pptx');

const blockerShot = path.join(
  rootDir,
  'int2-ihm-test-results',
  'transverse-complet-of-pap--371c7-r-OF-→-Créer-PAP-→-Vérifier',
  'test-failed-1.png'
);
const blockerContext = path.join(
  rootDir,
  'int2-ihm-test-results',
  'transverse-complet-of-pap--371c7-r-OF-→-Créer-PAP-→-Vérifier',
  'error-context.md'
);

function walkFiles(dir, collector = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, collector);
    } else {
      collector.push(full);
    }
  }
  return collector;
}

const allRecordingFiles = walkFiles(recordingsRoot, []);

const allMp4Files = allRecordingFiles
  .filter((f) => f.toLowerCase().endsWith('.mp4'))
  .sort();

const manifestFiles = allRecordingFiles
  .filter((f) => f.toLowerCase().endsWith('.json') && f.includes(`${path.sep}chains${path.sep}`))
  .sort();

const markdownFiles = allRecordingFiles
  .filter((f) => f.toLowerCase().endsWith('.md'))
  .sort();

if (allMp4Files.length === 0) {
  console.error('Aucun MP4 trouve dans int2-ihm-recordings/.');
  process.exit(1);
}

const manifests = manifestFiles.map((file) => JSON.parse(fs.readFileSync(file, 'utf8')));
const manifestByMp4 = new Map();
for (const m of manifests) {
  manifestByMp4.set(path.resolve(rootDir, m.mp4), m);
}

function safeRead(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function firstPngUnder(dirPath) {
  if (!dirPath || !fs.existsSync(dirPath)) return null;
  const stack = [dirPath];
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile() && full.toLowerCase().endsWith('.png')) {
        return full;
      }
    }
  }
  return null;
}

function ffprobeDurationSeconds(videoPath) {
  try {
    const out = execFileSync('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      videoPath,
    ], { encoding: 'utf8' }).trim();
    const num = Number(out);
    return Number.isFinite(num) ? num : null;
  } catch {
    return null;
  }
}

function scenarioMeta(mp4Path) {
  const key = mp4Path.toLowerCase();
  if (key.includes(`${path.sep}int2${path.sep}`)) {
    return {
      title: 'INT2 - Suite collaborateurs',
      scope: [
        'Validation affichage colonnes/lignes collaborateurs',
        'Recherche nominative et reduction dataset',
        'Validation message erreur + fermeture modale',
      ],
      suite: 'int2',
    };
  }
  if (key.includes(`${path.sep}exhaustive${path.sep}`)) {
    return {
      title: 'Exhaustive legacy - Suite transverse historique',
      scope: [
        'Run historique CU PAP wizard',
        'Run historique annulation intervention',
        'Run historique test transverse PAP',
      ],
      suite: 'exhaustive',
    };
  }
  if (key.includes('planning-annulation')) {
    return {
      title: 'Chaîne 1 - PP domicile (Planning + Annulation)',
      scope: [
        'Ouverture planning et consultation intervention',
        'Flux annulation + choix de motif',
        'Retour stable sur planning',
      ],
      suite: 'chains',
    };
  }
  if (key.includes('collaborateurs-filtres')) {
    return {
      title: 'Chaîne 2 - Pro multi-sites (Collaborateurs + Filtres)',
      scope: [
        'Recherche multi-passes collaborateurs',
        'Validation contenu du tableau',
        'Reset filtres et stabilite listing',
      ],
      suite: 'chains',
    };
  }
  return {
    title: 'Chaîne 3 - SAAD transverse (Create + Error Recovery)',
    scope: [
      'Ouverture flux Create',
      'Erreur backend visible et qualifiee',
      'Reprise utilisateur et stabilite post-erreur',
    ],
    suite: 'chains',
  };
}

function fileUrl(absPath) {
  return `file://${absPath}`;
}

const discoveredVideos = allMp4Files.map((videoPath) => {
  const abs = path.resolve(videoPath);
  const manifest = manifestByMp4.get(abs) || null;
  const duration = manifest ? Number(manifest.duration_seconds || 0) : ffprobeDurationSeconds(abs);
  const chapterDir = manifest ? path.resolve(rootDir, manifest.chapter_screenshots_dir || '') : null;
  const chapterPreview = chapterDir ? firstPngUnder(chapterDir) : null;
  const chapterCount = manifest ? Number(manifest.chapter_screenshots_count || 0) : 0;
  const meta = scenarioMeta(videoPath);
  const rel = path.relative(rootDir, videoPath).replaceAll('\\', '/');
  return {
    rel,
    abs,
    suite: meta.suite,
    title: meta.title,
    scope: meta.scope,
    duration: Number.isFinite(duration) ? duration : null,
    chapterPreview,
    chapterCount,
    manifest,
  };
});

const totalDuration = discoveredVideos.reduce((acc, v) => acc + (v.duration || 0), 0);
const totalChapters = discoveredVideos.reduce((acc, v) => acc + (v.chapterCount || 0), 0);
const avgDuration = discoveredVideos.length > 0 ? totalDuration / discoveredVideos.length : 0;

const bySuite = discoveredVideos.reduce((acc, v) => {
  acc[v.suite] = (acc[v.suite] || 0) + 1;
  return acc;
}, {});

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE';
pptx.author = 'Copilot - Orion E2E';
pptx.subject = 'Rapport exhaustif E2E Orion';
pptx.title = 'Rapport Exhaustif Orion - Tests E2E';
pptx.company = 'OuiCare / Orion';

const colors = {
  bg: 'F7F9FC',
  primary: '0B1F3A',
  accent: '0EA5E9',
  success: '0F766E',
  warning: 'B45309',
  muted: '475569',
  light: 'E2E8F0',
};

function decorate(slide, title, subtitle) {
  slide.background = { color: colors.bg };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.8, fill: { color: colors.primary }, line: { color: colors.primary } });
  slide.addText(title, { x: 0.4, y: 0.18, w: 8.8, h: 0.35, color: 'FFFFFF', bold: true, fontSize: 18, fontFace: 'Aptos' });
  if (subtitle) {
    slide.addText(subtitle, { x: 0.4, y: 0.58, w: 9.8, h: 0.22, color: 'D1D5DB', fontSize: 10, fontFace: 'Aptos' });
  }
}

// Slide 1 - Couverture globale
{
  const slide = pptx.addSlide();
  decorate(slide, 'Rapport Exhaustif E2E Orion', 'Synthese complete, videos, KPI, couverture et bloquants');

  slide.addText('Livrable visuel complet', {
    x: 0.6,
    y: 1.1,
    w: 6.4,
    h: 0.5,
    color: colors.primary,
    bold: true,
    fontSize: 26,
    fontFace: 'Aptos Display',
  });

  slide.addText(`Date generation: ${new Date().toISOString()}`, {
    x: 0.6,
    y: 1.7,
    w: 5.5,
    h: 0.25,
    color: colors.muted,
    fontSize: 12,
    fontFace: 'Aptos',
  });

  const cards = [
    { label: 'Videos incluses', value: `${discoveredVideos.length}`, color: colors.accent },
    { label: 'Duree totale video', value: `${totalDuration.toFixed(2)} s`, color: colors.success },
    { label: 'Chapitres captures', value: `${totalChapters}`, color: colors.warning },
    { label: 'Couverture metier stricte', value: '3/45 (6.67%)', color: 'DC2626' },
  ];

  cards.forEach((card, i) => {
    const x = 0.6 + i * 3.1;
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 2.2,
      w: 2.8,
      h: 1.35,
      rectRadius: 0.08,
      fill: { color: 'FFFFFF' },
      line: { color: colors.light },
      shadow: { type: 'outer', color: 'CBD5E1', blur: 3, angle: 45, distance: 2, opacity: 0.2 },
    });
    slide.addText(card.label, { x: x + 0.2, y: 2.45, w: 2.4, h: 0.22, color: colors.muted, fontSize: 10, fontFace: 'Aptos' });
    slide.addText(card.value, { x: x + 0.2, y: 2.75, w: 2.4, h: 0.45, color: card.color, bold: true, fontSize: 20, fontFace: 'Aptos Display' });
  });

  slide.addText(`Suites detectees: chains=${bySuite.chains || 0}, exhaustive=${bySuite.exhaustive || 0}, int2=${bySuite.int2 || 0}`, {
    x: 0.6,
    y: 3.85,
    w: 12.1,
    h: 0.3,
    color: colors.primary,
    fontSize: 12,
    fontFace: 'Aptos',
  });

  slide.addText('Ce deck contient chaque video MP4 disponible, les liens manifest/doc, les captures visuelles et les bloquants avec preuve.', {
    x: 0.6,
    y: 4.18,
    w: 12.1,
    h: 0.5,
    color: colors.primary,
    fontSize: 14,
    fontFace: 'Aptos',
  });
}

// Slides detaillees - Une slide par video detectee
for (const video of discoveredVideos) {
  const slide = pptx.addSlide();
  decorate(slide, video.title, `Suite: ${video.suite} | Resultat automation + evidence video + KPI`);

  if (video.chapterPreview && fs.existsSync(video.chapterPreview)) {
    slide.addImage({ path: video.chapterPreview, x: 0.6, y: 1.0, w: 6.9, h: 3.9 });
    slide.addShape(pptx.ShapeType.rect, { x: 0.6, y: 4.9, w: 6.9, h: 0.35, fill: { color: 'FFFFFF', transparency: 25 }, line: { color: colors.light } });
    slide.addText('Capture representative du run', { x: 0.8, y: 4.98, w: 6.3, h: 0.2, color: colors.primary, fontSize: 11, fontFace: 'Aptos' });
  } else {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.6,
      y: 1.0,
      w: 6.9,
      h: 3.9,
      rectRadius: 0.06,
      fill: { color: 'FFFFFF' },
      line: { color: colors.light },
    });
    slide.addText('Aucune capture chapitre disponible pour cette video.\nLe lien MP4 ci-contre permet la revue visuelle complete.', {
      x: 1.0,
      y: 2.3,
      w: 6.0,
      h: 1.0,
      color: colors.muted,
      fontSize: 13,
      fontFace: 'Aptos',
      align: 'center',
      breakLine: true,
    });
  }

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 7.8,
    y: 1.0,
    w: 4.9,
    h: 3.9,
    rectRadius: 0.08,
    fill: { color: 'FFFFFF' },
    line: { color: colors.light },
  });

  slide.addText('Perimetre fonctionnel demontre', {
    x: 8.05,
    y: 1.22,
    w: 4.4,
    h: 0.26,
    color: colors.primary,
    bold: true,
    fontSize: 13,
    fontFace: 'Aptos',
  });

  video.scope.forEach((line, idx) => {
    slide.addText(`• ${line}`, {
      x: 8.1,
      y: 1.6 + idx * 0.33,
      w: 4.3,
      h: 0.24,
      color: colors.muted,
      fontSize: 11,
      fontFace: 'Aptos',
    });
  });

  slide.addText(`Duree: ${video.duration !== null ? video.duration.toFixed(2) : 'N/A'} s`, { x: 8.1, y: 2.85, w: 2.3, h: 0.24, color: colors.success, bold: true, fontSize: 12, fontFace: 'Aptos' });
  slide.addText(`Chapitres: ${video.chapterCount}`, { x: 10.35, y: 2.85, w: 2.2, h: 0.24, color: colors.accent, bold: true, fontSize: 12, fontFace: 'Aptos' });

  const mp4Abs = video.abs;
  const mp4Text = path.basename(video.rel);
  slide.addText('Video du run (MP4):', { x: 8.1, y: 3.25, w: 4.1, h: 0.22, color: colors.primary, fontSize: 11, bold: true, fontFace: 'Aptos' });
  slide.addText(
    [{ text: mp4Text, options: { hyperlink: { url: fileUrl(mp4Abs) }, underline: true, color: '0EA5E9' } }],
    { x: 8.1, y: 3.48, w: 4.4, h: 0.42, fontSize: 10, fontFace: 'Aptos' }
  );

  if (video.manifest) {
    const manifestAbs = path.resolve(rootDir, video.rel.replace('.mp4', '.json'));
    slide.addText(
      [{ text: 'Manifest JSON associe', options: { hyperlink: { url: fileUrl(manifestAbs) }, underline: true, color: '0EA5E9' } }],
      { x: 8.1, y: 3.96, w: 4.4, h: 0.3, fontSize: 10, fontFace: 'Aptos' }
    );
  }

  slide.addText(`Genere le: ${video.manifest?.generated_at || 'N/A'}`, {
    x: 8.1,
    y: 4.35,
    w: 4.3,
    h: 0.22,
    color: colors.muted,
    fontSize: 9,
    fontFace: 'Aptos',
  });
}

// Slide blocker
{
  const slide = pptx.addSlide();
  decorate(slide, 'Bloquants Confirmes et Evidence', 'Blocages reels observes pendant les executions');

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.6,
    y: 1.0,
    w: 6.8,
    h: 4.1,
    rectRadius: 0.08,
    fill: { color: 'FFFFFF' },
    line: { color: colors.light },
  });

  if (fs.existsSync(blockerShot)) {
    slide.addImage({ path: blockerShot, x: 0.8, y: 1.2, w: 6.4, h: 3.6 });
  }

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 7.8,
    y: 1.0,
    w: 4.9,
    h: 4.1,
    rectRadius: 0.08,
    fill: { color: 'FFFFFF' },
    line: { color: colors.light },
  });

  const ctx = safeRead(blockerContext);
  const accessDenied = ctx.toLowerCase().includes('accessdenied') || ctx.toLowerCase().includes('access denied');

  const bullets = [
    'MP6 OF: AccessDenied observe lors du parcours complet OF -> PAP.',
    'Certaines routes plan-aide dev1 presentent une derive de donnees/acces.',
    'Connecteurs externes manquants dans ce repo: RRULE/Kafka/SIRENE/INS/DUI/DMP.',
    `Preuve AccessDenied: ${accessDenied ? 'Oui' : 'A verifier'}`,
  ];

  slide.addText('Diagnostic', { x: 8.05, y: 1.2, w: 4.4, h: 0.28, color: colors.primary, fontSize: 14, bold: true, fontFace: 'Aptos' });
  bullets.forEach((b, i) => {
    slide.addText(`• ${b}`, { x: 8.1, y: 1.55 + i * 0.55, w: 4.3, h: 0.45, color: colors.muted, fontSize: 11, fontFace: 'Aptos' });
  });

  if (fs.existsSync(blockerContext)) {
    slide.addText(
      [{ text: 'Ouvrir contexte erreur (error-context.md)', options: { hyperlink: { url: fileUrl(blockerContext) }, underline: true, color: '0EA5E9' } }],
      { x: 8.1, y: 3.95, w: 4.2, h: 0.3, fontSize: 10, fontFace: 'Aptos' }
    );
  }
}

// Slide inventaire videos (garantie anti-omission)
{
  const chunkSize = 10;
  const chunks = [];
  for (let i = 0; i < discoveredVideos.length; i += chunkSize) {
    chunks.push(discoveredVideos.slice(i, i + chunkSize));
  }

  chunks.forEach((chunk, chunkIdx) => {
    const slide = pptx.addSlide();
    decorate(slide, `Inventaire videos incluses (${chunkIdx + 1}/${chunks.length})`, 'Chaque MP4 present dans int2-ihm-recordings est reference ici');

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.7,
      y: 1.0,
      w: 12.0,
      h: 5.7,
      rectRadius: 0.08,
      fill: { color: 'FFFFFF' },
      line: { color: colors.light },
    });

    chunk.forEach((video, i) => {
      const y = 1.25 + i * 0.52;
      slide.addText(`• ${video.rel}`, {
        x: 0.95,
        y,
        w: 8.8,
        h: 0.25,
        color: colors.primary,
        fontSize: 10,
        fontFace: 'Aptos',
      });

      slide.addText(
        [{ text: 'Ouvrir MP4', options: { hyperlink: { url: fileUrl(video.abs) }, underline: true, color: '0EA5E9' } }],
        { x: 10.0, y, w: 1.2, h: 0.25, fontSize: 10, fontFace: 'Aptos' }
      );
    });
  });
}

// Slide liens docs/rapports importants
{
  const slide = pptx.addSlide();
  decorate(slide, 'Liens Importants (Docs + Rapports)', 'Aucun document critique omis');

  const importantPaths = [
    path.join(recordingsDir, 'OVERALL_DEMO_FUNCTIONAL_BREAKDOWN.md'),
    path.join(recordingsDir, 'OVERALL_COMPLETION_STATUS.md'),
    path.join(recordingsDir, 'RAPPORT_COUVERTURE_BLOQUANTS_KPI.md'),
    blockerContext,
    path.join(rootDir, 'playwright-report', 'index.html'),
  ].filter((p) => fs.existsSync(p));

  const finalDocList = [...new Set([...importantPaths, ...markdownFiles])];

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.7,
    y: 1.0,
    w: 12.0,
    h: 5.7,
    rectRadius: 0.08,
    fill: { color: 'FFFFFF' },
    line: { color: colors.light },
  });

  finalDocList.slice(0, 18).forEach((doc, i) => {
    const rel = path.relative(rootDir, doc).replaceAll('\\', '/');
    const y = 1.25 + i * 0.3;
    slide.addText(
      [{ text: rel, options: { hyperlink: { url: fileUrl(doc) }, underline: true, color: '0EA5E9' } }],
      { x: 1.0, y, w: 11.0, h: 0.24, fontSize: 10, fontFace: 'Aptos' }
    );
  });
}

// Slide synthese finale
{
  const slide = pptx.addSlide();
  decorate(slide, 'Synthese Finale et KPI', 'Vision globale pour decision metier et technique');

  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8,
    y: 1.1,
    w: 12.0,
    h: 4.8,
    rectRadius: 0.08,
    fill: { color: 'FFFFFF' },
    line: { color: colors.light },
  });

  slide.addText('KPI Globaux', { x: 1.1, y: 1.4, w: 3.0, h: 0.3, color: colors.primary, fontSize: 16, bold: true, fontFace: 'Aptos Display' });
  slide.addText(`• Videos incluses: ${discoveredVideos.length}\n• Duree totale video: ${totalDuration.toFixed(2)} s\n• Duree moyenne: ${avgDuration.toFixed(2)} s\n• Captures chapitres: ${totalChapters}\n• Couverture metier stricte: 3/45 (6.67%)`, {
    x: 1.1,
    y: 1.8,
    w: 5.4,
    h: 2.2,
    color: colors.muted,
    fontSize: 12,
    fontFace: 'Aptos',
    breakLine: true,
  });

  slide.addText('Commandes utiles', { x: 7.1, y: 1.4, w: 3.8, h: 0.3, color: colors.primary, fontSize: 16, bold: true, fontFace: 'Aptos Display' });
  slide.addText('• npm run test:full:exhaustive\n• npm run report:pptx:exhaustive\n• npx playwright show-report', {
    x: 7.1,
    y: 1.8,
    w: 4.8,
    h: 1.4,
    color: colors.muted,
    fontSize: 12,
    fontFace: 'Aptos',
    breakLine: true,
  });

  const reportMd = path.join(recordingsDir, 'RAPPORT_COUVERTURE_BLOQUANTS_KPI.md');
  if (fs.existsSync(reportMd)) {
    slide.addText(
      [{ text: 'Ouvrir rapport detaille Markdown', options: { hyperlink: { url: fileUrl(reportMd) }, underline: true, color: '0EA5E9' } }],
      { x: 7.1, y: 3.35, w: 4.9, h: 0.35, fontSize: 11, fontFace: 'Aptos' }
    );
  }

  slide.addText('Livrable: presentation exhaustive orientee lecture visuelle + actionnable (tests, preuves, KPI, blocages).', {
    x: 1.1,
    y: 4.7,
    w: 11.1,
    h: 0.45,
    color: colors.primary,
    bold: true,
    fontSize: 13,
    fontFace: 'Aptos',
  });
}

pptx.writeFile({ fileName: outputPptx })
  .then(() => {
    console.log(`PPTX genere: ${outputPptx}`);
  })
  .catch((err) => {
    console.error('Echec generation PPTX:', err);
    process.exit(1);
  });
