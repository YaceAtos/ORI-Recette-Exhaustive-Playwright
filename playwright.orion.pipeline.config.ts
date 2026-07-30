import { defineConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const outputRoot = 'int2-ihm-test-results/orion-pipeline';
const statePath = path.resolve(__dirname, '.orion-auth/state.json');
const hasAuth = fs.existsSync(statePath);

export default defineConfig({
  testDir: './int2-ihm-tests',
  timeout: Number(process.env.ORION_TEST_TIMEOUT || '45000'),
  expect: { timeout: Number(process.env.ORION_EXPECT_TIMEOUT || '8000') },
  fullyParallel: false,
  workers: Number(process.env.ORION_PLAYWRIGHT_WORKERS || '1'),
  retries: Number(process.env.ORION_PLAYWRIGHT_RETRIES || '0'),
  outputDir: `${outputRoot}/artifacts`,
  use: {
    baseURL: process.env.ORION_BASE_URL || 'https://orion-int2.itsap.net',
    headless: process.env.ORION_HEADED !== 'true',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    navigationTimeout: Number(process.env.ORION_NAV_TIMEOUT || '20000'),
    actionTimeout: Number(process.env.ORION_ACTION_TIMEOUT || '8000'),
    ...(hasAuth ? { storageState: statePath } : {}),
  },
  projects: [
    {
      name: 'setup',
      testMatch: /orion-auth\.setup\.ts/,
    },
    {
      name: 'orion-pipeline',
      testMatch: [
        '**/int2-ihm-sprint13-recette-23.spec.ts',
        '**/int2-ihm-sprint13-recette-23-batch2.spec.ts',
        '**/orion-autonomous-catalog.spec.ts',
      ],
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
