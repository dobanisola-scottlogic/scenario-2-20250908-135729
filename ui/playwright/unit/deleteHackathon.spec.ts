import { test as base } from '@playwright/test';
import { HackathonListPage } from '../pageObjectModel/admin-hackathon-list-page';
import { DeleteHackathonPage } from '../pageObjectModel/delete-hackathon-page';
import { LoginPage } from '../pageObjectModel/login-page';

const test = base.extend<{
  deleteHackathonPage: DeleteHackathonPage;
  hackathonListPage: HackathonListPage;
}>({
  deleteHackathonPage: async ({ page }, use) => {
    const deleteHackathonPage = new DeleteHackathonPage(page);
    await use(deleteHackathonPage);
  },
  hackathonListPage: async ({ page }, use) => {
    const hackathonListPage = new HackathonListPage(page);
    await use(hackathonListPage);
  },
});

test.beforeEach(async ({ page, deleteHackathonPage }) => {
  const login = new LoginPage(page);
  const hackathonListPage = new HackathonListPage(page);
  await deleteHackathonPage.createHackathon();
  await hackathonListPage.expectNumberOfHackathonsToBe(1);
  await page.goto('/');
  await login.inputCredentials('admin', 'secret');
  await login.attemptLogin();
  await hackathonListPage.verifyLoginSuccess();
});

test.afterEach(async ({ page }) => {
  await page.request.delete(
    'http://localhost:8080/application/api/hackathon/test'
  );
});

test('hackathon can be successfully deleted and subsequent alert can be closed', async ({
  deleteHackathonPage,
  hackathonListPage,
}) => {
  await hackathonListPage.openDeleteHackathonPopup();
  await deleteHackathonPage.confirmPopupIsVisible();
  await deleteHackathonPage.deleteHackathon();
  await deleteHackathonPage.confirmSuccessMessageIs(
    'Hackathon deleted successfully!'
  );
  await deleteHackathonPage.closeSuccessAlert();
  await deleteHackathonPage.confirmSuccessAlertDoesNotExist();
  await hackathonListPage.expectNumberOfHackathonsToBe(0);
});

test('hackathon deletion can be cancelled', async ({
  deleteHackathonPage,
  hackathonListPage,
}) => {
  await hackathonListPage.openDeleteHackathonPopup();
  await deleteHackathonPage.confirmPopupIsVisible();
  await deleteHackathonPage.cancelHackathonDeletion();
  await deleteHackathonPage.confirmSuccessAlertDoesNotExist();
});

test('hackathon popup has the expected text', async ({
  deleteHackathonPage,
  hackathonListPage,
}) => {
  await hackathonListPage.openDeleteHackathonPopup();
  await deleteHackathonPage.confirmPopupIsVisible();
  await deleteHackathonPage.confirmPopupTextIs(
    'Are you sure you want to delete the hackathon?',
    'This will delete teams and games in the hackathon as well. You cannot undo this action.'
  );
});

test('bad request error message will appear', async ({
  deleteHackathonPage,
  hackathonListPage,
}) => {
  await hackathonListPage.openDeleteHackathonPopup();
  await deleteHackathonPage.confirmPopupIsVisible();
  await deleteHackathonPage.mock400ErrorOnHackathonDeletion();
  await deleteHackathonPage.confirmErrorMessageIs(
    'Error deleting hackathon - bad request'
  );
});

test('internal server error message will appear', async ({
  deleteHackathonPage,
  hackathonListPage,
}) => {
  await hackathonListPage.openDeleteHackathonPopup();
  await deleteHackathonPage.confirmPopupIsVisible();
  await deleteHackathonPage.mock500ErrorOnHackathonDeletion();
  await deleteHackathonPage.confirmErrorMessageIs(
    'Error deleting hackathon - internal server error'
  );
});
