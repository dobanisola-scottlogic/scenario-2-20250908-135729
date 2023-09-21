import { test as base } from '@playwright/test';
import { DeleteHackathonPage } from '../pageObjectModel/delete-hackathon';
import { LoginPage } from '../pageObjectModel/login-page';

const test = base.extend<{ deleteHackathonPage: DeleteHackathonPage }>({
  deleteHackathonPage: async ({ page }, use) => {
    const deleteHackathonPage = new DeleteHackathonPage(page);
    await use(deleteHackathonPage);
  },
});

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await page.goto('/');
  await login.inputCredentials('admin', 'secret');
  await login.attemptLogin();
  await login.verifyLoginSuccessWithRole('Admin');
});

test('hackathon can be successfully deleted and subsequent alert can be closed', async ({
  deleteHackathonPage,
}) => {
  await deleteHackathonPage.createHackathon();
  await deleteHackathonPage.expectNumberOfHackathonsToBe(1);
  await deleteHackathonPage.openDeleteHackathonPopup();
  await deleteHackathonPage.confirmPopupIsVisible();
  await deleteHackathonPage.deleteHackathon();
  await deleteHackathonPage.confirmSuccessMessageIs(
    'Hackathon deleted successfully!'
  );
  await deleteHackathonPage.closeSuccessAlert();
  await deleteHackathonPage.confirmSuccessAlertDoesNotExist();
  await deleteHackathonPage.expectNumberOfHackathonsToBe(0);
});

test('hackathon deletion can be cancelled', async ({ deleteHackathonPage }) => {
  await deleteHackathonPage.openDeleteHackathonPopup();
  await deleteHackathonPage.confirmPopupIsVisible();
  await deleteHackathonPage.cancelHackathonDeletion();
  await deleteHackathonPage.confirmSuccessAlertDoesNotExist();
});

test('hackathon popup has the expected text', async ({
  deleteHackathonPage,
}) => {
  await deleteHackathonPage.openDeleteHackathonPopup();
  await deleteHackathonPage.confirmPopupIsVisible();
  await deleteHackathonPage.confirmPopupTextIs(
    'Are you sure you want to delete the hackathon?',
    'This will delete teams and games in the hackathon as well. You cannot undo this action.'
  );
});

test('bad request error message will appear', async ({
  deleteHackathonPage,
}) => {
  await deleteHackathonPage.openDeleteHackathonPopup();
  await deleteHackathonPage.confirmPopupIsVisible();
  await deleteHackathonPage.mock400ErrorOnHackathonDeletion();
  await deleteHackathonPage.confirmErrorMessageIs(
    'Error deleting hackathon - bad request'
  );
});

test('internal server error message will appear', async ({
  deleteHackathonPage,
}) => {
  await deleteHackathonPage.openDeleteHackathonPopup();
  await deleteHackathonPage.confirmPopupIsVisible();
  await deleteHackathonPage.mock500ErrorOnHackathonDeletion();
  await deleteHackathonPage.confirmErrorMessageIs(
    'Error deleting hackathon - internal server error'
  );
});
