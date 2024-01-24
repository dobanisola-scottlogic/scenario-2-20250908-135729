import { expect, type Locator, type Page } from '@playwright/test';

export class TeamDashboardPage {
  readonly page: Page;
  readonly viewInformationButton: Locator;
  readonly refreshButton: Locator;
  readonly connectButton: Locator;
  readonly cancelButton: Locator;
  readonly addGameButton: Locator;
  readonly connectStatusText: ({
    statusText,
  }: {
    statusText: string;
  }) => Locator;
  readonly milestoneInformation: ({
    map,
    bot,
  }: {
    map: string;
    bot: string;
  }) => Locator;
  readonly milestoneNotFoundText: Locator;
  readonly connectionStatistics: ({
    connectionStatus,
  }: {
    connectionStatus: string;
  }) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.viewInformationButton = page.getByRole('button', {
      name: 'View information',
    });
    this.refreshButton = page.getByRole('button', { name: 'Refresh' });
    this.connectButton = page.getByRole('button', { name: 'Connect' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.addGameButton = page.getByRole('button', {
      name: 'Add a new game',
    });
    this.connectStatusText = ({ statusText }) =>
      page.getByText(`The connection status of your bot is:${statusText}`);
    this.milestoneInformation = ({ map, bot }) =>
      page.getByText(`Current Milestone: Map: ${map} - Bot: ${bot}`);
    this.milestoneNotFoundText = page.getByText(
      'Failed to fetch current milestone.'
    );
    this.connectionStatistics = ({ connectionStatus }) =>
      page.getByText(`Status: ${connectionStatus}`);
  }

  async verifyLoginSuccess() {
    await expect(this.viewInformationButton).toBeEnabled();
    await expect(this.refreshButton).toBeEnabled();
    await expect(this.connectButton).toBeEnabled();
    await expect(this.addGameButton).toBeDisabled();
  }

  async verifyStateIsDisconnected() {
    await expect(this.connectButton).toBeVisible();
    await expect(this.cancelButton).toBeHidden();
    await expect(
      this.connectStatusText({ statusText: 'Disconnected' })
    ).toBeVisible();
  }

  async verifyStateIsAwaitingConnection() {
    await expect(this.cancelButton).toBeVisible();
    await expect(this.connectButton).toBeHidden();
    await expect(
      this.connectStatusText({
        statusText: 'Waiting for you to start your bot',
      })
    ).toBeVisible();
  }

  async clickViewInformationButton() {
    await this.viewInformationButton.click();
  }

  async clickRefreshButton() {
    await this.refreshButton.click();
  }

  async clickConnectButton() {
    await this.connectButton.click();
  }

  async verifyGameCanBeAdded() {
    await expect(this.addGameButton).toBeEnabled();
  }

  async verifyMilestoneInformationIs({
    map,
    bot,
  }: {
    map: string;
    bot: string;
  }) {
    await expect(
      this.milestoneInformation({ map: map, bot: bot })
    ).toBeVisible();
  }

  async verifyMilestoneErrorMessageAppears() {
    await expect(this.milestoneNotFoundText).toBeVisible();
  }

  async verifyConnectionStatusIs(connectionStatus: string) {
    await expect(
      this.connectStatusText({ statusText: connectionStatus })
    ).toBeVisible();
  }
}
