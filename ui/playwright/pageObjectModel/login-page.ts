import { type Locator, type Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly visibilityButton: Locator;
  readonly loginButton: Locator;
  readonly loggedInTitle: Locator;
  readonly errorLogo: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.getByRole('textbox', { name: 'Username'});
    this.passwordField = page.getByTestId('password-input');
    this.visibilityButton = page.getByLabel('toggle password visibility');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.loggedInTitle = page.getByRole('heading');
    this.errorLogo = page.getByTestId('ErrorOutlineIcon');
    this.errorMessage = page.getByRole('alert');
  }

  async inputPassword(password: string) {
    await this.passwordField.fill(password);
  }

  async inputCredentials(username: string, password: string) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
  }

  async attemptLogin() {
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
        await route.fulfill(
          {status: 500}
        )
      }
    );
    await this.attemptLogin();
  }

  async verifyLoginErrorIs(message: string) {
    await expect(this.errorLogo).toBeVisible();
    await expect(this.errorMessage).toHaveText(message);
  }

  async verifyLoginSuccessWithRole(role: string) {
    await expect(this.loggedInTitle).toContainText(role);
  }

  async clickVisibilityButton() {
    await this.visibilityButton.click();
  }

  async verifyPasswordIs(visibleOrHidden: string) {
    const requiredType = (visibleOrHidden == "visible") ? "text" : "password"
    await expect(this.passwordField).toHaveAttribute("type", requiredType)
  }
}
