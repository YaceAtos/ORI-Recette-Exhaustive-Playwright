const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const rootDir = path.resolve(__dirname, '..');
const profilePath = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'create-flow-profile.json');
const outputPath = path.join(rootDir, 'int2-ihm-recordings', 'int2-autonomous', 'create-flow-semantics.json');
const semanticKnowledgeDir = path.join(rootDir, 'int2-ihm-knowledge', 'semantic');

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function birthDateProfile() {
  return String(process.env.INT2_BIRTH_DATE_PROFILE || 'adult').toLowerCase();
}

function buildBirthDateFromProfile(profile, seed = Date.now()) {
  const digits = String(seed).replace(/\D/g, '') || '123456';
  const day = String(1 + (Number(digits.slice(-2)) % 27)).padStart(2, '0');
  const month = String(1 + (Number(digits.slice(-4, -2)) % 12)).padStart(2, '0');
  const currentYear = new Date().getFullYear();

  switch (profile) {
    case 'adult':
      return `${day}/${month}/${currentYear - 28}`;
    case 'senior':
      return `${day}/${month}/${currentYear - 72}`;
    case 'minor':
    default:
      return `${day}/${month}/${currentYear - 12}`;
  }
}

function loadSemanticKnowledge() {
  if (!fs.existsSync(semanticKnowledgeDir)) return [];
  const out = [];
  const files = fs.readdirSync(semanticKnowledgeDir).filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'));

  for (const fileName of files) {
    const filePath = path.join(semanticKnowledgeDir, fileName);
    const doc = yaml.load(fs.readFileSync(filePath, 'utf8')) || {};

    for (const [domain, fields] of Object.entries(doc)) {
      if (!fields || typeof fields !== 'object') continue;
      for (const [fieldKey, fieldDef] of Object.entries(fields)) {
        if (!fieldDef || typeof fieldDef !== 'object') continue;
        out.push({
          domain,
          fieldKey,
          semanticType: fieldDef.semantic_type || `${domain}.${fieldKey}`,
          aliases: Array.isArray(fieldDef.aliases) ? fieldDef.aliases : [],
          confidenceKeywords: Array.isArray(fieldDef.confidence_keywords) ? fieldDef.confidence_keywords : [],
          datatype: fieldDef.datatype || 'string',
          generators: fieldDef.generators || {},
          validation: fieldDef.validation || {},
        });
      }
    }
  }

  return out;
}

const semanticKnowledge = loadSemanticKnowledge();

function mapSemanticTypeToIntent(semanticType) {
  const t = normalizeText(semanticType || '');
  if (t === 'person.first_name') return 'firstName';
  if (t === 'person.last_name') return 'lastName';
  if (t === 'person.birth_date') return 'date';
  if (t === 'person.gender') return 'radioType';
  if (t === 'company.siren' || t === 'company.siret') return 'legalId';
  if (t === 'company.company_name') return 'company';
  if (t === 'company.agency') return 'agency';
  if (t === 'address.street') return 'address';
  if (t === 'address.city') return 'city';
  if (t === 'address.postal_code') return 'code';
  if (t === 'authentication.email') return 'email';
  if (t === 'authentication.username') return 'code';
  if (t === 'finance.credit_card') return 'number';
  return 'unknown';
}

function detectSemanticRule(field) {
  const haystack = normalizeText(`${field.label} ${field.name} ${field.type}`);
  let best = null;

  for (const rule of semanticKnowledge) {
    let score = 0;
    for (const alias of rule.aliases) {
      const a = normalizeText(alias);
      if (a && haystack.includes(a)) score += 3;
    }
    for (const kw of rule.confidenceKeywords) {
      const k = normalizeText(kw);
      if (k && haystack.includes(k)) score += 1;
    }

    if (!best || score > best.score) {
      best = { score, rule };
    }
  }

  if (!best || best.score < 2) return null;
  return best.rule;
}

function inferIntent(field) {
  const rule = detectSemanticRule(field);
  if (rule) {
    const knowledgeIntent = mapSemanticTypeToIntent(rule.semanticType);
    if (knowledgeIntent !== 'unknown') return knowledgeIntent;
  }

  const haystack = normalizeText(`${field.label} ${field.name} ${field.type}`);
  if (/nomusuel|nom usuel|cd\d+|\bcode\b/.test(haystack)) return 'code';
  const checks = [
    ['email', /email|e-mail|courriel/],
    ['phone', /telephone|numero|tel\b|mobile/],
    ['firstName', /prenom/],
    ['lastName', /nom d usage|nom usage|nom/],
    ['label', /libelle|intitule|designation|titre/],
    ['radioType', /radio|intervenant|operationnel agence/],
    ['address', /adresse/],
    ['city', /ville/],
    ['agency', /agence/],
    ['company', /societe|denomination|raison sociale/],
    ['legalId', /siret|siren|identifiant legal/],
    ['code', /\bcode\b|tenantid|identifiant/],
    ['description', /description/],
    ['url', /url|portail|https?:/],
    ['date', /date|jj\/mm\/aaaa/],
    ['number', /duree|nombre|number/],
    ['search', /rechercher|search/],
    ['select', /mat-select|combobox|select/],
  ];

  for (const [intent, pattern] of checks) {
    if (pattern.test(haystack)) return intent;
  }

  if (/textarea/.test(haystack)) return 'description';
  if (/email/.test(field.type || '')) return 'email';
  if (/tel/.test(field.type || '')) return 'phone';
  if (/number/.test(field.type || '')) return 'number';
  return 'unknown';
}

