import { expect, type Page } from '@playwright/test';

export class TeamDashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Start of locators

  getViewInformationButton = () =>
    this.page.getByRole('button', {
      name: 'View information',
    });

  getRefreshButton = () => this.page.getByRole('button', { name: 'Refresh' });

  getConnectButton = () => this.page.getByRole('button', { name: 'Connect' });

  getCancelButton = () => this.page.getByRole('button', { name: 'Cancel' });

  getAddGameButton = () =>
    this.page.getByRole('button', {
      name: 'Add a new game',
    });

  getConnectStatusText = (statusText: string) =>
    this.page.getByText(`The connection status of your bot is:${statusText}`);

  getMilestoneInformation = (map: string, bot: string) =>
    this.page.getByText(`Current Milestone: Map: ${map} - Bot: ${bot}`);

  getMilestoneNotFoundText = () =>
    this.page.getByText('Failed to fetch current milestone.');

  getConnectionStatistics = (connectionStatus: string) =>
    this.page.getByText(`Status: ${connectionStatus}`);

  // End of locators

  async verifyLoginSuccess() {
    await expect(this.getViewInformationButton()).toBeEnabled();
    await expect(this.getRefreshButton()).toBeEnabled();
    await expect(this.getConnectButton()).toBeEnabled();
    await expect(this.getAddGameButton()).toBeDisabled();
  }

  async verifyStateIsDisconnected() {
    await expect(this.getConnectButton()).toBeVisible();
    await expect(this.getCancelButton()).toBeHidden();
    await expect(this.getConnectStatusText('Disconnected')).toBeVisible();
  }

  async verifyStateIsAwaitingConnection() {
    await expect(this.getCancelButton()).toBeVisible();
    await expect(this.getConnectButton()).toBeHidden();
    await expect(
      this.getConnectStatusText('Waiting for you to start your bot')
    ).toBeVisible();
  }

  async clickViewInformationButton() {
    await this.getViewInformationButton().click();
  }

  async clickRefreshButton() {
    await this.getRefreshButton().click();
  }

  async clickConnectButton() {
    await this.getConnectButton().click();
  }

  async verifyGameCanBeAdded() {
    await expect(this.getAddGameButton()).toBeEnabled();
  }

  async verifyMilestoneInformationIs({
    map,
    bot,
  }: {
    map: string;
    bot: string;
  }) {
    await expect(this.getMilestoneInformation(map, bot)).toBeVisible();
  }

  async verifyMilestoneErrorMessageAppears() {
    await expect(this.getMilestoneNotFoundText()).toBeVisible();
  }

  async verifyConnectionStatusIs(connectionStatus: string) {
    await expect(this.getConnectStatusText(connectionStatus)).toBeVisible();
  }
}
