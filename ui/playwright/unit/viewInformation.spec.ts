import { HackathonHelpers } from 'playwright/helpers';
import test from '../fixtures';

const fieldCheckers: {
  textbox: string;
  text: string;
}[] = [
  { textbox: 'Account ID', text: '033692923448' },
  { textbox: 'IAM user name', text: 'hackathon-contestant' },
  { textbox: 'Password', text: 'Password!1' },
];

const uniqueHackathonId = new HackathonHelpers().generateRandomString;
let hackathonName = '';
let teamName = '';

test.beforeEach(
  async ({ page, login, createHackathonPage, createTeamPage, teamDashboardPage, commonPageObjects }) => {
    hackathonName = teamName =
    'viewInformation' + uniqueHackathonId
  await createHackathonPage.createHackathonUsingAPIWithName(hackathonName);
  await createTeamPage.createTeamUsingAPIWithHackathonAndTeamName(
    hackathonName,
    teamName
  );
    await page.goto('/');
    await login.inputCredentials(teamName, 'teamPassword');
    await login.attemptLogin();
    await teamDashboardPage.verifyLoginSuccess();
    await teamDashboardPage.clickViewInformationButton();
    await commonPageObjects.confirmPopupIsVisible();
  }
);

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
