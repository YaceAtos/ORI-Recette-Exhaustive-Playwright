import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './int2-ihm-tests',
  timeout: 30000,
  use: {
    baseURL: 'https://orion-int1.itsap.net',
    headless: true,
    screenshot: 'on',
    trace: 'on-first-retry',
    ignoreHTTPSErrors: true,
  },
  reporter: [['html', { open: 'never' }], ['list']],
});
