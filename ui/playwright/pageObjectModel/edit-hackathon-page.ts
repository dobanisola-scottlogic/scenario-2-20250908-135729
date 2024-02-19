import { expect, type Page } from '@playwright/test';

export class EditHackathonPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Start of locators

  getEditHackathonPopUp = () => this.page.getByRole('dialog');

  getEditHackathonPopUpTitle = () => this.page.getByText('Edit hackathon');

  getHackathonNameField = () => this.page.getByLabel('Hackathon name');

  getEditMilestoneBotDropdown = () =>
    this.page.getByTestId('current-milestone-bot');

  getEditMilestoneMapDropdown = () => this.page.getByTestId('game-map');

  getEditList = () => this.page.getByRole('listbox');

  getUpdateHackathonButton = () =>
    this.page.getByRole('button', {
      name: 'Update hackathon',
    });

  getCancelButton = () => this.page.getByRole('button', { name: 'Cancel' });

  // End of locators

  async editMilestoneBot() {
    await this.getEditMilestoneBotDropdown().click();
  }

  async editMilestoneMap() {
    await this.getEditMilestoneMapDropdown().click();
  }

  async clickUpdateHackathon() {
    await this.getUpdateHackathonButton().click();
  }

  async clickBotName(botName: string) {
    await this.getEditList().getByText(botName).click();
  }

  async clickMapName(mapName: string) {
    await this.getEditList().getByText(mapName).click();
  }

  async verifyEditHackathonPopUp() {
    await expect(this.getEditHackathonPopUp()).toBeVisible();
    await expect(this.getEditHackathonPopUpTitle()).toBeVisible();
    await expect(this.getUpdateHackathonButton()).toBeEnabled();
    await expect(this.getCancelButton()).toBeVisible();
  }

  async verifyEditHackathonPopUpDoesNotExist() {
    await expect(this.getEditHackathonPopUp()).toBeHidden();
  }

  async verifyMilestoneBotList() {
    await expect(this.getEditList()).toContainText('Milestone1Bot');
    await expect(this.getEditList()).toContainText('Milestone2Bot');
    await expect(this.getEditList()).toContainText('Milestone3Bot');
    await expect(this.getEditList()).toContainText('Milestone4Bot');
    await expect(this.getEditList()).toContainText('Milestone5Bot');
    await expect(this.getEditList()).toContainText('FastExpansionBot');
    await this.getEditList().click();
  }

  async verifyMilestoneMapList() {
    await expect(this.getEditList()).toContainText('Very Easy');
    await expect(this.getEditList()).toContainText('Easy');
    await expect(this.getEditList()).toContainText('Medium');
    await expect(this.getEditList()).toContainText('Large Medium');
    await expect(this.getEditList()).toContainText('Hard');
    await expect(this.getEditList()).toContainText('Three Star');
    await expect(this.getEditList()).toContainText('Three Straight');
    await this.getEditList().click();
  }

  async updateHackathonDetailsViaAPITo(
    hackathon: string,
    map: string,
    bot: string
  ) {
    const hackathonPutResponse = await this.page.request.put(
      `./api/hackathon/${hackathon.toLowerCase()}`,
      {
        data: {
          milestoneClassName: `com.scottlogic.hackathon.bots.${bot}`,
          milestoneMap: map,
        },
      }
    );
    expect(hackathonPutResponse.status()).toBe(200);
  }

  async mock400ErrorOnUpdatingHackathon() {
    await this.page.route('./api/hackathon/*', async (route) => {
      await route.fulfill({ status: 400 });
    });
    await this.clickUpdateHackathon();
  }

  async mock500ErrorOnUpdatingHackathon() {
    await this.page.route('./api/hackathon/*', async (route) => {
      await route.fulfill({ status: 500 });
    });
    await this.clickUpdateHackathon();
  }
}
