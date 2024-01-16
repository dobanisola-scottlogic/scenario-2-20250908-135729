import test from '~/fixtures';
import {
  generateUniqueName,
  initialURL,
  invalidCharacterErrors,
} from '~/helpers';

invalidCharacterErrors.push({
  errorReason: 'a prohibited name',
  invalidName: 'aDmIn',
});

const hackathonName = generateUniqueName('creaateTeam');
const teamName = hackathonName;

test.beforeEach(
  async ({
    login,
    page,
    createHackathonPage,
    hackathonListPage,
    hackathonDetailsPage,
    commonPageObjects,
  }) => {
    await createHackathonPage.createHackathonUsingAPIWithName(hackathonName);
    await page.goto(initialURL);
    await login.inputCredentials('admin', 'secret');
    await login.attemptLogin();
    await hackathonListPage.verifyLoginSuccess();
    await hackathonListPage.openTheHackathonPage(hackathonName);
    await hackathonDetailsPage.openCreateTeamPopup();
    await commonPageObjects.confirmPopupIsVisible();
  }
);

test.afterEach(async ({ hackathonListPage }) => {
  await hackathonListPage.clearAnyExistingHackathonWithName(hackathonName);
});

test('multiple teams can be created', async ({
  createTeamPage,
  commonPageObjects,
  hackathonDetailsPage,
}) => {
  await createTeamPage.inputTeamName(teamName);
  await createTeamPage.inputTeamPassword('teamPassword');
  await createTeamPage.addNewTeam();
  await commonPageObjects.confirmSuccessMessageIs('Team added successfully!');
  await commonPageObjects.closeSuccessAlert();
  await hackathonDetailsPage.openCreateTeamPopup();
  await commonPageObjects.confirmPopupIsVisible();
  await createTeamPage.inputTeamName('secondTeam');
  await createTeamPage.inputTeamPassword('teamPassword');
  await createTeamPage.addNewTeam();
  await commonPageObjects.confirmSuccessMessageIs('Team added successfully!');
  await commonPageObjects.closeSuccessAlert();
  await hackathonDetailsPage.checkExistenceOfTeamInTableWithName(
    teamName,
    true
  );
  await hackathonDetailsPage.checkExistenceOfTeamInTableWithName(
    'secondTeam',
    true
  );
});

test('team can be created using enter key', async ({
  createTeamPage,
  commonPageObjects,
  hackathonDetailsPage,
  page,
}) => {
  await createTeamPage.inputTeamName(teamName);
  await createTeamPage.inputTeamPassword('teamPassword');
  await page.keyboard.press('Enter');
  await commonPageObjects.confirmSuccessMessageIs('Team added successfully!');
  await commonPageObjects.closeSuccessAlert();
  await hackathonDetailsPage.checkExistenceOfTeamInTableWithName(
    teamName,
    true
  );
});

for (const invalidCharacterError of invalidCharacterErrors) {
  test(`team cannot be created if the team name has ${invalidCharacterError.errorReason}`, async ({
    createTeamPage,
    commonPageObjects,
  }) => {
    await createTeamPage.inputTeamName(invalidCharacterError.invalidName);
    await commonPageObjects.confirmValidationMessageExistsForTheField('Team');
  });
}

test('admin can cancel creation of a new team', async ({
  commonPageObjects,
}) => {
  await commonPageObjects.cancelCurrentAction();
  await commonPageObjects.confirmPopupIsHidden();
});

test('team popup contains the expected fields in the expected initial states', async ({
  createTeamPage,
}) => {
  await createTeamPage.verifyCreateTeamPopUpWithFieldLabels('Name', 'Password');
});

test('team fields cannot contain more than 255 characters', async ({
  createTeamPage,
}) => {
  await createTeamPage.inputTeamName('a'.repeat(256));
  await createTeamPage.validateTeamName('a'.repeat(255));
  await createTeamPage.inputTeamPassword('a'.repeat(256));
  await createTeamPage.validateTeamPassword('a'.repeat(255));
});

test('team cannot be created if fields are missing', async ({
  createTeamPage,
}) => {
  await createTeamPage.inputTeamName(teamName);
  await createTeamPage.verifyTeamCannotBeCreated();
  await createTeamPage.clearTeamName();
  await createTeamPage.inputTeamPassword('teamPassword');
  await createTeamPage.verifyTeamCannotBeCreated();
});

test('team cannot be created if team with the same name already exists', async ({
  createTeamPage,
  commonPageObjects,
  hackathonDetailsPage,
}) => {
  await createTeamPage.inputTeamName(teamName);
  await createTeamPage.inputTeamPassword('TeamPassword');
  await createTeamPage.addNewTeam();
  await commonPageObjects.confirmSuccessMessageIs('Team added successfully!');
  await hackathonDetailsPage.openCreateTeamPopup();
  await commonPageObjects.confirmPopupIsVisible();
  await createTeamPage.inputTeamName(teamName);
  await createTeamPage.inputTeamPassword('teampassword');
  await createTeamPage.addNewTeam();
  await commonPageObjects.confirmErrorMessageIs(
    'Error adding team - Team name already exists'
  );
});
