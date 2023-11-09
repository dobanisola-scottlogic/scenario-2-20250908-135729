import { HttpResponse, http } from 'msw';
import { baseUrl } from '../../api/api';
import { UserRole } from '../../enums/UserRole';

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
];
