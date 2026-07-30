import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'int2-ihm-tests',
  fullyParallel: false,
  forbidOnly: false,
  retries: 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'https://orion-int2.itsap.net',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: false, // ← HEADED MODE (visible browser)
  },
  webServer: undefined,
});
