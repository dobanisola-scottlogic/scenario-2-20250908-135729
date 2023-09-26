import { APIResponse, expect, type Locator, type Page } from '@playwright/test';

export class HackathonListPage {
  readonly page: Page;
  readonly navigationBarDropdownButton: Locator;
  readonly logoutButton: Locator;
  readonly addNewHackathonButton: Locator;
  readonly hackathonMenuButton: Locator;
  readonly deleteHackathonButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigationBarDropdownButton = page.getByRole('button', {
      name: 'admin',
    });
    this.logoutButton = page.getByRole('menuitem', { name: 'Logout' });
    this.addNewHackathonButton = page.getByRole('button', {
      name: 'Add a new hackathon',
    });
    this.hackathonMenuButton = page.getByLabel('more');
    this.deleteHackathonButton = page.getByRole('menuitem', {
      name: 'Delete...',
    });
  }

  async logoutUsingDropdown() {
    await this.navigationBarDropdownButton.click();
    await this.logoutButton.click();
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

  async expectNumberOfHackathonsToBe(hackathonNumber: number) {
    const hackathonResponse: APIResponse = await this.page.request.get(
      'http://localhost:8080/application/api/hackathon'
    );
    const hackathonResponseJSON = (await hackathonResponse.json()) as [];
    expect(hackathonResponseJSON).toHaveLength(hackathonNumber);
  }
}
