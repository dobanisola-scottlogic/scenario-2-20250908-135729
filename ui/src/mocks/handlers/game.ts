import { http } from 'msw';
import { baseUrl } from '~/api/api';
import { testGameId, testGameResultBody } from '~/mocks/test-data/game';
import { badRequestResponse, errorResponse, jsonOkResponse } from './utils';

const gameEndpoint = baseUrl + '/game';

export const handlers = [
  http.get(gameEndpoint, ({ request }) => {
    const url = new URL(request.url);
    const hackathonId = url.searchParams.get('hackathonId');

    testGameResultBody.game.hackathonId = hackathonId!;

    return jsonOkResponse([testGameResultBody]);
  }),
  http.get(`${gameEndpoint}/${testGameId.valid}`, () => {
    return jsonOkResponse(testGameResultBody);
  }),
  http.get(`${gameEndpoint}/${testGameId.badRequest}`, () => {
    return badRequestResponse();
  }),
  http.get(`${gameEndpoint}/${testGameId.networkError}`, () => {
    return errorResponse();
  }),
  http.post(gameEndpoint, () => {
    return jsonOkResponse(testGameResultBody);
  }),
];

export const getGameResultsNetworkErrorResponseHandler = http.get(
  gameEndpoint,
  () => {
    return errorResponse();
  }
);

export const postGameBadRequestResponseHandler = http.post(gameEndpoint, () => {
  return badRequestResponse();
});

export const postGameInternalServerErrorResponseHandler = http.post(
  gameEndpoint,
  () => {
    return errorResponse();
  }
);
