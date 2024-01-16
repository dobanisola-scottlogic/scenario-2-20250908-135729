import { expect, type Locator, type Page } from '@playwright/test';

export class CreateTeamPage {
  readonly page: Page;
  readonly createTeamPopup: Locator;
  readonly teamNameField: Locator;
  readonly teamPasswordField: Locator;
  readonly addNewTeamButton: Locator;
  readonly cancelButton: Locator;
  readonly togglePasswordVisibility: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createTeamPopup = page.getByRole('dialog');
    this.teamNameField = page.getByLabel('Name');
    this.teamPasswordField = page.getByTestId('password-input');
    this.addNewTeamButton = page.getByRole('button', {
      name: 'Add team',
    });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.togglePasswordVisibility = page.getByLabel(
      'toggle password visibility'
    );
  }

  async inputTeamName(teamName: string) {
    await this.teamNameField.fill(teamName);
  }

  async validateTeamName(teamName: string) {
    await expect(this.teamNameField).toHaveValue(teamName);
  }

  async clearTeamName() {
    await this.teamNameField.clear();
  }

  async inputTeamPassword(teamPassword: string) {
    await this.teamPasswordField.fill(teamPassword);
  }

  async validateTeamPassword(teamPassword: string) {
    await expect(this.teamPasswordField).toHaveValue(teamPassword);
  }

  async addNewTeam() {
    await this.addNewTeamButton.click();
  }

  async verifyCreateTeamPopUpWithFieldLabels(
    teamName: string,
    teamPassword: string
  ) {
    await expect(this.createTeamPopup).toContainText(teamName);
    await expect(this.createTeamPopup).toContainText(teamPassword);
    await expect(this.teamPasswordField).toHaveAttribute('type', 'password');
    await this.togglePasswordVisibility.click();
    await expect(this.teamPasswordField).toHaveAttribute('type', 'text');
    await expect(this.addNewTeamButton).toBeDisabled();
    await expect(this.cancelButton).toBeVisible();
  }

  async verifyTeamCannotBeCreated() {
    await expect(this.addNewTeamButton).toBeDisabled();
  }

  async createTeamUsingAPIWithHackathonAndTeamName(
    hackathonName: string,
    teamName: string
  ) {
    const teamPostResponse = await this.page.request.post('./api/team', {
      data: {
        name: teamName,
        password: 'teamPassword',
        hackathonId: hackathonName.toLowerCase(),
      },
    });
    expect(teamPostResponse.status()).toBe(200);
  }
}
