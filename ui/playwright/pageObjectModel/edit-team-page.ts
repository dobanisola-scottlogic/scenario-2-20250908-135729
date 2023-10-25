import { expect, type Locator, type Page } from '@playwright/test';

export class EditTeamPage {
  readonly page: Page;
  readonly teamNameField: Locator;
  readonly teamPasswordField: Locator;
  readonly teamMenuButton: ({ teamName }: { teamName: string }) => Locator;
  readonly updateTeamOption: Locator;
  readonly updateTeamButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.teamNameField = page.getByLabel('Name');
    this.teamPasswordField = page.getByLabel('Password').nth(1);
    this.teamMenuButton = ({ teamName }) =>
      page.getByRole('cell', { name: `${teamName}` }).getByLabel('more');
    this.updateTeamOption = page.getByRole('menuitem', { name: 'Edit...' });
    this.updateTeamButton = page.getByRole('button', {
      name: 'Update team',
    });
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

  async mock400ErrorOnUpdatingTeam() {
    await this.page.route(
      `http://localhost:8080/application/api/team/*`,
      async (route) => {
        await route.fulfill({ status: 400 });
      }
    );
    await this.updateTeam();
  }
}
