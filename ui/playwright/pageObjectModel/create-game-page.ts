import { expect, type Page } from '@playwright/test';

export class CreateGamePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Start of locators

  getCreateGamePopup = () => this.page.getByRole('dialog');

  getGamePlayerField = (playerNumber: number) =>
    this.page.getByTestId(`player-${playerNumber}`);

  getGameMapField = () => this.page.getByTestId('game-map');

  getOption = ({ option }: { option: string }) =>
    this.page.getByRole('option', { name: option });

  getDropdownOptions = () => this.page.getByRole('listbox');

  getAddNewGameButton = () =>
    this.page.getByRole('button', {
      name: 'Add a new game',
    });

  getCancelButton = () => this.page.getByRole('button', { name: 'Cancel' });

  // End of locators

  async addNewGame() {
    await this.getAddNewGameButton().click();
  }

  async selectOptionFromDropdown(option: string) {
    await this.getOption({ option: option }).click();
  }

  async chooseMapOption(map: string) {
    await this.getGameMapField().click();
    await this.selectOptionFromDropdown(map);
  }

  async choosePlayerOption(playerNumber: number) {
    await this.getGamePlayerField(playerNumber).click();
  }

  async chooseOptionForPlayer(playerNumber: number, dropdownOption: string) {
    await this.getGamePlayerField(playerNumber).click();
    await this.selectOptionFromDropdown(dropdownOption);
  }

  async createDefaultGameWithTwoPlayersAndMap(
    firstPlayer: string,
    secondPlayer: string,
    map: string
  ) {
    await this.chooseOptionForPlayer(1, firstPlayer);
    await this.chooseOptionForPlayer(2, secondPlayer);
    await this.chooseMapOption(map);
  }

  async createGameWithFourPlayersAndMap(
    firstPlayer: string,
    secondPlayer: string,
    thirdPlayer: string,
    fourthPlayer: string,
    map: string
  ) {
    await this.chooseOptionForPlayer(1, firstPlayer);
    await this.chooseOptionForPlayer(2, secondPlayer);
    await this.chooseOptionForPlayer(3, thirdPlayer);
    await this.chooseOptionForPlayer(4, fourthPlayer);
    await this.chooseMapOption(map);
  }

  async verifyCreateGamePopUpWithFieldLabels() {
    await expect(this.getCreateGamePopup()).toContainText('Select player 1 *');
    await expect(this.getCreateGamePopup()).toContainText('Select player 2 *');
    await expect(this.getCreateGamePopup()).toContainText('Select player 3');
    await expect(this.getCreateGamePopup()).toContainText('Select player 4');
    await expect(this.getCreateGamePopup()).toContainText('Select map');
    await expect(this.getAddNewGameButton()).toBeDisabled();
    await expect(this.getCancelButton()).toBeVisible();
  }

  async verifyMandatoryPlayerDropdownField() {
    await expect(this.getDropdownOptions()).toContainText(
      'TeamsMilestonesMilestone1BotMilestone2BotMilestone3BotMilestone4BotMilestone5BotFastExpansionBot'
    );
    await this.getDropdownOptions().click();
  }

  async verifyOptionalPlayerDropdownField() {
    await expect(this.getDropdownOptions()).toContainText(
      'NoneTeamsMilestonesMilestone1BotMilestone2BotMilestone3BotMilestone4BotMilestone5BotFastExpansionBot'
    );
    await this.getDropdownOptions().click();
  }

  async verifyPlayerDropdownFieldWithTeam(teamName: string) {
    await expect(this.getDropdownOptions()).toContainText(
      'Teams' +
        teamName +
        'MilestonesMilestone1BotMilestone2BotMilestone3BotMilestone4BotMilestone5BotFastExpansionBot'
    );
    await this.getDropdownOptions().click();
  }

  async verifyMapDropdownField() {
    await expect(this.getDropdownOptions()).toContainText(
      'Very EasyEasyMediumLarge MediumHardThree StarThree Straight'
    );
    await this.getDropdownOptions().click();
  }

  async verifyGameCannotBeCreated() {
    await expect(this.getAddNewGameButton()).toBeDisabled();
  }

  async createGameUsingAPIBetweenMilestoneBotsAndWithMap(
    hackathonName: string,
    map: string,
    player1: number,
    player2: number
  ) {
    const gamePostResponse = await this.page.request.post('./api/game', {
      data: {
        hackathonId: hackathonName.toLowerCase(),
        map: map,
        teams: [
          `com.scottlogic.hackathon.bots.Milestone${player1}Bot`,
          `com.scottlogic.hackathon.bots.Milestone${player2}Bot`,
        ],
      },
    });
    expect(gamePostResponse.status()).toBe(200);
  }
}
