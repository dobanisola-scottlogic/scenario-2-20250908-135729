import { test as base } from '@playwright/test';
import { HackathonListPage } from '../pageObjectModel/admin-hackathon-list-page';
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
});

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('admin can successfully log in', async ({ login, hackathonListPage }) => {
  await login.inputCredentials('admin', 'secret');
  await login.attemptLogin();
  await hackathonListPage.verifyLoginSuccess();
});

test('team can successfully log in', async ({ login, teamDashboardPage }) => {
  await login.inputCredentials('team', 'secret');
  await login.mockTeamLogin();
  await teamDashboardPage.verifyLoginSuccess();
});

for (const creds of emptyFieldErrors) {
  test(`username '${creds.username}' and password '${creds.password}' returns empty fields error message`, async ({
    login,
  }) => {
    await login.inputCredentials(creds.username, creds.password);
    await login.attemptLogin();
    await login.verifyLoginErrorIs('Username and password cannot be empty.');
  });
}

test("invalid username and password returns 'unable to login' error message", async ({
  login,
}) => {
  await login.inputCredentials('admin', 'wrong');
  await login.attemptLogin();
  await login.verifyLoginErrorIs(
    'Invalid username or password. Please check your credentials.'
  );
});

test("uncaught error returns 'please try again later' error message", async ({
  login,
}) => {
  await login.inputCredentials('error', 'unknown');
  await login.mockUncaughtErrorOnLogin();
  await login.verifyLoginErrorIs(
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
