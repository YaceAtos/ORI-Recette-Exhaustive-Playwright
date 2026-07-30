const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const graphFile = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'state-graph.json');
const outFile = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'INT2_AUTONOMOUS_SCENARIO_CANDIDATES.md');

function safeReadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function buildCandidates(graph) {
  const nodes = Array.isArray(graph?.nodes) ? graph.nodes : [];
  const candidates = [];

  for (const n of nodes) {
    if (!n || !n.id || !n.semantic || n.error) continue;
    const c = n.semantic.counters || {};
    const labels = Array.isArray(n.semantic.buttonLabels) ? n.semantic.buttonLabels : [];

    if ((c.tables || 0) > 0 && (c.searchboxes || 0) > 0) {
      candidates.push({
        type: 'search-filter-stability',
        page: n.id,
        goal: 'Verify listing remains usable after search and filter reset cycles.',
        actions: 'Search, validate rows > 0, reset filters, validate rows > 0.',
      });
    }

    const hasCreate = labels.some((x) => /creer|create/i.test(x));
    if (hasCreate) {
      candidates.push({
        type: 'create-flow-safe-branch',
        page: n.id,
        goal: 'Explore create entrypoint without persistent submit.',
        actions: 'Open create flow, validate dialog/form branch, close safely.',
      });
    }

    if ((c.dialogs || 0) > 0) {
      candidates.push({
        type: 'dialog-resilience',
        page: n.id,
        goal: 'Validate dialog open/close behavior and return to stable page state.',
        actions: 'Open dialog, verify expected content, close, verify page stable.',
      });
    }
  }

  return candidates;
}

function dedupeCandidates(candidates) {
  const seen = new Set();
  const out = [];
  for (const c of candidates) {
    const key = `${c.type}::${c.page}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c);
  }
  return out;
}

function main() {
  const graph = safeReadJson(graphFile);
  if (!graph) {
    throw new Error(`Missing or invalid graph file: ${graphFile}`);
  }

  const candidates = dedupeCandidates(buildCandidates(graph));

  const lines = [];
  lines.push('# INT2 Autonomous Scenario Candidates');
  lines.push('');
  lines.push(`- Generated at: ${new Date().toISOString()}`);
  lines.push(`- Source graph: int2-ihm-recordings/int2-autonomous/state-graph.json`);
  lines.push(`- Discovered pages: ${graph.discoveredPages || 0}`);
  lines.push(`- Candidate scenarios: ${candidates.length}`);
  lines.push('- Policy: no persistent data creation and no final submit actions.');
  lines.push('');
  lines.push('| ID | Type | Page | Goal | Actions |');
  lines.push('|---|---|---|---|---|');

  candidates.forEach((c, idx) => {
    lines.push(`| AUTO-SCN-${String(idx + 1).padStart(3, '0')} | ${c.type} | ${c.page} | ${c.goal} | ${c.actions} |`);
  });

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, `${lines.join('\n')}\n`, 'utf8');
  console.log(`INT2 autonomous scenario candidates generated: ${outFile}`);
}

main();
