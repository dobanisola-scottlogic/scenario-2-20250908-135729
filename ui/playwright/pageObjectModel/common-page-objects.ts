import { expect, type Locator, type Page } from '@playwright/test';

export class CommonPageObjects {
  readonly page: Page;
  readonly popupBox: Locator;
  readonly navigationBarDropdownButton: ({ user }: { user: string }) => Locator;
  readonly logoutButton: Locator;
  readonly popupText: ({text}: {text: string}) => Locator;
  readonly successIcon: Locator;
  readonly errorIcon: Locator;
  readonly fieldValidationText: ({
    fieldValidationMessage,
  }: {
    fieldValidationMessage: string;
  }) => Locator;
  readonly alertNotification: Locator;
  readonly successCloseButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.popupBox = page.getByRole('dialog');
    this.navigationBarDropdownButton = ({ user }) =>
      page.getByRole('button', { name: `${user}` });
    this.logoutButton = page.getByRole('menuitem', { name: 'Logout' });
    this.popupText = ({text}) => page.getByText(text);
    this.successIcon = page.getByTestId('SuccessOutlinedIcon');
    this.errorIcon = page.getByTestId('ErrorOutlineIcon');
    this.fieldValidationText = ({ fieldValidationMessage }) =>
      page.getByText(fieldValidationMessage);
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
    await expect(this.popupText({text: headerText})).toBeVisible();
    await expect(this.popupText({text: bodyText})).toBeVisible();
  }

  async cancelCurrentAction() {
    await this.cancelButton.click();
  }

  async logoutOfAccountWithName(user: string) {
    await this.navigationBarDropdownButton({ user: user }).click();
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

  async confirmValidationMessageExistsForTheField(field: string) {
    let fieldValidationMessage = '';
    switch (field) {
      case 'Team': {
        fieldValidationMessage = `Team name must not be empty, include special characters or be a prohibited name`;
        break;
      }
      case 'Hackathon': {
        fieldValidationMessage = `Hackathon name must not be empty or include special characters`;
        break;
      }
    }
    await expect(
      this.fieldValidationText({ fieldValidationMessage })
    ).toBeVisible();
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
