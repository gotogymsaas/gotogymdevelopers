export type AppRole = 'user' | 'gym' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  role: AppRole;
}
