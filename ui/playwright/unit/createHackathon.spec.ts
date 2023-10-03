import { test as base } from '@playwright/test';
import { HackathonHelpers } from '../helpers';
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

const uniqueHackId = new HackathonHelpers();
let hackathonName = '';

test.beforeEach(async ({ page, hackathonListPage }) => {
  hackathonName = 'createHackathon_' + uniqueHackId.generateRandomString();
  const login = new LoginPage(page);
  await page.goto('/');
  await page.getByText('Hackathon').click();
  await login.inputCredentials('admin', 'secret');
  await login.attemptLogin();
  await hackathonListPage.verifyLoginSuccess();
});

test('admin can create a new hackathon', async ({
  createHackathonPage,
  hackathonListPage,
}) => {
  await hackathonListPage.openCreateHackathonPopup();
  await createHackathonPage.verifyCreateHackathonPopUp('Add a new hackathon');
  await createHackathonPage.inputHackathonName(hackathonName);
  await createHackathonPage.addNewHackathon();
  await createHackathonPage.verifyHackathonCreated(
    'Hackathon created successfully!'
  );
  await hackathonListPage.checkExistenceOfHackathonInTableWithName(
    hackathonName,
    true
  );
  await hackathonListPage.clearAnyExistingHackathonWithName(hackathonName);
});

test('admin cannot create a new hackathon without a name', async ({
  createHackathonPage,
  hackathonListPage,
}) => {
  await hackathonListPage.openCreateHackathonPopup();
  await createHackathonPage.verifyCreateHackathonPopUp('Add a new hackathon');
  await createHackathonPage.inputHackathonName(hackathonName);
  await createHackathonPage.clearHackathonName();
  await createHackathonPage.verifyCreateHackathonPopUp('Add a new hackathon');
});

test('admin can cancel creating a new hackathon', async ({
  createHackathonPage,
  hackathonListPage,
}) => {
  await hackathonListPage.openCreateHackathonPopup();
  await createHackathonPage.verifyCreateHackathonPopUp('Add a new hackathon');
  await createHackathonPage.inputHackathonName(hackathonName);
  await createHackathonPage.cancelNewHackathon();
  await createHackathonPage.verifyCreateHackathonPopUpDoesNotExist();
  await hackathonListPage.checkExistenceOfHackathonInTableWithName(
    hackathonName,
    false
  );
});
