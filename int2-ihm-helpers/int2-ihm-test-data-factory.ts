import { Page } from '@playwright/test';

export function runTag(prefix = 'AUTO'): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${prefix}-${yyyy}${mm}${dd}-${hh}${min}${ss}`;
}

export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < retries) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }
  throw lastError;
}

export async function firstVisibleClientLastName(page: Page): Promise<string> {
  const candidate = page
    .locator('tr[role="row"] td:first-child, tr.mdc-data-table__row td:first-child, mat-row mat-cell:first-child')
    .first();
  const text = (await candidate.innerText()).trim();
  return text || 'CLIENT';
}