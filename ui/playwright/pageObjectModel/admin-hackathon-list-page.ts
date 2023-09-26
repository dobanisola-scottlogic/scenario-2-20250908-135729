import { expect, type Locator, type Page } from '@playwright/test';

export class HackathonListPage {
  readonly page: Page;
  readonly addNewHackathonButton: Locator;
  readonly hackathonMenuButton: Locator;
  readonly deleteHackathonButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addNewHackathonButton = page.getByRole('button', {
      name: 'Add a new hackathon',
    });
    this.hackathonMenuButton = page.getByLabel('more');
    this.deleteHackathonButton = page.getByRole('menuitem', {
      name: 'Delete...',
    });
  }

  async openCreateHackathonPopup() {
    await this.addNewHackathonButton.click();
  }

  async openDeleteHackathonPopup() {
    await this.hackathonMenuButton.click();
    await this.deleteHackathonButton.click();
  }

  async verifyLoginSuccess() {
    await expect(this.addNewHackathonButton).toBeVisible();
  }
}
