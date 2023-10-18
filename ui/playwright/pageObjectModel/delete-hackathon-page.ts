import { expect, type Locator, type Page } from '@playwright/test';

export class DeleteHackathonPage {
  readonly page: Page;
  readonly popupHeaderText: Locator;
  readonly popupBodyText: Locator;
  readonly deleteHackathonButton: Locator;
  readonly successCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.popupHeaderText = page.locator('[role="dialogHeading"]').nth(0);
    this.popupBodyText = page.locator('[role="dialogHeading"]').nth(1);
    this.deleteHackathonButton = page.getByRole('button', {
      name: 'Delete hackathon',
    });
    this.successCloseButton = page.getByLabel('Close');
  }

  async confirmPopupTextIs(headerText: string, bodyText: string) {
    await expect(this.popupHeaderText).toContainText(headerText);
    await expect(this.popupBodyText).toContainText(bodyText);
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
