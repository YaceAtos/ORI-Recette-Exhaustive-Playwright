import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const DEFAULT_TERMS = ['DU', 'MA', 'RO', 'SI', 'LA', 'A'];

type DatasetPayload = {
  searchTerms?: unknown;
  searchPlan?: {
    primary?: unknown;
    fallback?: unknown;
    maxRuntimeTerms?: unknown;
  };
};

function safeJsonParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function loadInt2SearchTerms(): string[] {
  const filePath = path.resolve(__dirname, '../fixtures/scenarios/int2/collaborateur-search-terms.generated.json');
  if (!fs.existsSync(filePath)) {
    return DEFAULT_TERMS;
  }

  const parsed = safeJsonParse(fs.readFileSync(filePath, 'utf8')) as DatasetPayload | null;
  const terms = Array.isArray(parsed?.searchTerms)
    ? parsed?.searchTerms.filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
    : [];

  return terms.length > 0 ? terms : DEFAULT_TERMS;
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

function deriveSmartTermsFromRows(texts: string[]): string[] {
  const banned = new Set(['ACTIF', 'INACTIF', 'STATUT', 'DATE', 'TYPE']);
  const out: string[] = [];
  const seen = new Set<string>();

  for (const text of texts) {
    const tokens = normalizeText(text).split(/[^A-Z0-9]+/g).filter(Boolean);
    for (const token of tokens) {
      if (token.length < 3 || token.length > 14) continue;
      if (banned.has(token)) continue;
      if (/^\d+$/.test(token)) continue;

      // Prefixes tend to be safer for fuzzy and "contains" filters.
      const candidate = token.slice(0, Math.min(5, token.length));
      if (candidate.length < 3) continue;
      if (seen.has(candidate)) continue;
      seen.add(candidate);
      out.push(candidate);
      if (out.length >= 12) return out;
    }
  }

  return out;
}

async function hasNoResultSignal(page: Page): Promise<boolean> {
  const signals = [
    page.getByText(/Aucun resultat trouve|Aucun résultat trouvé/i).first(),
    page.getByText(/Aucun resultat|Aucun résultat/i).first(),
  ];

  for (const s of signals) {
    if (await s.isVisible().catch(() => false)) {
      return true;
    }
  }

  return false;
}

function loadInt2SearchRuntimeLimit(defaultLimit = 12): number {
  const filePath = path.resolve(__dirname, '../fixtures/scenarios/int2/collaborateur-search-terms.generated.json');
  if (!fs.existsSync(filePath)) return defaultLimit;

  const parsed = safeJsonParse(fs.readFileSync(filePath, 'utf8')) as DatasetPayload | null;
  const maxRuntimeTerms = parsed?.searchPlan?.maxRuntimeTerms;
  if (typeof maxRuntimeTerms !== 'number' || !Number.isFinite(maxRuntimeTerms)) return defaultLimit;
  return Math.max(1, Math.floor(maxRuntimeTerms));
}

async function resolveSearchInput(page: Page) {
  const candidates = [
    page.getByRole('searchbox', { name: /Rechercher un collaborateur/i }).first(),
    page.getByRole('searchbox', { name: /Rechercher/i }).first(),
    page.locator('input[type="search"]').first(),
    page.locator('input[placeholder*="Rechercher" i]').first(),
  ];

  for (const candidate of candidates) {
    if (await candidate.isVisible().catch(() => false)) {
      return candidate;
    }
  }

  return null;
}

export async function searchFirstWorkingTerm(page: Page, opts?: { waitMs?: number }) {
  const waitMs = opts?.waitMs ?? 1300;
  const terms = loadInt2SearchTerms();
  const runtimeLimit = loadInt2SearchRuntimeLimit(12);
  const limitedTerms = terms.slice(0, runtimeLimit);
  const search = await resolveSearchInput(page);
  if (!search) {
    return { term: limitedTerms[0] || 'A', count: 0, texts: [] as string[], noSearchInput: true };
  }

  const rows = page.locator('tr[mat-row], tr.mdc-data-table__row').filter({ has: page.locator('td') });

  // Smart mode: derive candidates from currently visible dataset before trying generic terms.
  const beforeTexts = await rows.allInnerTexts().catch(() => [] as string[]);
  const rowDerivedTerms = deriveSmartTermsFromRows(beforeTexts);
  const candidateTerms = [...rowDerivedTerms, ...limitedTerms].filter((v, i, a) => a.indexOf(v) === i);

  for (const term of candidateTerms) {
    await search.fill(term);
    await search.press('Enter');
    await page.waitForTimeout(waitMs);

    const count = await rows.count();
    const noResult = await hasNoResultSignal(page);
    if (count > 0 && !noResult) {
      const texts = await rows.allInnerTexts();
      return { term, count, texts };
    }
  }

  await search.fill('').catch(() => {});
  await search.press('Enter').catch(() => {});
  await page.waitForTimeout(Math.min(waitMs, 900));

  const finalCount = await rows.count().catch(() => 0);
  const finalTexts = await rows.allInnerTexts().catch(() => [] as string[]);
  return { term: candidateTerms[0] || limitedTerms[0] || 'A', count: finalCount, texts: finalTexts, fallbackReset: true };
}
