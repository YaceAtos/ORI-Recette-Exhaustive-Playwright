const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const rootDir = path.resolve(__dirname, '..');
const semanticsFile = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'create-flow-semantics.json');
const pageAgentsDir = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'page-agents');
const outDir = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous');
const outJson = path.join(outDir, 'continuous-learning-report.json');
const outMd = path.join(outDir, 'INT2_CONTINUOUS_LEARNING_REPORT.md');
const learnedYaml = path.join(rootDir, 'int2-ihm-knowledge', 'semantic', 'autonomous-learned-suggestions.yaml');

function safeReadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function detectIntent(label) {
  const v = normalize(label);
  if (!v) return null;
  if (/prenom/.test(v)) return 'person.first_name';
  if (/nom/.test(v)) return 'person.last_name';
  if (/mail|email/.test(v)) return 'person.email';
  if (/telephone|tel\b|mobile/.test(v)) return 'person.phone';
  if (/siren/.test(v)) return 'company.siren';
  if (/siret/.test(v)) return 'company.siret';
  if (/raison sociale|societe/.test(v)) return 'company.name';
  if (/date/.test(v)) return 'core.date';
  if (/code postal|cp\b/.test(v)) return 'address.postal_code';
  if (/ville/.test(v)) return 'address.city';
  return null;
}

function addAlias(map, intent, alias, routeId) {
  if (!intent || !alias) return;
  if (!map[intent]) map[intent] = {};
  const key = normalize(alias);
  if (!key || key.length < 2) return;
  if (!map[intent][key]) {
    map[intent][key] = { count: 0, routes: new Set() };
  }
  map[intent][key].count += 1;
  if (routeId) map[intent][key].routes.add(routeId);
}

function addFromSemantics(aliasMap) {
  const semantics = safeReadJson(semanticsFile);
  const profiles = Array.isArray(semantics?.profiles) ? semantics.profiles : [];
  for (const profile of profiles) {
    const routeId = profile.id || profile.url || 'unknown';
    const fields = Array.isArray(profile.semanticFields) ? profile.semanticFields : [];
    for (const field of fields) {
      const intent = detectIntent(field.label) || field.intent || null;
      addAlias(aliasMap, intent, field.label, routeId);
      addAlias(aliasMap, intent, field.placeholder, routeId);
    }
  }
}

function addFromPageAgents(aliasMap) {
  if (!fs.existsSync(pageAgentsDir)) return;
  const files = fs.readdirSync(pageAgentsDir).filter((f) => f.endsWith('.json'));
  for (const fileName of files) {
    const payload = safeReadJson(path.join(pageAgentsDir, fileName));
    if (!payload || !payload.success || !payload.extract) continue;
    const routeId = payload.pageId || 'unknown';
    const fields = Array.isArray(payload.extract.fields) ? payload.extract.fields : [];
    for (const field of fields) {
      const intent = detectIntent(field.label) || detectIntent(field.ariaLabel) || null;
      addAlias(aliasMap, intent, field.label, routeId);
      addAlias(aliasMap, intent, field.ariaLabel, routeId);
      addAlias(aliasMap, intent, field.placeholder, routeId);
    }
  }
}

const aliasMap = {};
addFromSemantics(aliasMap);
addFromPageAgents(aliasMap);

const intents = Object.keys(aliasMap).sort((a, b) => a.localeCompare(b));
const suggestionPayload = {
  generatedAt: new Date().toISOString(),
  source: 'continuous-learning-agent',
  intents: {},
};

let aliasCount = 0;
for (const intent of intents) {
  const aliases = Object.entries(aliasMap[intent])
    .map(([alias, meta]) => ({
      alias,
      count: meta.count,
      routeCount: meta.routes.size,
      routes: Array.from(meta.routes).sort((a, b) => a.localeCompare(b)).slice(0, 10),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 40);

  if (aliases.length > 0) {
    suggestionPayload.intents[intent] = aliases;
    aliasCount += aliases.length;
  }
}

const yamlDoc = {
  generated_at: suggestionPayload.generatedAt,
  source: suggestionPayload.source,
  learned_aliases: Object.fromEntries(
    Object.entries(suggestionPayload.intents).map(([intent, aliases]) => [
      intent,
      aliases.map((a) => ({ alias: a.alias, count: a.count, route_count: a.routeCount })),
    ]),
  ),
};

fs.mkdirSync(path.dirname(learnedYaml), { recursive: true });
fs.writeFileSync(learnedYaml, `${yaml.dump(yamlDoc, { noRefs: true, lineWidth: -1 })}\n`, 'utf8');

const report = {
  generatedAt: suggestionPayload.generatedAt,
  learnedIntents: Object.keys(suggestionPayload.intents).length,
  learnedAliases: aliasCount,
  outputYaml: path.relative(rootDir, learnedYaml),
  intents: suggestionPayload.intents,
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

const lines = [];
lines.push('# INT2 Continuous Learning Report');
lines.push('');
lines.push(`- Generated at: ${report.generatedAt}`);
lines.push(`- Learned intents: ${report.learnedIntents}`);
lines.push(`- Learned aliases: ${report.learnedAliases}`);
lines.push(`- YAML output: ${report.outputYaml}`);
lines.push('');
lines.push('| Intent | Alias Count |');
lines.push('|---|---:|');
for (const [intent, aliases] of Object.entries(report.intents)) {
  lines.push(`| ${intent} | ${aliases.length} |`);
}

fs.writeFileSync(outMd, `${lines.join('\n')}\n`, 'utf8');

console.log(`INT2 continuous learning report generated: ${outJson}`);
console.log(`INT2 continuous learning markdown generated: ${outMd}`);
console.log(`INT2 learned semantic YAML generated: ${learnedYaml}`);
