import { expect, type Locator, type Page } from '@playwright/test';

export class CreateTeamPage {
  readonly page: Page;
  readonly createTeamPopup: Locator;
  readonly teamNameField: Locator;
  readonly teamPasswordField: Locator;
  readonly addNewTeamButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createTeamPopup = page.getByRole('dialog');
    this.teamNameField = page.getByLabel('Name');
    this.teamPasswordField = page.getByLabel('Password');
    this.addNewTeamButton = page.getByRole('button', {
      name: 'Add team',
    });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async inputTeamName(teamName: string) {
    await this.teamNameField.fill(teamName);
  }

  async clearTeamName() {
    await this.teamNameField.clear();
  }

  async inputTeamPassword(teamPassword: string) {
    await this.teamPasswordField.fill(teamPassword);
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
    await expect(this.addNewTeamButton).toBeDisabled();
    await expect(this.cancelButton).toBeVisible();
  }

  async verifyTeamCannotBeCreated() {
    await expect(this.addNewTeamButton).toBeDisabled();
  }

  async mock400ErrorOnCreatingTeam() {
    await this.page.route(
      `http://localhost:8080/application/api/team`,
      async (route) => {
        await route.fulfill({ status: 400 });
      }
    );
    await this.addNewTeam();
  }

  async createTeamUsingAPIWithHackathonAndTeamName(
    hackathonName: string,
    teamName: string
  ) {
    const teamPostResponse = await this.page.request.post(
      'http://localhost:8080/application/api/team',
      {
        data: {
          name: teamName,
          password: 'teamPassword',
          hackathonId: hackathonName.toLowerCase(),
        },
      }
    );
    expect(teamPostResponse.status()).toBe(200);
  }
}
