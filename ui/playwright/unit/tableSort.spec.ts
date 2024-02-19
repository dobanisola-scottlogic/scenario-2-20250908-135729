import test from '~/fixtures';
import {
  gameSortColumns,
  generateUniqueName,
  hackathonSortColumns,
  initialURL,
  tableValues,
} from '~/helpers';

const hackathonName = generateUniqueName('tableSort');
const hackathonFilteredName = tableValues[0].hackathonName.substring(1);

test.use({ storageState: 'playwright/.auth/admin.json' });

test.afterEach(async ({ hackathonListPage }) => {
  await hackathonListPage.clearAnyExistingHackathonWithName(hackathonName);
  for (let i = 0; i <= 2; i++) {
    await hackathonListPage.clearAnyExistingHackathonWithName(
      tableValues[i].hackathonName
    );
  }
});

test.describe('table sorting occurs on the admin hackathon list page', () => {
  test.beforeEach(
    async ({
      page,
      createHackathonPage,
      editHackathonPage,
      tableOptionsPage,
    }) => {
      for (const tableValue of tableValues) {
        await createHackathonPage.createHackathonUsingAPIWithName(
          tableValue.hackathonName
        );
        await editHackathonPage.updateHackathonDetailsViaAPITo(
          tableValue.hackathonName,
          tableValue.map,
          tableValue.bot
        );
      }
      await page.goto(initialURL);
      await tableOptionsPage.openFilterTextFoundInColumnNamed('Name');
      await tableOptionsPage.filterTableUsingText(hackathonFilteredName);
    }
  );

  for (const hackathonSortColumn of hackathonSortColumns) {
    test(`Sorting the admin hackathon list table using the ${hackathonSortColumn.columnHeader} header is functional`, async ({
      tableOptionsPage,
    }) => {
      await tableOptionsPage.sortTableUsingHeaderField(
        hackathonSortColumn.columnHeader
      );
      await tableOptionsPage.verifyOrderOfValuesInColumnIs(
        hackathonSortColumn.firstValue,
        hackathonSortColumn.secondValue,
        hackathonSortColumn.thirdValue
      );
      await tableOptionsPage.sortTableUsingHeaderField(
        hackathonSortColumn.columnHeader
      );
      await tableOptionsPage.verifyOrderOfValuesInColumnIs(
        hackathonSortColumn.thirdValue,
        hackathonSortColumn.secondValue,
        hackathonSortColumn.firstValue
      );
    });
  }
});

test.describe('table sorting of the teams occur on the admin hackathon details page', () => {
  test.beforeEach(async ({ createHackathonPage, createTeamPage, page }) => {
    await createHackathonPage.createHackathonUsingAPIWithName(hackathonName);
    for (const tableValue of tableValues) {
      await createTeamPage.createTeamUsingAPIWithHackathonAndTeamName(
        hackathonName,
        tableValue.teamName
      );
    }
    await page.goto(initialURL + hackathonName.toLowerCase());
  });

  test(`Sorting the admin hackathon details name table using the Name header is functional`, async ({
    tableOptionsPage,
  }) => {
    await tableOptionsPage.sortTableUsingHeaderField('Name');
    await tableOptionsPage.verifyOrderOfValuesInColumnIs(
      tableValues[0].teamName,
      tableValues[1].teamName,
      tableValues[2].teamName
    );
    await tableOptionsPage.sortTableUsingHeaderField('Name');
    await tableOptionsPage.verifyOrderOfValuesInColumnIs(
      tableValues[2].teamName,
      tableValues[1].teamName,
      tableValues[0].teamName
    );
  });
});

test.describe('table sorting of the games occur on the admin hackathon details page', () => {
  test.beforeEach(async ({ createHackathonPage, createGamePage, page }) => {
    await createHackathonPage.createHackathonUsingAPIWithName(hackathonName);
    for (const tableValue of tableValues) {
      await createGamePage.createGameUsingAPIBetweenMilestoneBotsAndWithMap(
        hackathonName,
        tableValue.map,
        tableValue.firstBotNumber,
        tableValue.secondBotNumber
      );
      await page.waitForTimeout(1000);
    }
    await page.goto(initialURL + hackathonName.toLowerCase());
  });

  for (const gameSortColumn of gameSortColumns) {
    test(`testing locator of ${gameSortColumn.columnHeader} in game table`, async ({
      tableOptionsPage,
    }) => {
      await tableOptionsPage.sortTableUsingHeaderField(
        gameSortColumn.columnHeader
      );
      await tableOptionsPage.verifyOrderOfValuesInColumnIs(
        gameSortColumn.firstValue,
        gameSortColumn.secondValue,
        gameSortColumn.thirdValue
      );
      await tableOptionsPage.sortTableUsingHeaderField(
        gameSortColumn.columnHeader
      );
      await tableOptionsPage.verifyOrderOfValuesInColumnIs(
        gameSortColumn.thirdValue,
        gameSortColumn.secondValue,
        gameSortColumn.firstValue
      );
    });
  }
});
