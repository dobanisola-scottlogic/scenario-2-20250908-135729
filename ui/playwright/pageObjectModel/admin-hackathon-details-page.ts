import { expect, type Locator, type Page } from '@playwright/test';

export class HackathonDetailsPage {
  readonly page: Page;
  readonly teamMenuButton: ({ teamName }: { teamName: string }) => Locator;
  readonly gameTitle: Locator;
  readonly navigationBarDropdownButton: Locator;
  readonly addNewTeamButton: Locator;
  readonly addNewGameButton: Locator;
  readonly hackathonMenuButton: ({
    hackathonName,
  }: {
    hackathonName: string;
  }) => Locator;
  readonly editHackathonButton: Locator;
  readonly deleteHackathonButton: Locator;
  readonly hackathonLink: ({
    hackathonName,
  }: {
    hackathonName: string;
  }) => Locator;
  readonly hackathonPageLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.teamMenuButton = ({ teamName }) =>
      page.getByRole('row', { name: `${teamName}` }).getByLabel('more');
    this.gameTitle = page.getByRole('cell').getByRole('link');
    this.navigationBarDropdownButton = page.getByRole('button', {
      name: 'admin',
    });
    this.addNewTeamButton = page.getByRole('button', {
      name: 'Add a new team',
    });
    this.addNewGameButton = page.getByRole('button', {
      name: 'Add a new game',
    });
    this.hackathonMenuButton = ({ hackathonName }) =>
      page.getByRole('row', { name: `${hackathonName}` }).getByLabel('more');
    this.editHackathonButton = page.getByRole('menuitem', {
      name: 'Edit...',
    });
    this.deleteHackathonButton = page.getByRole('menuitem', {
      name: 'Delete...',
    });
    this.hackathonLink = ({ hackathonName }) =>
      page.getByRole('link', { name: `${hackathonName}` });
    this.hackathonPageLink = page.getByRole('link', { name: 'Hackathons' });
  }

  async openCreateTeamPopup() {
    await this.addNewTeamButton.click();
  }

  async openCreateGamePopup() {
    await this.addNewGameButton.click();
  }

  async openDeletePopupOfHackathonWithName(hackathonName: string) {
    await this.hackathonMenuButton({ hackathonName: hackathonName }).click();
    await this.deleteHackathonButton.click();
  }

  async openEditHackathonPopup(hackathonName: string) {
    await this.hackathonMenuButton({
      hackathonName: hackathonName,
    }).click();
    await this.editHackathonButton.click();
  }

  async openTheHackathonPage(teamHackName: string) {
    await this.hackathonLink({ hackathonName: teamHackName }).click();
  }

  async returnToHackathonListPage() {
    await this.hackathonPageLink.click();
  }

  async checkExistenceOfTeamInTableWithName(
    teamName: string,
    shouldExist: boolean
  ) {
    let expectedAmount = 0;
    if (shouldExist) {
      expectedAmount = 1;
    }
    expect(await this.teamMenuButton({ teamName: teamName }).count()).toBe(
      expectedAmount
    );
  }

  // remove .nth(0) when bug HAC-202 has been completed
  async verifyGameExists(gameTitle: string) {
    await expect(this.gameTitle.nth(0)).toContainText(gameTitle);
  }

  // below can be deleted when bug HAC-202 has been completed
  async verifySecondGameExists(gameTitle: string) {
    await expect(this.gameTitle.nth(1)).toContainText(gameTitle);
  }
}
