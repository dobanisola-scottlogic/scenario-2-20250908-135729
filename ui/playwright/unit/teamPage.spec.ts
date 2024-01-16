import test from '~/fixtures';
import { generateUniqueName, initialURL } from '~/helpers';

const hackathonName = generateUniqueName('teamPage');
const teamName = hackathonName;

test.beforeEach(async ({ page, createHackathonPage, createTeamPage }) => {
  await createHackathonPage.createHackathonUsingAPIWithName(hackathonName);
  await createTeamPage.createTeamUsingAPIWithHackathonAndTeamName(
    hackathonName,
    teamName
  );
  await page.goto(initialURL);
});

test.afterEach(async ({ hackathonListPage }) => {
  await hackathonListPage.clearAnyExistingHackathonWithName(hackathonName);
});

test('milestone information is correct initially and when updated', async ({
  login,
  teamDashboardPage,
  editHackathonPage,
  commonPageObjects,
}) => {
  await login.inputCredentials(teamName, 'teamPassword');
  await login.attemptLogin();
  await teamDashboardPage.verifyLoginSuccess();
  await teamDashboardPage.verifyMilestoneInformationIs({
    map: 'Easy',
    bot: 'Milestone1Bot',
  });
  await editHackathonPage.updateHackathonDetailsViaAPITo(
    hackathonName.toLowerCase(),
    'Medium',
    'Milestone2Bot'
  );
  await commonPageObjects.refreshPage();
  await teamDashboardPage.verifyMilestoneInformationIs({
    map: 'Medium',
    bot: 'Milestone2Bot',
  });
});

test('Can interact with the "connect" button', async ({
  login,
  teamDashboardPage,
}) => {
  await login.inputCredentials(teamName, 'teamPassword');
  await login.attemptLogin();
  await teamDashboardPage.verifyLoginSuccess();
  await teamDashboardPage.clickConnectButton();
});
