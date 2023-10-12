import { expect, type Locator, type Page } from '@playwright/test';

export class HackathonDetailsPage {
  readonly page: Page;
  readonly teamName: ({ teamName }: { teamName: string }) => Locator;
  readonly navigationBarDropdownButton: Locator;
  readonly addNewTeamButton: Locator;
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

  constructor(page: Page) {
    this.page = page;
    this.teamName = ({ teamName }) =>
      page.getByRole('row', { name: `${teamName}` }).getByRole('cell');
    this.navigationBarDropdownButton = page.getByRole('button', {
      name: 'admin',
    });
    this.addNewTeamButton = page.getByRole('button', {
      name: 'Add a new team',
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
  }

  async openCreateTeamPopup() {
    await this.addNewTeamButton.click();
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

  async verifyTeamIsCreatedWithName(teamName: string) {
    await expect(this.teamName({ teamName: teamName })).toHaveText(teamName);
  }
}
