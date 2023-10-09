import { test as base } from '@playwright/test';
import { HackathonListPage } from '../pageObjectModel/admin-hackathon-list-page';
import { CommonPageObjects } from '../pageObjectModel/common-page-objects';
import { LoginPage } from '../pageObjectModel/login-page';

const test = base.extend<{
  login: LoginPage;
  hackathonListPage: HackathonListPage;
  commonPageObjects: CommonPageObjects;
}>({
  login: async ({ page }, use) => {
    const login = new LoginPage(page);
    await use(login);
  },
  hackathonListPage: async ({ page }, use) => {
    const hackathonListPage = new HackathonListPage(page);
    await use(hackathonListPage);
  },
  commonPageObjects: async ({ page }, use) => {
    const commonPageObjects = new CommonPageObjects(page);
    await use(commonPageObjects);
  },
});

test.beforeEach(async ({ page, login, hackathonListPage }) => {
  await page.goto('/');
  await page.getByText('Hackathon').click();
  await login.inputCredentials('admin', 'secret');
  await login.attemptLogin();
  await hackathonListPage.verifyLoginSuccess();
});

test('admin can successfully log out', async ({ login, commonPageObjects }) => {
  await commonPageObjects.logoutUsingDropdown();
  await login.verifyLogoutSuccess();
});
