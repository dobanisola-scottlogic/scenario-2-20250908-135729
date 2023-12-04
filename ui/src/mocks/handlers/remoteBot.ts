import { http } from 'msw';
import { baseUrl } from '~/api/api';
import { jsonOkResponse, plainTextOkResponse, unauthorizedResponse } from './utils';

const endpoint = `${baseUrl}/remotebot`;
const connectedStateEndpoint = `${endpoint}/connectedState`;

export const handlers = [
  http.get(connectedStateEndpoint, () => {
    return plainTextOkResponse('DISCONNECTED');
  }),
  http.post(endpoint + '/connect', () => {
    return jsonOkResponse(null);
  }),
];

export const getConnectedStateConnectedResponseHandler = http.get(
  connectedStateEndpoint,
  () => {
    return plainTextOkResponse('CONNECTED');
  }
);

export const getConnectedStateWaitingResponseHandler = http.get(
  connectedStateEndpoint,
  () => {
    return plainTextOkResponse('WAITING');
  }
);

export const getConnectedStateUnauthorizedResponseHandler = http.get(
  connectedStateEndpoint,
  () => {
    return unauthorizedResponse();
  }
);
