import { expect, type Page } from '@playwright/test';

export class CommonPageObjects {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Start of locators

  getPopupBox = () => this.page.getByRole('dialog');

  getNavigationBarDropdownButton = (user: string) =>
    this.page.getByRole('button', { name: user });

  getLogoutButton = () => this.page.getByRole('menuitem', { name: 'Logout' });

  getPopupText = (text: string) => this.page.getByText(text);

  getSuccessIcon = () => this.page.getByTestId('SuccessOutlinedIcon');

  getErrorIcon = () => this.page.getByTestId('ErrorOutlineIcon');

  getFieldValidationText = (fieldValidationMessage: string) =>
    this.page.getByText(fieldValidationMessage);

  getAlertNotification = () => this.page.getByRole('alert');

  getSuccessCloseButton = () => this.page.getByLabel('Close');

  getCancelButton = () =>
    this.page.getByRole('button', {
      name: 'Cancel',
    });

  // End of locators

  async confirmPopupIsVisible() {
    await expect(this.getPopupBox()).toBeVisible();
  }

  async confirmPopupIsHidden() {
    await expect(this.getPopupBox()).toBeHidden();
  }

  async confirmPopupTextIs(headerText: string, bodyText: string) {
    await expect(this.getPopupText(headerText)).toBeVisible();
    await expect(this.getPopupText(bodyText)).toBeVisible();
  }

  async cancelCurrentAction() {
    await this.getCancelButton().click();
  }

  async logoutOfAccountWithName(user: string) {
    await this.getNavigationBarDropdownButton(user).click();
    await this.getLogoutButton().click();
  }

  async confirmSuccessMessageIs(successMessage: string) {
    await expect(this.getSuccessIcon()).toBeVisible();
    await expect(this.getAlertNotification()).toContainText(successMessage);
  }

  async confirmErrorMessageIs(errorMessage: string) {
    await expect(this.getErrorIcon()).toBeVisible();
    await expect(this.getAlertNotification()).toContainText(errorMessage);
  }

  async confirmValidationMessageExistsForTheField(field: string) {
    let fieldValidationMessage = '';
    switch (field) {
      case 'Team': {
        fieldValidationMessage = `Team name must not be empty, include special characters, be a prohibited name or include multiple spaces`;
        break;
      }
      case 'Hackathon': {
        fieldValidationMessage = `Hackathon name must not be empty, include special characters or include multiple spaces`;
        break;
      }
    }
    await expect(
      this.getFieldValidationText(fieldValidationMessage)
    ).toBeVisible();
  }

  async closeSuccessAlert() {
    await this.getSuccessCloseButton().click();
  }

  async confirmSuccessAlertDoesNotExist() {
    await expect(this.getSuccessIcon()).toBeHidden();
  }

  async refreshPage() {
    await this.page.reload();
  }
}
