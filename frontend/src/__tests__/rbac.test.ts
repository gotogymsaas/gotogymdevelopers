import {
  ALL_ADMIN_MODULES,
  authenticateWithMockUsers,
  clearStoredSession,
  getAdminModules,
  getRoleAccess,
  getRoleDisplayName,
  getTenantContext,
  getUserPermissions,
  getUserRole,
  hasAdminModuleAccess,
  hasPermission,
  setStoredSession,
} from '../../auth/rbac';

describe('RBAC helpers', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  test('valida credenciales mock y retorna token con rol', () => {
    const session = authenticateWithMockUsers('admin@test.com', '123456');

    expect(session).toEqual({
      token: 'fake-token',
      role: 'admin',
      email: 'admin@test.com',
      permissions: [
        'integrations:read',
        'integrations:sync',
        'bodygraph:read',
        'smartwatch:read',
        'business:wellbeing:read',
        'admin:modules:read',
      ],
    });
  });

  test('retorna null con credenciales invalidas', () => {
    const session = authenticateWithMockUsers('admin@test.com', 'bad-pass');

    expect(session).toBeNull();
  });

  test('exhibe acceso de sidebar y modulos para admin', () => {
    const access = getRoleAccess('admin');

    expect(access.canViewSidebar).toBe(true);
    expect(access.adminModules).toEqual(ALL_ADMIN_MODULES);
  });

  test('usuario y gym no tienen acceso a modulos de admin', () => {
    expect(getRoleAccess('user').canViewSidebar).toBe(false);
    expect(getRoleAccess('gym').canViewSidebar).toBe(false);
    expect(getAdminModules('user')).toEqual([]);
    expect(getAdminModules('gym')).toEqual([]);
  });

  test('evalua permisos puntuales por modulo', () => {
    expect(hasAdminModuleAccess('admin', 'users')).toBe(true);
    expect(hasAdminModuleAccess('user', 'users')).toBe(false);
  });

  test('persiste y limpia sesion con role helper', () => {
    setStoredSession({
      token: 'fake-token',
      role: 'gym',
      email: 'gym@test.com',
      permissions: ['business:wellbeing:read'],
      tenant: {
        tenantId: 'tenant-gym-001',
        organizationId: 'org-gym-001',
      },
    });
    expect(getUserRole()).toBe('gym');
    expect(getUserPermissions()).toEqual(['business:wellbeing:read']);
    expect(hasPermission('business:wellbeing:read')).toBe(true);
    expect(getTenantContext()).toEqual({
      tenantId: 'tenant-gym-001',
      organizationId: 'org-gym-001',
      workspaceId: undefined,
      membershipId: undefined,
    });

    clearStoredSession();
    expect(getUserRole()).toBeNull();
  });

  test('retorna etiqueta legible del rol', () => {
    expect(getRoleDisplayName('user')).toBe('Usuario Final');
    expect(getRoleDisplayName('gym')).toBe('GYM y Entrenadores');
    expect(getRoleDisplayName('admin')).toBe('Administrador');
  });
});
