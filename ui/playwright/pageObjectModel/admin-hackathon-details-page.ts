import { expect, type Page } from '@playwright/test';

export class HackathonDetailsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Start of locators

  getTeamMenuButton = (teamName: string) =>
    this.page.getByRole('row', { name: teamName }).getByLabel('more');

  getGameTitle = (gameTitleName: string) =>
    this.page.getByRole('row', { name: gameTitleName });

  getAddNewTeamButton = () =>
    this.page.getByRole('button', {
      name: 'Add a new team',
    });

  getAddNewGameButton = () =>
    this.page.getByRole('button', {
      name: 'Add a new game',
    });

  getHackathonMenuButton = (hackathonName: string) =>
    this.page.getByRole('row', { name: `${hackathonName}` }).getByLabel('more');

  getEditHackathonButton = () =>
    this.page.getByRole('menuitem', {
      name: 'Edit...',
    });

  getHackathonLink = (hackathonName: string) =>
    this.page.getByRole('link', { name: `${hackathonName}` });

  getHackathonPageLink = () =>
    this.page.getByRole('link', { name: 'Hackathons' });

  getMilestoneInformationText = (map: string, milestone: string) =>
    this.page.getByText(`Current Milestone: Map: ${map} - Bot: ${milestone}`);

  // End of locators

  async openCreateTeamPopup() {
    await this.getAddNewTeamButton().click();
  }

  async openCreateGamePopup() {
    await this.getAddNewGameButton().click();
  }

  async openEditHackathonPopup(hackathonName: string) {
    await this.getHackathonMenuButton(hackathonName).click();
    await this.getEditHackathonButton().click();
  }

  async openTheHackathonPage(teamHackathonName: string) {
    await this.getHackathonLink(teamHackathonName).click();
  }

  async returnToHackathonListPage() {
    await this.getHackathonPageLink().click();
  }

  async checkExistenceOfTeamInTableWithName(
    teamName: string,
    shouldExist: boolean
  ) {
    let expectedAmount = 0;
    if (shouldExist) {
      expectedAmount = 1;
    }
    expect(await this.getTeamMenuButton(teamName).count()).toBe(expectedAmount);
  }

  async verifyGameExists(gameTitle: string) {
    await expect(this.getGameTitle(gameTitle)).toContainText(gameTitle);
  }

  async verifyMilestoneInformationHasDetails(map: string, milestone: string) {
    await expect(
      this.getMilestoneInformationText(map, milestone)
    ).toBeVisible();
  }
}
