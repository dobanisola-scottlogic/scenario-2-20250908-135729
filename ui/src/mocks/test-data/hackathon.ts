export const testHackathonId = {
  valid: 'test-hackathon',
  notFound: 'not-found-id',
  badRequest: 'bad-request-id',
  networkError: 'network-error-id',
};

export const testHackathonName = {
  valid: 'Test Hackathon',
  badRequest: 'Bad Request Hackathon',
  networkError: 'Error Hackathon',
};

export const testHackathonBody = {
  id: testHackathonId.valid,
  name: testHackathonName.valid,
  games: [],
  teams: [],
  currentMilestoneClassName: 'com.scottlogic.hackathon.bots.Milestone1Bot',
  currentMilestoneMap: 'Easy',
};

// Required for logged-in team to fetch current hackathon details
export const validTeamCredentials = {
  credentials: btoa('team:password'),
  authorizationHeader: 'Basic ' + btoa('team:password'),
};
