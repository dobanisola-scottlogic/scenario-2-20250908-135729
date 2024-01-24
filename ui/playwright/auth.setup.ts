import test from '~/fixtures';
import { initialURL } from '~/helpers';

const adminFile = 'playwright/.auth/admin.json';

test('admin login storage state', async ({
  page,
  login,
  hackathonListPage,
}) => {
  await page.goto(initialURL);
  await login.inputCredentials('admin', 'secret');
  await login.attemptLogin();
  await hackathonListPage.verifyLoginSuccess();
  await page.context().storageState({ path: adminFile });
});

// This will be usable after HAC-305 bugfix
/*
const teamFile = 'playwright/.auth/team.json';

test('team login storage state', async ({
  page,
  login,
  createHackathonPage,
  createTeamPage,
  teamDashboardPage
}) => {
  await createHackathonPage.createHackathonUsingAPIWithName(teamStateHackathon);
    await createTeamPage.createTeamUsingAPIWithHackathonAndTeamName(
      teamStateHackathon,
      teamName
    );
    await page.goto(initialURL);
    await login.inputCredentials(teamName, 'teamPassword');
    await login.attemptLogin();
    await teamDashboardPage.verifyLoginSuccess();
  await page.context().storageState({ path: teamFile });
});
*/
