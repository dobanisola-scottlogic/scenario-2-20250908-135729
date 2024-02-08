import { expect, type Page } from '@playwright/test';

export class TableOptionsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  //Start of locators

  getTableHeader = (buttonName: string ) =>
      this.page.getByLabel(buttonName).getByText(buttonName, {
        exact: true,
      });
    getEditTableButton = () => this.page.getByRole('button', {
      name: 'Menu',
    });
    getFilterMenuItem = () =>  this.page.getByRole('menuitem', {
      name: 'Filter',
    });
    getFilterTextBox = () =>  this.page.getByPlaceholder('Filter value');
    getValueInRow = (row: number) => this.page.locator(`[aria-rowindex='${row}']`);
    getHackathonTable = () => this.page.getByLabel('List of hackathons')

  //End of locators

  async sortTableUsingHeaderField(field: string) {
    await this.getTableHeader(field).click();
  }

  //The selector for the first row starts at 'aria-rowindex=2' and increments by 1 for each row
  async verifyNameOfValueInRowIs(rowNumber: number, expectedValue: string) {
    await expect(
      this.getValueInRow(rowNumber + 2 ).filter({
        hasText: expectedValue,
      })
    ).toContainText(expectedValue);
  }

  async verifyOrderOfValuesInColumnIs(
    firstValue: string,
    secondValue: string,
    thirdValue: string
  ) {
    const expectedValues = [firstValue, secondValue, thirdValue];
    for (let i = 0; i < 3; i++) {
      await this.verifyNameOfValueInRowIs(i, expectedValues[i]);
    }
  }

  async openFilterTextFoundInColumnNamed(headerName: string) {
    await this.getTableHeader(headerName).hover();
    await this.getEditTableButton().click();
    await this.getFilterMenuItem().click();
  }

  async filterTableUsingText(text: string) {
    await this.getFilterTextBox().type(text);
  }

  async dismissFilterBoxByClickingOnTable() {
    await this.getHackathonTable().click();
  }
}
