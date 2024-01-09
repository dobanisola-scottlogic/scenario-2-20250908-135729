import test from '../fixtures';
import { HackathonHelpers } from '../helpers';

const invalidCharacterErrors = new HackathonHelpers().invalidCharacterErrors;
const uniqueHackathonId = new HackathonHelpers().generateRandomString;
const initialURL = new HackathonHelpers().initialURL;
let hackathonName = '';

test.beforeEach(
  async ({ login, page, hackathonListPage, createHackathonPage }) => {
    hackathonName = 'createHackathon' + uniqueHackathonId;
    await page.goto(initialURL);
    await login.inputCredentials('admin', 'secret');
    await login.attemptLogin();
    await hackathonListPage.verifyLoginSuccess();
    await hackathonListPage.openCreateHackathonPopup();
    await createHackathonPage.verifyCreateHackathonPopUp('Add a new hackathon');
  }
);

test.afterEach(async ({ hackathonListPage }) => {
  await hackathonListPage.clearAnyExistingHackathonWithName(hackathonName);
});

test('admin can create a new hackathon and verify default map and bot', async ({
  createHackathonPage,
  hackathonListPage,
  commonPageObjects,
  hackathonDetailsPage,
}) => {
  await createHackathonPage.inputHackathonName(hackathonName);
  await createHackathonPage.addNewHackathon();
  await commonPageObjects.confirmSuccessMessageIs(
    'Hackathon created successfully!'
  );
  await hackathonListPage.checkExistenceOfHackathonInTableWithName(
    hackathonName,
    true
  );
  await hackathonListPage.clearAnyExistingHackathonWithName(hackathonName);
  await hackathonListPage.verifyHackathonDetails(
    hackathonName,
    'Easy',
    'Milestone1Bot'
  );
  await hackathonListPage.openTheHackathonPage(hackathonName);
  await hackathonDetailsPage.verifyMilestoneInformationHasDetails(
    'Easy',
    'Milestone1Bot'
  );
});

test('admin can create a new hackathon using enter key', async ({
  createHackathonPage,
  hackathonListPage,
  commonPageObjects,
  page,
}) => {
  await createHackathonPage.inputHackathonName(hackathonName);
  await page.keyboard.press('Enter');
  await commonPageObjects.confirmSuccessMessageIs(
    'Hackathon created successfully!'
  );
  await hackathonListPage.checkExistenceOfHackathonInTableWithName(
    hackathonName,
    true
  );
  await hackathonListPage.verifyHackathonDetails(
    hackathonName,
    'Easy',
    'Milestone1Bot'
  );
});

test('admin cannot create a hackathon where the name already exists with different casing', async ({
  createHackathonPage,
  commonPageObjects,
  hackathonListPage,
}) => {
  await createHackathonPage.inputHackathonName('DuplicateName');
  await createHackathonPage.addNewHackathon();
  await commonPageObjects.confirmSuccessMessageIs(
    'Hackathon created successfully!'
  );
  await hackathonListPage.openCreateHackathonPopup();
  await createHackathonPage.inputHackathonName('duplicatename');
  await createHackathonPage.addNewHackathon();
  await commonPageObjects.confirmErrorMessageIs(
    'Error creating hackathon - Hackathon with ID duplicatename already exists'
  );
});

test('admin cannot enter more than 255 characters for a hackathon name', async ({
  createHackathonPage,
}) => {
  await createHackathonPage.inputHackathonName('a'.repeat(256));
  await createHackathonPage.validateHackathonName('a'.repeat(255));
});

test('admin cannot create a new hackathon without a name', async ({
  createHackathonPage,
}) => {
  await createHackathonPage.inputHackathonName(hackathonName);
  await createHackathonPage.clearHackathonName();
  await createHackathonPage.verifyCreateHackathonPopUp('Add a new hackathon');
});

for (const invalidCharacterError of invalidCharacterErrors) {
  test(`hackathon cannot be created if the hackathon name has ${invalidCharacterError.errorReason}`, async ({
    createHackathonPage,
    commonPageObjects,
  }) => {
    await createHackathonPage.inputHackathonName(
      invalidCharacterError.invalidName
    );
    await commonPageObjects.confirmValidationMessageExistsForTheField(
      'Hackathon'
    );
  });
}

test('admin can cancel creating a new hackathon', async ({
  createHackathonPage,
  hackathonListPage,
  commonPageObjects,
}) => {
  await createHackathonPage.inputHackathonName(hackathonName);
  await commonPageObjects.cancelCurrentAction();
  await commonPageObjects.confirmPopupIsHidden();
  await hackathonListPage.checkExistenceOfHackathonInTableWithName(
    hackathonName,
    false
  );
});

test('internal server error message will appear', async ({
  createHackathonPage,
  commonPageObjects,
}) => {
  await createHackathonPage.inputHackathonName(hackathonName);
  await createHackathonPage.mock500ErrorOnCreatingHackathon();
  await commonPageObjects.confirmErrorMessageIs(
    'Error creating hackathon - internal server error'
  );
});
