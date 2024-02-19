import { expect, type Page } from '@playwright/test';

export class ViewInformationPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Start of locators

  getCopyTextButton = () => this.page.getByTestId('ContentCopyRoundedIcon');

  getTextbox = (textboxName: string) =>
    this.page.getByRole('textbox', { name: textboxName });

  getCloseButton = () =>
    this.page.getByRole('button', {
      name: 'Close',
    });

  getMockDevelopmentEnvironmentLink = () =>
    this.page.getByLabel('http://localhost:8080/application/ui/');

  // End of locators

  async copyTextFromTextbox(textboxName: string) {
    let buttonNumber: number;
    switch (textboxName) {
      case 'Account ID':
        buttonNumber = 0;
        break;
      case 'IAM user name':
        buttonNumber = 1;
        break;
      case 'Password':
        buttonNumber = 2;
        break;
      default:
        throw new Error('Invalid textbox name');
    }
    await this.getCopyTextButton().nth(buttonNumber).click();
  }

  async verifyTextFoundInTextbox(textboxName: string, text: string) {
    await expect(this.getTextbox(textboxName)).toHaveValue(text);
  }

  async verifyTextInTextboxCannotBeEdited(textboxName: string) {
    const editCheck = await this.getTextbox(textboxName).isEditable();
    expect(editCheck).toEqual(false);
  }

  async verifyTextHasBeenCopied(text: string) {
    expect(
      await this.page.evaluate(() => navigator.clipboard.readText())
    ).toEqual(text);
  }

  async verifyDetailsOfDevelopmentEnvironmentLink() {
    await expect(this.getMockDevelopmentEnvironmentLink()).toBeVisible();
    await expect(this.getMockDevelopmentEnvironmentLink()).toContainText(
      'Access your development environment'
    );
  }

  async closeViewInformationPopup() {
    await this.getCloseButton().click();
  }
}
