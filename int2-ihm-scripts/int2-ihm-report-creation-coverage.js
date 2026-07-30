const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const profilePath = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'create-flow-profile.json');
const outputPath = path.join(rootDir, 'int2-ihm-recordings', 'INT2_CREATION_COVERAGE_STATUS.md');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function statusForProfile(profile) {
  if (profile.status !== 'profiled') return 'not-profiled';
  if (!profile.createOpened) return 'create-not-opened';
  return 'semantic-create-executed-safe-mode';
}

function nextStepForProfile(profile) {
  if (profile.status !== 'profiled') return 'Fix route or discovery/profile errors.';
  if ((profile.requiredCount || 0) === 0) return 'Optional: map final submit success criteria for page-style create routes.';
  return 'Optional: add controlled submit plus rollback/cleanup for destructive validation.';
}

const payload = readJson(profilePath);
const profiles = Array.isArray(payload.profiles) ? payload.profiles : [];

const lines = [];
lines.push('# INT2 Creation Coverage Status');
lines.push('');
lines.push(`- Generated at: ${new Date().toISOString()}`);
lines.push(`- Source: int2-ihm-recordings/int2-autonomous/create-flow-profile.json`);
lines.push(`- Create-capable URLs profiled: ${profiles.length}`);
lines.push('- Meaning of current status: create entrypoint was opened, semantically understood, and exercised in safe mode without final submit.');
lines.push('');
lines.push('| URL | Container | Fields | Required | Current Coverage | Next Step |');
lines.push('|---|---|---:|---:|---|---|');
for (const p of profiles) {
  lines.push(`| ${p.url} | ${p.container || 'unknown'} | ${p.fieldCount || 0} | ${p.requiredCount || 0} | ${statusForProfile(p)} | ${nextStepForProfile(p)} |`);
}

fs.writeFileSync(outputPath, `${lines.join('\n')}\n`, 'utf8');
console.log(`INT2 creation coverage report generated: ${outputPath}`);
