const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const outputFile = path.join(rootDir, 'fixtures', 'scenarios', 'int2', 'collaborateur-search-terms.generated.json');
const graphFile = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'state-graph.json');
const profileFile = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'create-flow-profile.json');

function safeReadJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function uniqUpper(values) {
  const seen = new Set();
  const out = [];
  for (const v of values) {
    if (typeof v !== 'string') continue;
    const t = v.trim().toUpperCase();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

function extractSignalsFromGraph(graph) {
  const nodes = Array.isArray(graph?.nodes) ? graph.nodes : [];
  const words = [];

  for (const n of nodes) {
    const labels = Array.isArray(n?.semantic?.buttonLabels) ? n.semantic.buttonLabels : [];
    const headings = Array.isArray(n?.semantic?.headings) ? n.semantic.headings : [];
    const joined = [...labels, ...headings].join(' ');
    const tokens = joined.split(/[^a-zA-Z0-9]+/g).filter(Boolean);
    for (const token of tokens) {
      if (token.length >= 2 && token.length <= 5) {
        words.push(token);
      }
    }
  }

  return words;
}

function extractSignalsFromProfile(profile) {
  const entries = Array.isArray(profile?.profiles) ? profile.profiles : [];
  const words = [];

  for (const e of entries) {
    const fields = Array.isArray(e?.fields) ? e.fields : [];
    for (const f of fields) {
      if (typeof f?.label === 'string') {
        const chunks = f.label.split(/[^a-zA-Z0-9]+/g).filter(Boolean);
        for (const c of chunks) {
          if (c.length >= 2 && c.length <= 5) {
            words.push(c);
          }
        }
      }
    }
  }

  return words;
}

function buildManagedTerms() {
  const powerMode = String(process.env.INT2_JDD_POWER || 'high').toLowerCase();
  const baseStrong = ['DU', 'MA', 'RO', 'SI', 'LA', 'AN', 'LE', 'DE', 'RA', 'NA'];
  const domainSeeds = ['CLI', 'PRO', 'DEV', 'PAP', 'AIDE', 'OF', 'CDA', 'PLA', 'FAC', 'PAIE'];
  const baseFallback = ['A', 'E', 'I', 'O', 'U', 'R', 'S', 'N', 'M', 'L', 'T', 'C', 'P'];

  const graph = safeReadJson(graphFile);
  const profile = safeReadJson(profileFile);
  const graphSignals = extractSignalsFromGraph(graph);
  const profileSignals = extractSignalsFromProfile(profile);

  const merged = uniqUpper([
    ...baseStrong,
    ...domainSeeds,
    ...(powerMode === 'high' ? baseFallback : []),
    ...graphSignals,
    ...profileSignals,
  ]);

  const primary = merged.filter((t) => t.length >= 2).slice(0, 24);
  const fallback = merged.filter((t) => t.length === 1).slice(0, 12);
  const searchTerms = uniqUpper([...primary, ...fallback]);

  return {
    powerMode,
    searchTerms,
    plan: {
      primary,
      fallback,
      maxRuntimeTerms: powerMode === 'high' ? 18 : 10,
    },
    signals: {
      graphTokenCount: graphSignals.length,
      profileTokenCount: profileSignals.length,
    },
  };
}

function baselineVolumesFromOrionJdd() {
  return {
    mp1: { marques: 2, societes: 3, agences: 5 },
    sp15: { profils: 5, utilisateurs: 10 },
    mp2: { categories: 3, familles: 5, produits: 10 },
    mp3: { intervenants: 10, contrats: 10 },
    mp4: { clients: 20, prospects: 10, devis: 10 },
    mp5: { interventions: 50, tournes: 10 },
    mp6: { organismesFinanceurs: 5, cda: 10, pap: 20 },
    mp7: { pointages: 100, exportPaieLots: 3 },
  };
}

const managed = buildManagedTerms();

const payload = {
  source: 'int2-agent-dataset-manager',
  generatedAt: new Date().toISOString(),
  intent: 'Use adaptive, realistic, non-personalized search tokens to maximize matching chances in INT2 datasets.',
  powerMode: managed.powerMode,
  searchTerms: managed.searchTerms,
  searchPlan: managed.plan,
  extractedSignals: managed.signals,
  baselineVolumes: baselineVolumesFromOrionJdd(),
  constraints: {
    avoidHardcodedIdentity: true,
    avoidSingleSurnameDependency: true,
    noPersistentCreationData: true,
  },
};

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`INT2 dataset generated (${managed.powerMode}, ${managed.searchTerms.length} terms): ${outputFile}`);
