import { test as base } from '@playwright/test';
import { CreateHackathonPage } from '../pageObjectModel/createHackathon-page';
import { LoginPage } from '../pageObjectModel/login-page';

const test = base.extend<{ createHackathonPage: CreateHackathonPage }>({
  createHackathonPage: async ({ page }, use) => {
    const createHackathonPage = new CreateHackathonPage(page);
    await use(createHackathonPage);
  },
});

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await page.goto('/');
  await login.inputCredentials('admin', 'secret');
  await login.attemptLogin();
  await login.verifyLoginSuccessWithRole('Admin');
});

test('admin can create a new hackathon', async ({
  page,
  createHackathonPage,
}) => {
  await createHackathonPage.expectNumberOfHackathonsToBe(0);
  await createHackathonPage.openCreateHackathonPopup();
  await createHackathonPage.verifyCreateHackathonPopUp('Add a new hackathon');
  await createHackathonPage.inputHackathonName('New Hackathon');
  await createHackathonPage.addNewHackathon();
  await createHackathonPage.verifyHackathonCreated(
    'Hackathon created successfully!'
  );
  await createHackathonPage.expectNumberOfHackathonsToBe(1);
  await page.request.delete(
    'http://localhost:8080/application/api/hackathon/new-hackathon'
  );
});

test('admin cannot create a new hackathon without a name', async ({
  createHackathonPage,
}) => {
  await createHackathonPage.openCreateHackathonPopup();
  await createHackathonPage.verifyCreateHackathonPopUp('Add a new hackathon');
  await createHackathonPage.inputHackathonName('New Hackathon');
  await createHackathonPage.clearHackathonName();
  await createHackathonPage.verifyCreateHackathonPopUp('Add a new hackathon');
});

test('admin can cancel creating a new hackathon', async ({
  createHackathonPage,
}) => {
  await createHackathonPage.openCreateHackathonPopup();
  await createHackathonPage.verifyCreateHackathonPopUp('Add a new hackathon');
  await createHackathonPage.cancelNewHackathon();
  await createHackathonPage.verifyCreateHackathonPopUpDoesNotExist();
});
