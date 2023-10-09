import { expect, type Locator, type Page } from '@playwright/test';

export class DeleteTeamPage {
  readonly page: Page;
  readonly popupBox: Locator;
  readonly deleteTeamButton: Locator;
  readonly teamMenuButton: ({ teamName }: { teamName: string }) => Locator;
  readonly deleteTeamOption: Locator;
  readonly cancelDeletionButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.popupBox = page.getByRole('dialog');
    this.deleteTeamButton = page.getByRole('button', { name: 'Delete team' });
    this.teamMenuButton = ({ teamName }) =>
      page.getByRole('cell', { name: `${teamName}` }).getByLabel('more');
    this.deleteTeamOption = page.getByRole('menuitem', { name: 'Delete...' });
    this.cancelDeletionButton = page.getByRole('button', {
      name: 'Cancel',
    });
  }

  async openDeletePopupOfTeamWithName(teamName: string) {
    await this.teamMenuButton({ teamName: teamName }).click();
    await this.deleteTeamOption.click();
  }

  async deleteTeam() {
    await this.deleteTeamButton.click();
  }

  async cancelTeamDeletion() {
    await this.cancelDeletionButton.click();
  }

  async mock400ErrorOnTeamDeletion() {
    await this.page.route(
      `http://localhost:8080/application/api/team/*`,
      async (route) => {
        await route.fulfill({ status: 400 });
      }
    );
    await this.deleteTeam();
  }

  async mock500ErrorOnTeamDeletion() {
    await this.page.route(
      `http://localhost:8080/application/api/team/*`,
      async (route) => {
        await route.fulfill({ status: 500 });
      }
    );
    await this.deleteTeam();
  }

  // This will be refactored into a "create team" page object model when it gets created
  async createTeamUsingAPIWithName(teamAndHackathonName: string) {
    const teamPostResponse = await this.page.request.post(
      'http://localhost:8080/application/api/team',
      {
        data: {
          name: teamAndHackathonName,
          password: 'teamPassword',
          hackathonId: teamAndHackathonName.toLowerCase(),
        },
      }
    );
    expect(teamPostResponse.status()).toBe(200);
  }
}
