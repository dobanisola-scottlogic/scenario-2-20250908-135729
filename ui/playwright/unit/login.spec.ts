import { test as base } from '@playwright/test';
import { HackathonListPage } from '../pageObjectModel/admin-hackathon-list-page';
import { CommonPageObjects } from '../pageObjectModel/common-page-objects';
import { LoginPage } from '../pageObjectModel/login-page';
import { TeamDashboardPage } from '../pageObjectModel/team-dashboard-page';

const emptyFieldErrors: {
  username: string;
  password: string;
}[] = [
  { username: '', password: '' },
  { username: 'admin', password: ' ' },
  { username: ' ', password: 'secret' },
];

const test = base.extend<{
  login: LoginPage;
  hackathonListPage: HackathonListPage;
  teamDashboardPage: TeamDashboardPage;
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
  teamDashboardPage: async ({ page }, use) => {
    const teamDashboardPage = new TeamDashboardPage(page);
    await use(teamDashboardPage);
  },
  commonPageObjects: async ({ page }, use) => {
    const commonPageObjects = new CommonPageObjects(page);
    await use(commonPageObjects);
  },
});

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByText('Hackathon').click();
});

test('admin can successfully log in', async ({ login, hackathonListPage }) => {
  await login.inputCredentials('admin', 'secret');
  await login.attemptLogin();
  await hackathonListPage.verifyLoginSuccess();
});

test('admin can successfully log in with enter key', async ({
  login,
  hackathonListPage,
  page,
}) => {
  await login.inputCredentials('admin', 'secret');
  await page.keyboard.press('Enter');
  await hackathonListPage.verifyLoginSuccess();
});

test('team can successfully log in', async ({ login, teamDashboardPage }) => {
  await login.inputCredentials('team', 'secret');
  await login.mockTeamLogin();
  await teamDashboardPage.verifyLoginSuccess();
});

for (const emptyFieldError of emptyFieldErrors) {
  test(`username '${emptyFieldError.username}' and password '${emptyFieldError.password}' returns empty fields error message`, async ({
    login,
    commonPageObjects,
  }) => {
    await login.inputCredentials(
      emptyFieldError.username,
      emptyFieldError.password
    );
    await login.attemptLogin();
    await commonPageObjects.confirmErrorMessageIs(
      'Username and password cannot be empty.'
    );
  });
}

test("invalid username and password returns 'unable to login' error message", async ({
  login,
  commonPageObjects,
}) => {
  await login.inputCredentials('admin', 'wrong');
  await login.attemptLogin();
  await commonPageObjects.confirmErrorMessageIs(
    'Invalid username or password. Please check your credentials.'
  );
});

test("uncaught error returns 'please try again later' error message", async ({
  login,
  commonPageObjects,
}) => {
  await login.inputCredentials('error', 'unknown');
  await login.mockUncaughtErrorOnLogin();
  await commonPageObjects.confirmErrorMessageIs(
    "Sorry, we couldn't log you in. Please try again later."
  );
});

test('password visibility can be toggled on and off', async ({ login }) => {
  await login.inputPassword('toggleVisibility');
  await login.verifyPasswordIs('hidden');
  await login.clickVisibilityButton();
  await login.verifyPasswordIs('visible');
  await login.clickVisibilityButton();
  await login.verifyPasswordIs('hidden');
});
