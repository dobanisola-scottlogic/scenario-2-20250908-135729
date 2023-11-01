import { HttpResponse, PathParams, http } from 'msw';

import { UserRole } from '../enums/UserRole';
import { Arena } from '../interfaces/Arena';
import { CutoffCondition } from '../interfaces/CutoffCondition';
import { GameResult } from '../interfaces/GameResult';
import { Hackathon } from '../interfaces/Hackathon';
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

const loginResponse = {
  role: UserRole.ADMIN,
  name: 'admin',
  admin: true,
  team: false,
};

export const handlers = [
  http.post(baseUrl + '/login', ({ request }) => {
    const authorizationHeader = request.headers.get('Authorization');

    if (authorizationHeader === 'Basic ' + btoa('testusername:testpassword')) {
      return HttpResponse.json(loginResponse);
    } else if (
      authorizationHeader ===
      'Basic ' + btoa('networkerror:networkerror')
    ) {
      return HttpResponse.error();
    } else {
      return new HttpResponse(
        'Credentials are required to access this resource.',
        {
          status: 401,
        }
      );
    }
  }),
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
  http.get(baseUrl + '/milestone', () => {
    return HttpResponse.json(getMilestonesResponse);
  }),
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
  http.get(baseUrl + '/hackathon', () => {
    return HttpResponse.json([testHackathonBody]);
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
  http.get(baseUrl + '/game', ({ request }) => {
    const url = new URL(request.url);
    const hackathonId = url.searchParams.get('hackathonId');

    testGameResultBody.game.hackathonId = hackathonId!;

    return HttpResponse.json([testGameResultBody]);
  }),
  http.post(baseUrl + '/game', () => {
    return HttpResponse.json(testGameResultBody);
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

export const getGameResultsNetworkErrorResponseHandler = http.get(
  baseUrl + '/game',
  () => {
    return HttpResponse.error();
  }
);

export const getHackathonsNetworkErrorResponseHandler = http.get(
  baseUrl + '/hackathon',
  () => {
    return HttpResponse.error();
  }
);

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

export const postGameBadRequestResponseHandler = http.post(
  baseUrl + '/game',
  () => {
    return new HttpResponse(null, {
      status: 400,
    });
  }
);

export const postGameInternalServerErrorResponseHandler = http.post(
  baseUrl + '/game',
  () => {
    return HttpResponse.error();
  }
);
