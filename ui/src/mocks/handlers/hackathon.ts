import { PathParams, http } from 'msw';
import { baseUrl } from '~/api/api';
import { Hackathon } from '~/interfaces/Hackathon';
import {
  testHackathonBody,
  testHackathonId,
  testHackathonName,
  validTeamCredentials,
} from '~/mocks/test-data/hackathon';
import {
  badRequestResponse,
  errorResponse,
  jsonOkResponse,
  noContentResponse,
  notFoundResponse,
} from './utils';

const hackathonEndpoint = baseUrl + '/hackathon';

export const handlers = [
  http.post<PathParams<string>, Hackathon>(
    hackathonEndpoint,
    async ({ request }) => {
      const requestData = await request.json();
      const hackathonName = requestData.name;

      if (hackathonName === testHackathonName.valid) {
        return jsonOkResponse(testHackathonBody);
      } else if (hackathonName === testHackathonName.badRequest) {
        return badRequestResponse({
          message: 'Bad request error message',
        });
      } else if (hackathonName === testHackathonName.networkError) {
        return errorResponse();
      }
    }
  ),
  http.delete(`${hackathonEndpoint}/${testHackathonId.valid}`, () => {
    return noContentResponse();
  }),
  http.delete(`${hackathonEndpoint}/${testHackathonId.badRequest}`, () => {
    return badRequestResponse();
  }),
  http.delete(`${hackathonEndpoint}/${testHackathonId.networkError}`, () => {
    return errorResponse();
  }),
  http.get(`${hackathonEndpoint}/${testHackathonId.valid}`, () => {
    return jsonOkResponse(testHackathonBody);
  }),
  http.get(`${hackathonEndpoint}/${testHackathonId.notFound}`, () => {
    return notFoundResponse();
  }),
  http.get(`${hackathonEndpoint}/${testHackathonId.networkError}`, () => {
    return errorResponse();
  }),
  http.put(`${hackathonEndpoint}/${testHackathonId.valid}`, () => {
    return jsonOkResponse(testHackathonBody);
  }),
  http.get(hackathonEndpoint, () => {
    return jsonOkResponse([testHackathonBody]);
  }),
  http.get(`${hackathonEndpoint}/team`, ({ request }) => {
    const authorizationHeader = request.headers.get('Authorization');

    if (authorizationHeader === validTeamCredentials.authorizationHeader) {
      return jsonOkResponse(testHackathonBody);
    } else {
      return errorResponse();
    }
  }),
];

export const getHackathonsNoContentResponseHandler = http.get(
  hackathonEndpoint,
  () => {
    return noContentResponse();
  }
);

export const getHackathonsNetworkErrorResponseHandler = http.get(
  hackathonEndpoint,
  () => {
    return errorResponse();
  }
);

export const postUpdateHackathonBadRequestResponseHandler = http.put(
  `${hackathonEndpoint}/${testHackathonId.valid}`,
  () => {
    return badRequestResponse({
      message: 'Bad request error message',
    });
  }
);

export const postUpdateHackathonInternalServerErrorResponseHandler = http.put(
  `${hackathonEndpoint}/${testHackathonId.valid}`,
  () => {
    return errorResponse();
  }
);
