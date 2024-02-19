import { expect, type Page } from '@playwright/test';

export class CreateHackathonPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Start of locators

  getCreateHackathonPopup = () => this.page.getByRole('dialog');

  getHackathonNameField = () => this.page.getByLabel('Hackathon name');

  getAddNewHackathonButton = () =>
    this.page.getByRole('button', {
      name: 'Add a new hackathon',
    });

  getCancelButton = () => this.page.getByRole('button', { name: 'Cancel' });

  // End of locators

  async inputHackathonName(hackathonName: string) {
    await this.getHackathonNameField().fill(hackathonName);
  }

  async validateHackathonName(hackathonName: string) {
    await expect(this.getHackathonNameField()).toHaveValue(hackathonName);
  }

  async clearHackathonName() {
    await this.getHackathonNameField().clear();
  }

  async addNewHackathon() {
    await this.getAddNewHackathonButton().click();
  }

  async verifyCreateHackathonPopUp(hackathonName: string) {
    await expect(this.getCreateHackathonPopup()).toContainText(hackathonName);
    await expect(this.getAddNewHackathonButton()).toBeDisabled();
    await expect(this.getCancelButton()).toBeVisible();
  }

  async createHackathonUsingAPIWithName(hackathonName: string) {
    const hackathonPostResponse = await this.page.request.post(
      './api/hackathon',
      {
        data: {
          name: hackathonName,
        },
      }
    );
    expect(hackathonPostResponse.status()).toBe(201);
  }

  async mock500ErrorOnCreatingHackathon() {
    await this.page.route('./api/hackathon', async (route) => {
      await route.fulfill({ status: 500 });
    });
    await this.addNewHackathon();
  }
}
