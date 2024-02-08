import { expect, type Locator, type Page } from '@playwright/test';

export class CreateGamePage {
  readonly page: Page;
  readonly createGamePopup: Locator;
  readonly gamePlayer1Field: Locator;
  readonly gamePlayer2Field: Locator;
  readonly gamePlayer3Field: Locator;
  readonly gamePlayer4Field: Locator;
  readonly gameMapField: Locator;
  readonly option: ({ option }: { option: string }) => Locator;
  readonly dropdownOptions: Locator;
  readonly addNewGameButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createGamePopup = page.getByRole('dialog');
    this.gamePlayer1Field = page.getByTestId('player-1');
    this.gamePlayer2Field = page.getByTestId('player-2');
    this.gamePlayer3Field = page.getByTestId('player-3');
    this.gamePlayer4Field = page.getByTestId('player-4');
    this.gameMapField = page.getByTestId('game-map');
    this.option = ({ option }) => page.getByRole('option', { name: option });
    this.dropdownOptions = page.getByRole('listbox');
    this.addNewGameButton = page.getByRole('button', {
      name: 'Add a new game',
    });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async addNewGame() {
    await this.addNewGameButton.click();
  }

  async selectOption(option: string) {
    await this.option({ option: option }).click();
  }

  async verifyCreateGamePopUpWithFieldLabels() {
    await expect(this.createGamePopup).toContainText('Select player 1 *');
    await expect(this.createGamePopup).toContainText('Select player 2 *');
    await expect(this.createGamePopup).toContainText('Select player 3');
    await expect(this.createGamePopup).toContainText('Select player 4');
    await expect(this.createGamePopup).toContainText('Select map');
    await expect(this.addNewGameButton).toBeDisabled();
    await expect(this.cancelButton).toBeVisible();
  }

  async verifyMandatoryPlayerDropdownField() {
    await expect(this.dropdownOptions).toContainText(
      'TeamsMilestonesMilestone1BotMilestone2BotMilestone3BotMilestone4BotMilestone5BotFastExpansionBot'
    );
    await this.dropdownOptions.click();
  }

  async verifyOptionalPlayerDropdownField() {
    await expect(this.dropdownOptions).toContainText(
      'NoneTeamsMilestonesMilestone1BotMilestone2BotMilestone3BotMilestone4BotMilestone5BotFastExpansionBot'
    );
    await this.dropdownOptions.click();
  }

  async verifyPlayerDropdownFieldWithTeam(teamName: string) {
    await expect(this.dropdownOptions).toContainText(
      'Teams' +
        teamName +
        'MilestonesMilestone1BotMilestone2BotMilestone3BotMilestone4BotMilestone5BotFastExpansionBot'
    );
    await this.dropdownOptions.click();
  }

  async verifyMapDropdownField() {
    await expect(this.dropdownOptions).toContainText(
      'Very EasyEasyMediumLarge MediumHardThree StarThree Straight'
    );
    await this.dropdownOptions.click();
  }

  async verifyGameCannotBeCreated() {
    await expect(this.addNewGameButton).toBeDisabled();
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
