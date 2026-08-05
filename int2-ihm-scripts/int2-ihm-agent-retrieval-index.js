const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const graphFile = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'state-graph.json');
const pageAgentsDir = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'page-agents');
const knowledgeDir = path.join(rootDir, 'int2-ihm-knowledge');
const externalLoopRepoDir = path.join(rootDir, 'external-repos', 'loop-engineering');
const docsDir = path.join(rootDir, 'docs');
const hybridReportFile = path.join(rootDir, 'int2-ihm-recordings', 'orion-pipeline', 'hybrid-report.json');
const outDir = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous');
const outIndex = path.join(outDir, 'retrieval-index.json');
const outCorpus = path.join(outDir, 'retrieval-corpus.ndjson');

function safeReadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

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

function toBrique(routeId) {
  const parts = String(routeId || '').split('/').filter(Boolean);
  return parts[0] || '_unknown';
}

function collectFilesRecursive(baseDir, exts, maxFiles = 200) {
  if (!fs.existsSync(baseDir)) return [];
  const out = [];
  const stack = [baseDir];

  while (stack.length > 0) {
    const current = stack.pop();
    let entries = [];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
        continue;
      }
      const low = entry.name.toLowerCase();
      if (exts.some((e) => low.endsWith(e))) {
        out.push(full);
        if (out.length >= maxFiles) return out;
      }
    }
  }

  return out;
}

