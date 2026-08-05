/**
 * INT2 / Orion — Full Automation Video Concatenator
 *
 * Concatenates every per-test-case "journey.mp4" evidence video (produced by
 * orion-evidence-organize.js under mon-espace/.../preuves/<ISSUE>/<CASE>/journey.mp4)
 * into a SINGLE full-length MP4 that plays the whole automation run end-to-end,
 * with embedded chapter markers (one chapter per test case) so a viewer (VLC,
 * QuickTime, most browsers) can jump directly to any scenario.
 *
 * Ordering: uses int2-ihm-recordings/orion-pipeline/hybrid-report.json (the same
 * order as the Excel matrix / RAPPORT_HYBRIDE.md) when available, so the final
 * video follows the functional/module order (MP1 -> MP6). Falls back to a
 * lexicographic file scan otherwise.
 *
 * Output:
 *  - <outDir>/FULL_AUTOMATION_VIDEO.mp4          (single concatenated video)
 *  - <outDir>/FULL_AUTOMATION_VIDEO.chapters.json (chapter list: title, start/end seconds, source)
 *  - <outDir>/FULL_AUTOMATION_VIDEO.chapters.txt  (ffmpeg FFMETADATA chapters, embedded in the mp4)
 *  - <outDir>/INT2_VIDEO_CONCAT_REPORT.md         (human summary)
 *
 * Usage:
 *   node int2-ihm-scripts/int2-ihm-video-concat.js
 *   INT2_CONCAT_PREUVES_DIR=... INT2_CONCAT_OUT_DIR=... node int2-ihm-scripts/int2-ihm-video-concat.js
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const preuvesDir = path.resolve(
  process.env.INT2_CONCAT_PREUVES_DIR ||
    path.join(rootDir, 'mon-espace', 'recette-sprints-11-12-13', 'livrables-opencode', 'preuves'),
);
const hybridReportFile = path.join(rootDir, 'int2-ihm-recordings', 'orion-pipeline', 'hybrid-report.json');
const outDir = path.resolve(process.env.INT2_CONCAT_OUT_DIR || path.join(rootDir, 'int2-ihm-recordings', 'orion-pipeline'));
const outMp4 = path.join(outDir, 'FULL_AUTOMATION_VIDEO.mp4');
const chaptersJson = path.join(outDir, 'FULL_AUTOMATION_VIDEO.chapters.json');
const chaptersTxt = path.join(outDir, 'FULL_AUTOMATION_VIDEO.chapters.txt');
const reportMd = path.join(outDir, 'INT2_VIDEO_CONCAT_REPORT.md');
const concatListFile = path.join(outDir, '.concat-list.tmp.txt');
const noChaptersMp4 = path.join(outDir, '.concat-no-chapters.tmp.mp4');

function safeReadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function ffprobeDurationSeconds(file) {
  const res = spawnSync('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    file,
  ]);
  const out = String(res.stdout || '').trim();
  const n = Number(out);
  return Number.isFinite(n) ? n : 0;
}

function findAllJourneyVideos() {
  const found = [];
  if (!fs.existsSync(preuvesDir)) return found;
  const issues = fs.readdirSync(preuvesDir).filter((f) => fs.statSync(path.join(preuvesDir, f)).isDirectory());
  for (const issue of issues) {
    const issueDir = path.join(preuvesDir, issue);
    const cases = fs.readdirSync(issueDir).filter((f) => fs.statSync(path.join(issueDir, f)).isDirectory());
    for (const caseId of cases) {
      const mp4 = path.join(issueDir, caseId, 'journey.mp4');
      if (fs.existsSync(mp4)) {
        found.push({ issueKey: issue, caseId, file: mp4 });
      }
    }
  }
  return found;
}

function orderVideos(videos) {
  const hybrid = safeReadJson(hybridReportFile);
  const rows = Array.isArray(hybrid?.rows) ? hybrid.rows : [];
  if (rows.length === 0) {
    return videos.sort((a, b) => (a.issueKey + a.caseId).localeCompare(b.issueKey + b.caseId));
  }

  const orderIndex = new Map();
  rows.forEach((r, idx) => orderIndex.set(`${r.issueKey}::${r.caseId}`, { idx, scenario: r.scenario, module: r.module, status: r.status }));

  const byKey = new Map(videos.map((v) => [`${v.issueKey}::${v.caseId}`, v]));
  const ordered = [];
  const usedKeys = new Set();

  const sortedKeys = Array.from(orderIndex.keys()).sort((a, b) => orderIndex.get(a).idx - orderIndex.get(b).idx);
  for (const key of sortedKeys) {
    const v = byKey.get(key);
    if (v) {
      const meta = orderIndex.get(key);
      ordered.push({ ...v, scenario: meta.scenario, module: meta.module, status: meta.status });
      usedKeys.add(key);
    }
  }

  // Append any remaining videos not present in the hybrid report (safety net).
  for (const v of videos) {
    const key = `${v.issueKey}::${v.caseId}`;
    if (!usedKeys.has(key)) ordered.push(v);
  }

  return ordered;
}

function escapeConcatPath(p) {
  return p.replace(/'/g, "'\\''");
}

function msToFfmetadataTimebase(seconds) {
  // FFMETADATA chapters use TIMEBASE=1/1000 (milliseconds) here for simplicity.
  return Math.round(seconds * 1000);
}

function run() {
  fs.mkdirSync(outDir, { recursive: true });

  const rawVideos = findAllJourneyVideos();
  if (rawVideos.length === 0) {
    console.error(`No journey.mp4 evidence videos found under: ${preuvesDir}`);
    console.error('Run the pipeline (npm run orion:pipeline:run) and evidence organizer first.');
    process.exit(1);
  }

  const videos = orderVideos(rawVideos);

  console.log(`Found ${videos.length} evidence video(s). Probing durations...`);
  const withDurations = videos.map((v) => ({ ...v, duration: ffprobeDurationSeconds(v.file) })).filter((v) => v.duration > 0);

  const skipped = videos.length - withDurations.length;
  if (skipped > 0) console.warn(`Skipped ${skipped} video(s) with unreadable/zero duration.`);

  // Build concat demuxer list.
  const listLines = withDurations.map((v) => `file '${escapeConcatPath(v.file)}'`);
  fs.writeFileSync(concatListFile, `${listLines.join('\n')}\n`, 'utf8');

  // Compute chapters (cumulative offsets).
  let cursor = 0;
  const chapters = withDurations.map((v) => {
    const start = cursor;
    const end = cursor + v.duration;
    cursor = end;
    return {
      title: `${v.issueKey} - ${v.caseId}${v.scenario ? `: ${v.scenario}` : ''}`,
      issueKey: v.issueKey,
      caseId: v.caseId,
      module: v.module || null,
      status: v.status || null,
      startSeconds: Number(start.toFixed(3)),
      endSeconds: Number(end.toFixed(3)),
      durationSeconds: Number(v.duration.toFixed(3)),
      sourceFile: path.relative(rootDir, v.file),
    };
  });
  const totalDuration = cursor;

  // Attempt fast concat with stream copy first (works when all inputs share codec/params).
  console.log('Concatenating videos (stream copy, fast path)...');
  let concatOk = false;
  try {
    execSync(
      `ffmpeg -y -f concat -safe 0 -i "${concatListFile}" -c copy "${noChaptersMp4}"`,
      { stdio: 'pipe' },
    );
    concatOk = true;
  } catch (err) {
    console.warn('Stream-copy concat failed, falling back to re-encode concat (slower)...');
  }

  if (!concatOk) {
    try {
      execSync(
        `ffmpeg -y -f concat -safe 0 -i "${concatListFile}" -c:v libx264 -preset veryfast -crf 23 -pix_fmt yuv420p -movflags +faststart "${noChaptersMp4}"`,
        { stdio: 'pipe' },
      );
      concatOk = true;
    } catch (err2) {
      console.error('Re-encode concat also failed:', String(err2.message || err2));
      process.exit(1);
    }
  }

  // Build FFMETADATA chapters file and remux (fast, metadata-only pass).
  const metaLines = [';FFMETADATA1'];
  for (const c of chapters) {
    metaLines.push('[CHAPTER]');
    metaLines.push('TIMEBASE=1/1000');
    metaLines.push(`START=${msToFfmetadataTimebase(c.startSeconds)}`);
    metaLines.push(`END=${msToFfmetadataTimebase(c.endSeconds)}`);
    metaLines.push(`title=${c.title.replace(/[\r\n]/g, ' ')}`);
  }
  fs.writeFileSync(chaptersTxt, `${metaLines.join('\n')}\n`, 'utf8');

  console.log('Embedding chapter markers...');
  try {
    execSync(
      `ffmpeg -y -i "${noChaptersMp4}" -i "${chaptersTxt}" -map_metadata 1 -codec copy "${outMp4}"`,
      { stdio: 'pipe' },
    );
  } catch (err) {
    console.warn('Chapter embedding failed, keeping video without chapters.');
    fs.copyFileSync(noChaptersMp4, outMp4);
  }

  fs.rmSync(noChaptersMp4, { force: true });
  fs.rmSync(concatListFile, { force: true });

  const chaptersPayload = {
    generatedAt: new Date().toISOString(),
    sourcePreuvesDir: path.relative(rootDir, preuvesDir),
    outputVideo: path.relative(rootDir, outMp4),
    totalDurationSeconds: Number(totalDuration.toFixed(3)),
    videoCount: chapters.length,
    chapters,
  };
  fs.writeFileSync(chaptersJson, `${JSON.stringify(chaptersPayload, null, 2)}\n`, 'utf8');

  const mm = Math.floor(totalDuration / 60);
  const ss = Math.round(totalDuration % 60);
  const lines = [];
  lines.push('# INT2 Full Automation Video — Concatenation Report');
  lines.push('');
  lines.push(`- Generated at: ${chaptersPayload.generatedAt}`);
  lines.push(`- Source evidence videos: ${chaptersPayload.videoCount} (from ${chaptersPayload.sourcePreuvesDir})`);
  lines.push(`- Output video: ${chaptersPayload.outputVideo}`);
  lines.push(`- Total duration: ${mm}m${String(ss).padStart(2, '0')}s`);
  lines.push(`- Chapters embedded: ${chapters.length > 0 ? 'yes (playable in VLC/QuickTime/most browsers)' : 'no'}`);
  lines.push('');
  lines.push('## Chapter list (first 25)');
  lines.push('');
  lines.push('| # | Start | Issue | Case | Module | Status |');
  lines.push('|---:|---|---|---|---|---|');
  for (const [i, c] of chapters.slice(0, 25).entries()) {
    const m = Math.floor(c.startSeconds / 60);
    const s = Math.round(c.startSeconds % 60);
    lines.push(`| ${i + 1} | ${m}:${String(s).padStart(2, '0')} | ${c.issueKey} | ${c.caseId} | ${c.module || '-'} | ${c.status || '-'} |`);
  }
  if (chapters.length > 25) lines.push(`\n_... and ${chapters.length - 25} more chapters, see FULL_AUTOMATION_VIDEO.chapters.json_`);
  fs.writeFileSync(reportMd, `${lines.join('\n')}\n`, 'utf8');

  console.log(`\nFull automation video created: ${outMp4}`);
  console.log(`Total duration: ${mm}m${String(ss).padStart(2, '0')}s (${chapters.length} chapters)`);
  console.log(`Chapters manifest: ${chaptersJson}`);
  console.log(`Report: ${reportMd}`);
}

run();
