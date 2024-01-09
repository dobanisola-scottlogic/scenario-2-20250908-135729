import test from '../fixtures';
import { HackathonHelpers } from '../helpers';

const uniqueHackathonId = new HackathonHelpers().generateRandomString;
const initialURL = new HackathonHelpers().initialURL;
let hackathonName = '';
let teamName = '';

test.beforeEach(
  async ({
    login,
    page,
    createHackathonPage,
    hackathonListPage,
    deleteTeamPage,
    createTeamPage,
    commonPageObjects,
  }) => {
    hackathonName = teamName = 'deleteTeam' + uniqueHackathonId;
    await createHackathonPage.createHackathonUsingAPIWithName(hackathonName);
    await createTeamPage.createTeamUsingAPIWithHackathonAndTeamName(
      hackathonName,
      teamName
    );
    await page.goto(initialURL);
    await login.inputCredentials('admin', 'secret');
    await login.attemptLogin();
    await hackathonListPage.verifyLoginSuccess();
    await hackathonListPage.openTheHackathonPage(hackathonName);
    await deleteTeamPage.openDeletePopupOfTeamWithName(hackathonName);
    await commonPageObjects.confirmPopupIsVisible();
  }
);

test.afterEach(async ({ hackathonListPage }) => {
  await hackathonListPage.clearAnyExistingHackathonWithName(hackathonName);
});

test('team can be successfully deleted and subsequent alert can be closed', async ({
  deleteTeamPage,
  commonPageObjects,
  hackathonDetailsPage,
}) => {
  await deleteTeamPage.deleteTeam();
  await commonPageObjects.confirmSuccessMessageIs('Team deleted successfully!');
  await commonPageObjects.closeSuccessAlert();
  await commonPageObjects.confirmSuccessAlertDoesNotExist();
  await hackathonDetailsPage.checkExistenceOfTeamInTableWithName(
    teamName,
    false
  );
});

test('team can be successfully deleted with enter key', async ({
  commonPageObjects,
  hackathonDetailsPage,
  page,
}) => {
  await page.keyboard.press('Enter');
  await commonPageObjects.confirmSuccessMessageIs('Team deleted successfully!');
  await commonPageObjects.closeSuccessAlert();
  await commonPageObjects.confirmSuccessAlertDoesNotExist();
  await hackathonDetailsPage.checkExistenceOfTeamInTableWithName(
    teamName,
    false
  );
});

test('team deletion can be cancelled', async ({ commonPageObjects }) => {
  await commonPageObjects.cancelCurrentAction();
  await commonPageObjects.confirmSuccessAlertDoesNotExist();
});

test('team popup has the expected text', async ({ commonPageObjects }) => {
  await commonPageObjects.confirmPopupTextIs(
    'Are you sure you want to delete the team?',
    "This will delete the team's games as well. You cannot undo this action."
  );
});

test('bad request error message will appear', async ({
  deleteTeamPage,
  commonPageObjects,
}) => {
  await deleteTeamPage.mock400ErrorOnTeamDeletion();
  await commonPageObjects.confirmErrorMessageIs(
    'Error deleting team - bad request'
  );
});

test('internal server error message will appear', async ({
  deleteTeamPage,
  commonPageObjects,
}) => {
  await deleteTeamPage.mock500ErrorOnTeamDeletion();
  await commonPageObjects.confirmErrorMessageIs(
    'Error deleting team - internal server error'
  );
});
