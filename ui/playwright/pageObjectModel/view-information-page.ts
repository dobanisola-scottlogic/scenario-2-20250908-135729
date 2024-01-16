import { expect, type Locator, type Page } from '@playwright/test';

export class ViewInformationPage {
  readonly page: Page;
  readonly copyTextButton: Locator;
  readonly textbox: ({ textboxName }: { textboxName: string }) => Locator;
  readonly closeButton: Locator;
  readonly mockDevelopmentEnvironmentLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.copyTextButton = page.getByTestId('ContentCopyRoundedIcon');
    this.textbox = ({ textboxName }) =>
      page.getByRole('textbox', { name: `${textboxName}` });
    this.closeButton = page.getByRole('button', {
      name: 'Close',
    });
    this.mockDevelopmentEnvironmentLink = page.getByLabel(
      'http://localhost:8080/application/ui/'
    );
  }

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
    await this.copyTextButton.nth(buttonNumber).click();
  }

  async verifyTextFoundInTextbox(textboxName: string, text: string) {
    await expect(this.textbox({ textboxName })).toHaveValue(text);
  }

  async verifyTextInTextboxCannotBeEdited(textboxName: string) {
    const editCheck = await this.textbox({ textboxName }).isEditable();
    expect(editCheck).toEqual(false);
  }

  async verifyTextHasBeenCopied(text: string) {
    expect(
      await this.page.evaluate(() => navigator.clipboard.readText())
    ).toEqual(text);
  }

  async verifyDetailsOfDevelopmentEnvironmentLink() {
    await expect(this.mockDevelopmentEnvironmentLink).toBeVisible();
    await expect(this.mockDevelopmentEnvironmentLink).toContainText(
      'Access your development environment'
    );
  }

  async closeViewInformationPopup() {
    await this.closeButton.click();
  }
}
