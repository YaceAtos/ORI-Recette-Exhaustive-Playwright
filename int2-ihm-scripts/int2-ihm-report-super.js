const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const rootDir = path.resolve(__dirname, '..');
const inPath = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'int2-multi-agent-exhaustive.yaml');
const outMd = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'INT2_SUPER_REPORT.md');
const outYaml = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'int2-super-report.yaml');

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function inferSemanticType(field) {
  const hay = normalize([
    field.label,
    field.placeholder,
    field.ariaLabel,
    field.name,
    field.id,
    field.type,
  ].filter(Boolean).join(' '));

  const rules = [
    ['person.first_name', /prenom|first.?name|given.?name|fname/],
    ['person.last_name', /nom d usage|nom usage|lastname|last.?name|surname|\bnom\b/],
    ['person.birth_date', /date.?naissance|birth.?date|birthday|\bdob\b|jj\/mm\/aaaa/],
    ['person.gender', /civilite|gender|sexe|sex|homme|femme/],
    ['company.siren', /\bsiren\b|numero.?siren/],
    ['company.siret', /\bsiret\b|numero.?siret/],
    ['company.company_name', /raison.?sociale|denomination|societe|company.?name/],
    ['company.agency', /\bagence\b|agency|branch/],
    ['address.street', /\badresse\b|address|street|line1/],
    ['address.city', /\bville\b|\bcity\b|commune/],
    ['address.postal_code', /code.?postal|postal.?code|\bzip\b/],
    ['address.country', /\bpays\b|\bcountry\b/],
    ['authentication.email', /\bemail\b|e-mail|courriel/],
    ['authentication.username', /username|login|identifiant/],
    ['authentication.password', /password|mot.?de.?passe|passwd/],
    ['finance.iban', /\biban\b/],
    ['finance.bic', /\bbic\b|\bswift\b/],
    ['ui.search', /rechercher|search/],
    ['ui.select', /mat-select|combobox|select/],
  ];

  for (const [semanticType, pattern] of rules) {
    if (pattern.test(hay)) return semanticType;
  }
  return 'unknown';
}

function collapseFieldSignals(field) {
  return {
    label: field.label || null,
    placeholder: field.placeholder || null,
    ariaLabel: field.ariaLabel || null,
    name: field.name || null,
    id: field.id || null,
    type: field.type || field.tag || null,
    required: Boolean(field.required),
    disabled: Boolean(field.disabled),
    readonly: Boolean(field.readonly),
    semantic_type: inferSemanticType(field),
  };
}

function summarizePage(page) {
  const extract = page.extract || {};
  const fields = Array.isArray(extract.fields) ? extract.fields : [];
  const links = Array.isArray(extract.links) ? extract.links : [];
  const buttons = Array.isArray(extract.buttons) ? extract.buttons : [];
  const tables = Array.isArray(extract.tables) ? extract.tables : [];

  const semanticCoverage = {};
  const compactFields = fields.map((f) => collapseFieldSignals(f));
  for (const f of compactFields) {
    semanticCoverage[f.semantic_type] = (semanticCoverage[f.semantic_type] || 0) + 1;
  }

  return {
    page_id: page.page_id,
    page_url: page.page_url,
    agent_id: page.agent_id,
    success: page.success,
    error: page.error,
    related_pages: page.related_pages || [],
    counters: {
      headings: (extract.headings || []).length,
      buttons: buttons.length,
      links: links.length,
      fields: fields.length,
      dialogs: (extract.dialogs || []).length,
      tables: tables.length,
      alerts: (extract.alerts || []).length,
    },
    semantic_coverage: semanticCoverage,
    fields: compactFields,
    ui_elements: {
      headings: (extract.headings || []).map((h) => h.text).filter(Boolean).slice(0, 30),
      buttons: buttons.map((b) => b.text).filter(Boolean).slice(0, 60),
      table_headers: tables.flatMap((t) => t.headers || []).filter(Boolean).slice(0, 80),
      option_samples: (extract.options || []).slice(0, 80),
      links: links.map((l) => ({ text: l.text || '', href: l.href || '' })).slice(0, 100),
    },
  };
}

