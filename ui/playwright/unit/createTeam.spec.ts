import { test as base } from '@playwright/test';
import { HackathonHelpers } from '../helpers';
import { HackathonDetailsPage } from '../pageObjectModel/admin-hackathon-details-page';
import { HackathonListPage } from '../pageObjectModel/admin-hackathon-list-page';
import { CommonPageObjects } from '../pageObjectModel/common-page-objects';
import { CreateHackathonPage } from '../pageObjectModel/create-hackathon-page';
import { CreateTeamPage } from '../pageObjectModel/create-team-page';
import { LoginPage } from '../pageObjectModel/login-page';

const test = base.extend<{
  createHackathonPage: CreateHackathonPage;
  createTeamPage: CreateTeamPage;
  hackathonListPage: HackathonListPage;
  hackathonDetailsPage: HackathonDetailsPage;
  commonPageObjects: CommonPageObjects;
}>({
  createHackathonPage: async ({ page }, use) => {
    const createHackathonPage = new CreateHackathonPage(page);
    await use(createHackathonPage);
  },
  createTeamPage: async ({ page }, use) => {
    const createTeamPage = new CreateTeamPage(page);
    await use(createTeamPage);
  },
  hackathonListPage: async ({ page }, use) => {
    const hackathonListPage = new HackathonListPage(page);
    await use(hackathonListPage);
  },
  hackathonDetailsPage: async ({ page }, use) => {
    const hackathonDetailsPage = new HackathonDetailsPage(page);
    await use(hackathonDetailsPage);
  },
  commonPageObjects: async ({ page }, use) => {
    const commonPageObjects = new CommonPageObjects(page);
    await use(commonPageObjects);
  },
});

const uniqueHackathonId = new HackathonHelpers();
let hackathonName = '';
let teamName = '';

test.beforeEach(
  async ({
    page,
    createHackathonPage,
    hackathonListPage,
    hackathonDetailsPage,
    commonPageObjects,
  }) => {
    const login = new LoginPage(page);
    hackathonName = teamName =
      'deleteTeam_' + uniqueHackathonId.generateRandomString();
    await createHackathonPage.createHackathonUsingAPIWithName(hackathonName);
    await page.goto('/');
    await login.inputCredentials('admin', 'secret');
    await login.attemptLogin();
    await hackathonListPage.verifyLoginSuccess();
    await hackathonListPage.openTheHackathonPage(hackathonName);
    await hackathonDetailsPage.openCreateTeamPopup();
    await commonPageObjects.confirmPopupIsVisible();
  }
);

test.afterEach(async ({ hackathonListPage }) => {
  await hackathonListPage.clearAnyExistingHackathonWithName(hackathonName);
});

test('multiple teams can be created', async ({
  createTeamPage,
  commonPageObjects,
  hackathonDetailsPage,
}) => {
  await createTeamPage.inputTeamName(teamName);
  await createTeamPage.inputTeamPassword('teamPassword');
  await createTeamPage.addNewTeam();
  await commonPageObjects.confirmSuccessMessageIs('Team added successfully!');
  await commonPageObjects.closeSuccessAlert();
  await hackathonDetailsPage.openCreateTeamPopup();
  await commonPageObjects.confirmPopupIsVisible();
  await createTeamPage.inputTeamName('secondTeam');
  await createTeamPage.inputTeamPassword('teamPassword');
  await createTeamPage.addNewTeam();
  await commonPageObjects.confirmSuccessMessageIs('Team added successfully!');
  await commonPageObjects.closeSuccessAlert();
  await hackathonDetailsPage.verifyTeamExistsWithName(teamName);
  await hackathonDetailsPage.verifyTeamExistsWithName('secondTeam');
});

test('admin can cancel creation of a new team', async ({
  commonPageObjects,
}) => {
  await commonPageObjects.cancelCurrentAction();
  await commonPageObjects.confirmPopupIsHidden();
});

test('team popup contains the expected fields in the expected initial states', async ({
  createTeamPage,
}) => {
  await createTeamPage.verifyCreateTeamPopUpWithFieldLabels('Name', 'Password');
});

test('team cannot be created if fields are missing', async ({
  createTeamPage,
}) => {
  await createTeamPage.inputTeamName(teamName);
  await createTeamPage.verifyTeamCannotBeCreated();
  await createTeamPage.clearTeamName();
  await createTeamPage.inputTeamPassword('teamPassword');
  await createTeamPage.verifyTeamCannotBeCreated();
});

test('team cannot be created if team with the same name already exists', async ({
  createTeamPage,
  commonPageObjects,
  hackathonDetailsPage,
}) => {
  await createTeamPage.inputTeamName(teamName);
  await createTeamPage.inputTeamPassword('teamPassword');
  await createTeamPage.addNewTeam();
  await commonPageObjects.confirmSuccessMessageIs('Team added successfully!');
  await hackathonDetailsPage.openCreateTeamPopup();
  await commonPageObjects.confirmPopupIsVisible();
  await createTeamPage.inputTeamName(teamName);
  await createTeamPage.inputTeamPassword('teamPassword');
  await createTeamPage.addNewTeam();
  await commonPageObjects.confirmErrorMessageIs(
    'Error adding team - internal server error'
  );
});

test('bad request error will appear', async ({
  createTeamPage,
  commonPageObjects,
}) => {
  await createTeamPage.inputTeamName(teamName);
  await createTeamPage.inputTeamPassword('teamPassword');
  await createTeamPage.mock400ErrorOnCreatingTeam();
  await commonPageObjects.confirmErrorMessageIs(
    'Error adding team - bad request'
  );
});
