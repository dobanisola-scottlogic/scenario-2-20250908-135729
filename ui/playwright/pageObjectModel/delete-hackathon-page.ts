import { type Page } from '@playwright/test';

export class DeleteHackathonPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Start of locators

  getDeleteHackathonButton = () =>
    this.page.getByRole('button', {
      name: 'Delete hackathon',
    });

  // End of locators

  async deleteHackathon() {
    await this.getDeleteHackathonButton().click();
  }

  async mock400ErrorOnDeletingHackathon() {
    await this.page.route('./api/hackathon/*', async (route) => {
      await route.fulfill({ status: 400 });
    });
    await this.deleteHackathon();
  }

  async mock500ErrorOnDeletingHackathon() {
    await this.page.route('./api/hackathon/*', async (route) => {
      await route.fulfill({ status: 500 });
    });
    await this.deleteHackathon();
  }
}
