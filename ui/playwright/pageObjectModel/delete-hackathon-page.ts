import { APIResponse, expect, type Locator, type Page } from '@playwright/test';

export class DeleteHackathonPage {
  readonly page: Page;
  readonly popupBox: Locator;
  readonly popupHeaderText: Locator;
  readonly popupBodyText: Locator;
  readonly deleteHackathonButton: Locator;
  readonly cancelDeletionButton: Locator;
  readonly successIcon: Locator;
  readonly alertMessage: Locator;
  readonly successCloseButton: Locator;
  readonly errorIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.popupBox = page.getByRole('dialog');
    this.popupHeaderText = page.locator('[role="dialogHeading"]').nth(0);
    this.popupBodyText = page.locator('[role="dialogHeading"]').nth(1);
    this.deleteHackathonButton = page.getByRole('button', {
      name: 'DELETE HACKATHON',
    });
    this.cancelDeletionButton = page.getByRole('button', {
      name: 'CANCEL',
    });
    this.successIcon = page.getByTestId('SuccessOutlinedIcon');
    this.alertMessage = page.getByRole('alert');
    this.successCloseButton = page.getByLabel('Close');
    this.errorIcon = page.getByTestId('ErrorOutlineIcon');
  }

  async createHackathon() {
    const check = await this.page.request.post(
      'http://localhost:8080/application/api/hackathon',
      {
        data: {
          name: 'test',
        },
      }
    );
    expect(check.status()).toBe(200);
  }

  async expectNumberOfHackathonsToBe(hackNum: number) {
    const hackRes: APIResponse = await this.page.request.get(
      'http://localhost:8080/application/api/hackathon'
    );
    const hackResJSON = (await hackRes.json()) as [];
    expect(hackResJSON).toHaveLength(hackNum);
  }

  async confirmPopupIsVisible() {
    await expect(this.popupBox).toBeVisible();
  }

  async confirmPopupTextIs(headerText: string, bodyText: string) {
    await expect(this.popupHeaderText).toContainText(headerText);
    await expect(this.popupBodyText).toContainText(bodyText);
  }

  async deleteHackathon() {
    await this.deleteHackathonButton.click();
  }

  async mock400ErrorOnHackathonDeletion() {
    await this.page.route(
      'http://localhost:8080/application/api/hackathon/test',
      async (route) => {
        await route.fulfill({ status: 400 });
      }
    );
    await this.deleteHackathon();
  }

  async mock500ErrorOnHackathonDeletion() {
    await this.page.route(
      'http://localhost:8080/application/api/hackathon/test',
      async (route) => {
        await route.fulfill({ status: 500 });
      }
    );
    await this.deleteHackathon();
  }

  async cancelHackathonDeletion() {
    await this.cancelDeletionButton.click();
  }

  async confirmSuccessMessageIs(successMessage: string) {
    await expect(this.successIcon).toBeVisible();
    await expect(this.alertMessage).toContainText(successMessage);
  }

  async confirmErrorMessageIs(errorMessage: string) {
    await expect(this.errorIcon).toBeVisible();
    await expect(this.alertMessage).toContainText(errorMessage);
  }

  async confirmSuccessAlertDoesNotExist() {
    await expect(this.successIcon).toBeHidden();
  }

  async closeSuccessAlert() {
    await this.successCloseButton.click();
  }
}
