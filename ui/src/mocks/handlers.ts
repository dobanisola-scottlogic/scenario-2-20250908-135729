import { rest } from 'msw';
import { UserRole } from '../enums/UserRole';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const testHackathonBody = {
  id: 'test-id',
  name: 'Test Hackathon',
  games: [],
  teams: [],
  currentMilestoneClassName: 'com.scottlogic.hackathon.bots.Milestone1Bot',
  currentMilestoneMap: 'Easy',
};

const getMilestonesResponse = [
  {
    id: 'a7d63a7f-0a67-4abf-9eaa-74fc5c52aed4',
    milestoneClassName: 'com.scottlogic.hackathon.bots.Milestone1Bot',
  },
  {
    id: '559cd7d4-d601-4a45-949e-e8babd10aafa',
    milestoneClassName: 'com.scottlogic.hackathon.bots.Milestone2Bot',
  },
];

export const handlers = [
  rest.post(baseUrl + '/login', (req, res, ctx) => {
    const authorizationHeader = req.headers.get('Authorization');

    if (authorizationHeader === 'Basic ' + btoa('testusername:testpassword')) {
      return res(
        ctx.status(200),
        ctx.json({
          role: UserRole.ADMIN,
          name: 'admin',
          admin: true,
          team: false,
        })
      );
    } else if (
      authorizationHeader ===
      'Basic ' + btoa('networkerror:networkerror')
    ) {
      return res.networkError('Network error occurred.');
    } else {
      return res(
        ctx.status(401),
        ctx.text('Credentials are required to access this resource.')
      );
    }
  }),
  rest.post(baseUrl + '/hackathon', async (req, res, ctx) => {
    const requestData: Record<string, string> = await req.json();
    const hackathonName = requestData.name;

    if (hackathonName === 'Test Hackathon') {
      return res(ctx.status(200), ctx.json(testHackathonBody));
    } else if (hackathonName === 'Bad Request Hackathon') {
      return res(
        ctx.status(400),
        ctx.json({
          message: 'An error occurred - bad request.',
        })
      );
    } else if (hackathonName === 'Error Hackathon') {
      return res(
        ctx.status(500),
        ctx.json({
          message: 'An error occurred.',
        })
      );
    }
  }),
  rest.delete(baseUrl + '/hackathon/test-id', (_, res, ctx) => {
    return res(ctx.status(204));
  }),
  rest.delete(baseUrl + '/hackathon/400', (_, res, ctx) => {
    return res(
      ctx.status(400),
      ctx.json({
        message: 'An error occurred - bad request.',
      })
    );
  }),
  rest.delete(baseUrl + '/hackathon/500', (_, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        message: 'An error occurred.',
      })
    );
  }),
  rest.get(baseUrl + '/hackathon/test-id', (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(testHackathonBody));
  }),
  rest.get(baseUrl + '/hackathon/not-found-id', (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(null));
  }),
  rest.put(baseUrl + '/hackathon/test-id', (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(testHackathonBody));
  }),
  rest.get(baseUrl + '/milestone', (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(getMilestonesResponse));
  }),
  rest.delete(baseUrl + '/team/test-id', (_, res, ctx) => {
    return res(ctx.status(204));
  }),
  rest.delete(baseUrl + '/team/400', (_, res, ctx) => {
    return res(
      ctx.status(400),
      ctx.json({
        message: 'An error occurred - bad request.',
      })
    );
  }),
  rest.delete(baseUrl + '/team/500', (_, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        message: 'An error occurred.',
      })
    );
  }),
];
