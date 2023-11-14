import test from '../fixtures';
import { HackathonHelpers } from '../helpers';

const uniqueHackathonId = new HackathonHelpers().generateRandomString;
let hackathonName = '';

test.beforeEach(
  async ({
    login,
    page,
    createHackathonPage,
    editHackathonPage,
    hackathonListPage,
  }) => {
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

test('admin can edit a hackathon and see it be updated in the hackathon details page', async ({
  editHackathonPage,
  hackathonListPage,
  hackathonDetailsPage,
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
  await hackathonListPage.openTheHackathonPage(hackathonName);
  await hackathonDetailsPage.verifyMilestoneInformationHasDetails(
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
