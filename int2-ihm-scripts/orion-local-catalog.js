const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const rootDir = path.resolve(__dirname, '..');
const defaultWorkbook = path.join(rootDir, 'docs', 'CAS DE TEST DES US SPRINT 11 12 13 (version 1).xlsx');
const workbookPath = path.resolve(process.env.ORION_TEST_CATALOG_XLSX || defaultWorkbook);
const outputDir = path.join(rootDir, 'int2-ihm-recordings', 'orion-pipeline');
const testsDir = path.join(rootDir, 'int2-ihm-tests');
const atlassianBundlePath = path.join(outputDir, 'atlassian-source-bundle.json');

const columns = {
  module: 1,
  caseId: 2,
  jira: 3,
  scenario: 4,
  priority: 5,
  persona: 6,
  type: 7,
  preconditions: 8,
  standardData: 9,
  boundaryData: 10,
  errorData: 11,
  specifications: 12,
  fixtures: 13,
  actions: 14,
  expectedSteps: 15,
  expectedGlobal: 16,
};

function cellText(row, index) {
  return String(row.getCell(index).text || '').trim();
}

function uniqueMatches(value, pattern) {
  return [...new Set([...String(value || '').matchAll(pattern)].map((match) => match[1] || match[0]))];
}

function splitNumberedSteps(value) {
  const text = String(value || '').trim();
  if (!text || /^N\/?A$/i.test(text)) return [];
  const chunks = text.split(/(?:^|\n)\s*\d+\.\s*/).map((item) => item.trim()).filter(Boolean);
  return chunks.length > 1 || /^\s*\d+\./.test(text) ? chunks : [text];
}

function csvValue(value) {
  const text = Array.isArray(value) ? value.join(' | ') : String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
}

