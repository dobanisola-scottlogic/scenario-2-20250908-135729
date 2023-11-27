import { http } from 'msw';
import { baseUrl } from '~/api/api';
import { plainTextOkResponse } from './utils';

const endpoint = `${baseUrl}/remotebot`;
const connectedStateEndpoint = `${endpoint}/connectedState`;

export const handlers = [
  http.get(connectedStateEndpoint, () => {
    return plainTextOkResponse('DISCONNECTED');
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
