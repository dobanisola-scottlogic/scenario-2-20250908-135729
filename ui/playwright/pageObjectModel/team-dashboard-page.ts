import { expect, type Locator, type Page } from '@playwright/test';

export class TeamDashboardPage {
  readonly page: Page;
  readonly loggedInTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loggedInTitle = page.getByRole('heading');
  }

  async verifyLoginSuccess() {
    await expect(this.loggedInTitle).toContainText('Team');
  }
}
