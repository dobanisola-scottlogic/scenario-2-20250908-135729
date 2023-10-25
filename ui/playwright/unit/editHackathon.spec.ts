import { test as base } from '@playwright/test';
import { HackathonHelpers } from '../helpers';
import { HackathonListPage } from '../pageObjectModel/admin-hackathon-list-page';
import { CommonPageObjects } from '../pageObjectModel/common-page-objects';
import { CreateHackathonPage } from '../pageObjectModel/create-hackathon-page';
import { EditHackathonPage } from '../pageObjectModel/edit-hackathon-page';
import { LoginPage } from '../pageObjectModel/login-page';

const test = base.extend<{
  editHackathonPage: EditHackathonPage;
  hackathonListPage: HackathonListPage;
  createHackathonPage: CreateHackathonPage;
  commonPageObjects: CommonPageObjects;
}>({
  editHackathonPage: async ({ page }, use) => {
    const editHackathonPage = new EditHackathonPage(page);
    await use(editHackathonPage);
  },
  hackathonListPage: async ({ page }, use) => {
    const hackathonListPage = new HackathonListPage(page);
    await use(hackathonListPage);
  },
  createHackathonPage: async ({ page }, use) => {
    const createHackathonPage = new CreateHackathonPage(page);
    await use(createHackathonPage);
  },
  commonPageObjects: async ({ page }, use) => {
    const commonPageObjects = new CommonPageObjects(page);
    await use(commonPageObjects);
  },
});

const uniqueHackathonId = new HackathonHelpers().generateRandomString;
let hackathonName = '';

test.beforeEach(
  async ({
    page,
    createHackathonPage,
    editHackathonPage,
    hackathonListPage,
  }) => {
    const login = new LoginPage(page);
    hackathonName = 'updateHackathon' + uniqueHackathonId;
    await page.goto('/');
    await page.getByText('Hackathon').click();
    await login.inputCredentials('admin', 'secret');
    await login.attemptLogin();
    await hackathonListPage.verifyLoginSuccess();
    await hackathonListPage.openCreateHackathonPopup();
    await createHackathonPage.inputHackathonName(hackathonName);
    await createHackathonPage.addNewHackathon();
    await hackathonListPage.verifyHackathonDetails(
      hackathonName,
      'Easy',
      'Milestone1Bot'
    );
    await hackathonListPage.openEditHackathonPopup(hackathonName);
    await editHackathonPage.verifyEditHackathonPopUp();
  }
);

test.afterEach(async ({ hackathonListPage }) => {
  await hackathonListPage.clearAnyExistingHackathonWithName(hackathonName);
});

test('verify dropdown lists in pop up', async ({ editHackathonPage }) => {
  await editHackathonPage.editMilestoneBot();
  await editHackathonPage.verifyMilestoneBotList();
  await editHackathonPage.editMilestoneMap();
  await editHackathonPage.verifyMilestoneMapList();
});

test('admin can edit a hackathon', async ({
  editHackathonPage,
  hackathonListPage,
}) => {
  await editHackathonPage.editMilestoneBot();
  await editHackathonPage.clickBotName('Milestone2Bot');
  await editHackathonPage.editMilestoneMap();
  await editHackathonPage.clickMapName('Hard');
  await editHackathonPage.clickUpdateHackathon();
  await editHackathonPage.verifyHackathonEdited(
    'Hackathon updated successfully!'
  );
  await hackathonListPage.verifyHackathonDetails(
    hackathonName,
    'Hard',
    'Milestone2Bot'
  );
});

test('admin can cancel editing a hackathon', async ({ commonPageObjects }) => {
  await commonPageObjects.cancelCurrentAction();
  await commonPageObjects.confirmSuccessAlertDoesNotExist();
});

test('bad request error message will appear', async ({
  editHackathonPage,
  commonPageObjects,
}) => {
  await editHackathonPage.editMilestoneBot();
  await editHackathonPage.clickBotName('Milestone2Bot');
  await editHackathonPage.editMilestoneMap();
  await editHackathonPage.clickMapName('Hard');
  await editHackathonPage.mock400ErrorOnUpdatingHackathon();
  await commonPageObjects.confirmErrorMessageIs(
    'Error updating hackathon - bad request'
  );
});

test('internal server error message will appear', async ({
  editHackathonPage,
  commonPageObjects,
}) => {
  await editHackathonPage.editMilestoneBot();
  await editHackathonPage.clickBotName('Milestone2Bot');
  await editHackathonPage.editMilestoneMap();
  await editHackathonPage.clickMapName('Hard');
  await editHackathonPage.mock500ErrorOnUpdatingHackathon();
  await commonPageObjects.confirmErrorMessageIs(
    'Error updating hackathon - internal server error'
  );
});
