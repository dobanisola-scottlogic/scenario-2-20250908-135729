import { type Locator, type Page } from '@playwright/test';

export class DeleteHackathonPage {
  readonly page: Page;
  readonly deleteHackathonButton: Locator;
  readonly successCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.deleteHackathonButton = page.getByRole('button', {
      name: 'Delete hackathon',
    });
    this.successCloseButton = page.getByLabel('Close');
  }

  async deleteHackathon() {
    await this.deleteHackathonButton.click();
  }

  async mock400ErrorOnDeletingHackathon() {
    await this.page.route(
      'http://localhost:8080/application/api/hackathon/*',
      async (route) => {
        await route.fulfill({ status: 400 });
      }
    );
    await this.deleteHackathon();
  }

  async mock500ErrorOnDeletingHackathon() {
    await this.page.route(
      'http://localhost:8080/application/api/hackathon/*',
      async (route) => {
        await route.fulfill({ status: 500 });
      }
    );
    await this.deleteHackathon();
  }

  async closeSuccessAlert() {
    await this.successCloseButton.click();
  }
}
