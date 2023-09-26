import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright',
  outputDir: './playwright/report/trace',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html', { outputFolder: 'playwright/report/results' }]],
  use: {
    baseURL: 'http://localhost:5173',
    httpCredentials: {
      username: 'admin',
      password: 'secret',
    },
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
