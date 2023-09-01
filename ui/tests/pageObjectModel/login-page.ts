import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.getByPlaceholder("Team Name");
    this.passwordField = page.getByPlaceholder("Password");
    this.loginButton = page.getByRole("button", {name: "Login"})
  }

  async inputUsername(username: string) {
    await this.usernameField.fill(username);
  }

  async inputPassword(password: string) {
    await this.passwordField.fill(password);
  }

  async attemptLogin() {
    await this.loginButton.click();
  }
}