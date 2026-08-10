import { defineConfig, devices } from '@playwright/test';
import { getEnvironment } from './src/config/environment';
import 'dotenv/config'

const env = getEnvironment();
if (!process.env.TEST_WORKER_INDEX) {
  console.log(`[config] Running tests against "${env.envName}" (${env.baseUrl})`);
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: env.baseUrl,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: '**/get-open-prs.spec.ts',
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: '**/get-open-prs.spec.ts',
    },
  ],
});
