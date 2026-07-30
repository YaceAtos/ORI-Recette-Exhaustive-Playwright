const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous');
const indexFile = path.join(outDir, 'retrieval-index.json');
const outJson = path.join(outDir, 'knowledge-search-results.json');
const outMd = path.join(outDir, 'INT2_KNOWLEDGE_SEARCH_RESULTS.md');

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ' ')
    .replace(/[^a-z0-9\s/_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value) {
  return normalizeText(value)
    .split(/\s+/g)
    .filter((t) => t && t.length >= 2 && t.length <= 48);
}

function safeReadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function usageAndExit() {
  console.error('Usage: npm run agent:int2:knowledge:search -- "query terms"');
  console.error('or set env INT2_KNOWLEDGE_SEARCH_QUERY="query terms"');
  process.exit(1);
}

const index = safeReadJson(indexFile);
if (!index || !Array.isArray(index.documents) || !index.lexicon) {
  throw new Error(`Missing or invalid retrieval index: ${indexFile}`);
}

const query = process.env.INT2_KNOWLEDGE_SEARCH_QUERY || process.argv.slice(2).join(' ').trim();
if (!query) usageAndExit();

const topK = Math.max(1, Number(process.env.INT2_KNOWLEDGE_SEARCH_TOPK || '8'));
const queryTokens = tokenize(query);
if (queryTokens.length === 0) {
  throw new Error('Query has no usable tokens after normalization.');
}

const knowledgeDocs = index.documents.filter((doc) => {
  const kind = String(doc?.sourceKind || '');
  return kind === 'local-knowledge' || kind === 'external-loop-engineering';
});

const avgDocLen = index.meta?.averageTokenCount || 1;
const k1 = 1.2;
const b = 0.75;

const scores = [];
for (const doc of knowledgeDocs) {
  let score = 0;
  const matchedTokens = [];

  for (const token of queryTokens) {
    const tf = Number(doc.tf?.[token] || 0);
    if (tf <= 0) continue;

    const idf = Number(index.lexicon?.[token]?.idf || 0);
    const num = tf * (k1 + 1);
    const den = tf + k1 * (1 - b + b * (doc.tokenCount / avgDocLen));
    score += idf * (num / den);
    matchedTokens.push(token);
  }

  if (score > 0) {
    scores.push({
      id: doc.id,
      url: doc.url,
      brique: doc.brique,
      sourceKind: doc.sourceKind || null,
      sourcePath: doc.sourcePath || null,
      score: Number(score.toFixed(8)),
      matchedTokens,
    });
  }
}

scores.sort((a, b) => b.score - a.score);
const results = scores.slice(0, topK);

const payload = {
  generatedAt: new Date().toISOString(),
  query,
  queryTokens,
  sourceFilter: ['local-knowledge', 'external-loop-engineering'],
  totalMatches: scores.length,
  topK,
  results,
};

fs.writeFileSync(outJson, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

const lines = [];
lines.push('# INT2 Knowledge Search Results');
lines.push('');
lines.push(`- Generated at: ${payload.generatedAt}`);
lines.push(`- Query: ${query}`);
lines.push(`- Tokens: ${queryTokens.join(', ')}`);
lines.push(`- Source filter: ${payload.sourceFilter.join(', ')}`);
lines.push(`- Total matches: ${payload.totalMatches}`);
lines.push(`- Top K: ${topK}`);
lines.push('');
lines.push('| Rank | Doc ID | Source | Score | Path | Matched Tokens |');
lines.push('|---:|---|---|---:|---|---|');
for (let i = 0; i < results.length; i += 1) {
  const r = results[i];
  lines.push(`| ${i + 1} | ${r.id} | ${r.sourceKind || ''} | ${r.score.toFixed(4)} | ${r.sourcePath || ''} | ${r.matchedTokens.join(', ')} |`);
}

fs.writeFileSync(outMd, `${lines.join('\n')}\n`, 'utf8');

console.log(`INT2 knowledge search results generated: ${outJson}`);
console.log(`INT2 knowledge search report generated: ${outMd}`);
for (const r of results.slice(0, 5)) {
  console.log(`- ${r.id} (${r.score.toFixed(4)})`);
}
