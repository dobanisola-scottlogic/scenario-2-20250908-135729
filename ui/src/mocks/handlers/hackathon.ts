import { HttpResponse, PathParams, http } from 'msw';
import { baseUrl } from '../../api/api';
import { Hackathon } from '../../interfaces/Hackathon';

const testHackathonBody = {
  id: 'test-id',
  name: 'Test Hackathon',
  games: [],
  teams: [],
  currentMilestoneClassName: 'com.scottlogic.hackathon.bots.Milestone1Bot',
  currentMilestoneMap: 'Easy',
};

export const handlers = [
  http.post<PathParams<string>, Hackathon>(
    baseUrl + '/hackathon',
    async ({ request }) => {
      const requestData = await request.json();
      const hackathonName = requestData.name;

      if (hackathonName === 'Test Hackathon') {
        return HttpResponse.json(testHackathonBody);
      } else if (hackathonName === 'Bad Request Hackathon') {
        return new HttpResponse(null, {
          status: 400,
        });
      } else if (hackathonName === 'Error Hackathon') {
        return HttpResponse.error();
      }
    }
  ),
  http.delete(baseUrl + '/hackathon/test-id', () => {
    return new HttpResponse(null, { status: 204 });
  }),
  http.delete(baseUrl + '/hackathon/400', () => {
    return new HttpResponse(null, {
      status: 400,
    });
  }),
  http.delete(baseUrl + '/hackathon/500', () => {
    return HttpResponse.error();
  }),
  http.get(baseUrl + '/hackathon/test-id', () => {
    return HttpResponse.json(testHackathonBody);
  }),
  http.get(baseUrl + '/hackathon/not-found-id', () => {
    return new HttpResponse();
  }),
  http.put(baseUrl + '/hackathon/test-id', () => {
    return HttpResponse.json(testHackathonBody);
  }),
  http.get(baseUrl + '/hackathon', () => {
    return HttpResponse.json([testHackathonBody]);
  }),
  http.get(baseUrl + '/hackathon/team', ({ request }) => {
    const authorizationHeader = request.headers.get('Authorization');

    if (authorizationHeader === 'Basic team') {
      return HttpResponse.json(testHackathonBody);
    } else {
      return HttpResponse.error();
    }
  }),
];

export const getHackathonsNetworkErrorResponseHandler = http.get(
  baseUrl + '/hackathon',
  () => {
    return HttpResponse.error();
  }
);
