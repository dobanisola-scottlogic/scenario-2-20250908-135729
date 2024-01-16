import test from '~/fixtures';
import { generateUniqueName, initialURL } from '~/helpers';

const fieldCheckers: {
  textbox: string;
  text: string;
}[] = [
  { textbox: 'Account ID', text: '012345678901' },
  { textbox: 'IAM user name', text: 'haclocal-contestant' },
  { textbox: 'Password', text: 'teamPassword' },
];

const hackathonName = generateUniqueName('viewInformation');
const teamName = hackathonName;

test.beforeEach(
  async (
    {
      page,
      login,
      createHackathonPage,
      createTeamPage,
      teamDashboardPage,
      commonPageObjects,
    },
    testInfo
  ) => {
    await createHackathonPage.createHackathonUsingAPIWithName(hackathonName);
    await createTeamPage.createTeamUsingAPIWithHackathonAndTeamName(
      hackathonName,
      teamName
    );
    await page.goto(initialURL);
    await login.inputCredentials(teamName, 'teamPassword');
    if (testInfo.title.includes('error message')) {
      await login.attemptLogin();
    } else {
      await login.attemptTeamLoginWithRequiredInformation();
    }
    await teamDashboardPage.verifyLoginSuccess();
    await teamDashboardPage.clickViewInformationButton();
    await commonPageObjects.confirmPopupIsVisible();
  }
);

test.describe('Text within each box appears correctly', () => {
  for (const fieldChecker of fieldCheckers) {
    test(`text within the ${fieldChecker.textbox} box is uneditable and can be copied using the copy button`, async ({
      viewInformationPage,
    }) => {
      await viewInformationPage.verifyTextFoundInTextbox(
        fieldChecker.textbox,
        fieldChecker.text
      );
      await viewInformationPage.verifyTextInTextboxCannotBeEdited(
        fieldChecker.textbox
      );
      await viewInformationPage.copyTextFromTextbox(fieldChecker.textbox);
      await viewInformationPage.verifyTextHasBeenCopied(fieldChecker.text);
    });
  }
});

test.describe('other functions and error messages associated with the information box works correctly', () => {
  test('close button closes the view information box', async ({
    viewInformationPage,
    commonPageObjects,
  }) => {
    await viewInformationPage.closeViewInformationPopup();
    await commonPageObjects.confirmPopupIsHidden();
  });

  test('development environment link is visible and has the correct text', async ({
    viewInformationPage,
  }) => {
    await viewInformationPage.verifyDetailsOfDevelopmentEnvironmentLink();
  });

  test('error message appears if team information cannot be found', async ({
    commonPageObjects,
  }) => {
    await commonPageObjects.confirmErrorMessageIs(
      'Error fetching team information'
    );
  });
});
