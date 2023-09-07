import { UserRole } from '../enums/UserRole';

export interface AuthState {
  name: string | null;
  role: UserRole | null;
  credentials: string | null;
}
