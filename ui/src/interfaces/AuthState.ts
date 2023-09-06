import { UserRole } from '../enums/UserRole';

export interface AuthState {
  name: string | null;
  role: UserRole;
  credentials: string | null;
}
