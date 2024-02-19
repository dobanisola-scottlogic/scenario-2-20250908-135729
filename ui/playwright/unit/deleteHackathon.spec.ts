import test from '~/fixtures';
import { generateUniqueName, initialURL } from '~/helpers';

const hackathonName = generateUniqueName('deleteHackathon');

test.use({ storageState: 'playwright/.auth/admin.json' });

test.beforeEach(
  async ({
    page,
    createHackathonPage,
    hackathonListPage,
    commonPageObjects,
  }) => {
    await createHackathonPage.createHackathonUsingAPIWithName(hackathonName);
    await page.goto(initialURL);
    await hackathonListPage.openDeletePopupOfHackathonWithName(hackathonName);
    await commonPageObjects.confirmPopupIsVisible();
  }
);

test.afterEach(async ({ hackathonListPage }) => {
  await hackathonListPage.clearAnyExistingHackathonWithName(hackathonName);
});

test('hackathon can be successfully deleted and subsequent alert can be closed', async ({
  deleteHackathonPage,
  hackathonListPage,
  commonPageObjects,
}) => {
  await deleteHackathonPage.deleteHackathon();
  await commonPageObjects.confirmSuccessMessageIs(
    'Hackathon deleted successfully!'
  );
  await commonPageObjects.closeSuccessAlert();
  await commonPageObjects.confirmSuccessAlertDoesNotExist();
  await hackathonListPage.checkExistenceOfHackathonInTableWithName(
    hackathonName,
    false
  );
});

test('hackathon can be successfully deleted with enter key', async ({
  hackathonListPage,
  commonPageObjects,
  page,
}) => {
  await page.keyboard.press('Enter');
  await commonPageObjects.confirmSuccessMessageIs(
    'Hackathon deleted successfully!'
  );
  await commonPageObjects.closeSuccessAlert();
  await commonPageObjects.confirmSuccessAlertDoesNotExist();
  await hackathonListPage.checkExistenceOfHackathonInTableWithName(
    hackathonName,
    false
  );
});

test('hackathon deletion can be cancelled', async ({ commonPageObjects }) => {
  await commonPageObjects.cancelCurrentAction();
  await commonPageObjects.confirmSuccessAlertDoesNotExist();
});

test('hackathon popup has the expected text', async ({ commonPageObjects }) => {
  await commonPageObjects.confirmPopupTextIs(
    'Are you sure you want to delete the hackathon?',
    'This will delete teams and games in the hackathon as well. You cannot undo this action.'
  );
});

test('bad request error message will appear', async ({
  deleteHackathonPage,
  commonPageObjects,
}) => {
  await deleteHackathonPage.mock400ErrorOnDeletingHackathon();
  await commonPageObjects.confirmErrorMessageIs(
    'Error deleting hackathon - bad request'
  );
});

test('internal server error message will appear', async ({
  deleteHackathonPage,
  commonPageObjects,
}) => {
  await deleteHackathonPage.mock500ErrorOnDeletingHackathon();
  await commonPageObjects.confirmErrorMessageIs(
    'Error deleting hackathon - internal server error'
  );
});
