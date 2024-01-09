import { HackathonHelpers } from 'playwright/helpers';
import test from '../fixtures';

const emptyFields: {
  username: string;
  password: string;
}[] = [
  { username: '', password: '' },
  { username: 'admin', password: ' ' },
  { username: ' ', password: 'secret' },
];

const uniqueHackathonId = new HackathonHelpers().generateRandomString;
const initialURL = new HackathonHelpers().initialURL;
let hackathonName = '';
let teamName = '';

test.beforeEach(async ({ page }) => {
  await page.goto(initialURL);
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

test('team can successfully log in', async ({
  login,
  createHackathonPage,
  createTeamPage,
  teamDashboardPage,
}) => {
  hackathonName = teamName = 'login' + uniqueHackathonId;
  await createHackathonPage.createHackathonUsingAPIWithName(hackathonName);
  await createTeamPage.createTeamUsingAPIWithHackathonAndTeamName(
    hackathonName,
    teamName
  );
  await login.inputCredentials(teamName, 'teamPassword');
  await login.attemptLogin();
  await teamDashboardPage.verifyLoginSuccess();
});

test('username and password fields cannot exceed 255 characters', async ({
  login,
}) => {
  await login.inputCredentials('a'.repeat(256), 'b'.repeat(256));
  await login.validateUsername('a'.repeat(255));
  await login.validatePassword('b'.repeat(255));
});

for (const emptyField of emptyFields) {
  test(`username '${emptyField.username}' and password '${emptyField.password}' disables the login button`, async ({
    login,
  }) => {
    await login.inputCredentials(emptyField.username, emptyField.password);
    await login.verifyLoginButtonIsDisabled();
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
