import test from '../fixtures';
import { HackathonHelpers } from '../helpers';

const uniqueHackathonId = new HackathonHelpers().generateRandomString;
let hackathonName = '';
const player1 = 'Milestone1Bot';
const player2 = 'Milestone2Bot';
const player3 = 'Milestone3Bot';
const player4 = 'Milestone4Bot';
const map = 'Hard';

test.beforeEach(
  async ({ page, createHackathonPage, hackathonListPage, login }) => {
    hackathonName = 'createGame' + uniqueHackathonId;
    await createHackathonPage.createHackathonUsingAPIWithName(hackathonName);
    await page.goto('/');
    await login.inputCredentials('admin', 'secret');
    await login.attemptLogin();
    await hackathonListPage.verifyLoginSuccess();
    await hackathonListPage.openTheHackathonPage(hackathonName);
  }
);

test.afterEach(async ({ hackathonListPage }) => {
  await hackathonListPage.clearAnyExistingHackathonWithName(hackathonName);
});

test.describe('create a new game popup without a team being created', () => {
  // runs tests in serial to prevent clash of game creation tests
  test.describe.configure({ mode: 'serial' });
  test.beforeEach(async ({ hackathonDetailsPage, commonPageObjects }) => {
    await hackathonDetailsPage.openCreateGamePopup();
    await commonPageObjects.confirmPopupIsVisible();
  });

  test('multiple games can be created', async ({
    createGamePage,
    commonPageObjects,
    hackathonDetailsPage,
  }) => {
    await createGamePage.gamePlayer1Field.click();
    await createGamePage.selectOption(player1);
    await createGamePage.gamePlayer2Field.click();
    await createGamePage.selectOption(player2);
    await createGamePage.gameMapField.click();
    await createGamePage.selectOption(map);
    await createGamePage.addNewGame();
    await commonPageObjects.confirmSuccessMessageIs(
      'Game created successfully!'
    );
    await commonPageObjects.closeSuccessAlert();
    await hackathonDetailsPage.openCreateGamePopup();
    await commonPageObjects.confirmPopupIsVisible();
    await createGamePage.gamePlayer1Field.click();
    await createGamePage.selectOption(player3);
    await createGamePage.gamePlayer2Field.click();
    await createGamePage.selectOption(player4);
    await createGamePage.gameMapField.click();
    await createGamePage.selectOption(map);
    await createGamePage.addNewGame();
    await commonPageObjects.confirmSuccessMessageIs(
      'Game created successfully!'
    );
    await commonPageObjects.closeSuccessAlert();
    // below can be used instead when bug HAC-202 has been completed
    // await hackathonDetailsPage.verifyGameExists('Milestone1Bot vs Milestone2Bot');
    await hackathonDetailsPage.verifyGameExists('Milestone1Bot');
    await hackathonDetailsPage.verifyGameExists('Milestone2Bot');
    // below can be used instead when bug HAC-202 has been completed
    // await hackathonDetailsPage.verifyGameExists('Milestone3Bot vs Milestone4Bot');
    await hackathonDetailsPage.verifySecondGameExists('Milestone3Bot');
    await hackathonDetailsPage.verifySecondGameExists('Milestone4Bot');
  });

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

  test('game cannot be created if fields are missing', async ({
    createGamePage,
    commonPageObjects,
    hackathonDetailsPage,
  }) => {
    await createGamePage.verifyGameCannotBeCreated();
    await createGamePage.gamePlayer1Field.click();
    await createGamePage.selectOption(player1);
    await createGamePage.gamePlayer2Field.click();
    await createGamePage.selectOption(player2);
    await createGamePage.verifyGameCannotBeCreated();
    await commonPageObjects.cancelCurrentAction();
    await hackathonDetailsPage.openCreateGamePopup();
    await createGamePage.gamePlayer1Field.click();
    await createGamePage.selectOption(player1);
    await createGamePage.gameMapField.click();
    await createGamePage.selectOption(map);
    await createGamePage.verifyGameCannotBeCreated();
  });

  test('bad request error will appear', async ({
    createGamePage,
    commonPageObjects,
  }) => {
    await createGamePage.gamePlayer1Field.click();
    await createGamePage.selectOption(player1);
    await createGamePage.gamePlayer2Field.click();
    await createGamePage.selectOption(player2);
    await createGamePage.gameMapField.click();
    await createGamePage.selectOption(map);
    await createGamePage.mock400ErrorOnCreatingGame();
    await commonPageObjects.confirmErrorMessageIs(
      'Error creating game - bad request'
    );
  });
});

test.describe('create a team before entering the create game popup', () => {
  test('created team appears in dropdown lists', async ({
    hackathonDetailsPage,
    commonPageObjects,
    createTeamPage,
    createGamePage,
  }) => {
    await hackathonDetailsPage.openCreateTeamPopup();
    await commonPageObjects.confirmPopupIsVisible();
    await createTeamPage.inputTeamName('teamName');
    await createTeamPage.inputTeamPassword('teamPassword');
    await createTeamPage.addNewTeam();
    await hackathonDetailsPage.openCreateGamePopup();
    await commonPageObjects.confirmPopupIsVisible();
    await createGamePage.gamePlayer1Field.click();
    await createGamePage.verifyPlayerDropdownFieldWithTeam('teamName');
  });
});
