import { rest } from 'msw';
import { UserRole } from '../enums/UserRole';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

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
  rest.post(baseUrl + '/hackathon', (req, res, ctx) => {
    const hackathonName = req.body.name as string;

    console.log('hackathonName', hackathonName);

    if (hackathonName === 'Test Hackathon') {
      return res(
        ctx.status(200),
        ctx.json({
          id: 'test-hackathon-id',
          name: 'Test Hackathon',
          games: null,
          teams: null,
          currentMilestoneClassName: 'Milestone1Bot', // Old service returns a default milestone class
          currentMilestoneMap: 'VeryEasy', // Old service returns a default milestone map
        })
      );
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
];
