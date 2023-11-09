import { testHackathonBody } from './hackathon';

export const testTeamId = {
  valid: 'bc2db3fe-59a4-4b3d-b72c-3b442f07b30b',
  badRequest: 'bad-request-id',
  networkError: 'network-error-id',
};

export const testTeamBody = {
  hackathonId: testHackathonBody.id,
  id: testTeamId.valid,
  name: 'Team 1',
  password: 'pa$$w0rd',
};
