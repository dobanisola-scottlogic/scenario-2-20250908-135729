import { APIResponse, expect, type Locator, type Page } from '@playwright/test';

export class HackathonListPage {
  readonly page: Page;
  readonly navigationBarDropdownButton: Locator;
  readonly logoutButton: Locator;
  readonly addNewHackathonButton: Locator;
  readonly hackathonMenuButton: ({
    hackathonName,
  }: {
    hackathonName: string;
  }) => Locator;
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
    this.hackathonMenuButton = ({ hackathonName }) =>
      page.getByRole('row', { name: `${hackathonName}` }).getByLabel('more');
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

  async openDeletePopupOfHackathonWithName(hackathonName: string) {
    await this.hackathonMenuButton({ hackathonName: hackathonName }).click();
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

  async checkExistenceOfHackathonInTableWithName(
    hackathonName: string,
    shouldExist: boolean
  ) {
    let expectedAmount = 0;
    if (shouldExist) {
      expectedAmount = 1;
    }
    expect(
      await this.hackathonMenuButton({ hackathonName: hackathonName }).count()
    ).toBe(expectedAmount);
  }

  async clearAnyExistingHackathonWithName(hackathonName: string) {
    const hackathonPostResponse = await this.page.request.get(
      `http://localhost:8080/application/api/hackathon/${hackathonName.toLowerCase()}`
    );
    if (hackathonPostResponse.status() == 200) {
      const hackathonDeleteResponse = await this.page.request.delete(
        `http://localhost:8080/application/api/hackathon/${hackathonName.toLowerCase()}`
      );
      expect(hackathonDeleteResponse.status()).toBe(204);
    }
  }
}
