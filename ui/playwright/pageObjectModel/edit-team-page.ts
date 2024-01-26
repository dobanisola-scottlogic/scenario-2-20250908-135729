import { expect, type Locator, type Page } from '@playwright/test';

export class EditTeamPage {
  readonly page: Page;
  readonly teamNameField: Locator;
  readonly teamPasswordField: Locator;
  readonly teamMenuButton: ({ teamName }: { teamName: string }) => Locator;
  readonly updateTeamOption: Locator;
  readonly updateTeamButton: Locator;
  readonly togglePasswordVisibility: Locator;

  constructor(page: Page) {
    this.page = page;
    this.teamNameField = page.getByLabel('Name');
    this.teamPasswordField = page.getByTestId('password-input');
    this.teamMenuButton = ({ teamName }) =>
      page.getByRole('row', { name: `${teamName}` }).getByLabel('more');
    this.updateTeamOption = page.getByRole('menuitem', { name: 'Edit...' });
    this.updateTeamButton = page.getByRole('button', {
      name: 'Update team',
    });
    this.togglePasswordVisibility = page.getByLabel(
      'toggle password visibility'
    );
  }

  async openEditPopupOfTeamWithName(teamName: string) {
    await this.teamMenuButton({ teamName: teamName }).click();
    await this.updateTeamOption.click();
  }

  async clearTeamNameField() {
    await this.teamNameField.clear();
  }

  async clearTeamPasswordField() {
    await this.teamPasswordField.clear();
  }

  async enterTeamName(teamName: string) {
    await this.teamNameField.fill(teamName);
  }

  async enterTeamPassword(teamPassword: string) {
    await this.teamPasswordField.fill(teamPassword);
  }

  async updateTeam() {
    await this.updateTeamButton.click();
  }

  async verifyTeamCanBeUpdated() {
    await expect(this.updateTeamButton).toBeEnabled();
  }

  async verifyTeamCannotBeUpdated() {
    await expect(this.updateTeamButton).toBeDisabled();
  }

  async verifyPasswordToggle() {
    await expect(this.teamPasswordField).toHaveAttribute('type', 'password');
    await this.togglePasswordVisibility.click();
    await expect(this.teamPasswordField).toHaveAttribute('type', 'text');
  }

  async mock400ErrorOnUpdatingTeam() {
    await this.page.route('./api/team/*', async (route) => {
      await route.fulfill({ status: 400 });
    });
    await this.updateTeam();
  }
}
