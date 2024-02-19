import { expect, type Page } from '@playwright/test';

export class CreateTeamPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Start of locators

  getCreateTeamPopup = () => this.page.getByRole('dialog');

  getTeamNameField = () => this.page.getByLabel('Name *');

  getTeamPasswordField = () => this.page.getByTestId('password-input');

  getAddNewTeamButton = () =>
    this.page.getByRole('button', {
      name: 'Add team',
    });

  getCancelButton = () => this.page.getByRole('button', { name: 'Cancel' });

  getTogglePasswordVisibility = () =>
    this.page.getByLabel('toggle password visibility');

  // End of locators

  async inputTeamName(teamName: string) {
    await this.getTeamNameField().fill(teamName);
  }

  async validateTeamName(teamName: string) {
    await expect(this.getTeamNameField()).toHaveValue(teamName);
  }

  async clearTeamName() {
    await this.getTeamNameField().clear();
  }

  async inputTeamPassword(teamPassword: string) {
    await this.getTeamPasswordField().fill(teamPassword);
  }

  async validateTeamPassword(teamPassword: string) {
    await expect(this.getTeamPasswordField()).toHaveValue(teamPassword);
  }

  async addNewTeam() {
    await this.getAddNewTeamButton().click();
  }

  async verifyCreateTeamPopUpWithFieldLabels(
    teamName: string,
    teamPassword: string
  ) {
    await expect(this.getCreateTeamPopup()).toContainText(teamName);
    await expect(this.getCreateTeamPopup()).toContainText(teamPassword);
    await expect(this.getTeamPasswordField()).toHaveAttribute(
      'type',
      'password'
    );
    await this.getTogglePasswordVisibility().click();
    await expect(this.getTeamPasswordField()).toHaveAttribute('type', 'text');
    await expect(this.getAddNewTeamButton()).toBeDisabled();
    await expect(this.getCancelButton()).toBeVisible();
  }

  async verifyTeamCannotBeCreated() {
    await expect(this.getAddNewTeamButton()).toBeDisabled();
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
