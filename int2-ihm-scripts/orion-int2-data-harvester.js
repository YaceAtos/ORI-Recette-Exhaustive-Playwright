const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const outFile = path.join(rootDir, 'int2-ihm-knowledge', 'int2-real-data.json');
const base = process.env.ORION_BASE_URL || 'https://orion-int2.itsap.net';

// Pages-listes réelles où des données existent (celles que l'interprète cible).
const PAGES = [
  { module: 'MP1', key: 'structure', url: `${base}/gestion-marque/structure/pages/structure` },
  { module: 'MP1-SP1.5', key: 'profils', url: `${base}/gestion-marque/habilitation/pages/habilitation-profils` },
  { module: 'MP2', key: 'familles', url: `${base}/offres-tarifs/pages/catalogue/familles` },
  { module: 'MP2', key: 'options', url: `${base}/offres-tarifs/pages/catalogue/options` },
  { module: 'MP3', key: 'collaborateur', url: `${base}/gestion-admin/pages/collaborateur` },
  { module: 'MP5', key: 'planning', url: `${base}/sap/pages/planning` },
  { module: 'MP4', key: 'clients', url: `${base}/crm/pages/clients-prospects` },
  { module: 'MP6', key: 'organisme-financeur', url: `${base}/facturation-paie/pages/organisme-financeur` },
];

const STOP = new Set(['nom', 'code', 'statut', 'date', 'actif', 'inactif', 'nature', 'type', 'action', 'actions', 'élément', 'elements', 'éléments', 'modification', 'représentant', 'representant', 'legal', 'légal', 'entités', 'entites', 'rattachées', 'rattachees', 'administratif', 'état', 'etat', 'complétude', 'completude', 'description', 'famille', 'produits', 'packages', 'tous', 'aucun', 'résultat', 'resultat', 'afficher', 'page', 'sur', 'par', 'précédente', 'suivante', 'première', 'dernière',
  // Bruit d'icônes Material et pictos (apparaissent à chaque ligne)
  'home', 'work', 'home_work', 'mode', 'mode_night', 'night', 'standby', 'chevron', 'chevron_right', 'right', 'left', 'keyboard', 'keyboard_arrow_down', 'keyboard_arrow_up', 'arrow', 'arrow_forward', 'expand', 'expand_more', 'expand_less', 'more', 'more_vert', 'vert', 'horiz', 'info', 'mat', 'group', 'person', 'handshake', 'calendar', 'calendar_today', 'block', 'circle', 'check', 'check_circle', 'cancel', 'visibility', 'search', 'close', 'edit', 'delete', 'add', 'double', 'auto_awesome', 'star', 'warning', 'error', 'done', 'pending']);

function buildTerms(rows, columns) {
  const rowCount = rows.length || 1;
  const rawValues = Object.values(columns).flat();
  // Colonne "nom/libellé" = ce que la recherche filtre réellement.
  const nameKey = Object.keys(columns).find((k) => /nom|libell|raison|d[eé]nomination|intitul|client|prospect|structure|collaborateur/i.test(k))
    || Object.entries(columns).sort((a, b) => (b[1].join('').length / b[1].length) - (a[1].join('').length / a[1].length))[0]?.[0];
  const nameVals = nameKey ? columns[nameKey] : [];
  const nameTerms = [];
  for (const v of nameVals) {
    for (const tok of String(v).split(/[^A-Za-zÀ-ÿ0-9-]+/)) {
      const t = tok.trim();
      if (t.length < 3 || t.length > 24 || STOP.has(t.toLowerCase())) continue;
      if (/^\d+$/.test(t) && t.length < 4) continue;
      nameTerms.push(t);
    }
  }
  const termCounts = {};
  const codes = new Set();
  const idents = new Set();
  for (const v of rawValues) {
    (v.match(/\b[A-Z]{2,}(?:[-_][A-Z0-9]+)+\b|\bOPT-\d+\b|\bFAM-[A-Z]+\b/g) || []).forEach((c) => codes.add(c));
    (v.match(/\b[A-ZÀ-Ý]{3,}\b/g) || []).forEach((c) => { if (!STOP.has(c.toLowerCase())) codes.add(c); });
    (v.match(/\b\d{9}\b|\b\d{14}\b/g) || []).forEach((c) => idents.add(c));
    for (const tok of v.split(/[^A-Za-zÀ-ÿ0-9]+/)) {
      const t = tok.trim();
      if (t.length < 3 || t.length > 24) continue;
      if (STOP.has(t.toLowerCase())) continue;
      if (/^\d+$/.test(t) && t.length < 9) continue;
      termCounts[t] = (termCounts[t] || 0) + 1;
    }
  }
  const realTokens = Object.entries(termCounts)
    .filter(([t, n]) => n < Math.max(2, rowCount * 0.85))
    .sort((a, b) => a[1] - b[1]).map(([t]) => t);
  // Priorité : NOMS/LIBELLÉS (matchés par la recherche) > identifiants > codes > tokens.
  const searchTerms = [...new Set([...nameTerms, ...idents, ...codes, ...realTokens])].filter(Boolean).slice(0, 40);
  const duplicates = Object.entries(termCounts).filter(([t, n]) => n > 1 && !STOP.has(t.toLowerCase()) && n < rowCount * 0.85)
    .sort((a, b) => b[1] - a[1]).map(([t, n]) => ({ term: t, count: n })).slice(0, 25);
  const prefixCount = {};
  for (const c of codes) { const p = (c.match(/^[A-Z]+[-_]/) || [])[0]; if (p) prefixCount[p] = (prefixCount[p] || 0) + 1; }
  const nomenclature = Object.entries(prefixCount).sort((a, b) => b[1] - a[1]).map(([p, n]) => ({ prefix: p, count: n })).slice(0, 15);
  return { searchTerms, nameColumn: nameKey || null, codes: [...codes].slice(0, 30), identifiers: [...idents].slice(0, 20), duplicates, nomenclature };
}

