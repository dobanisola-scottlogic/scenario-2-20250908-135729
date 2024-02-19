import { type Page } from '@playwright/test';

export class DeleteTeamPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Start of locators

  getPopupBox = () => this.page.getByRole('dialog');

  getDeleteTeamButton = () =>
    this.page.getByRole('button', { name: 'Delete team' });

  getTeamMenuButton = (teamName: string) =>
    this.page.getByRole('row', { name: teamName }).getByLabel('more');

  getDeleteTeamOption = () =>
    this.page.getByRole('menuitem', { name: 'Delete...' });

  // End of locators

  async openDeletePopupOfTeamWithName(teamName: string) {
    await this.getTeamMenuButton(teamName).click();
    await this.getDeleteTeamOption().click();
  }

  async deleteTeam() {
    await this.getDeleteTeamButton().click();
  }

  async mock400ErrorOnTeamDeletion() {
    await this.page.route('./api/team/*', async (route) => {
      await route.fulfill({ status: 400 });
    });
    await this.deleteTeam();
  }

  async mock500ErrorOnTeamDeletion() {
    await this.page.route('./api/team/*', async (route) => {
      await route.fulfill({ status: 500 });
    });
    await this.deleteTeam();
  }
}
