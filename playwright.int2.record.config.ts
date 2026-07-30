import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './int2-ihm-tests',
  timeout: 30000,
  use: {
    baseURL: 'https://orion-int2.itsap.net',
    headless: false,
    screenshot: 'on',
    trace: 'on',
    video: 'on',
    ignoreHTTPSErrors: true,
    launchOptions: {
      slowMo: 250,
    },
  },
  reporter: [['html', { open: 'never' }], ['list']],
});