import test from '~/fixtures';
import { generateUniqueName, initialURL } from '~/helpers';

const hackathonName = generateUniqueName('teamPage');
const teamName = hackathonName;

test.beforeEach(
  async ({
    page,
    login,
    teamDashboardPage,
    createHackathonPage,
    createTeamPage,
  }) => {
    await createHackathonPage.createHackathonUsingAPIWithName(hackathonName);
    await createTeamPage.createTeamUsingAPIWithHackathonAndTeamName(
      hackathonName,
      teamName
    );
    await page.goto(initialURL);
    await login.inputCredentials(teamName, 'teamPassword');
    await login.attemptLogin();
    await teamDashboardPage.verifyLoginSuccess();
  }
);

test.afterEach(async ({ hackathonListPage }) => {
  await hackathonListPage.clearAnyExistingHackathonWithName(hackathonName);
});

test('milestone information is correct initially and when updated', async ({
  teamDashboardPage,
  editHackathonPage,
  commonPageObjects,
}) => {
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

test('Team can trigger a connection listener', async ({
  teamDashboardPage,
}) => {
  await teamDashboardPage.verifyConnectionStatusIs('Disconnected');
  await teamDashboardPage.clickConnectButton();
  await teamDashboardPage.clickRefreshButton();
  await teamDashboardPage.verifyConnectionStatusIs(
    'Waiting for you to start your bot'
  );
});
