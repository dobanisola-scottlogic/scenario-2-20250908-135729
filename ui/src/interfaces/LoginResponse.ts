import { UserRole } from '../enums/UserRole';

export interface LoginResponse {
  name: string;
  role: UserRole;
  admin: boolean;
  team: boolean;
}
