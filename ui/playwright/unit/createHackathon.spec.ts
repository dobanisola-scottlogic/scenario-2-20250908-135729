import { test as base } from '@playwright/test';
import { HackathonListPage } from '../pageObjectModel/admin-hackathon-list-page';
import { CreateHackathonPage } from '../pageObjectModel/create-hackathon-page';
import { LoginPage } from '../pageObjectModel/login-page';

const test = base.extend<{
  createHackathonPage: CreateHackathonPage;
  hackathonListPage: HackathonListPage;
}>({
  createHackathonPage: async ({ page }, use) => {
    const createHackathonPage = new CreateHackathonPage(page);
    await use(createHackathonPage);
  },
  hackathonListPage: async ({ page }, use) => {
    const hackathonListPage = new HackathonListPage(page);
    await use(hackathonListPage);
  },
});

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  const hackathonListPage = new HackathonListPage(page);
  await page.goto('/');
  await login.inputCredentials('admin', 'secret');
  await login.attemptLogin();
  await hackathonListPage.verifyLoginSuccess();
});

test('admin can create a new hackathon', async ({
  page,
  createHackathonPage,
  hackathonListPage,
}) => {
  await hackathonListPage.expectNumberOfHackathonsToBe(0);
  await hackathonListPage.openCreateHackathonPopup();
  await createHackathonPage.verifyCreateHackathonPopUp('Add a new hackathon');
  await createHackathonPage.inputHackathonName('New Hackathon');
  await createHackathonPage.addNewHackathon();
  await createHackathonPage.verifyHackathonCreated(
    'Hackathon created successfully!'
  );
  await hackathonListPage.expectNumberOfHackathonsToBe(1);
  await page.request.delete(
    'http://localhost:8080/application/api/hackathon/new-hackathon'
  );
});

test('admin cannot create a new hackathon without a name', async ({
  createHackathonPage,
  hackathonListPage,
}) => {
  await hackathonListPage.openCreateHackathonPopup();
  await createHackathonPage.verifyCreateHackathonPopUp('Add a new hackathon');
  await createHackathonPage.inputHackathonName('New Hackathon');
  await createHackathonPage.clearHackathonName();
  await createHackathonPage.verifyCreateHackathonPopUp('Add a new hackathon');
});

test('admin can cancel creating a new hackathon', async ({
  createHackathonPage,
  hackathonListPage,
}) => {
  await hackathonListPage.openCreateHackathonPopup();
  await createHackathonPage.verifyCreateHackathonPopUp('Add a new hackathon');
  await createHackathonPage.cancelNewHackathon();
  await createHackathonPage.verifyCreateHackathonPopUpDoesNotExist();
});
