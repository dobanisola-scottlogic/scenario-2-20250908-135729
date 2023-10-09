import { expect, type Locator, type Page } from '@playwright/test';

export class CreateHackathonPage {
  readonly page: Page;
  readonly createHackathonPopup: Locator;
  readonly hackathonNameField: Locator;
  readonly addNewHackathonButton: Locator;
  readonly cancelButton: Locator;
  readonly successIcon: Locator;
  readonly alertNotification: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createHackathonPopup = page.getByRole('dialog');
    this.hackathonNameField = page.getByLabel('Hackathon name');
    this.addNewHackathonButton = page.getByRole('button', {
      name: 'Add a new hackathon',
    });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.successIcon = page.getByTestId('SuccessOutlinedIcon');
    this.alertNotification = page.getByRole('alert');
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
    await expect(this.createHackathonPopup).toBeVisible();
    await expect(this.createHackathonPopup).toContainText(hackathonName);
    await expect(this.addNewHackathonButton).toBeDisabled();
    await expect(this.cancelButton).toBeVisible();
  }

  async verifyCreateHackathonPopUpDoesNotExist() {
    await expect(this.createHackathonPopup).toBeHidden();
  }

  async verifyHackathonCreated(alertMessage: string) {
    await expect(this.successIcon).toBeVisible();
    await expect(this.alertNotification).toContainText(alertMessage);
  }
}
