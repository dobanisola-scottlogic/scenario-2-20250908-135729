import { rest } from 'msw';

import { UserRole } from '../enums/UserRole';
import { Arena } from '../interfaces/Arena';
import { CutoffCondition } from '../interfaces/CutoffCondition';
import { GameResult } from '../interfaces/GameResult';
import { Milestone } from '../interfaces/Milestone';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const testHackathonBody = {
  id: 'test-id',
  name: 'Test Hackathon',
  games: [],
  teams: [],
  currentMilestoneClassName: 'com.scottlogic.hackathon.bots.Milestone1Bot',
  currentMilestoneMap: 'Easy',
};

const testTeamBody = {
  hackathonId: 'test-id',
  id: 'team1',
  name: 'Team 1',
  password: 'pa$$w0rd',
};

const testArena: Arena = {
  height: 64,
  name: 'Easy',
  outOfBoundPositions: [
    { x: 109, y: 63 },
    { x: 127, y: 23 },
    { x: 102, y: 63 },
  ],
  width: 128,
};

const testGameResultBody: GameResult = {
  cutoffCondition: CutoffCondition.LONE_SURVIVOR,
  game: {
    arena: testArena,
    gameTime: Date.parse('13 Oct 2023 09:12:34'),
    hackathonId: 'hackathon1',
    map: testArena,
    teams: [
      {
        botId: 10,
        teamId: null,
        teamName: 'com.scottlogic.hackathon.bots.Milestone1Bot',
      },
      {
        botId: 9,
        teamId: null,
        teamName: 'com.scottlogic.hackathon.bots.Milestone2Bot',
      },
    ],
  },
  id: '59A17EC8-D5AB-48DC-9800-FDCF6DC86F7D',
};

const getMilestonesResponse: Milestone[] = [
  {
    id: 'a7d63a7f-0a67-4abf-9eaa-74fc5c52aed4',
    milestoneClassName: 'com.scottlogic.hackathon.bots.Milestone1Bot',
    readableMilestoneClassName: 'Milestone1Bot',
    timeStamp: 1697106871827,
  },
  {
    id: '559cd7d4-d601-4a45-949e-e8babd10aafa',
    milestoneClassName: 'com.scottlogic.hackathon.bots.Milestone2Bot',
    readableMilestoneClassName: 'Milestone2Bot',
    timeStamp: 1697106871827,
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
  rest.post(baseUrl + '/team', (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        hackathonId: 'hackathon1',
        id: 'cb63cf4b-6683-4d4f-901c-7476bedd658e',
        name: 'team1',
        password: 'pa$$w0rd',
      })
    );
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
  rest.put(baseUrl + '/team/team1', (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(testTeamBody));
  }),
  rest.get(baseUrl + '/hackathon', (_, res, ctx) => {
    return res(ctx.status(200), ctx.json([testHackathonBody]));
  }),
  rest.get(baseUrl + '/team/team1', (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(testTeamBody));
  }),
  rest.get(baseUrl + '/team', (req, res, ctx) => {
    const hackathonId = req.url.searchParams.get('hackathonId');

    testTeamBody.hackathonId = hackathonId!;

    return res(ctx.status(200), ctx.json([testTeamBody]));
  }),
  rest.get(baseUrl + '/game', (req, res, ctx) => {
    const hackathonId = req.url.searchParams.get('hackathonId');

    testGameResultBody.game.hackathonId = hackathonId!;

    return res(ctx.status(200), ctx.json([testGameResultBody]));
  }),
  rest.post(baseUrl + '/game', (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(testGameResultBody));
  }),
];

export const getGameResultsNetworkErrorResponseHandler = rest.get(
  baseUrl + '/game',
  (_, res) => {
    return res.networkError('Network error occurred.');
  }
);

export const getHackathonsNetworkErrorResponseHandler = rest.get(
  baseUrl + '/hackathon',
  (_, res) => {
    return res.networkError('Network error occurred.');
  }
);

export const getTeamsNetworkErrorResponseHandler = rest.get(
  baseUrl + '/team',
  (_, res) => {
    return res.networkError('Network error occurred.');
  }
);

export const postTeamBadRequestResponseHandler = rest.post(
  baseUrl + '/team',
  (_, res, ctx) => {
    return res(
      ctx.status(400),
      ctx.json({
        message: 'An error occurred - bad request.',
      })
    );
  }
);

export const postTeamInternalServerErrorResponseHandler = rest.post(
  baseUrl + '/team',
  (_, res, ctx) => {
    return res(
      ctx.status(503),
      ctx.json({
        message: 'Error adding team - internal server error',
      })
    );
  }
);

export const putTeamBadRequestResponseHandler = rest.put(
  baseUrl + '/team/team1',
  (_, res, ctx) => {
    return res(
      ctx.status(400),
      ctx.json({
        message: 'An error occurred - bad request.',
      })
    );
  }
);

export const putTeamInternalServerErrorResponseHandler = rest.put(
  baseUrl + '/team/team1',
  (_, res, ctx) => {
    return res(
      ctx.status(503),
      ctx.json({
        message: 'Error updating team - internal server error',
      })
    );
  }
);

export const postGameBadRequestResponseHandler = rest.post(
  baseUrl + '/game',
  (_, res, ctx) => {
    return res(
      ctx.status(400),
      ctx.json({
        message: 'Error creating game - bad request',
      })
    );
  }
);

export const postGameInternalServerErrorResponseHandler = rest.post(
  baseUrl + '/game',
  (_, res, ctx) => {
    return res(
      ctx.status(503),
      ctx.json({
        message: 'Error creating game - internal server error',
      })
    );
  }
);
