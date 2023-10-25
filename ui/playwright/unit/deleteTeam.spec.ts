import { test as base } from '@playwright/test';
import { HackathonHelpers } from '../helpers';
import { HackathonDetailsPage } from '../pageObjectModel/admin-hackathon-details-page';
import { HackathonListPage } from '../pageObjectModel/admin-hackathon-list-page';
import { CommonPageObjects } from '../pageObjectModel/common-page-objects';
import { CreateHackathonPage } from '../pageObjectModel/create-hackathon-page';
import { CreateTeamPage } from '../pageObjectModel/create-team-page';
import { DeleteTeamPage } from '../pageObjectModel/delete-team-page';
import { LoginPage } from '../pageObjectModel/login-page';

const test = base.extend<{
  createHackathonPage: CreateHackathonPage;
  hackathonListPage: HackathonListPage;
  hackathonDetailsPage: HackathonDetailsPage;
  deleteTeamPage: DeleteTeamPage;
  createTeamPage: CreateTeamPage;
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
  hackathonDetailsPage: async ({ page }, use) => {
    const hackathonDetailsPage = new HackathonDetailsPage(page);
    await use(hackathonDetailsPage);
  },
  deleteTeamPage: async ({ page }, use) => {
    const deleteTeamPage = new DeleteTeamPage(page);
    await use(deleteTeamPage);
  },
  createTeamPage: async ({ page }, use) => {
    const createTeamPage = new CreateTeamPage(page);
    await use(createTeamPage);
  },
  commonPageObjects: async ({ page }, use) => {
    const commonPageObjects = new CommonPageObjects(page);
    await use(commonPageObjects);
  },
});

const uniqueHackathonId = new HackathonHelpers().generateRandomString;
let hackathonName = '';
let teamName = '';

test.beforeEach(
  async ({
    page,
    createHackathonPage,
    hackathonListPage,
    deleteTeamPage,
    createTeamPage,
    commonPageObjects,
  }) => {
    const login = new LoginPage(page);
    hackathonName = teamName = 'deleteTeam' + uniqueHackathonId;
    await createHackathonPage.createHackathonUsingAPIWithName(hackathonName);
    await createTeamPage.createTeamUsingAPIWithHackathonAndTeamName(
      hackathonName,
      teamName
    );
    await page.goto('/');
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