function markdownToSignals(content) {
  return String(content || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/\[[^\]]+\]\([^\)]+\)/g, ' ')
    .replace(/[>#*_~|\-]{1,}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildKnowledgeDocuments() {
  const docs = [];
  const maxKnowledgeFiles = Number(process.env.INT2_KNOWLEDGE_MAX_FILES || '120');

  const localKnowledgeFiles = collectFilesRecursive(knowledgeDir, ['.md', '.yaml', '.yml'], maxKnowledgeFiles);
  for (const filePath of localKnowledgeFiles) {
    let content = '';
    try {
      content = fs.readFileSync(filePath, 'utf8');
    } catch {
      continue;
    }

    const rel = path.relative(rootDir, filePath);
    const signals = markdownToSignals(`${rel}\n${content}`);
    const tokens = tokenize(signals);
    if (tokens.length === 0) continue;

    const tf = {};
    for (const token of tokens) tf[token] = (tf[token] || 0) + 1;

    docs.push({
      id: `knowledge::${rel}`,
      url: `file://${rel}`,
      brique: 'knowledge',
      tokenCount: tokens.length,
      tf,
      signalsCount: 1,
      sourceKind: 'local-knowledge',
      sourcePath: rel,
    });
  }

  const externalDocsDir = path.join(externalLoopRepoDir, 'docs');
  const externalFiles = [
    path.join(externalLoopRepoDir, 'README.md'),
    ...collectFilesRecursive(externalDocsDir, ['.md'], 80),
  ].filter((p) => fs.existsSync(p));

  for (const filePath of externalFiles) {
    let content = '';
    try {
      content = fs.readFileSync(filePath, 'utf8');
    } catch {
      continue;
    }

    const rel = path.relative(rootDir, filePath);
    const signals = markdownToSignals(`${rel}\n${content}`);
    const tokens = tokenize(signals);
    if (tokens.length === 0) continue;

    const tf = {};
    for (const token of tokens) tf[token] = (tf[token] || 0) + 1;

    docs.push({
      id: `external::loop-engineering::${rel}`,
      url: `file://${rel}`,
      brique: 'external-loop-engineering',
      tokenCount: tokens.length,
      tf,
      signalsCount: 1,
      sourceKind: 'external-loop-engineering',
      sourcePath: rel,
    });
  }

  return docs;
}

function collectPageExtracts() {
  if (!fs.existsSync(pageAgentsDir)) return new Map();

  const files = fs.readdirSync(pageAgentsDir).filter((f) => f.endsWith('.json'));
  const map = new Map();

  for (const fileName of files) {
    const payload = safeReadJson(path.join(pageAgentsDir, fileName));
    if (!payload || !payload.pageId || !payload.success || !payload.extract) continue;
    map.set(payload.pageId, payload.extract);
  }
  return map;
}

function buildDocuments(graph, extracts) {
  const nodes = Array.isArray(graph?.nodes) ? graph.nodes : [];
  const docs = [];

  for (const node of nodes) {
    if (!node || !node.id || node.error) continue;

    const semantic = node.semantic && typeof node.semantic === 'object' ? node.semantic : {};
    const extract = extracts.get(node.id) || null;

    const signals = [];
    signals.push(node.id);
    signals.push(node.url || '');
    for (const h of semantic.headings || []) signals.push(h);
    for (const b of semantic.buttonLabels || []) signals.push(b);
    if (extract) {
      for (const h of extract.headings || []) signals.push(h.text || '');
      for (const b of extract.buttons || []) signals.push(b.text || '');
      for (const f of extract.fields || []) {
        signals.push(f.label || '');
        signals.push(f.placeholder || '');
        signals.push(f.ariaLabel || '');
        signals.push(f.name || '');
      }
      for (const d of extract.dialogs || []) signals.push(d.text || '');
      for (const a of extract.alerts || []) signals.push(a.text || '');
      for (const t of extract.visibleTextBlocks || []) signals.push(t);
    }

    const tokens = tokenize(signals.join(' '));
    const tf = {};
    for (const token of tokens) tf[token] = (tf[token] || 0) + 1;

    docs.push({
      id: node.id,
      url: node.url,
      brique: toBrique(node.id),
      tokenCount: tokens.length,
      tf,
      signalsCount: signals.length,
    });
  }
  return docs;
}

function buildLexicon(documents) {
  const N = documents.length;
  const df = {};

  for (const doc of documents) {
    const seen = new Set(Object.keys(doc.tf));
    for (const token of seen) df[token] = (df[token] || 0) + 1;
  }

  const lexicon = {};
  for (const [token, value] of Object.entries(df)) {
    const idf = Math.log(1 + (N - value + 0.5) / (value + 0.5));
    lexicon[token] = { df: value, idf: Number(idf.toFixed(8)) };
  }
  return lexicon;
}

function writeCorpus(documents) {
  const lines = documents.map((doc) => {
    const row = {
      id: doc.id,
      url: doc.url,
      brique: doc.brique,
      tokenCount: doc.tokenCount,
      tokens: Object.keys(doc.tf).slice(0, 120),
    };
    return JSON.stringify(row);
  });
  fs.writeFileSync(outCorpus, `${lines.join('\n')}\n`, 'utf8');
}

function buildDocsMapDocuments() {
  // Indexes the local functional "carte" (docs/*.md): domain tags, RG code prefixes,
  // known pitfalls. This is NOT the full functional detail (that lives on Confluence,
  // see buildHybridReportDocuments for the closest local substitute), but it gives
  // domain-routing signal (which MP/domain a query concept belongs to).
  const docs = [];
  if (!fs.existsSync(docsDir)) return docs;

  const files = fs
    .readdirSync(docsDir)
    .filter((f) => f.endsWith('.md') && f.toLowerCase() !== 'agents.md');

  for (const fileName of files) {
    const filePath = path.join(docsDir, fileName);
    let content = '';
    try {
      content = fs.readFileSync(filePath, 'utf8');
    } catch {
      continue;
    }

    const rel = path.relative(rootDir, filePath);
    const signals = markdownToSignals(`${rel}\n${content}`);
    const tokens = tokenize(signals);
    if (tokens.length === 0) continue;

    const tf = {};
    for (const token of tokens) tf[token] = (tf[token] || 0) + 1;

    docs.push({
      id: `docs-map::${fileName}`,
      url: `file://${rel}`,
      brique: 'docs-map',
      tokenCount: tokens.length,
      tf,
      signalsCount: 1,
      sourceKind: 'local-docs-map',
      sourcePath: rel,
    });
  }
  return docs;
}

function buildHybridReportDocuments() {
  // Indexes the hybrid-report.json (Excel <-> Playwright <-> Xray traceability), one
  // document per test case row. This is the richest LOCAL substitute for functional
  // detail (real RG codes + scenario text extracted from the Sprint 11-12-13 Excel),
  // usable even when live Confluence access is unavailable.
  const hybrid = safeReadJson(hybridReportFile);
  const rows = Array.isArray(hybrid?.rows) ? hybrid.rows : [];
  const docs = [];

  for (const row of rows) {
    const rules = Array.isArray(row.rules) ? row.rules : [];
    const signals = [row.issueKey, row.caseId, row.module, row.scenario, row.type, ...rules].filter(Boolean);
    const tokens = tokenize(signals.join(' '));
    if (tokens.length === 0) continue;

    const tf = {};
    for (const token of tokens) tf[token] = (tf[token] || 0) + 1;

    docs.push({
      id: `hybrid-report::${row.canonicalId || `${row.issueKey}::${row.caseId}`}`,
      url: `jira://${row.issueKey}#${row.caseId}`,
      brique: 'hybrid-report',
      tokenCount: tokens.length,
      tf,
      signalsCount: signals.length,
      sourceKind: 'local-hybrid-report',
      meta: { issueKey: row.issueKey, caseId: row.caseId, module: row.module, rules, status: row.status },
    });
  }
  return docs;
}

const graph = safeReadJson(graphFile);
if (!graph) {
  throw new Error(`Missing or invalid graph file: ${graphFile}`);
}

const extracts = collectPageExtracts();
const routeDocuments = buildDocuments(graph, extracts);
const knowledgeDocuments = buildKnowledgeDocuments();
const docsMapDocuments = buildDocsMapDocuments();
const hybridReportDocuments = buildHybridReportDocuments();
const documents = [...routeDocuments, ...knowledgeDocuments, ...docsMapDocuments, ...hybridReportDocuments];
if (documents.length === 0) {
  throw new Error('No valid documents found to build retrieval index. Run discovery and extraction first.');
}

const lexicon = buildLexicon(documents);
const payload = {
  generatedAt: new Date().toISOString(),
  source: {
    graph: path.relative(rootDir, graphFile),
    pageAgentsDir: path.relative(rootDir, pageAgentsDir),
    knowledgeDir: path.relative(rootDir, knowledgeDir),
    externalLoopRepoDir: path.relative(rootDir, externalLoopRepoDir),
    docsDir: path.relative(rootDir, docsDir),
    hybridReportFile: path.relative(rootDir, hybridReportFile),
  },
  meta: {
    documents: documents.length,
    routeDocuments: routeDocuments.length,
    knowledgeDocuments: knowledgeDocuments.length,
    docsMapDocuments: docsMapDocuments.length,
    hybridReportDocuments: hybridReportDocuments.length,
    vocabularySize: Object.keys(lexicon).length,
    averageTokenCount: Number((documents.reduce((a, d) => a + d.tokenCount, 0) / documents.length).toFixed(2)),
  },
  documents,
  lexicon,
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outIndex, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
writeCorpus(documents);

console.log(`INT2 retrieval index generated: ${outIndex}`);
console.log(`INT2 retrieval corpus generated: ${outCorpus}`);
console.log(`Documents: ${payload.meta.documents}, vocabulary: ${payload.meta.vocabularySize}`);