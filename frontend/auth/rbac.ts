export type UserRole = 'user' | 'gym' | 'admin';

export type AdminModule = 'users' | 'gyms' | 'trainers' | 'reports' | 'settings';

export type AppPermission =
  | 'integrations:read'
  | 'integrations:sync'
  | 'bodygraph:read'
  | 'smartwatch:read'
  | 'business:wellbeing:read'
  | 'admin:modules:read';

export interface TenantContext {
  tenantId: string;
  organizationId?: string;
  workspaceId?: string;
  membershipId?: string;
}

export interface AuthSession {
  token: string;
  refreshToken?: string;
  role: UserRole;
  email: string;
  username?: string;
  permissions: AppPermission[];
  tenant?: TenantContext;
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

interface DevelopersAuthUser {
  id: string;
  email: string;
  role: UserRole;
  permissions?: AppPermission[];
  tenant?: TenantContext;
}

interface DevelopersLoginResponse {
  success: boolean;
  data?: {
    token: string;
    role: UserRole;
    user?: DevelopersAuthUser;
    expiresIn?: string | number;
  };
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
const APP_PERMISSIONS: AppPermission[] = [
  'integrations:read',
  'integrations:sync',
  'bodygraph:read',
  'smartwatch:read',
  'business:wellbeing:read',
  'admin:modules:read',
];
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
    || accountType.includes('empresa')
    || accountType.includes('corporate')
    || accountType.includes('company')
    || accountType.includes('organization')
    || accountType.includes('gym')
    || backendRole.includes('business')
    || backendRole.includes('empresa')
    || backendRole.includes('corporate')
    || backendRole.includes('company')
    || backendRole.includes('organization')
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

const hasSessionStorage = (): boolean =>
  typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';

const hasLocalStorage = (): boolean =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const clearLegacyPersistentSession = (): void => {
  if (!hasLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(SESSION_STORAGE_KEY);
};

const isUserRole = (value: unknown): value is UserRole =>
  typeof value === 'string' && USER_ROLES.includes(value as UserRole);

const isAppPermission = (value: unknown): value is AppPermission =>
  typeof value === 'string' && APP_PERMISSIONS.includes(value as AppPermission);

const defaultPermissionsByRole = (role: UserRole): AppPermission[] => {
  if (role === 'admin') {
    return [...APP_PERMISSIONS];
  }

  if (role === 'gym') {
    return ['business:wellbeing:read', 'integrations:read', 'bodygraph:read'];
  }

  return ['smartwatch:read', 'bodygraph:read'];
};

const parsePermissions = (value: unknown, role: UserRole): AppPermission[] => {
  if (!Array.isArray(value)) {
    return defaultPermissionsByRole(role);
  }

  const permissions = value.filter(isAppPermission);
  return permissions.length > 0 ? permissions : defaultPermissionsByRole(role);
};

const parseTenant = (value: unknown): TenantContext | undefined => {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const tenant = value as Partial<TenantContext>;
  if (typeof tenant.tenantId !== 'string' || tenant.tenantId.length === 0) {
    return undefined;
  }

  return {
    tenantId: tenant.tenantId,
    organizationId: typeof tenant.organizationId === 'string' ? tenant.organizationId : undefined,
    workspaceId: typeof tenant.workspaceId === 'string' ? tenant.workspaceId : undefined,
    membershipId: typeof tenant.membershipId === 'string' ? tenant.membershipId : undefined,
  };
};

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
        permissions: parsePermissions(parsed.permissions, parsed.role),
        tenant: parseTenant(parsed.tenant),
      };
    }
  } catch {
    return null;
  }

  return null;
};

export const getStoredSession = (): AuthSession | null => {
  clearLegacyPersistentSession();

  if (!hasSessionStorage()) {
    return null;
  }

  const session = parseSession(window.sessionStorage.getItem(SESSION_STORAGE_KEY));
  if (session && session.token !== FAKE_TOKEN && isJwtExpired(session.token)) {
    clearStoredSession();
    return null;
  }

  return session;
};

export const setStoredSession = (session: AuthSession): void => {
  clearLegacyPersistentSession();

  if (!hasSessionStorage()) {
    return;
  }

  window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const clearStoredSession = (): void => {
  if (hasSessionStorage()) {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }

  clearLegacyPersistentSession();
};

export const getAuthToken = (): string | null => {
  const token = getStoredSession()?.token ?? null;
  return token && token !== FAKE_TOKEN ? token : null;
};

export const getUserEmail = (): string | null => getStoredSession()?.email ?? null;

export const getUserRole = (): UserRole | null => getStoredSession()?.role ?? null;

export const getUserPermissions = (): AppPermission[] => getStoredSession()?.permissions ?? [];

export const hasPermission = (permission: AppPermission): boolean =>
  getUserPermissions().includes(permission);

export const getTenantContext = (): TenantContext | null => getStoredSession()?.tenant ?? null;

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

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  const [, payload] = token.split('.');
  if (!payload) {
    return null;
  }

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return JSON.parse(window.atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const isJwtExpired = (token: string): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  const payload = decodeJwtPayload(token);
  const exp = typeof payload?.exp === 'number' ? payload.exp : null;
  if (!exp) {
    return false;
  }

  return exp * 1000 <= Date.now();
};

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
    permissions: defaultPermissionsByRole(user.role),
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
    const loginBody = JSON.stringify({
      username: email.trim(),
      email: email.trim(),
      password,
    });
    const requestInit: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: loginBody,
    };

    let response = await fetch(`${baseUrl}/api/v1/auth/login`, requestInit);
    if (response.status === 404) {
      response = await fetch(`${baseUrl}/api/login/`, requestInit);
    }

    if (!response.ok) {
      return null;
    }

    const payload = await response.json() as AppDesplegadaLoginResponse | DevelopersLoginResponse | ApiResponse<Partial<AuthSession>>;
    const legacyData = 'data' in payload ? payload.data : undefined;
    const developersUser = legacyData && 'user' in legacyData ? legacyData.user as DevelopersAuthUser | undefined : undefined;
    const token = 'access' in payload ? payload.access : legacyData?.token;
    const refreshToken = 'refresh' in payload ? payload.refresh : legacyData?.refreshToken;
    const backendUser = 'user' in payload ? payload.user : undefined;
    const role = legacyData?.role && isUserRole(legacyData.role)
      ? legacyData.role
      : developersUser?.role && isUserRole(developersUser.role)
        ? developersUser.role
        : inferRoleFromBackendUser(backendUser);

    if (typeof token !== 'string' || token.length === 0) {
      return null;
    }

    const session: AuthSession = {
      token,
      refreshToken,
      role,
      email: typeof developersUser?.email === 'string' && developersUser.email.length > 0
        ? developersUser.email.toLowerCase()
        : typeof backendUser?.email === 'string' && backendUser.email.length > 0
        ? backendUser.email.toLowerCase()
        : typeof legacyData?.email === 'string' && legacyData.email.length > 0
          ? legacyData.email.toLowerCase()
          : email.trim().toLowerCase(),
      username: typeof backendUser?.username === 'string' && backendUser.username.length > 0
        ? backendUser.username
        : email.trim().toLowerCase(),
      permissions: parsePermissions(developersUser?.permissions ?? legacyData?.permissions, role),
      tenant: parseTenant(developersUser?.tenant ?? legacyData?.tenant),
    };
    setStoredSession(session);
    return session;
  } catch {
    return null;
  }
};
