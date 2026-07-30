const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const graphPath = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'state-graph.json');
const outDir = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'page-agents');
const taskDir = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'page-agent-tasks');
const extractorScript = path.join(rootDir, 'int2-ihm-scripts', 'int2-ihm-agent-page-extractor.js');
const yamlOutPath = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'int2-multi-agent-exhaustive.yaml');

const concurrency = Math.max(1, Number(process.env.INT2_AGENT_CONCURRENCY || '4'));

function loadGraph() {
  if (!fs.existsSync(graphPath)) {
    throw new Error(`Missing graph file: ${graphPath}`);
  }
  return JSON.parse(fs.readFileSync(graphPath, 'utf8'));
}

function toBrique(pathname) {
  const parts = String(pathname || '').split('/').filter(Boolean);
  return parts[0] || '_unknown';
}

function runWorker(task) {
  return new Promise((resolve) => {
    const taskFile = path.join(taskDir, `${task.agentId}.json`);
    fs.writeFileSync(taskFile, `${JSON.stringify(task, null, 2)}\n`, 'utf8');

    const child = spawn(process.execPath, [extractorScript, taskFile], {
      cwd: rootDir,
      stdio: 'ignore',
      env: process.env,
    });

    child.on('close', (code) => {
      resolve({ ...task, exitCode: code });
    });
  });
}

async function runPool(tasks) {
  const queue = [...tasks];
  const active = new Set();
  const done = [];

  while (queue.length > 0 || active.size > 0) {
    while (queue.length > 0 && active.size < concurrency) {
      const task = queue.shift();
      const p = runWorker(task).then((res) => {
        done.push(res);
        active.delete(p);
      });
      active.add(p);
    }

    if (active.size > 0) {
      await Promise.race(Array.from(active));
    }
  }

  return done;
}

function correlateAgents(agentOutputs) {
  const tokensPerPage = new Map();

  for (const a of agentOutputs) {
    const extract = a.extract || {};
    const bag = [];

    for (const h of extract.headings || []) bag.push(String(h.text || ''));
    for (const b of extract.buttons || []) bag.push(String(b.text || ''));
    for (const f of extract.fields || []) {
      bag.push(String(f.label || ''));
      bag.push(String(f.placeholder || ''));
    }

    const tokens = new Set(
      bag
        .join(' ')
        .toLowerCase()
        .replace(/[^a-z0-9à-ÿ\s'-]/gi, ' ')
        .split(/\s+/)
        .filter((x) => x && x.length > 2),
    );

    tokensPerPage.set(a.pageId, tokens);
  }

  const related = {};
  const ids = agentOutputs.map((x) => x.pageId);
  for (const idA of ids) {
    related[idA] = [];
    for (const idB of ids) {
      if (idA === idB) continue;
      const setA = tokensPerPage.get(idA) || new Set();
      const setB = tokensPerPage.get(idB) || new Set();

      let overlap = 0;
      for (const t of setA) {
        if (setB.has(t)) overlap += 1;
      }

      if (overlap >= 8) {
        related[idA].push({ page: idB, overlap });
      }
    }
    related[idA].sort((a, b) => b.overlap - a.overlap);
    related[idA] = related[idA].slice(0, 8);
  }

  return related;
}

function exportYaml(payload) {
  const yaml = require('js-yaml');
  const yamlText = yaml.dump(payload, {
    noRefs: true,
    lineWidth: -1,
    sortKeys: false,
    quotingType: '"',
    forceQuotes: false,
  });
  fs.writeFileSync(yamlOutPath, `${yamlText}\n`, 'utf8');
}

async function main() {
  const graph = loadGraph();
  const nodes = Array.isArray(graph.nodes) ? graph.nodes : [];

  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(taskDir, { recursive: true });
  for (const f of fs.readdirSync(outDir)) {
    if (f.endsWith('.json')) fs.unlinkSync(path.join(outDir, f));
  }
  for (const f of fs.readdirSync(taskDir)) {
    if (f.endsWith('.json')) fs.unlinkSync(path.join(taskDir, f));
  }

  const tasks = nodes.map((n, idx) => ({
    agentId: `page-agent-${String(idx + 1).padStart(3, '0')}`,
    pageId: n.id,
    pageUrl: n.url,
    outputPath: path.join(outDir, `${String(idx + 1).padStart(3, '0')}-${n.id.replace(/\//g, '_')}.json`),
  }));

  await runPool(tasks);

  const outputs = [];
  for (const task of tasks) {
    if (!fs.existsSync(task.outputPath)) {
      outputs.push({
        pageId: task.pageId,
        pageUrl: task.pageUrl,
        agentId: task.agentId,
        success: false,
        error: 'missing output file',
        extract: null,
      });
      continue;
    }
    outputs.push(JSON.parse(fs.readFileSync(task.outputPath, 'utf8')));
  }

  const relatedPages = correlateAgents(outputs.filter((x) => x.success));

  const briquesMap = new Map();
  for (const o of outputs) {
    const b = toBrique(o.pageId);
    if (!briquesMap.has(b)) briquesMap.set(b, []);
    briquesMap.get(b).push({
      page_id: o.pageId,
      page_url: o.pageUrl,
      agent_id: o.agentId,
      success: o.success,
      error: o.error,
      related_pages: relatedPages[o.pageId] || [],
      extract: o.extract,
    });
  }

  const briques = Array.from(briquesMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, pages]) => ({
      name,
      page_count: pages.length,
      pages: pages.sort((a, b) => a.page_id.localeCompare(b.page_id)),
    }));

  const totals = {};
  for (const b of briques) totals[b.name] = b.page_count;

  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      baseUrl: graph.baseUrl || null,
      sourceGraphGeneratedAt: graph.generatedAt || null,
      mode: 'multi-agent-deep-extract',
      agent_count: tasks.length,
      success_count: outputs.filter((x) => x.success).length,
      error_count: outputs.filter((x) => !x.success).length,
      brique_count: briques.length,
    },
    totals,
    briques,
  };

  exportYaml(payload);
  console.log(`INT2 multi-agent exhaustive YAML generated: ${yamlOutPath}`);
  console.log(`Agents launched: ${tasks.length}`);
  console.log(`Success: ${payload.meta.success_count} / ${tasks.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
