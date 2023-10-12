import { expect, type Locator, type Page } from '@playwright/test';

export class CreateHackathonPage {
  readonly page: Page;
  readonly createHackathonPopup: Locator;
  readonly hackathonNameField: Locator;
  readonly addNewHackathonButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createHackathonPopup = page.getByRole('dialog');
    this.hackathonNameField = page.getByLabel('Hackathon name');
    this.addNewHackathonButton = page.getByRole('button', {
      name: 'Add a new hackathon',
    });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async inputHackathonName(hackathonName: string) {
    await this.hackathonNameField.fill(hackathonName);
  }

  async clearHackathonName() {
    await this.hackathonNameField.clear();
  }

  async addNewHackathon() {
    await this.addNewHackathonButton.click();
  }

  async cancelNewHackathon() {
    await this.cancelButton.click();
  }

  async verifyCreateHackathonPopUp(hackathonName: string) {
    await expect(this.createHackathonPopup).toContainText(hackathonName);
    await expect(this.addNewHackathonButton).toBeDisabled();
    await expect(this.cancelButton).toBeVisible();
  }

  async createHackathonUsingAPIWithName(hackathonName: string) {
    const hackathonPostResponse = await this.page.request.post(
      'http://localhost:8080/application/api/hackathon',
      {
        data: {
          name: hackathonName,
        },
      }
    );
    expect(hackathonPostResponse.status()).toBe(200);
  }

  async mock400ErrorOnCreatingHackathon() {
    await this.page.route(
      `http://localhost:8080/application/api/hackathon`,
      async (route) => {
        await route.fulfill({ status: 400 });
      }
    );
    await this.addNewHackathon();
  }

  async mock500ErrorOnCreatingHackathon() {
    await this.page.route(
      `http://localhost:8080/application/api/hackathon`,
      async (route) => {
        await route.fulfill({ status: 500 });
      }
    );
    await this.addNewHackathon();
  }
}