function writeCsv(filePath, headers, rows) {
  const lines = [headers.map(csvValue).join(',')];
  for (const row of rows) {
    lines.push(headers.map((header) => csvValue(row[header])).join(','));
  }
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`, 'utf8');
}

function listTestFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return listTestFiles(target);
    return entry.isFile() && entry.name.endsWith('.spec.ts') ? [target] : [];
  });
}

function readAtlassianBundle() {
  if (!fs.existsSync(atlassianBundlePath)) return null;
  try {
    const bundle = JSON.parse(fs.readFileSync(atlassianBundlePath, 'utf8'));
    if (bundle.schemaVersion !== '1.0' || bundle.mode !== 'read-only') {
      throw new Error('schemaVersion=1.0 et mode=read-only requis');
    }
    return bundle;
  } catch (error) {
    throw new Error(`Bundle Atlassian invalide: ${error.message}`);
  }
}

function buildCoverage(cases) {
  const sources = listTestFiles(testsDir).map((filePath) => ({
    file: path.relative(rootDir, filePath).replaceAll('\\', '/'),
    content: fs.readFileSync(filePath, 'utf8'),
  }));

  return cases.map((testCase) => {
    const exactFiles = sources.filter((source) => {
      if (source.file.includes('orion-autonomous-catalog.spec.ts')) return true;
      return source.content.includes(testCase.caseId);
    }).map((source) => source.file);
    const issueFiles = sources.filter((source) => source.content.includes(testCase.issueKey)).map((source) => source.file);
    const level = exactFiles.length > 0 ? 'exacte' : issueFiles.length > 0 ? 'ticket-seulement' : 'manquante';
    return {
      canonicalId: testCase.canonicalId,
      localTestCaseRef: testCase.references.testCase,
      issueKey: testCase.issueKey,
      caseId: testCase.caseId,
      level,
      matchedFiles: level === 'exacte' ? exactFiles : issueFiles,
    };
  });
}

function buildXrayRows(cases) {
  return cases.flatMap((testCase) => {
    const stepCount = Math.max(testCase.steps.length, testCase.expectedSteps.length, 1);
    return Array.from({ length: stepCount }, (_, index) => ({
      'Test Case Identifier': testCase.references.testCase,
      Summary: `${testCase.issueKey} ${testCase.caseId} - ${testCase.scenario}`,
      Description: testCase.expectedGlobal,
      Preconditions: testCase.preconditions,
      'Test Step': testCase.steps[index] || (index === 0 ? testCase.scenario : ''),
      'Test Data': [testCase.datasets.standard, testCase.datasets.boundary, testCase.datasets.error].filter(Boolean).join('\n'),
      'Expected Result': testCase.expectedSteps[index] || testCase.expectedGlobal,
      Priority: testCase.priority,
      Labels: ['orion', 'sprint-11-12-13', testCase.module.split('>')[0].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')].join(' '),
      'Requirement Issue Keys': testCase.issueKey,
      'Test Plan': testCase.references.testPlan,
      'Test Execution': testCase.references.testExecution,
      'Test Set': testCase.references.testSet,
    }));
  });
}

function buildJiraRows(cases) {
  const planRef = 'TP-LOCAL-SPRINT-11-12-13';
  const executionRef = 'TE-LOCAL-INT2-SPRINT-11-12-13';
  const testSets = [...new Map(cases.map((testCase) => [testCase.references.testSet, testCase.issueKey])).entries()];
  const rows = [
    {
      'External ID': planRef,
      'Issue Type': 'Test Plan',
      Summary: 'ORI - Plan de test local Sprints 11, 12 et 13',
      Description: 'Plan local genere depuis le classeur de recette. Aucune ecriture Jira/Xray automatique.',
      Priority: 'High',
      Labels: 'orion local-only sprint-11-12-13',
      'Linked Requirement': '',
      'Test Plan': planRef,
      'Test Execution': '',
      'Test Set': '',
    },
    {
      'External ID': executionRef,
      'Issue Type': 'Test Execution',
      Summary: 'ORI - Execution Playwright locale INT2 Sprints 11, 12 et 13',
      Description: 'Reference locale pour les resultats Playwright JSON/JUnit/HTML.',
      Priority: 'High',
      Labels: 'orion local-only int2 playwright',
      'Linked Requirement': '',
      'Test Plan': planRef,
      'Test Execution': executionRef,
      'Test Set': '',
    },
    ...testSets.map(([testSetRef, issueKey]) => ({
      'External ID': testSetRef,
      'Issue Type': 'Test Set',
      Summary: `${issueKey} - Jeu de tests local`,
      Description: `Regroupe les cas de test locaux rattaches a ${issueKey}.`,
      Priority: 'Medium',
      Labels: 'orion local-only test-set',
      'Linked Requirement': issueKey,
      'Test Plan': planRef,
      'Test Execution': executionRef,
      'Test Set': testSetRef,
    })),
    ...cases.map((testCase) => ({
      'External ID': testCase.references.testCase,
      'Issue Type': 'Test',
      Summary: `${testCase.issueKey} ${testCase.caseId} - ${testCase.scenario}`,
      Description: testCase.expectedGlobal,
      Priority: testCase.priority === 'P1' ? 'High' : testCase.priority === 'P2' ? 'Medium' : 'Low',
      Labels: 'orion local-only playwright-candidate',
      'Linked Requirement': testCase.issueKey,
      'Test Plan': planRef,
      'Test Execution': executionRef,
      'Test Set': testCase.references.testSet,
    })),
  ];
  return rows;
}

async function main() {
  if (!fs.existsSync(workbookPath)) throw new Error(`Classeur introuvable: ${workbookPath}`);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(workbookPath);
  const sheet = workbook.getWorksheet('US SPRINT 11 12 13') || workbook.worksheets[0];
  if (!sheet) throw new Error('Le classeur ne contient aucune feuille.');
  const atlassianBundle = readAtlassianBundle();
  const jiraByKey = new Map((atlassianBundle?.jira?.issues || []).map((issue) => [issue.key, issue]));
  const confluenceById = new Map((atlassianBundle?.confluence?.pages || []).map((page) => [String(page.pageId), page]));

  const cases = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber < 5) return;
    const caseId = cellText(row, columns.caseId);
    const jiraText = cellText(row, columns.jira);
    const issueKey = uniqueMatches(jiraText, /\b(ORI-\d+)\b/g)[0];
    if (!caseId.startsWith('CT-') || !issueKey) return;

    const issueSummary = jiraText.replace(issueKey, '').trim();
    const specifications = cellText(row, columns.specifications);
    const localId = `TC-${issueKey}-${caseId}-R${rowNumber}`;
    const testSet = `TS-${issueKey}`;
    cases.push({
      schemaVersion: '1.0',
      sourceRow: rowNumber,
      canonicalId: `${issueKey}::${caseId}::R${rowNumber}`,
      caseId,
      issueKey,
      issueSummary,
      module: cellText(row, columns.module),
      scenario: cellText(row, columns.scenario),
      priority: cellText(row, columns.priority),
      persona: cellText(row, columns.persona),
      type: cellText(row, columns.type),
      preconditions: cellText(row, columns.preconditions),
      datasets: {
        standard: cellText(row, columns.standardData),
        boundary: cellText(row, columns.boundaryData),
        error: cellText(row, columns.errorData),
      },
      confluence: {
        pageIds: uniqueMatches(specifications, /\bPage\s+(\d{6,})\b/g),
        tinyLinks: uniqueMatches(specifications, /\bwiki\/x\/([A-Za-z0-9_-]+)\b/g),
        rules: uniqueMatches(specifications, /\b(RG_[A-Za-z0-9_]+)\b/g),
        sourceText: specifications,
        requiresConfirmation: /a confirmer|à confirmer|NB\s*:/i.test(specifications),
      },
      fixtures: cellText(row, columns.fixtures),
      steps: splitNumberedSteps(cellText(row, columns.actions)),
      expectedSteps: splitNumberedSteps(cellText(row, columns.expectedSteps)),
      expectedGlobal: cellText(row, columns.expectedGlobal),
      references: {
        testPlan: 'TP-LOCAL-SPRINT-11-12-13',
        testExecution: 'TE-LOCAL-INT2-SPRINT-11-12-13',
        testSet,
        testCase: localId,
      },
      atlassian: {
        jira: jiraByKey.get(issueKey) || null,
        confluencePages: uniqueMatches(specifications, /\bPage\s+(\d{6,})\b/g)
          .map((pageId) => confluenceById.get(String(pageId)))
          .filter(Boolean),
      },
    });
  });

  const coverage = buildCoverage(cases);
  const levels = coverage.reduce((acc, item) => {
    acc[item.level] = (acc[item.level] || 0) + 1;
    return acc;
  }, {});
  const issueKeys = [...new Set(cases.map((testCase) => testCase.issueKey))].sort((a, b) => Number(a.split('-')[1]) - Number(b.split('-')[1]));
  const rules = [...new Set(cases.flatMap((testCase) => testCase.confluence.rules))].sort();
  const pageIds = [...new Set(cases.flatMap((testCase) => testCase.confluence.pageIds))].sort();
  const generatedAt = new Date().toISOString();

  const catalog = {
    schemaVersion: '1.0',
    generatedAt,
    mode: 'local-only',
    atlassianReadBundle: atlassianBundle
      ? {
          source: path.relative(rootDir, atlassianBundlePath).replaceAll('\\', '/'),
          generatedAt: atlassianBundle.generatedAt,
          jiraIssueCount: jiraByKey.size,
          confluencePageCount: confluenceById.size,
        }
      : null,
    source: path.relative(rootDir, workbookPath).replaceAll('\\', '/'),
    sheet: sheet.name,
    release: 'v0.2.0',
    environment: 'INT2',
    count: cases.length,
    issueKeys,
    rules,
    confluencePageIds: pageIds,
    cases,
  };
  const traceability = {
    schemaVersion: '1.0',
    generatedAt,
    sourceCaseCount: cases.length,
    issueCount: issueKeys.length,
    ruleCount: rules.length,
    coverageLevels: levels,
    coverage,
  };

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'test-catalog.json'), `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
  fs.writeFileSync(path.join(outputDir, 'traceability.json'), `${JSON.stringify(traceability, null, 2)}\n`, 'utf8');

  writeCsv(path.join(outputDir, 'xray-manual-test-cases.csv'), [
    'Test Case Identifier', 'Summary', 'Description', 'Preconditions', 'Test Step', 'Test Data',
    'Expected Result', 'Priority', 'Labels', 'Requirement Issue Keys', 'Test Plan', 'Test Execution', 'Test Set',
  ], buildXrayRows(cases));
  writeCsv(path.join(outputDir, 'jira-xray-issues.csv'), [
    'External ID', 'Issue Type', 'Summary', 'Description', 'Priority', 'Labels', 'Linked Requirement',
    'Test Plan', 'Test Execution', 'Test Set',
  ], buildJiraRows(cases));

  const summary = [
    '# Catalogue de tests Orion local',
    '',
    `- Genere le : ${generatedAt}`,
    `- Source : ${catalog.source}`,
    `- Cas de test : ${cases.length}`,
    `- Tickets ORI : ${issueKeys.length}`,
    `- Regles RG : ${rules.length}`,
    `- Couverture Playwright exacte : ${levels.exacte || 0}`,
    `- Couverture Playwright au niveau ticket : ${levels['ticket-seulement'] || 0}`,
    `- Couverture Playwright manquante : ${levels.manquante || 0}`,
    '',
    '> Une couverture au niveau ticket ne prouve pas que chaque cas Excel est automatise.',
    '> Les CSV sont produits localement. Aucun appel Jira, Confluence ou Xray n est effectue.',
  ];
  fs.writeFileSync(path.join(outputDir, 'CATALOG_SUMMARY.md'), `${summary.join('\n')}\n`, 'utf8');

  console.log(`Catalogue local genere: ${cases.length} cas, ${issueKeys.length} tickets ORI.`);
  console.log(`Couverture: exacte=${levels.exacte || 0}, ticket-seulement=${levels['ticket-seulement'] || 0}, manquante=${levels.manquante || 0}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
