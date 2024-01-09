import test from '../fixtures';
import { HackathonHelpers } from '../helpers';

const uniqueHackathonId = new HackathonHelpers().generateRandomString;
const initialURL = new HackathonHelpers().initialURL;
let hackathonName = '';
let teamName = '';
const player1 = 'Milestone1Bot';
const player2 = 'Milestone2Bot';
const player3 = 'Milestone3Bot';
const player4 = 'Milestone4Bot';
const playerUnknown = 'Milestone6Bot';
const map = 'Hard';

test.beforeEach(
  async ({ page, createHackathonPage, hackathonListPage, login }, testInfo) => {
    hackathonName = teamName = 'createGame' + uniqueHackathonId;
    await createHackathonPage.createHackathonUsingAPIWithName(hackathonName);
    await page.goto(initialURL);
    await login.inputCredentials('admin', 'secret');
    if (testInfo.title.includes('unknown milestone bot')) {
      await login.loginWithUnknownMilestoneBot();
    } else {
      await login.attemptLogin();
    }
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
    await hackathonDetailsPage.verifyGameExists(`${player1} vs ${player2}`);
    await hackathonDetailsPage.verifyGameExists(`${player3} vs ${player4}`);
  });

  test('games with four teams can be created and are sorted alphabetically', async ({
    createGamePage,
    commonPageObjects,
    hackathonDetailsPage,
  }) => {
    await createGamePage.gamePlayer1Field.click();
    await createGamePage.selectOption(player3);
    await createGamePage.gamePlayer2Field.click();
    await createGamePage.selectOption(player1);
    await createGamePage.gamePlayer3Field.click();
    await createGamePage.selectOption(player4);
    await createGamePage.gamePlayer4Field.click();
    await createGamePage.selectOption(player2);
    await createGamePage.gameMapField.click();
    await createGamePage.selectOption(map);
    await createGamePage.addNewGame();
    await commonPageObjects.confirmSuccessMessageIs(
      'Game created successfully!'
    );
    await commonPageObjects.closeSuccessAlert();
    await hackathonDetailsPage.verifyGameExists(
      `${player1} vs ${player2} vs ${player3} vs ${player4}`
    );
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
    await createGamePage.verifyMandatoryPlayerDropdownField();
    await createGamePage.gamePlayer2Field.click();
    await createGamePage.verifyMandatoryPlayerDropdownField();
    await createGamePage.gamePlayer3Field.click();
    await createGamePage.verifyOptionalPlayerDropdownField();
    await createGamePage.gamePlayer4Field.click();
    await createGamePage.verifyOptionalPlayerDropdownField();
    await createGamePage.gameMapField.click();
    await createGamePage.verifyMapDropdownField();
  });

  test('game cannot be created if number of players exceed number of available spawn points', async ({
    createGamePage,
    commonPageObjects,
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
    await createGamePage.selectOption('Three Straight');
    await createGamePage.addNewGame();
    await commonPageObjects.confirmErrorMessageIs(
      'Error creating game - The specified number of bots (4) exceeds the available number of spawn points (3)'
    );
  });

  test('game cannot be created if mandatory fields are missing', async ({
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
    await commonPageObjects.cancelCurrentAction();
    await hackathonDetailsPage.openCreateGamePopup();
    await createGamePage.gamePlayer1Field.click();
    await createGamePage.selectOption(player1);
    await createGamePage.gamePlayer3Field.click();
    await createGamePage.selectOption(player3);
    await createGamePage.gameMapField.click();
    await createGamePage.selectOption(map);
    await createGamePage.verifyGameCannotBeCreated();
  });

  test('duplicate teams cannot be selected', async ({
    createGamePage,
    commonPageObjects,
  }) => {
    await createGamePage.gamePlayer1Field.click();
    await createGamePage.selectOption(player1);
    await createGamePage.gamePlayer2Field.click();
    await createGamePage.selectOption(player1);
    await createGamePage.gameMapField.click();
    await createGamePage.selectOption(map);
    await createGamePage.addNewGame();
    await commonPageObjects.confirmErrorMessageIs(
      'Error creating game - all players must be unique'
    );
  });

  test('Error message appears when unknown milestone bot is used', async ({
    createGamePage,
    commonPageObjects,
  }) => {
    await createGamePage.gamePlayer1Field.click();
    await createGamePage.selectOption(player1);
    await createGamePage.gamePlayer2Field.click();
    await createGamePage.selectOption(playerUnknown);
    await createGamePage.gameMapField.click();
    await createGamePage.selectOption(map);
    await createGamePage.addNewGame();
    await commonPageObjects.confirmErrorMessageIs(
      `Error creating game - com.scottlogic.hackathon.bots.${playerUnknown} is not a valid milestone bot.`
    );
  });
});

test.describe('create a team before entering the create game popup', () => {
  test.beforeEach(
    async ({
      hackathonDetailsPage,
      commonPageObjects,
      createTeamPage,
      createGamePage,
    }) => {
      await hackathonDetailsPage.openCreateTeamPopup();
      await commonPageObjects.confirmPopupIsVisible();
      await createTeamPage.inputTeamName(teamName);
      await createTeamPage.inputTeamPassword('teamPassword');
      await createTeamPage.addNewTeam();
      await hackathonDetailsPage.openCreateGamePopup();
      await commonPageObjects.confirmPopupIsVisible();
      await createGamePage.gamePlayer1Field.click();
    }
  );
  test('created team appears in dropdown lists', async ({ createGamePage }) => {
    await createGamePage.verifyPlayerDropdownFieldWithTeam(teamName);
  });

  test('internal server error appears when attempting to run an unconnected team bot', async ({
    commonPageObjects,
    createGamePage,
  }) => {
    await createGamePage.selectOption(teamName);
    await createGamePage.gamePlayer2Field.click();
    await createGamePage.selectOption(player2);
    await createGamePage.gameMapField.click();
    await createGamePage.selectOption(map);
    await createGamePage.addNewGame();
    await commonPageObjects.confirmErrorMessageIs(
      `Error creating game - Team ${teamName} has no bots`
    );
  });
});
