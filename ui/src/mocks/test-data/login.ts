import { UserRole } from '../../enums/UserRole';

export const loginResponse = {
  role: UserRole.ADMIN,
  name: 'admin',
  admin: true,
  team: false,
};

export const successfulLoginCredentials = {
  username: 'admin',
  password: 'secret',
  authorizationHeader: 'Basic ' + btoa('admin:secret'),
};

export const networkErrorLoginCredentials = {
  username: 'networkerror',
  password: 'networkerror',
  authorizationHeader: 'Basic ' + btoa('networkerror:networkerror'),
};
