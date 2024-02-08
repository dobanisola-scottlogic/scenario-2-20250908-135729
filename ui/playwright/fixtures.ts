import { test as base } from '@playwright/test';
import { HackathonDetailsPage } from './pageObjectModel/admin-hackathon-details-page';
import { HackathonListPage } from './pageObjectModel/admin-hackathon-list-page';
import { CommonPageObjects } from './pageObjectModel/common-page-objects';
import { CreateGamePage } from './pageObjectModel/create-game-page';
import { CreateHackathonPage } from './pageObjectModel/create-hackathon-page';
import { CreateTeamPage } from './pageObjectModel/create-team-page';
import { DeleteHackathonPage } from './pageObjectModel/delete-hackathon-page';
import { DeleteTeamPage } from './pageObjectModel/delete-team-page';
import { EditHackathonPage } from './pageObjectModel/edit-hackathon-page';
import { EditTeamPage } from './pageObjectModel/edit-team-page';
import { LoginPage } from './pageObjectModel/login-page';
import { TableOptionsPage } from './pageObjectModel/table-options-page';
import { TeamDashboardPage } from './pageObjectModel/team-dashboard-page';
import { ViewInformationPage } from './pageObjectModel/view-information-page';

const test = base.extend<{
  commonPageObjects: CommonPageObjects;
  createGamePage: CreateGamePage;
  createHackathonPage: CreateHackathonPage;
  createTeamPage: CreateTeamPage;
  deleteHackathonPage: DeleteHackathonPage;
  deleteTeamPage: DeleteTeamPage;
  editHackathonPage: EditHackathonPage;
  editTeamPage: EditTeamPage;
  hackathonDetailsPage: HackathonDetailsPage;
  hackathonListPage: HackathonListPage;
  login: LoginPage;
  tableOptionsPage: TableOptionsPage;
  teamDashboardPage: TeamDashboardPage;
  viewInformationPage: ViewInformationPage;
}>({
  commonPageObjects: async ({ page }, use) => {
    const commonPageObjects = new CommonPageObjects(page);
    await use(commonPageObjects);
  },
  createGamePage: async ({ page }, use) => {
    const createGamePage = new CreateGamePage(page);
    await use(createGamePage);
  },
  createHackathonPage: async ({ page }, use) => {
    const createHackathonPage = new CreateHackathonPage(page);
    await use(createHackathonPage);
  },
  createTeamPage: async ({ page }, use) => {
    const createTeamPage = new CreateTeamPage(page);
    await use(createTeamPage);
  },
  deleteHackathonPage: async ({ page }, use) => {
    const deleteHackathonPage = new DeleteHackathonPage(page);
    await use(deleteHackathonPage);
  },
  deleteTeamPage: async ({ page }, use) => {
    const deleteTeamPage = new DeleteTeamPage(page);
    await use(deleteTeamPage);
  },
  editHackathonPage: async ({ page }, use) => {
    const editHackathonPage = new EditHackathonPage(page);
    await use(editHackathonPage);
  },
  editTeamPage: async ({ page }, use) => {
    const editTeamPage = new EditTeamPage(page);
    await use(editTeamPage);
  },
  hackathonDetailsPage: async ({ page }, use) => {
    const hackathonDetailsPage = new HackathonDetailsPage(page);
    await use(hackathonDetailsPage);
  },
  hackathonListPage: async ({ page }, use) => {
    const hackathonListPage = new HackathonListPage(page);
    await use(hackathonListPage);
  },
  login: async ({ page }, use) => {
    const login = new LoginPage(page);
    await use(login);
  },
  tableOptionsPage: async ({ page }, use) => {
    const tableOptionsPage = new TableOptionsPage(page);
    await use(tableOptionsPage);
  },
  teamDashboardPage: async ({ page }, use) => {
    const teamDashboardPage = new TeamDashboardPage(page);
    await use(teamDashboardPage);
  },
  viewInformationPage: async ({ page }, use) => {
    const viewInformationPage = new ViewInformationPage(page);
    await use(viewInformationPage);
  },
});
export default test;
