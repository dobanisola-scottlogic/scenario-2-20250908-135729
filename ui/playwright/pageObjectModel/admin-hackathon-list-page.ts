import { expect, type Page } from '@playwright/test';

export class HackathonListPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Start of locators

  getHackathonByName = (hackathonName: string) =>
    this.page.getByRole('link', { name: `${hackathonName}` });

  getHackathonMapByName = (hackathonName: string, hackathonMap: string) =>
    this.page
      .getByRole('row', { name: `${hackathonName}` })
      .getByRole('cell', { name: `${hackathonMap}` });

  getByHackathonBot = (hackathonName: string, hackathonBot: string) =>
    this.page
      .getByRole('row', { name: `${hackathonName}` })
      .getByRole('cell', { name: `${hackathonBot}` });

  getNavigationBarDropdownButton = () =>
    this.page.getByRole('button', {
      name: 'admin',
    });

  getAddNewHackathonButton = () =>
    this.page.getByRole('button', {
      name: 'Add a new hackathon',
    });

  getHackathonMenuButtonByName = (hackathonName: string) =>
    this.page.getByRole('row', { name: `${hackathonName}` }).getByLabel('more');

  getEditHackathonButton = () =>
    this.page.getByRole('menuitem', {
      name: 'Edit...',
    });

  getDeleteHackathonButton = () =>
    this.page.getByRole('menuitem', {
      name: 'Delete...',
    });

  // End of locators

  async openCreateHackathonPopup() {
    await this.getAddNewHackathonButton().click();
  }

  async openDeletePopupOfHackathonWithName(hackathonName: string) {
    await this.getHackathonMenuButtonByName(hackathonName).click();
    await this.getDeleteHackathonButton().click();
  }

  async openEditHackathonPopup(hackathonName: string) {
    await this.getHackathonMenuButtonByName(hackathonName).click();
    await this.getEditHackathonButton().click();
  }

  async openTheHackathonPage(hackathonName: string) {
    await this.getHackathonByName(hackathonName).click();
  }

  async verifyLoginSuccess() {
    await expect(this.getAddNewHackathonButton()).toBeVisible();
  }

  async checkExistenceOfHackathonInTableWithName(
    hackathonName: string,
    shouldExist: boolean
  ) {
    let expectedAmount = 0;
    if (shouldExist) {
      expectedAmount = 1;
    }
    expect(await this.getHackathonMenuButtonByName(hackathonName).count()).toBe(
      expectedAmount
    );
  }

  async clearAnyExistingHackathonWithName(hackathonName: string) {
    const formattedHackathonName = hackathonName.toLowerCase();
    const hackathonPostResponse = await this.page.request.get(
      `./api/hackathon/${formattedHackathonName}`
    );
    if (hackathonPostResponse.status() == 200) {
      const hackathonDeleteResponse = await this.page.request.delete(
        `./api/hackathon/${formattedHackathonName}`
      );
      expect(hackathonDeleteResponse.status()).toBe(204);
    }
  }

  async verifyHackathonDetails(
    hackathonName: string,
    hackathonMap: string,
    hackathonBot: string
  ) {
    await expect(this.getHackathonByName(hackathonName)).toBeVisible();
    await expect(
      this.getHackathonMapByName(hackathonName, hackathonMap)
    ).toBeVisible();
    await expect(
      this.getByHackathonBot(hackathonName, hackathonBot)
    ).toBeVisible();
  }
}
