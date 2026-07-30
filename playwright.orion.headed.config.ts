import { defineConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const outputRoot = 'int2-ihm-test-results/orion-pipeline-headed';
const statePath = path.resolve(__dirname, '.orion-auth/state.json');
const hasAuth = fs.existsSync(statePath);

// Configuration NAVIGATEUR VISIBLE (headed) — exécution autonome par ticket avec preuve vidéo.
// Modes de visualisation : ORION_VIEW = headless | corner | headed (défaut headed)
const view = process.env.ORION_VIEW || 'headed';
const isHeadless = view === 'headless';
const cornerArgs = view === 'corner' ? ['--window-position=1180,560', '--window-size=740,420'] : [];

export default defineConfig({
  testDir: './int2-ihm-tests',
  timeout: Number(process.env.ORION_TEST_TIMEOUT || '60000'),
  expect: { timeout: Number(process.env.ORION_EXPECT_TIMEOUT || '10000') },
  fullyParallel: false,
  workers: 1,
  retries: Number(process.env.ORION_PLAYWRIGHT_RETRIES || '0'),
  outputDir: `${outputRoot}/artifacts`,
  use: {
    baseURL: process.env.ORION_BASE_URL || 'https://orion-int2.itsap.net',
    headless: isHeadless,
    viewport: { width: 1536, height: 864 },
    screenshot: 'on',
    trace: 'on',
    video: 'on',
    ignoreHTTPSErrors: true,
    navigationTimeout: Number(process.env.ORION_NAV_TIMEOUT || '25000'),
    actionTimeout: Number(process.env.ORION_ACTION_TIMEOUT || '10000'),
    launchOptions: { slowMo: Number(process.env.ORION_SLOWMO || '350'), args: cornerArgs },
    ...(hasAuth ? { storageState: statePath } : {}),
  },
  projects: [
    { name: 'setup', testMatch: /orion-auth\.setup\.ts/ },
    {
      name: 'orion-headed',
      testMatch: ['**/orion-autonomous-catalog.spec.ts'],
      dependencies: process.env.ORION_USER && process.env.ORION_PASSWORD ? ['setup'] : [],
    },
  ],
  reporter: [
    ['list'],
    ['html', { outputFolder: `${outputRoot}/html`, open: 'never' }],
    ['json', { outputFile: `${outputRoot}/playwright-results.json` }],
    ['junit', { outputFile: `${outputRoot}/playwright-results.xml` }],
  ],
});
