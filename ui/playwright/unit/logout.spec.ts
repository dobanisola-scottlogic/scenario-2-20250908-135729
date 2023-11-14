import test from '../fixtures';
import { HackathonHelpers } from '../helpers';

const uniqueHackathonId = new HackathonHelpers();
let hackathonName = '';
let teamName = '';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('admin can successfully log out', async ({
  login,
  hackathonListPage,
  commonPageObjects,
}) => {
  await login.inputCredentials('admin', 'secret');
  await login.attemptLogin();
  await hackathonListPage.verifyLoginSuccess();
  await commonPageObjects.logoutOfAccountWithName('admin');
  await login.verifyLogoutSuccess();
});

test('team can successfully log out', async ({
  login,
  createHackathonPage,
  createTeamPage,
  teamDashboardPage,
  commonPageObjects,
  hackathonListPage,
}) => {
  hackathonName = teamName =
    'teamLogout' + uniqueHackathonId.generateRandomString;
  await createHackathonPage.createHackathonUsingAPIWithName(hackathonName);
  await createTeamPage.createTeamUsingAPIWithHackathonAndTeamName(
    hackathonName,
    teamName
  );
  await login.inputCredentials(teamName, 'teamPassword');
  await login.attemptLogin();
  await teamDashboardPage.verifyLoginSuccess();
  await commonPageObjects.logoutOfAccountWithName(teamName);
  await login.verifyLogoutSuccess();
  await hackathonListPage.clearAnyExistingHackathonWithName(hackathonName);
});
