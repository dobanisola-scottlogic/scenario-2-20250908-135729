import { test as base } from '@playwright/test';
import { HackathonHelpers } from '../helpers';
import { HackathonListPage } from '../pageObjectModel/admin-hackathon-list-page';
import { CreateHackathonPage } from '../pageObjectModel/create-hackathon-page';
import { DeleteHackathonPage } from '../pageObjectModel/delete-hackathon-page';
import { LoginPage } from '../pageObjectModel/login-page';

const test = base.extend<{
  deleteHackathonPage: DeleteHackathonPage;
  hackathonListPage: HackathonListPage;
  createHackathonPage: CreateHackathonPage;
}>({
  deleteHackathonPage: async ({ page }, use) => {
    const deleteHackathonPage = new DeleteHackathonPage(page);
    await use(deleteHackathonPage);
  },
  hackathonListPage: async ({ page }, use) => {
    const hackathonListPage = new HackathonListPage(page);
    await use(hackathonListPage);
  },
  createHackathonPage: async ({ page }, use) => {
    const createHackathonPage = new CreateHackathonPage(page);
    await use(createHackathonPage);
  },
});

const uniqueHackId = new HackathonHelpers();
let hackathonName = '';

test.beforeEach(
  async ({
    page,
    createHackathonPage,
    hackathonListPage,
    deleteHackathonPage,
  }) => {
    const login = new LoginPage(page);
    hackathonName = 'deleteHackathon_' + uniqueHackId.generateRandomString();
    await page.goto('/');
    await page.getByText('Hackathon').click();
    await login.inputCredentials('admin', 'secret');
    await login.attemptLogin();
    await hackathonListPage.verifyLoginSuccess();
    await hackathonListPage.openCreateHackathonPopup();
    await createHackathonPage.inputHackathonName(hackathonName);
    await createHackathonPage.addNewHackathon();
    await hackathonListPage.openDeletePopupOfHackathonWithName(hackathonName);
    await deleteHackathonPage.confirmPopupIsVisible();
  }
);

test.afterEach(async ({ hackathonListPage }) => {
  await hackathonListPage.clearAnyExistingHackathonWithName(hackathonName);
});

test('hackathon can be successfully deleted and subsequent alert can be closed', async ({
  deleteHackathonPage,
  hackathonListPage,
}) => {
  await deleteHackathonPage.deleteHackathon();
  await deleteHackathonPage.confirmSuccessMessageIs(
    'Hackathon deleted successfully!'
  );
  await deleteHackathonPage.closeSuccessAlert();
  await deleteHackathonPage.confirmSuccessAlertDoesNotExist();
  await hackathonListPage.checkExistenceOfHackathonInTableWithName(
    hackathonName,
    false
  );
});

test('hackathon deletion can be cancelled', async ({ deleteHackathonPage }) => {
  await deleteHackathonPage.cancelHackathonDeletion();
  await deleteHackathonPage.confirmSuccessAlertDoesNotExist();
});

test('hackathon popup has the expected text', async ({
  deleteHackathonPage,
}) => {
  await deleteHackathonPage.confirmPopupTextIs(
    'Are you sure you want to delete the hackathon?',
    'This will delete teams and games in the hackathon as well. You cannot undo this action.'
  );
});

test('bad request error message will appear', async ({
  deleteHackathonPage,
}) => {
  await deleteHackathonPage.mock400ErrorOnDeletingTheHackathon(hackathonName);
  await deleteHackathonPage.confirmErrorMessageIs(
    'Error deleting hackathon - bad request'
  );
});

test('internal server error message will appear', async ({
  deleteHackathonPage,
}) => {
  await deleteHackathonPage.mock500ErrorOnDeletingTheHackathon(hackathonName);
  await deleteHackathonPage.confirmErrorMessageIs(
    'Error deleting hackathon - internal server error'
  );
});