function luhnCheckDigit(base) {
  const digits = String(base)
    .replace(/\D/g, '')
    .split('')
    .map((d) => Number(d));

  let sum = 0;
  const parity = (digits.length + 1) % 2;
  for (let i = 0; i < digits.length; i += 1) {
    let n = digits[i];
    if (i % 2 === parity) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return (10 - (sum % 10)) % 10;
}

function makeLuhnNumber(length, seed = Date.now()) {
  const seedDigits = String(seed).replace(/\D/g, '') || '1234567890123456';
  const bodyLength = Math.max(1, length - 1);
  const body = seedDigits.repeat(Math.ceil(bodyLength / seedDigits.length)).slice(0, bodyLength);
  const check = luhnCheckDigit(body);
  return `${body}${check}`;
}

function legalIdKind(field) {
  const haystack = normalizeText(`${field.label} ${field.name} ${field.type}`);
  if (/siret/.test(haystack)) return 'siret';
  if (/siren/.test(haystack)) return 'siren';
  return 'generic';
}

function buildLegalIdPair(seedText) {
  const digits = String(seedText || Date.now())
    .replace(/\D/g, '')
    .padEnd(16, '7');

  const sirenBody = digits.slice(0, 8);
  const siren = `${sirenBody}${luhnCheckDigit(sirenBody)}`;

  const nicBody = digits.slice(8, 12);
  const siretBody = `${siren}${nicBody}`;
  const siret = `${siretBody}${luhnCheckDigit(siretBody)}`;

  return { siren, siret };
}

function sampleForField(field, intent, legalPair) {
  const suffix = Date.now().toString().slice(-6);
  const haystack = normalizeText(`${field.label} ${field.name} ${field.type}`);
  const rule = detectSemanticRule(field);

  if (rule) {
    if (normalizeText(rule.semanticType) === 'company.siren') {
      const pair = legalPair || buildLegalIdPair(`55${suffix}33`);
      return pair.siren;
    }
    if (normalizeText(rule.semanticType) === 'company.siret') {
      const pair = legalPair || buildLegalIdPair(`55${suffix}33`);
      return pair.siret;
    }

    const frRealistic = (((rule.generators || {}).realistic || {}).locale || {}).fr;
    if (Array.isArray(frRealistic) && frRealistic.length > 0) {
      const idx = Number(suffix) % frRealistic.length;
      return String(frRealistic[idx]);
    }
  }

  if (intent === 'legalId') {
    const pair = legalPair || buildLegalIdPair(`55${suffix}33`);
    const kind = legalIdKind(field);
    if (kind === 'siret') return pair.siret;
    if (kind === 'siren') return pair.siren;
    return pair.siren;
  }

  if (intent === 'code') {
    if (/tenantid|tenant_id|identifiant/.test(haystack)) return `qa-int2-${suffix.slice(-3)}`;
    return `QA${suffix.slice(-4)}`;
  }

  if (intent === 'label') {
    if (/commercial/.test(haystack)) return 'Option commerciale standard';
    return 'Option standard';
  }

  if (intent === 'date' && /birth|naissance|birthday|dob/.test(haystack)) {
    return buildBirthDateFromProfile(birthDateProfile(), suffix);
  }

  return sampleForIntent(intent);
}

function sampleForIntent(intent) {
  const suffix = Date.now().toString().slice(-6);
  switch (intent) {
    case 'email':
      return `qa.${suffix}@example.test`;
    case 'phone':
      return '0601020304';
    case 'firstName':
      return 'Alice';
    case 'lastName':
      return 'MARTIN';
    case 'address':
      return '8 rue de Rivoli Paris';
    case 'city':
      return 'Paris';
    case 'agency':
      return '';
    case 'company':
      return '';
    case 'legalId':
      return '123456789';
    case 'code':
      return `AUTO${suffix}`;
    case 'description':
      return 'Description generee pour validation de formulaire.';
    case 'url':
      return 'https://example.test';
    case 'date':
      return '01/01/1990';
    case 'number':
      return '30';
    default:
      return `AUTO-${suffix}`;
  }
}

function confidenceForIntent(intent) {
  if (intent === 'unknown') return 'low';
  if (intent === 'select' || intent === 'search') return 'medium';
  return 'high';
}

const payload = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
const profiles = Array.isArray(payload.profiles) ? payload.profiles : [];

const semanticProfiles = profiles.map((profile) => {
  const profileLegalPair = buildLegalIdPair(`${Date.now()}${profile.id || ''}`);
  return {
    ...profile,
    semanticFields: (profile.fields || []).map((field) => {
      const intent = inferIntent(field);
      return {
        ...field,
        intent,
        confidence: confidenceForIntent(intent),
        sampleValue: sampleForField(field, intent, profileLegalPair),
        fillable: !field.disabled && intent !== 'search' && intent !== 'unknown',
      };
    }),
  };
});

fs.writeFileSync(
  outputPath,
  `${JSON.stringify({ generatedAt: new Date().toISOString(), total: semanticProfiles.length, profiles: semanticProfiles }, null, 2)}\n`,
  'utf8'
);
console.log(`INT2 semantic form understanding generated: ${outputPath}`);
