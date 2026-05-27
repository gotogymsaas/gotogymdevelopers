import {
  ALL_ADMIN_MODULES,
  authenticateWithMockUsers,
  clearStoredSession,
  getAdminModules,
  getRoleAccess,
  getRoleDisplayName,
  getUserRole,
  hasAdminModuleAccess,
  setStoredSession,
} from '../../auth/rbac';

describe('RBAC helpers', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('valida credenciales mock y retorna token con rol', () => {
    const session = authenticateWithMockUsers('admin@test.com', '123456');

    expect(session).toEqual({
      token: 'fake-token',
      role: 'admin',
      email: 'admin@test.com',
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
    setStoredSession({ token: 'fake-token', role: 'gym', email: 'gym@test.com' });
    expect(getUserRole()).toBe('gym');

    clearStoredSession();
    expect(getUserRole()).toBeNull();
  });

  test('retorna etiqueta legible del rol', () => {
    expect(getRoleDisplayName('user')).toBe('Usuario Final');
    expect(getRoleDisplayName('gym')).toBe('GYM y Entrenadores');
    expect(getRoleDisplayName('admin')).toBe('Administrador');
  });
});
