import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: false, // need visible browser for manual login flows
    viewport: { width: 1280, height: 720 },
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
  },
  timeout: 120_000,
});