async function extractPage(page, meta) {
  await page.goto(meta.url, { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForTimeout(3500);
  const data = await page.evaluate(() => {
    const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
    // En-têtes de colonnes
    const heads = [...document.querySelectorAll('th, mat-header-cell, [role="columnheader"]')].map((h) => clean(h.innerText)).filter(Boolean);
    // Lignes de données (zone tableau)
    const rows = [...document.querySelectorAll('tbody tr, mat-row, [role="row"]')]
      .map((r) => [...r.querySelectorAll('td, mat-cell, [role="cell"]')].map((c) => clean(c.innerText)))
      .filter((cells) => cells.length && cells.some(Boolean));
    // Options de listes déroulantes déjà rendues
    const options = [...document.querySelectorAll('mat-option, option, [role="option"]')].map((o) => clean(o.innerText)).filter(Boolean);
    const h = [...document.querySelectorAll('h1,h2,h3')].map((x) => clean(x.innerText)).filter(Boolean).slice(0, 4);
    return { heads, rows, options, headings: h };
  });

  // Construire colonnes header->valeurs
  const columns = {};
  for (const cells of data.rows) {
    cells.forEach((val, i) => {
      const key = data.heads[i] || `col${i}`;
      if (!val) return;
      (columns[key] = columns[key] || []).push(val);
    });
  }

  const { searchTerms, codes, identifiers, duplicates, nomenclature } = buildTerms(data.rows, columns);

  return {
    module: meta.module, key: meta.key, url: meta.url,
    headings: data.headings, rowCount: data.rows.length,
    columns: Object.fromEntries(Object.entries(columns).map(([k, v]) => [k, [...new Set(v)].slice(0, 20)])),
    searchTerms, codes, identifiers,
    options: [...new Set(data.options)].slice(0, 40),
    duplicates, nomenclature,
    empty: data.rows.length === 0,
  };
}

async function main() {
  const b = await chromium.launch();
  const ctx = await b.newContext({ ignoreHTTPSErrors: true, viewport: { width: 1536, height: 864 } });
  const page = await ctx.newPage();
  const pages = {};
  const byModule = {};
  for (const meta of PAGES) {
    try {
      const d = await extractPage(page, meta);
      pages[meta.key] = d;
      const m = meta.module.split('-')[0];
      if (!byModule[m]) byModule[m] = { searchTerms: [], codes: [], identifiers: [] };
      byModule[m].searchTerms.push(...d.searchTerms);
      byModule[m].codes.push(...d.codes);
      byModule[m].identifiers.push(...d.identifiers);
      console.log(`[harvest] ${meta.key} (${meta.module}) · lignes=${d.rowCount} · termes=${d.searchTerms.length} · doublons=${d.duplicates.length} · nomenclature=${d.nomenclature.length}${d.empty ? ' · VIDE' : ''}`);
    } catch (e) {
      console.log(`[harvest] ${meta.key} ERREUR: ${e.message}`);
    }
  }
  for (const m of Object.keys(byModule)) {
    byModule[m].searchTerms = [...new Set(byModule[m].searchTerms)].slice(0, 60);
    byModule[m].codes = [...new Set(byModule[m].codes)].slice(0, 40);
    byModule[m].identifiers = [...new Set(byModule[m].identifiers)].slice(0, 30);
  }
  const out = { generatedAt: new Date().toISOString(), base, pages, byModule };
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(out, null, 2));
  console.log(`\nIndex données réelles INT2 écrit: ${path.relative(rootDir, outFile)}`);
  console.log(`Pages moissonnées: ${Object.keys(pages).length} · modules: ${Object.keys(byModule).join(', ')}`);
  await b.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
