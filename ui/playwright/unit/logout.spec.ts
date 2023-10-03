import { test as base } from '@playwright/test';
import { HackathonListPage } from '../pageObjectModel/admin-hackathon-list-page';
import { LoginPage } from '../pageObjectModel/login-page';

const test = base.extend<{
  login: LoginPage;
  hackathonListPage: HackathonListPage;
}>({
  login: async ({ page }, use) => {
    const login = new LoginPage(page);
    await use(login);
  },
  hackathonListPage: async ({ page }, use) => {
    const hackathonListPage = new HackathonListPage(page);
    await use(hackathonListPage);
  },
});

test.beforeEach(async ({ page, login, hackathonListPage }) => {
  await page.goto('/');
  await page.getByText('Hackathon').click();
  await login.inputCredentials('admin', 'secret');
  await login.attemptLogin();
  await hackathonListPage.verifyLoginSuccess();
});

test('admin can successfully log out', async ({ login, hackathonListPage }) => {
  await hackathonListPage.logoutUsingDropdown();
  await login.verifyLogoutSuccess();
});
