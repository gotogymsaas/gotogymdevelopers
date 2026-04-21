import type { AppRole } from '../types/auth';

export interface MockUser {
  id: string;
  email: string;
  password: string;
  role: AppRole;
}

export const mockUsers: MockUser[] = [
  {
    id: 'user-001',
    email: 'user@test.com',
    password: '123456',
    role: 'user',
  },
  {
    id: 'gym-001',
    email: 'gym@test.com',
    password: '123456',
    role: 'gym',
  },
  {
    id: 'admin-001',
    email: 'admin@test.com',
    password: '123456',
    role: 'admin',
  },
];
