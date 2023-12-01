import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly loginTitle: Locator;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly visibilityButton: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginTitle = page.getByRole('heading');
    this.usernameField = page.getByRole('textbox', { name: 'Username' });
    this.passwordField = page.getByTestId('password-input');
    this.visibilityButton = page.getByLabel('toggle password visibility');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async inputPassword(password: string) {
    await this.passwordField.fill(password);
  }

  async inputCredentials(username: string, password: string) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
  }

  async verifyLoginButtonIsDisabled() {
    await expect(this.loginButton).toBeDisabled();
  }

  async attemptLogin() {
    await expect (this.loginButton).toBeEnabled();
    await this.loginButton.click();
  }

  async mockTeamLogin() {
    await this.page.route(
      'http://localhost:8080/application/api/login',
      async (route) => {
        const json = { name: 'team', role: 'TEAM', admin: false, team: true };
        await route.fulfill({ json });
      }
    );
    await this.attemptLogin();
  }

  async mockUncaughtErrorOnLogin() {
    await this.page.route(
      'http://localhost:8080/application/api/login',
      async (route) => {
        await route.fulfill({ status: 500 });
      }
    );
    await this.attemptLogin();
  }

  async clickVisibilityButton() {
    await this.visibilityButton.click();
  }

  async verifyPasswordIs(visibleOrHidden: string) {
    const requiredType = visibleOrHidden == 'visible' ? 'text' : 'password';
    await expect(this.passwordField).toHaveAttribute('type', requiredType);
  }

  async verifyLogoutSuccess() {
    await expect(this.loginTitle).toContainText('Login');
  }
}
