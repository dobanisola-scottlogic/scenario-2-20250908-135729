import { expect, type Locator, type Page } from '@playwright/test';

export class CommonPageObjects {
  readonly page: Page;
  readonly popupBox: Locator;
  readonly navigationBarDropdownButton: Locator;
  readonly logoutButton: Locator;
  readonly popupHeaderText: Locator;
  readonly popupBodyText: Locator;
  readonly successIcon: Locator;
  readonly errorIcon: Locator;
  readonly alertNotification: Locator;
  readonly successCloseButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.popupBox = page.getByRole('dialog');
    this.navigationBarDropdownButton = page.getByRole('button', {
      name: 'admin',
    });
    this.logoutButton = page.getByRole('menuitem', { name: 'Logout' });
    this.popupHeaderText = page.locator('[role="dialogHeading"]').nth(0);
    this.popupBodyText = page.locator('[role="dialogHeading"]').nth(1);
    this.successIcon = page.getByTestId('SuccessOutlinedIcon');
    this.errorIcon = page.getByTestId('ErrorOutlineIcon');
    this.alertNotification = page.getByRole('alert');
    this.successCloseButton = page.getByLabel('Close');
    this.cancelButton = page.getByRole('button', {
      name: 'Cancel',
    });
  }

  async confirmPopupIsVisible() {
    await expect(this.popupBox).toBeVisible();
  }

  async confirmPopupIsHidden() {
    await expect(this.popupBox).toBeHidden();
  }

  async confirmPopupTextIs(headerText: string, bodyText: string) {
    await expect(this.popupHeaderText).toContainText(headerText);
    await expect(this.popupBodyText).toContainText(bodyText);
  }

  async cancelCurrentAction() {
    await this.cancelButton.click();
  }

  async logoutUsingDropdown() {
    await this.navigationBarDropdownButton.click();
    await this.logoutButton.click();
  }

  async confirmSuccessMessageIs(successMessage: string) {
    await expect(this.successIcon).toBeVisible();
    await expect(this.alertNotification).toContainText(successMessage);
  }

  async confirmErrorMessageIs(errorMessage: string) {
    await expect(this.errorIcon).toBeVisible();
    await expect(this.alertNotification).toContainText(errorMessage);
  }

  async closeSuccessAlert() {
    await this.successCloseButton.click();
  }

  async confirmSuccessAlertDoesNotExist() {
    await expect(this.successIcon).toBeHidden();
  }

  async refreshPage() {
    await this.page.reload();
  }
}
