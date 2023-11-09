import { http } from 'msw';
import { baseUrl } from '../../api/api';
import {
  loginResponse,
  networkErrorLoginCredentials,
  successfulLoginCredentials,
} from '../test-data/login';
import { errorResponse, jsonOkResponse, unauthorizedResponse } from './utils';

const loginEndpoint = baseUrl + '/login';

export const handlers = [
  http.post(loginEndpoint, ({ request }) => {
    const authorizationHeader = request.headers.get('Authorization');

    if (
      authorizationHeader === successfulLoginCredentials.authorizationHeader
    ) {
      return jsonOkResponse(loginResponse);
    } else if (
      authorizationHeader === networkErrorLoginCredentials.authorizationHeader
    ) {
      return errorResponse();
    } else {
      return unauthorizedResponse();
    }
  }),
];
