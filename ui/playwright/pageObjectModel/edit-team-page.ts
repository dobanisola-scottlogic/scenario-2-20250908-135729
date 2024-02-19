import { expect, type Page } from '@playwright/test';

export class EditTeamPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Start of locators

  getTeamNameField = () => this.page.getByLabel('Name *');

  getTeamPasswordField = () => this.page.getByTestId('password-input');

  getTeamMenuButton = (teamName: string) =>
    this.page.getByRole('row', { name: teamName }).getByLabel('more');

  getUpdateTeamOption = () =>
    this.page.getByRole('menuitem', { name: 'Edit...' });

  getUpdateTeamButton = () =>
    this.page.getByRole('button', {
      name: 'Update team',
    });
  getTogglePasswordVisibility = () =>
    this.page.getByLabel('toggle password visibility');

  // End of locators

  async openEditPopupOfTeamWithName(teamName: string) {
    await this.getTeamMenuButton(teamName).click();
    await this.getUpdateTeamOption().click();
  }

  async clearTeamNameField() {
    await this.getTeamNameField().clear();
  }

  async clearTeamPasswordField() {
    await this.getTeamPasswordField().clear();
  }

  async enterTeamName(teamName: string) {
    await this.getTeamNameField().fill(teamName);
  }

  async enterTeamPassword(teamPassword: string) {
    await this.getTeamPasswordField().fill(teamPassword);
  }

  async updateTeam() {
    await this.getUpdateTeamButton().click();
  }

  async verifyTeamCanBeUpdated() {
    await expect(this.getUpdateTeamButton()).toBeEnabled();
  }

  async verifyTeamCannotBeUpdated() {
    await expect(this.getUpdateTeamButton()).toBeDisabled();
  }

  async verifyPasswordToggle() {
    await expect(this.getTeamPasswordField()).toHaveAttribute(
      'type',
      'password'
    );
    await this.getTogglePasswordVisibility().click();
    await expect(this.getTeamPasswordField()).toHaveAttribute('type', 'text');
  }

  async mock500ErrorOnUpdatingTeam() {
    await this.page.route('./api/team/*', async (route) => {
      await route.fulfill({ status: 500 });
    });
    await this.updateTeam();
  }
}
