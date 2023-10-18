import { type Locator, type Page } from '@playwright/test';

export class DeleteTeamPage {
  readonly page: Page;
  readonly popupBox: Locator;
  readonly deleteTeamButton: Locator;
  readonly teamMenuButton: ({ teamName }: { teamName: string }) => Locator;
  readonly deleteTeamOption: Locator;

  constructor(page: Page) {
    this.page = page;
    this.popupBox = page.getByRole('dialog');
    this.deleteTeamButton = page.getByRole('button', { name: 'Delete team' });
    this.teamMenuButton = ({ teamName }) =>
      page.getByRole('cell', { name: `${teamName}` }).getByLabel('more');
    this.deleteTeamOption = page.getByRole('menuitem', { name: 'Delete...' });
  }

  async openDeletePopupOfTeamWithName(teamName: string) {
    await this.teamMenuButton({ teamName: teamName }).click();
    await this.deleteTeamOption.click();
  }

  async deleteTeam() {
    await this.deleteTeamButton.click();
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
}
