export type UserRole = 'user' | 'gym' | 'admin';

export type AdminModule = 'users' | 'gyms' | 'trainers' | 'reports' | 'settings';

export interface AuthSession {
  token: string;
  refreshToken?: string;
  role: UserRole;
  email: string;
  username?: string;
}

interface RoleAccess {
  canViewSidebar: boolean;
  adminModules: AdminModule[];
}

interface MockUser {
  email: string;
  password: string;
  role: UserRole;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
}

interface AppDesplegadaLoginResponse {
  success?: boolean;
  access?: string;
  refresh?: string;
  user?: {
    username?: string;
    email?: string;
    account_type?: string;
    is_staff?: boolean;
    is_superuser?: boolean;
    role?: string;
  };
}

export const MOCK_USERS: MockUser[] = [
  { email: 'user@test.com', password: '123456', role: 'user' },
  { email: 'gym@test.com', password: '123456', role: 'gym' },
  { email: 'admin@test.com', password: '123456', role: 'admin' },
];

export const ROLE_LABELS: Record<UserRole, string> = {
  user: 'Usuario Final',
  gym: 'GYM y Entrenadores',
  admin: 'Administrador',
};

export const ADMIN_MODULE_LABELS: Record<AdminModule, string> = {
  users: 'Usuarios',
  gyms: 'Gimnasios',
  trainers: 'Entrenadores',
  reports: 'Reportes',
  settings: 'Configuracion',
};

export const ALL_ADMIN_MODULES: AdminModule[] = [
  'users',
  'gyms',
  'trainers',
  'reports',
  'settings',
];

const SESSION_STORAGE_KEY = 'gotogym_session';
const USER_ROLES: UserRole[] = ['user', 'gym', 'admin'];
const FAKE_TOKEN = 'fake-token';

const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined' && window.__APP_ENV__?.VITE_API_URL) {
    return window.__APP_ENV__.VITE_API_URL;
  }

  return (
    (typeof process !== 'undefined' && process.env && process.env.VITE_API_URL)
    || ''
  );
};

const inferRoleFromBackendUser = (user: AppDesplegadaLoginResponse['user']): UserRole => {
  if (!user) {
    return 'user';
  }

  if (user.is_superuser || user.is_staff || user.role === 'admin') {
    return 'admin';
  }

  const accountType = String(user.account_type || '').toLowerCase();
  const backendRole = String(user.role || '').toLowerCase();
  if (
    accountType.includes('business')
    || accountType.includes('gym')
    || backendRole.includes('business')
    || backendRole.includes('gym')
  ) {
    return 'gym';
  }

  return 'user';
};

const ROLE_ACCESS: Record<UserRole, RoleAccess> = {
  user: {
    canViewSidebar: false,
    adminModules: [],
  },
  gym: {
    canViewSidebar: false,
    adminModules: [],
  },
  admin: {
    canViewSidebar: true,
    adminModules: ALL_ADMIN_MODULES,
  },
};

const hasStorage = (): boolean =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const isUserRole = (value: unknown): value is UserRole =>
  typeof value === 'string' && USER_ROLES.includes(value as UserRole);

const parseSession = (value: string | null): AuthSession | null => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<AuthSession>;
    if (
      typeof parsed.token === 'string'
      && parsed.token.length > 0
      && isUserRole(parsed.role)
    ) {
      return {
        token: parsed.token,
        refreshToken: typeof parsed.refreshToken === 'string' ? parsed.refreshToken : undefined,
        role: parsed.role,
        email: typeof parsed.email === 'string' ? parsed.email : '',
        username: typeof parsed.username === 'string' ? parsed.username : undefined,
      };
    }
  } catch {
    return null;
  }

  return null;
};

export const getStoredSession = (): AuthSession | null => {
  if (!hasStorage()) {
    return null;
  }

  return parseSession(window.localStorage.getItem(SESSION_STORAGE_KEY));
};

export const setStoredSession = (session: AuthSession): void => {
  if (!hasStorage()) {
    return;
  }

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const clearStoredSession = (): void => {
  if (!hasStorage()) {
    return;
  }

  window.localStorage.removeItem(SESSION_STORAGE_KEY);
};

export const getAuthToken = (): string | null => getStoredSession()?.token ?? null;

export const getUserEmail = (): string | null => getStoredSession()?.email ?? null;

export const getUserRole = (): UserRole | null => getStoredSession()?.role ?? null;

export const getRoleDisplayName = (role: UserRole): string => ROLE_LABELS[role];

export const getRoleAccess = (role: UserRole | null): RoleAccess => {
  if (!role) {
    return {
      canViewSidebar: false,
      adminModules: [],
    };
  }

  const access = ROLE_ACCESS[role];
  return {
    canViewSidebar: access.canViewSidebar,
    adminModules: [...access.adminModules],
  };
};

export const getAdminModules = (role: UserRole | null): AdminModule[] =>
  getRoleAccess(role).adminModules;

export const hasAdminModuleAccess = (role: UserRole | null, module: AdminModule): boolean =>
  getAdminModules(role).includes(module);

export const isAuthenticated = (): boolean => Boolean(getAuthToken());

export const canAccessAdminMenu = (role: UserRole | null): boolean =>
  getRoleAccess(role).canViewSidebar;

export const authenticateWithMockUsers = (email: string, password: string): AuthSession | null => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = MOCK_USERS.find(
    mockUser =>
      mockUser.email.toLowerCase() === normalizedEmail
      && mockUser.password === password,
  );

  if (!user) {
    return null;
  }

  return {
    token: FAKE_TOKEN,
    role: user.role,
    email: user.email,
  };
};

export const loginWithMockUsers = (email: string, password: string): AuthSession | null => {
  const session = authenticateWithMockUsers(email, password);
  if (!session) {
    return null;
  }

  setStoredSession(session);
  return session;
};

export const loginWithApi = async (email: string, password: string): Promise<AuthSession | null> => {
  try {
    const baseUrl = getApiBaseUrl().replace(/\/$/, '');
    const response = await fetch(`${baseUrl}/api/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email.trim(),
        email: email.trim(),
        password,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json() as AppDesplegadaLoginResponse | ApiResponse<Partial<AuthSession>>;
    const legacyData = 'data' in payload ? payload.data : undefined;
    const token = 'access' in payload ? payload.access : legacyData?.token;
    const refreshToken = 'refresh' in payload ? payload.refresh : legacyData?.refreshToken;
    const backendUser = 'user' in payload ? payload.user : undefined;
    const role = legacyData?.role && isUserRole(legacyData.role)
      ? legacyData.role
      : inferRoleFromBackendUser(backendUser);

    if (typeof token !== 'string' || token.length === 0) {
      return null;
    }

    const session: AuthSession = {
      token,
      refreshToken,
      role,
      email: typeof backendUser?.email === 'string' && backendUser.email.length > 0
        ? backendUser.email.toLowerCase()
        : typeof legacyData?.email === 'string' && legacyData.email.length > 0
          ? legacyData.email.toLowerCase()
          : email.trim().toLowerCase(),
      username: typeof backendUser?.username === 'string' && backendUser.username.length > 0
        ? backendUser.username
        : email.trim().toLowerCase(),
    };
    setStoredSession(session);
    return session;
  } catch {
    return null;
  }
};
