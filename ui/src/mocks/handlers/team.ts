import { HttpResponse, http } from 'msw';
import { baseUrl } from '../../api/api';

const testTeamBody = {
  hackathonId: 'test-id',
  id: 'team1',
  name: 'Team 1',
  password: 'pa$$w0rd',
};

export const handlers = [
  http.post(baseUrl + '/team', () => {
    return HttpResponse.json(testTeamBody);
  }),
  http.delete(baseUrl + '/team/test-id', () => {
    return new HttpResponse(null, { status: 204 });
  }),
  http.delete(baseUrl + '/team/400', () => {
    return new HttpResponse(null, {
      status: 400,
    });
  }),
  http.delete(baseUrl + '/team/500', () => {
    return HttpResponse.error();
  }),
  http.put(baseUrl + '/team/team1', () => {
    return HttpResponse.json(testTeamBody);
  }),
  http.get(baseUrl + '/team/team1', () => {
    return HttpResponse.json(testTeamBody);
  }),
  http.get(baseUrl + '/team', ({ request }) => {
    const url = new URL(request.url);
    const hackathonId = url.searchParams.get('hackathonId');

    testTeamBody.hackathonId = hackathonId!;

    return HttpResponse.json([testTeamBody]);
  }),
];

export const getTeamsNetworkErrorResponseHandler = http.get(
  baseUrl + '/team',
  () => {
    return HttpResponse.error();
  }
);

export const postTeamBadRequestResponseHandler = http.post(
  baseUrl + '/team',
  () => {
    return new HttpResponse(null, {
      status: 400,
    });
  }
);

export const postTeamInternalServerErrorResponseHandler = http.post(
  baseUrl + '/team',
  () => {
    return HttpResponse.error();
  }
);

export const putTeamBadRequestResponseHandler = http.put(
  baseUrl + '/team/team1',
  () => {
    return new HttpResponse(null, {
      status: 400,
    });
  }
);

export const putTeamInternalServerErrorResponseHandler = http.put(
  baseUrl + '/team/team1',
  () => {
    return HttpResponse.error();
  }
);
