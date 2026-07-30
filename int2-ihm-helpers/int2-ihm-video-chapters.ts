import { Page, TestInfo } from '@playwright/test';
import { mkdirSync } from 'fs';
import path from 'path';
import { slugify } from './int2-ihm-test-data-factory';

export async function captureChapter(
  page: Page,
  testInfo: TestInfo,
  chainName: string,
  chapterName: string
): Promise<string> {
  const chainSlug = slugify(chainName);
  const chapterSlug = slugify(chapterName);
  const fileName = `${Date.now()}-${chapterSlug}.png`;
  const relPath = path.join('chapters', chainSlug, fileName);
  const absPath = testInfo.outputPath(relPath);

  mkdirSync(path.dirname(absPath), { recursive: true });
  await page.screenshot({ path: absPath, fullPage: true });

  await testInfo.attach(`chapter:${chainSlug}:${chapterSlug}`, {
    path: absPath,
    contentType: 'image/png',
  });

  return relPath;
}