import { http } from 'msw';
import { baseUrl } from '../../api/api';
import { testTeamBody, testTeamId } from '../test-data/team';
import {
  badRequestResponse,
  errorResponse,
  jsonOkResponse,
  noContentResponse,
} from './utils';

const teamEndpoint = baseUrl + '/team';

export const handlers = [
  http.post(teamEndpoint, () => {
    return jsonOkResponse(testTeamBody);
  }),
  http.delete(`${teamEndpoint}/${testTeamId.valid}`, () => {
    return noContentResponse();
  }),
  http.delete(`${teamEndpoint}/${testTeamId.badRequest}`, () => {
    return badRequestResponse();
  }),
  http.delete(`${teamEndpoint}/${testTeamId.networkError}`, () => {
    return errorResponse();
  }),
  http.put(`${teamEndpoint}/${testTeamId.valid}`, () => {
    return jsonOkResponse(testTeamBody);
  }),
  http.put(`${teamEndpoint}/${testTeamId.badRequest}`, () => {
    return badRequestResponse();
  }),
  http.put(`${teamEndpoint}/${testTeamId.networkError}`, () => {
    return errorResponse();
  }),
  http.get(`${teamEndpoint}/${testTeamId.valid}`, () => {
    return jsonOkResponse(testTeamBody);
  }),
  http.get(teamEndpoint, ({ request }) => {
    const url = new URL(request.url);
    const hackathonId = url.searchParams.get('hackathonId');

    testTeamBody.hackathonId = hackathonId!;

    return jsonOkResponse([testTeamBody]);
  }),
];

export const getTeamsNetworkErrorResponseHandler = http.get(
  teamEndpoint,
  () => {
    return errorResponse();
  }
);

export const postTeamBadRequestResponseHandler = http.post(teamEndpoint, () => {
  return badRequestResponse();
});

export const postTeamInternalServerErrorResponseHandler = http.post(
  teamEndpoint,
  () => {
    return errorResponse();
  }
);
