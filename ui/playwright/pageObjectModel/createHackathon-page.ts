import { APIResponse, expect, type Locator, type Page } from '@playwright/test';

export class CreateHackathonPage {
  readonly page: Page;
  readonly logoutButton: Locator;
  readonly createHackathonButton: Locator;
  readonly createHackathonPopUp: Locator;
  readonly hackathonNameField: Locator;
  readonly addNewHackathonButton: Locator;
  readonly cancelButton: Locator;
  readonly successIcon: Locator;
  readonly alertNotification: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
    this.createHackathonButton = page.getByRole('button', {
      name: 'Create Hackathon',
    });
    this.createHackathonPopUp = page.getByRole('dialog');
    this.hackathonNameField = page.getByLabel('Hackathon name');
    this.addNewHackathonButton = page.getByRole('button', {
      name: 'ADD A NEW HACKATHON',
    });
    this.cancelButton = page.getByRole('button', { name: 'CANCEL' });
    this.successIcon = page.getByTestId('SuccessOutlinedIcon');
    this.alertNotification = page.getByRole('alert');
  }

  async openCreateHackathonPopup() {
    await this.createHackathonButton.click();
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
    await expect(this.createHackathonButton).toBeHidden();
    await expect(this.createHackathonPopUp).toBeVisible();
    await expect(this.createHackathonPopUp).toContainText(hackathonName);
    await expect(this.addNewHackathonButton).toBeDisabled();
    await expect(this.cancelButton).toBeVisible();
  }

  async verifyCreateHackathonPopUpDoesNotExist() {
    await expect(this.createHackathonPopUp).toBeHidden();
  }

  async verifyCreateHackathonButtonDoesNotExist() {
    await expect(this.createHackathonButton).toBeHidden();
  }

  async verifyHackathonCreated(alertMessage: string) {
    await expect(this.successIcon).toBeVisible();
    await expect(this.alertNotification).toContainText(alertMessage);
  }

  async expectNumberOfHackathonsToBe(hackathonNumber: number) {
    const hackathonResponse: APIResponse = await this.page.request.get(
      'http://localhost:8080/application/api/hackathon'
    );
    const hackathonResponseJSON = (await hackathonResponse.json()) as [];
    expect(hackathonResponseJSON).toHaveLength(hackathonNumber);
  }
}
