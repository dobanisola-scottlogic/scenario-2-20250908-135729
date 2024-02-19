import { expect, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Start of locators

  getLoginTitle = () => this.page.getByRole('heading');

  getUsernameField = () => this.page.getByRole('textbox', { name: 'Username' });

  getPasswordField = () => this.page.getByTestId('password-input');

  getVisibilityButton = () =>
    this.page.getByLabel('toggle password visibility');

  getLoginButton = () => this.page.getByRole('button', { name: 'Login' });

  // End of locators

  async inputPassword(password: string) {
    await this.getPasswordField().fill(password);
  }

  async inputCredentials(username: string, password: string) {
    await this.getUsernameField().fill(username);
    await this.getPasswordField().fill(password);
  }

  async validateUsername(username: string) {
    await expect(this.getUsernameField()).toHaveValue(username);
  }

  async validatePassword(password: string) {
    await expect(this.getPasswordField()).toHaveValue(password);
  }

  async verifyLoginButtonIsDisabled() {
    await expect(this.getLoginButton()).toBeDisabled();
  }

  async attemptLogin() {
    await expect(this.getLoginButton()).toBeEnabled();
    await this.getLoginButton().click();
  }

  async clickVisibilityButton() {
    await this.getVisibilityButton().click();
  }

  async verifyPasswordIs(visibleOrHidden: string) {
    const requiredType = visibleOrHidden == 'visible' ? 'text' : 'password';
    await expect(this.getPasswordField()).toHaveAttribute('type', requiredType);
  }

  async verifyLogoutSuccess() {
    await expect(this.getLoginTitle()).toContainText('Login');
  }

  async attemptTeamLoginWithRequiredInformation() {
    await this.page.route(
      'http://localhost:8080/application/api/team/info',
      async (route) => {
        const json = {
          accountId: '012345678901',
          userName: 'haclocal-contestant',
          password: 'teamPassword',
          devEnvironment: 'http://localhost:8080/application/ui/',
        };
        await route.fulfill({ json });
      }
    );
    await this.attemptLogin();
  }

  async mockTeamLogin() {
    await this.page.route('./api/login', async (route) => {
      const json = { name: 'team', role: 'TEAM', team: true, admin: false };
      await route.fulfill({ json });
    });
    await this.attemptLogin();
  }

  async mockUncaughtErrorOnLogin() {
    await this.page.route('./api/login', async (route) => {
      await route.fulfill({ status: 500 });
    });
    await this.attemptLogin();
  }

  async loginWithUnknownMilestoneBot() {
    await this.page.route('./api/milestone', async (route) => {
      const response = await route.fetch();
      const json = (await response.json()) as {
        id: string;
        milestoneClassName: string;
        timeStamp: number;
      }[];
      json.push({
        id: 'abcdefgh-0123-4567-ijkl-mnopqr890123',
        milestoneClassName: 'com.scottlogic.hackathon.bots.Milestone6Bot',
        timeStamp: Date.now(),
      });
      await route.fulfill({ json });
    });
    await this.attemptLogin();
  }
}
