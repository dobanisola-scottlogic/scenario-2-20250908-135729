import test from '~/fixtures';
import {
  generateUniqueName,
  initialURL,
  invalidCharacterErrors,
} from '~/helpers';

const hackathonName = generateUniqueName('editTeam');
const teamName = hackathonName;

test.use({ storageState: 'playwright/.auth/admin.json' });

test.beforeEach(
  async ({
    page,
    createHackathonPage,
    editTeamPage,
    createTeamPage,
    commonPageObjects,
  }) => {
    await createHackathonPage.createHackathonUsingAPIWithName(hackathonName);
    await createTeamPage.createTeamUsingAPIWithHackathonAndTeamName(
      hackathonName,
      teamName
    );
    await page.goto(initialURL + hackathonName.toLowerCase());
    await editTeamPage.openEditPopupOfTeamWithName(teamName);
    await commonPageObjects.confirmPopupIsVisible();
  }
);

test.afterEach(async ({ hackathonListPage }) => {
  await hackathonListPage.clearAnyExistingHackathonWithName(hackathonName);
});

test('edit team popup is in correct initial state', async ({
  editTeamPage,
  commonPageObjects,
}) => {
  await editTeamPage.verifyTeamCanBeUpdated();
  await editTeamPage.verifyPasswordToggle();
  await commonPageObjects.cancelCurrentAction();
});

test('team and password can be successfully edited', async ({
  editTeamPage,
  commonPageObjects,
  hackathonDetailsPage,
}) => {
  await editTeamPage.clearTeamNameField();
  await editTeamPage.clearTeamPasswordField();
  await editTeamPage.enterTeamName(teamName + ' updated');
  await editTeamPage.enterTeamPassword('newTeamPassword');
  await editTeamPage.updateTeam();
  await commonPageObjects.confirmSuccessMessageIs('Team updated successfully');
  await commonPageObjects.closeSuccessAlert();
  await commonPageObjects.confirmSuccessAlertDoesNotExist();
  await hackathonDetailsPage.checkExistenceOfTeamInTableWithName(
    teamName + ' updated',
    true
  );
});

test('team updating can be cancelled', async ({ commonPageObjects }) => {
  await commonPageObjects.cancelCurrentAction();
  await commonPageObjects.confirmSuccessAlertDoesNotExist();
});

test('team cannot be updated if fields are missing', async ({
  editTeamPage,
}) => {
  await editTeamPage.clearTeamNameField();
  await editTeamPage.verifyTeamCannotBeUpdated();
  await editTeamPage.enterTeamName(teamName + ' updated');
  await editTeamPage.verifyTeamCanBeUpdated();
  await editTeamPage.clearTeamPasswordField();
  await editTeamPage.verifyTeamCannotBeUpdated();
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

test('bad request error returns on updating team name to one that already exists', async ({
  createTeamPage,
  editTeamPage,
  commonPageObjects,
}) => {
  const secondTeamName = 'anotherTeamName';
  await createTeamPage.createTeamUsingAPIWithHackathonAndTeamName(
    hackathonName.toLowerCase(),
    secondTeamName
  );
  await commonPageObjects.refreshPage();
  await editTeamPage.openEditPopupOfTeamWithName(secondTeamName);
  await commonPageObjects.confirmPopupIsVisible();
  await editTeamPage.clearTeamNameField();
  await editTeamPage.clearTeamPasswordField();
  await editTeamPage.enterTeamName(teamName);
  await editTeamPage.enterTeamPassword('newTeamPassword');
  await editTeamPage.updateTeam();
  await commonPageObjects.confirmErrorMessageIs(
    'Error updating team - bad request'
  );
});

test('internal server error message will appear', async ({
  editTeamPage,
  commonPageObjects,
}) => {
  await editTeamPage.mock500ErrorOnUpdatingTeam();
  await commonPageObjects.confirmErrorMessageIs(
    'Error updating team - internal server error'
  );
});
