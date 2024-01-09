import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright',
  outputDir: './playwright/report/trace',
  globalTeardown: './playwright/global-teardown',
  timeout: 50000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'playwright/report/results' }]],
  use: {
    baseURL: 'http://localhost:8080/application/',
    httpCredentials: {
      username: 'admin',
      password: 'secret',
    },
    trace: 'retain-on-failure',
    permissions: ['clipboard-read', 'clipboard-write'],
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8080/application/ui',
    reuseExistingServer: !process.env.CI,
  },
});
