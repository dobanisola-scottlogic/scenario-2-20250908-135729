import { test as base } from '@playwright/test';
import { HackathonHelpers } from '../helpers';
import { HackathonListPage } from '../pageObjectModel/admin-hackathon-list-page';
import { CommonPageObjects } from '../pageObjectModel/common-page-objects';
import { CreateHackathonPage } from '../pageObjectModel/create-hackathon-page';
import { DeleteTeamPage } from '../pageObjectModel/delete-team-page';
import { LoginPage } from '../pageObjectModel/login-page';

const test = base.extend<{
  createHackathonPage: CreateHackathonPage;
  hackathonListPage: HackathonListPage;
  deleteTeamPage: DeleteTeamPage;
  commonPageObjects: CommonPageObjects;
}>({
  createHackathonPage: async ({ page }, use) => {
    const createHackathonPage = new CreateHackathonPage(page);
    await use(createHackathonPage);
  },
  hackathonListPage: async ({ page }, use) => {
    const hackathonListPage = new HackathonListPage(page);
    await use(hackathonListPage);
  },
  deleteTeamPage: async ({ page }, use) => {
    const deleteTeamPage = new DeleteTeamPage(page);
    await use(deleteTeamPage);
  },
  commonPageObjects: async ({ page }, use) => {
    const commonPageObjects = new CommonPageObjects(page);
    await use(commonPageObjects);
  },
});

const uniqueHackId = new HackathonHelpers();
let hackathonAndTeamName = '';

test.beforeEach(
  async ({
    page,
    createHackathonPage,
    hackathonListPage,
    deleteTeamPage,
    commonPageObjects,
  }) => {
    const login = new LoginPage(page);
    hackathonAndTeamName = 'deleteTeam_' + uniqueHackId.generateRandomString();
    await createHackathonPage.createHackathonUsingAPIWithName(
      hackathonAndTeamName
    );
    await deleteTeamPage.createTeamUsingAPIWithName(hackathonAndTeamName);
    await page.goto('/');
    await login.inputCredentials('admin', 'secret');
    await login.attemptLogin();
    await hackathonListPage.verifyLoginSuccess();
    await hackathonListPage.openTheHackathonPage(hackathonAndTeamName);
    await deleteTeamPage.openDeletePopupOfTeamWithName(hackathonAndTeamName);
    await commonPageObjects.confirmPopupIsVisible();
  }
);

test.afterEach(async ({ hackathonListPage }) => {
  await hackathonListPage.clearAnyExistingHackathonWithName(
    hackathonAndTeamName
  );
});

test('team can be successfully deleted and subsequent alert can be closed', async ({
  deleteTeamPage,
  commonPageObjects,
}) => {
  await deleteTeamPage.deleteTeam();
  await commonPageObjects.confirmSuccessMessageIs('Team deleted successfully!');
  await commonPageObjects.closeSuccessAlert();
  await commonPageObjects.confirmSuccessAlertDoesNotExist();
});

test('team deletion can be cancelled', async ({
  deleteTeamPage,
  commonPageObjects,
}) => {
  await deleteTeamPage.cancelTeamDeletion();
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
