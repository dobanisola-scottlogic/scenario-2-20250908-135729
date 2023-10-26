import { expect, type Locator, type Page } from '@playwright/test';

export class CreateGamePage {
  readonly page: Page;
  readonly createGamePopup: Locator;
  readonly gamePlayer1Field: Locator;
  readonly gamePlayer2Field: Locator;
  readonly gamePlayer3Field: Locator;
  readonly gamePlayer4Field: Locator;
  readonly gameMapField: Locator;
  readonly option: Locator;
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
    this.option = page.getByRole('option');
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
    await this.option.getByText(option).click();
  }

  async verifyCreateGamePopUpWithFieldLabels() {
    await expect(this.createGamePopup).toContainText('Select player 1');
    await expect(this.createGamePopup).toContainText('Select player 2');
    await expect(this.createGamePopup).toContainText(
      'Select player 3 (Optional)'
    );
    await expect(this.createGamePopup).toContainText(
      'Select player 4 (Optional)'
    );
    await expect(this.createGamePopup).toContainText('Select map');
    await expect(this.addNewGameButton).toBeDisabled();
    await expect(this.cancelButton).toBeVisible();
  }

  async verifyPlayerDropdownField() {
    await expect(this.dropdownOptions).toContainText(
      'TeamsMilestonesMilestone1BotMilestone2BotMilestone3BotMilestone4BotMilestone5BotFastExpansionBot'
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

  async mock400ErrorOnCreatingGame() {
    await this.page.route(
      `http://localhost:8080/application/api/game`,
      async (route) => {
        await route.fulfill({ status: 400 });
      }
    );
    await this.addNewGame();
  }
}
