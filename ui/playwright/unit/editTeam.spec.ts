import { test as base } from '@playwright/test';
import { HackathonHelpers } from '../helpers';
import { HackathonDetailsPage } from '../pageObjectModel/admin-hackathon-details-page';
import { HackathonListPage } from '../pageObjectModel/admin-hackathon-list-page';
import { CommonPageObjects } from '../pageObjectModel/common-page-objects';
import { CreateHackathonPage } from '../pageObjectModel/create-hackathon-page';
import { CreateTeamPage } from '../pageObjectModel/create-team-page';
import { EditTeamPage } from '../pageObjectModel/edit-team-page';
import { LoginPage } from '../pageObjectModel/login-page';

const test = base.extend<{
  createHackathonPage: CreateHackathonPage;
  hackathonListPage: HackathonListPage;
  hackathonDetailsPage: HackathonDetailsPage;
  editTeamPage: EditTeamPage;
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
  editTeamPage: async ({ page }, use) => {
    const editTeamPage = new EditTeamPage(page);
    await use(editTeamPage);
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

const invalidCharacterErrors = new HackathonHelpers().invalidCharacterErrors;

test.beforeEach(
  async ({
    page,
    createHackathonPage,
    hackathonListPage,
    editTeamPage,
    createTeamPage,
    commonPageObjects,
  }) => {
    const login = new LoginPage(page);
    hackathonName = teamName = 'updateTeam' + uniqueHackathonId;
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
    await editTeamPage.openEditPopupOfTeamWithName(teamName);
    await commonPageObjects.confirmPopupIsVisible();
  }
);

test.afterEach(async ({ hackathonListPage }) => {
  await hackathonListPage.clearAnyExistingHackathonWithName(hackathonName);
});

test('team and password can be successfully edited', async ({
  editTeamPage,
  commonPageObjects,
  hackathonDetailsPage,
}) => {
  await editTeamPage.clearTeamNameField();
  await editTeamPage.clearTeamPasswordField();
  await editTeamPage.enterTeamName(teamName + ' updated');
  await editTeamPage.enterTeamPassword('newTeamPassword');
  await editTeamPage.updateTeam();
  await commonPageObjects.confirmSuccessMessageIs('Team updated successfully');
  await commonPageObjects.closeSuccessAlert();
  await commonPageObjects.confirmSuccessAlertDoesNotExist();
  await hackathonDetailsPage.checkExistenceOfTeamInTableWithName(
    teamName + ' updated',
    true
  );
});

test('team updating can be cancelled', async ({ commonPageObjects }) => {
  await commonPageObjects.cancelCurrentAction();
  await commonPageObjects.confirmSuccessAlertDoesNotExist();
});

test('team cannot be updated if fields are missing', async ({
  editTeamPage,
}) => {
  await editTeamPage.clearTeamNameField();
  await editTeamPage.verifyTeamCannotBeUpdated();
  await editTeamPage.enterTeamName(teamName + ' updated');
  await editTeamPage.verifyTeamCanBeUpdated();
  await editTeamPage.clearTeamPasswordField();
  await editTeamPage.verifyTeamCannotBeUpdated();
});

for (const invalidCharacterError of invalidCharacterErrors) {
  test(`team cannot be created if the team name has ${invalidCharacterError.errorReason}`, async ({
    createTeamPage,
    commonPageObjects,
  }) => {
    await createTeamPage.inputTeamName(invalidCharacterError.invalidName);
    await commonPageObjects.confirmValidationMessageExistsForTheField('Team');
  });
}

test('internal server error returns on updating team name to one that already exists', async ({
  createTeamPage,
  editTeamPage,
  commonPageObjects,
}) => {
  const secondTeamName = 'anotherTeamName';
  await createTeamPage.createTeamUsingAPIWithHackathonAndTeamName(
    hackathonName,
    secondTeamName
  );
  await commonPageObjects.refreshPage();
  await editTeamPage.openEditPopupOfTeamWithName(secondTeamName);
  await commonPageObjects.confirmPopupIsVisible();
  await editTeamPage.clearTeamNameField();
  await editTeamPage.clearTeamPasswordField();
  await editTeamPage.enterTeamName(teamName);
  await editTeamPage.enterTeamPassword('newTeamPassword');
  await editTeamPage.updateTeam();
  await commonPageObjects.confirmErrorMessageIs(
    'Error updating team - internal server error'
  );
});

test('bad request error message will appear', async ({
  editTeamPage,
  commonPageObjects,
}) => {
  await editTeamPage.mock400ErrorOnUpdatingTeam();
  await commonPageObjects.confirmErrorMessageIs(
    'Error updating team - bad request'
  );
});
