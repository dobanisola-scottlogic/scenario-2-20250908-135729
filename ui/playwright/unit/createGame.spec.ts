import { test as base } from '@playwright/test';
import { HackathonHelpers } from '../helpers';
import { HackathonDetailsPage } from '../pageObjectModel/admin-hackathon-details-page';
import { HackathonListPage } from '../pageObjectModel/admin-hackathon-list-page';
import { CommonPageObjects } from '../pageObjectModel/common-page-objects';
import { CreateGamePage } from '../pageObjectModel/create-game-page';
import { CreateHackathonPage } from '../pageObjectModel/create-hackathon-page';
import { CreateTeamPage } from '../pageObjectModel/create-team-page';
import { LoginPage } from '../pageObjectModel/login-page';

const test = base.extend<{
  createHackathonPage: CreateHackathonPage;
  createGamePage: CreateGamePage;
  createTeamPage: CreateTeamPage;
  hackathonListPage: HackathonListPage;
  hackathonDetailsPage: HackathonDetailsPage;
  commonPageObjects: CommonPageObjects;
}>({
  createHackathonPage: async ({ page }, use) => {
    const createHackathonPage = new CreateHackathonPage(page);
    await use(createHackathonPage);
  },
  createGamePage: async ({ page }, use) => {
    const createGamePage = new CreateGamePage(page);
    await use(createGamePage);
  },
  createTeamPage: async ({ page }, use) => {
    const createTeamPage = new CreateTeamPage(page);
    await use(createTeamPage);
  },
  hackathonListPage: async ({ page }, use) => {
    const hackathonListPage = new HackathonListPage(page);
    await use(hackathonListPage);
  },
  hackathonDetailsPage: async ({ page }, use) => {
    const hackathonDetailsPage = new HackathonDetailsPage(page);
    await use(hackathonDetailsPage);
  },
  commonPageObjects: async ({ page }, use) => {
    const commonPageObjects = new CommonPageObjects(page);
    await use(commonPageObjects);
  },
});

const uniqueHackathonId = new HackathonHelpers().generateRandomString;
let hackathonName = '';
const player1 = 'Milestone1Bot';
const player2 = 'Milestone2Bot';
const player3 = 'Milestone3Bot';
const player4 = 'Milestone4Bot';
const map = 'Hard';

test.afterEach(async ({ hackathonListPage }) => {
  await hackathonListPage.clearAnyExistingHackathonWithName(hackathonName);
});

test.describe('tests create a new game popup without a team being created', () => {
  test.beforeEach(
    async ({
      page,
      createHackathonPage,
      hackathonListPage,
      hackathonDetailsPage,
      commonPageObjects,
    }) => {
      const login = new LoginPage(page);
      hackathonName = 'createGame' + uniqueHackathonId;
      await createHackathonPage.createHackathonUsingAPIWithName(hackathonName);
      await page.goto('/');
      await login.inputCredentials('admin', 'secret');
      await login.attemptLogin();
      await hackathonListPage.verifyLoginSuccess();
      await hackathonListPage.openTheHackathonPage(hackathonName);
      await hackathonDetailsPage.openCreateGamePopup();
      await commonPageObjects.confirmPopupIsVisible();
    }
  );

  test('games with four teams can be created', async ({
    createGamePage,
    commonPageObjects,
    hackathonDetailsPage,
  }) => {
    await createGamePage.gamePlayer1Field.click();
    await createGamePage.selectOption(player1);
    await createGamePage.gamePlayer2Field.click();
    await createGamePage.selectOption(player2);
    await createGamePage.gamePlayer3Field.click();
    await createGamePage.selectOption(player3);
    await createGamePage.gamePlayer4Field.click();
    await createGamePage.selectOption(player4);
    await createGamePage.gameMapField.click();
    await createGamePage.selectOption(map);
    await createGamePage.addNewGame();
    await commonPageObjects.confirmSuccessMessageIs(
      'Game created successfully!'
    );
    await commonPageObjects.closeSuccessAlert();
    // below can be used instead when bug HAC-202 has been completed
    // await hackathonDetailsPage.verifyGameExists('Milestone1Bot vs Milestone2Bot vs Milestone3Bot vs Milestone4Bot');
    await hackathonDetailsPage.verifyGameExists('Milestone1Bot');
    await hackathonDetailsPage.verifyGameExists('Milestone2Bot');
    await hackathonDetailsPage.verifyGameExists('Milestone3Bot');
    await hackathonDetailsPage.verifyGameExists('Milestone4Bot');
  });

  test('admin can cancel creation of a new game', async ({
    commonPageObjects,
  }) => {
    await commonPageObjects.cancelCurrentAction();
    await commonPageObjects.confirmPopupIsHidden();
  });

  test('game popup contains the expected fields in the expected initial states', async ({
    createGamePage,
  }) => {
    await createGamePage.verifyCreateGamePopUpWithFieldLabels();
  });

  test('dropdown fields contain the expected values', async ({
    createGamePage,
  }) => {
    await createGamePage.gamePlayer1Field.click();
    await createGamePage.verifyPlayerDropdownField();
    await createGamePage.gamePlayer2Field.click();
    await createGamePage.verifyPlayerDropdownField();
    await createGamePage.gamePlayer3Field.click();
    await createGamePage.verifyPlayerDropdownField();
    await createGamePage.gamePlayer4Field.click();
    await createGamePage.verifyPlayerDropdownField();
    await createGamePage.gameMapField.click();
    await createGamePage.verifyMapDropdownField();
  });
});
