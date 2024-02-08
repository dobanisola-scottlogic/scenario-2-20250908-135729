import { expect, type Locator, type Page } from '@playwright/test';

export class EditHackathonPage {
  readonly page: Page;
  readonly editHackathonPopUp: Locator;
  readonly editHackathonPopUpTitle: Locator;
  readonly hackathonNameField: Locator;
  readonly editMilestoneBotDropdown: Locator;
  readonly editMilestoneMapDropdown: Locator;
  readonly editList: Locator;
  readonly updateHackathonButton: Locator;
  readonly cancelButton: Locator;
  readonly successIcon: Locator;
  readonly alertNotification: Locator;

  constructor(page: Page) {
    this.page = page;
    this.editHackathonPopUp = page.getByRole('dialog');
    this.editHackathonPopUpTitle = page.getByText('Edit hackathon');
    this.hackathonNameField = page.getByLabel('Hackathon name');
    this.editMilestoneBotDropdown = page.getByTestId('current-milestone-bot');
    this.editMilestoneMapDropdown = page.getByTestId('game-map');
    this.editList = page.getByRole('listbox');
    this.updateHackathonButton = page.getByRole('button', {
      name: 'Update hackathon',
    });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.successIcon = page.getByTestId('SuccessOutlinedIcon');
    this.alertNotification = page.getByRole('alert');
  }

  async editMilestoneBot() {
    await this.editMilestoneBotDropdown.click();
  }

  async editMilestoneMap() {
    await this.editMilestoneMapDropdown.click();
  }

  async clickUpdateHackathon() {
    await this.updateHackathonButton.click();
  }

  async clickBotName(botName: string) {
    await this.editList.getByText(botName).click();
  }

  async clickMapName(mapName: string) {
    await this.editList.getByText(mapName).click();
  }

  async verifyEditHackathonPopUp() {
    await expect(this.editHackathonPopUp).toBeVisible();
    await expect(this.editHackathonPopUpTitle).toBeVisible();
    await expect(this.updateHackathonButton).toBeEnabled();
    await expect(this.cancelButton).toBeVisible();
  }

  async verifyEditHackathonPopUpDoesNotExist() {
    await expect(this.editHackathonPopUp).toBeHidden();
  }

  async verifyMilestoneBotList() {
    await expect(this.editList).toContainText('Milestone1Bot');
    await expect(this.editList).toContainText('Milestone2Bot');
    await expect(this.editList).toContainText('Milestone3Bot');
    await expect(this.editList).toContainText('Milestone4Bot');
    await expect(this.editList).toContainText('Milestone5Bot');
    await expect(this.editList).toContainText('FastExpansionBot');
    await this.editList.click();
  }

  async verifyMilestoneMapList() {
    await expect(this.editList).toContainText('Very Easy');
    await expect(this.editList).toContainText('Easy');
    await expect(this.editList).toContainText('Medium');
    await expect(this.editList).toContainText('Large Medium');
    await expect(this.editList).toContainText('Hard');
    await expect(this.editList).toContainText('Three Star');
    await expect(this.editList).toContainText('Three Straight');
    await this.editList.click();
  }

  async verifyHackathonEdited(alertMessage: string) {
    await expect(this.successIcon).toBeVisible();
    await expect(this.alertNotification).toContainText(alertMessage);
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
