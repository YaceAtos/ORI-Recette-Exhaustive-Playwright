const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const inputPath = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'state-graph.json');
const outputPath = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'int2-site-map-exhaustive.yaml');

function normalizeArray(values) {
  if (!Array.isArray(values)) return [];
  return values.filter((v) => typeof v === 'string' && v.trim().length > 0);
}

function getBriqueName(pathname) {
  if (typeof pathname !== 'string' || pathname.length === 0) return '_unknown';
  const parts = pathname.split('/').filter(Boolean);
  return parts.length > 0 ? parts[0] : '_root';
}

function buildSiteMap(graph) {
  const nodes = Array.isArray(graph.nodes) ? graph.nodes : [];
  const edges = Array.isArray(graph.edges) ? graph.edges : [];

  const byBrique = new Map();

  for (const node of nodes) {
    const pathname = typeof node.id === 'string' ? node.id : '';
    const brique = getBriqueName(pathname);

    if (!byBrique.has(brique)) {
      byBrique.set(brique, []);
    }

    const semantic = node.semantic && typeof node.semantic === 'object' ? node.semantic : {};

    byBrique.get(brique).push({
      id: pathname,
      url: typeof node.url === 'string' ? node.url : '',
      discoveredFrom: node.discoveredFrom || null,
      discoveredVia: node.discoveredVia || null,
      title: typeof semantic.pageTitle === 'string' ? semantic.pageTitle : null,
      headings: normalizeArray(semantic.headings),
      buttonLabels: normalizeArray(semantic.buttonLabels),
      counters: semantic.counters && typeof semantic.counters === 'object' ? semantic.counters : {},
      error: node.error || null,
    });
  }

  const briqueEntries = Array.from(byBrique.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  const totals = {};
  const briques = briqueEntries.map(([name, pages]) => {
    const sortedPages = pages.sort((a, b) => a.id.localeCompare(b.id));
    totals[name] = sortedPages.length;

    return {
      name,
      page_count: sortedPages.length,
      pages: sortedPages,
    };
  });

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      sourceGeneratedAt: graph.generatedAt || null,
      baseUrl: graph.baseUrl || null,
      discoveredPages: nodes.length,
      discoveredEdges: edges.length,
      briqueCount: briques.length,
    },
    totals,
    briques,
  };
}

function fallbackYamlStringify(data) {
  return JSON.stringify(data, null, 2);
}

function writeYaml(data) {
  let yamlText;
  try {
    const yaml = require('js-yaml');
    yamlText = yaml.dump(data, {
      noRefs: true,
      lineWidth: -1,
      sortKeys: false,
      quotingType: '"',
      forceQuotes: false,
    });
  } catch {
    yamlText = fallbackYamlStringify(data);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${yamlText}\n`, 'utf8');
}

function main() {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Missing input graph file: ${inputPath}`);
  }

  const raw = fs.readFileSync(inputPath, 'utf8');
  const graph = JSON.parse(raw);

  const siteMap = buildSiteMap(graph);
  writeYaml(siteMap);

  console.log(`INT2 exhaustive site map YAML generated: ${outputPath}`);
  console.log(`Discovered pages: ${siteMap.meta.discoveredPages}`);
  console.log(`Briques: ${siteMap.meta.briqueCount}`);
}

main();
