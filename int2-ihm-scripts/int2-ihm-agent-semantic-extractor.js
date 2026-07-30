const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const testsDir = path.join(rootDir, 'int2-ihm-tests');
const outputFile = path.join(rootDir, 'int2-ihm-recordings', 'INT2_SEMANTIC_PAGES.md');

const testFiles = fs.readdirSync(testsDir)
  .filter((fileName) => fileName.endsWith('.spec.ts'))
  .map((fileName) => path.join(testsDir, fileName));

const lines = [];
lines.push('# INT2 Semantic Page Extraction');
lines.push('');
lines.push(`- Generated at: ${new Date().toISOString()}`);
lines.push('');

for (const filePath of testFiles) {
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf8');
  const rel = path.relative(rootDir, filePath).replaceAll('\\\\', '/');

  const urlMatches = [...content.matchAll(/https:\/\/orion-int2\.itsap\.net[^'"\s)]*/g)].map((m) => m[0]);
  const routeMatches = [...content.matchAll(/routes\.([A-Za-z0-9_]+)/g)].map((m) => m[1]);
  const issueMatches = [...content.matchAll(/\bORI-\d+\b/g)].map((m) => m[0]);
  const titleMatches = [...content.matchAll(/heading\s*\(\s*\{\s*name:\s*'([^']+)'/g)].map((m) => m[1]);
  const searchMatches = [...content.matchAll(/Rechercher un collaborateur/g)].length;
  const createMatches = [...content.matchAll(/name:\s*'Créer'/g)].length;

  lines.push(`## ${rel}`);
  lines.push('');
  lines.push('- URLs INT2:');
  if (urlMatches.length === 0) {
    lines.push('  - none');
  } else {
    for (const url of Array.from(new Set(urlMatches))) {
      lines.push(`  - ${url}`);
    }
  }

  lines.push('- Semantic UI anchors:');
  for (const title of Array.from(new Set(titleMatches))) {
    lines.push(`  - heading: ${title}`);
  }
  lines.push(`  - search box usage count: ${searchMatches}`);
  lines.push(`  - create button usage count: ${createMatches}`);
  lines.push(`  - route helpers: ${Array.from(new Set(routeMatches)).join(', ') || 'none'}`);
  lines.push(`  - Jira issues: ${Array.from(new Set(issueMatches)).join(', ') || 'none'}`);
  lines.push('');
}

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, `${lines.join('\n')}\n`, 'utf8');
console.log(`INT2 semantic extraction generated: ${outputFile}`);
