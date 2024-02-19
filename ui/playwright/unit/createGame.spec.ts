import test from '~/fixtures';
import { generateUniqueName, initialURL } from '~/helpers';

const player1 = 'Milestone1Bot';
const player2 = 'Milestone2Bot';
const player3 = 'Milestone3Bot';
const player4 = 'Milestone4Bot';
const playerUnknown = 'Milestone6Bot';
const map = 'Hard';

const hackathonName = generateUniqueName('createGame');
const teamName = hackathonName;

test.use({ storageState: 'playwright/.auth/admin.json' });

test.beforeEach(async ({ page, createHackathonPage }) => {
  await createHackathonPage.createHackathonUsingAPIWithName(hackathonName);
  await page.goto(initialURL + hackathonName.toLowerCase());
});

test.afterEach(async ({ hackathonListPage }) => {
  await hackathonListPage.clearAnyExistingHackathonWithName(hackathonName);
});

test.describe('create a new game popup without a team being created', () => {
  test.beforeEach(async ({ hackathonDetailsPage, commonPageObjects }) => {
    await hackathonDetailsPage.openCreateGamePopup();
    await commonPageObjects.confirmPopupIsVisible();
  });

  test('multiple games can be created', async ({
    createGamePage,
    commonPageObjects,
    hackathonDetailsPage,
  }) => {
    await createGamePage.createDefaultGameWithTwoPlayersAndMap(
      player1,
      player2,
      map
    );
    await createGamePage.addNewGame();
    await commonPageObjects.confirmSuccessMessageIs(
      'Game created successfully!'
    );
    await commonPageObjects.closeSuccessAlert();
    await hackathonDetailsPage.openCreateGamePopup();
    await commonPageObjects.confirmPopupIsVisible();
    await createGamePage.createDefaultGameWithTwoPlayersAndMap(
      player3,
      player4,
      map
    );
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
    await createGamePage.createGameWithFourPlayersAndMap(
      player2,
      player4,
      player1,
      player3,
      map
    );
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
    await createGamePage.choosePlayerOption(1);
    await createGamePage.verifyMandatoryPlayerDropdownField();
    await createGamePage.getGameMapField().click();
    await createGamePage.verifyMapDropdownField();
  });

  test('game cannot be created if number of players exceed number of available spawn points', async ({
    createGamePage,
    commonPageObjects,
  }) => {
    await createGamePage.createGameWithFourPlayersAndMap(
      player1,
      player2,
      player3,
      player4,
      'Three Straight'
    );
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
    await createGamePage.chooseOptionForPlayer(1, player1);
    await createGamePage.chooseOptionForPlayer(2, player2);
    await createGamePage.verifyGameCannotBeCreated();
    await commonPageObjects.cancelCurrentAction();
    await hackathonDetailsPage.openCreateGamePopup();
    await createGamePage.chooseOptionForPlayer(1, player1);
    await createGamePage.chooseMapOption(map);
    await createGamePage.verifyGameCannotBeCreated();
    await commonPageObjects.cancelCurrentAction();
    await hackathonDetailsPage.openCreateGamePopup();
    await createGamePage.chooseOptionForPlayer(1, player1);
    await createGamePage.chooseOptionForPlayer(3, player3);
    await createGamePage.chooseMapOption(map);
    await createGamePage.verifyGameCannotBeCreated();
  });

  test('duplicate teams cannot be selected', async ({
    createGamePage,
    commonPageObjects,
  }) => {
    await createGamePage.createDefaultGameWithTwoPlayersAndMap(
      player1,
      player1,
      map
    );
    await createGamePage.addNewGame();
    await commonPageObjects.confirmErrorMessageIs(
      'Error creating game - all players must be unique'
    );
  });
});

test.describe('create a team before entering the create game popup', () => {
  test.beforeEach(
    async ({ hackathonDetailsPage, commonPageObjects, createTeamPage }) => {
      await hackathonDetailsPage.openCreateTeamPopup();
      await commonPageObjects.confirmPopupIsVisible();
      await createTeamPage.inputTeamName(teamName);
      await createTeamPage.inputTeamPassword('teamPassword');
      await createTeamPage.addNewTeam();
      await hackathonDetailsPage.openCreateGamePopup();
      await commonPageObjects.confirmPopupIsVisible();
    }
  );
  test('created team appears in dropdown lists', async ({ createGamePage }) => {
    await createGamePage.choosePlayerOption(1);
    await createGamePage.verifyPlayerDropdownFieldWithTeam(teamName);
  });

  test('internal server error appears when attempting to run an unconnected team bot', async ({
    commonPageObjects,
    createGamePage,
  }) => {
    await createGamePage.createDefaultGameWithTwoPlayersAndMap(
      teamName,
      player2,
      map
    );
    await createGamePage.addNewGame();
    await commonPageObjects.confirmErrorMessageIs(
      `Error creating game - Team ${teamName} has no bots`
    );
  });
});

test.describe('add an unknown milestone bot', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Error message appears when unknown milestone bot is used', async ({
    createGamePage,
    commonPageObjects,
    hackathonDetailsPage,
    hackathonListPage,
    login,
    page,
  }) => {
    await page.goto(initialURL);
    await login.inputCredentials('admin', 'secret');
    await login.loginWithUnknownMilestoneBot();
    await hackathonListPage.verifyLoginSuccess();
    await hackathonListPage.openTheHackathonPage(hackathonName);
    await hackathonDetailsPage.openCreateGamePopup();
    await commonPageObjects.confirmPopupIsVisible();
    await createGamePage.createDefaultGameWithTwoPlayersAndMap(
      player1,
      playerUnknown,
      map
    );
    await createGamePage.addNewGame();
    await commonPageObjects.confirmErrorMessageIs(
      `Error creating game - com.scottlogic.hackathon.bots.${playerUnknown} is not a valid milestone bot.`
    );
  });
});