function buildReport(input) {
  const briques = Array.isArray(input.briques) ? input.briques : [];
  const pages = briques.flatMap((b) => (b.pages || []).map((p) => ({ brique: b.name, ...p })));
  const pageSummaries = pages.map((p) => summarizePage(p));

  const totals = {
    briques: briques.length,
    pages: pages.length,
    success_pages: pageSummaries.filter((x) => x.success).length,
    error_pages: pageSummaries.filter((x) => !x.success).length,
    fields_total: pageSummaries.reduce((s, x) => s + (x.counters.fields || 0), 0),
    buttons_total: pageSummaries.reduce((s, x) => s + (x.counters.buttons || 0), 0),
    links_total: pageSummaries.reduce((s, x) => s + (x.counters.links || 0), 0),
  };

  const globalSemanticCoverage = {};
  for (const page of pageSummaries) {
    for (const [k, v] of Object.entries(page.semantic_coverage || {})) {
      globalSemanticCoverage[k] = (globalSemanticCoverage[k] || 0) + v;
    }
  }

  const communication = pageSummaries.map((p) => ({
    page_id: p.page_id,
    related_pages: p.related_pages || [],
  }));

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      source: 'int2-ihm-recordings/int2-autonomous/int2-multi-agent-exhaustive.yaml',
      baseUrl: input.meta?.baseUrl || null,
      mode: 'int2-super-report',
    },
    totals,
    briques: briques.map((b) => ({
      name: b.name,
      page_count: (b.pages || []).length,
    })),
    global_semantic_coverage: globalSemanticCoverage,
    communication,
    pages: pageSummaries,
  };
}

function toMarkdown(report) {
  const lines = [];
  lines.push('# INT2 Super Report');
  lines.push('');
  lines.push(`- Generated at: ${report.meta.generatedAt}`);
  lines.push(`- Source: ${report.meta.source}`);
  lines.push(`- Base URL: ${report.meta.baseUrl || 'n/a'}`);
  lines.push(`- Briques: ${report.totals.briques}`);
  lines.push(`- Pages: ${report.totals.pages}`);
  lines.push(`- Success pages: ${report.totals.success_pages}`);
  lines.push(`- Error pages: ${report.totals.error_pages}`);
  lines.push(`- Fields total: ${report.totals.fields_total}`);
  lines.push(`- Buttons total: ${report.totals.buttons_total}`);
  lines.push(`- Links total: ${report.totals.links_total}`);
  lines.push('');

  lines.push('## Brique Matrix');
  lines.push('');
  lines.push('| Brique | Pages |');
  lines.push('|---|---:|');
  for (const b of report.briques) {
    lines.push(`| ${b.name} | ${b.page_count} |`);
  }
  lines.push('');

  lines.push('## Global Semantic Coverage');
  lines.push('');
  lines.push('| Semantic Type | Count |');
  lines.push('|---|---:|');
  const sem = Object.entries(report.global_semantic_coverage || {}).sort((a, b) => b[1] - a[1]);
  for (const [k, v] of sem) {
    lines.push(`| ${k} | ${v} |`);
  }
  lines.push('');

  lines.push('## Page Matrix');
  lines.push('');
  lines.push('| Page | Fields | Buttons | Links | Dialogs | Related Pages | Success |');
  lines.push('|---|---:|---:|---:|---:|---:|---|');
  for (const p of report.pages) {
    lines.push(`| ${p.page_id} | ${p.counters.fields} | ${p.counters.buttons} | ${p.counters.links} | ${p.counters.dialogs} | ${(p.related_pages || []).length} | ${p.success ? 'yes' : 'no'} |`);
  }
  lines.push('');

  lines.push('## Inter-Page Communication');
  lines.push('');
  for (const p of report.pages) {
    lines.push(`### ${p.page_id}`);
    if (!p.related_pages || p.related_pages.length === 0) {
      lines.push('- Related: none');
    } else {
      for (const r of p.related_pages) {
        lines.push(`- ${r.page} (overlap=${r.overlap})`);
      }
    }
    lines.push('');
  }

  return `${lines.join('\n')}\n`;
}

function main() {
  if (!fs.existsSync(inPath)) {
    throw new Error(`Missing input file: ${inPath}`);
  }

  const input = yaml.load(fs.readFileSync(inPath, 'utf8'));
  const report = buildReport(input);

  fs.writeFileSync(outYaml, yaml.dump(report, {
    noRefs: true,
    lineWidth: -1,
    sortKeys: false,
    quotingType: '"',
    forceQuotes: false,
  }), 'utf8');

  fs.writeFileSync(outMd, toMarkdown(report), 'utf8');

  console.log(`INT2 super report YAML generated: ${outYaml}`);
  console.log(`INT2 super report Markdown generated: ${outMd}`);
  console.log(`Pages: ${report.totals.pages}, fields: ${report.totals.fields_total}`);
}

main();
