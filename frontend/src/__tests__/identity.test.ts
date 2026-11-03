import { finishIdentity, identityAvailable } from '../../auth/identity';
import { getStoredSession } from '../../auth/rbac';
beforeEach(()=> {
  sessionStorage.clear();
  localStorage.clear();
  history.replaceState(null,'','/login');
  // Keep the old Django API unchanged. SSO must use the dedicated Node backend.
  window.__APP_ENV__ = {
    VITE_API_URL: 'https://api.gotogym.store',
    VITE_IDENTITY_API_URL: 'https://developers-api.example',
  };
});
afterEach(()=>{ jest.restoreAllMocks(); delete window.__APP_ENV__; });
test('no callback means no exchange',async()=>{expect(await finishIdentity()).toBe(false);});
test('ticket without tab proof is rejected and removed from URL',async()=>{history.replaceState(null,'','/login#sso_ticket=abc');await expect(finishIdentity()).rejects.toThrow();expect(location.hash).toBe('');});
test('exchange installs only permissions returned by local backend',async()=>{
 history.replaceState(null,'','/login#sso_ticket=abc');sessionStorage.setItem('gtg_identity_verifier','proof');
 global.fetch=jest.fn().mockResolvedValue({ok:true,json:async()=>({data:{token:'local-jwt',role:'end_user',user:{email:'ana@example.com',tenant:{tenantId:'personal'},scopes:['profile:read:self']}}})});
 expect(await finishIdentity()).toBe(true);expect(getStoredSession()?.role).toBe('user');expect(getStoredSession()?.permissions).toEqual([]);expect(sessionStorage.getItem('gtg_identity_verifier')).toBeNull();
});
test('failed exchange does not create a session',async()=>{
 history.replaceState(null,'','/login#sso_ticket=abc');sessionStorage.setItem('gtg_identity_verifier','proof');global.fetch=jest.fn().mockResolvedValue({ok:false});await expect(finishIdentity()).rejects.toThrow();expect(getStoredSession()).toBeNull();
});
test('discovery failure keeps button unavailable',async()=>{global.fetch=jest.fn().mockRejectedValue(new Error('offline'));expect(await identityAvailable()).toBe(false);});

test('identity status uses the dedicated Developers Node API, not the Coach API',async()=>{
  global.fetch=jest.fn().mockResolvedValue({ok:true,json:async()=>({enabled:true})});
  expect(await identityAvailable()).toBe(true);
  expect(global.fetch).toHaveBeenCalledWith('https://developers-api.example/api/v1/auth/identity/status', {cache:'no-store'});
});

test('identity is unavailable when the dedicated backend is not configured',async()=>{
  delete window.__APP_ENV__!.VITE_IDENTITY_API_URL;
  global.fetch=jest.fn();
  expect(await identityAvailable()).toBe(false);
  expect(global.fetch).not.toHaveBeenCalled();
});

test.each([
  'https://api.gotogym.store',
  'http://developers-api.example',
  'https://user:pass@developers-api.example',
  'https://developers-api.example/unexpected-path',
  'https://developers-api.example/?state=foo',
  'https://developers-api.example/#fragment',
  'javascript:alert(1)',
])('identity rejects an unsafe or wrong backend: %s',async(origin)=>{
  window.__APP_ENV__!.VITE_IDENTITY_API_URL=origin;
  global.fetch=jest.fn();
  expect(await identityAvailable()).toBe(false);
  expect(global.fetch).not.toHaveBeenCalled();
});

test('identity exchange refuses a wrong backend without creating a session',async()=>{
  window.__APP_ENV__!.VITE_IDENTITY_API_URL='https://api.gotogym.store';
  history.replaceState(null,'','/login#sso_ticket=abc');
  sessionStorage.setItem('gtg_identity_verifier','proof');
  global.fetch=jest.fn();
  await expect(finishIdentity()).rejects.toThrow('identity_backend_invalid');
  expect(getStoredSession()).toBeNull();
  expect(global.fetch).not.toHaveBeenCalled();
  expect(location.hash).toBe('');
});

test('local development may use localhost without exposing production to plain HTTP',async()=>{
  window.__APP_ENV__!.VITE_IDENTITY_API_URL='http://localhost:4000';
  global.fetch=jest.fn().mockResolvedValue({ok:true,json:async()=>({enabled:false})});
  expect(await identityAvailable()).toBe(false);
  expect(global.fetch).toHaveBeenCalledWith('http://localhost:4000/api/v1/auth/identity/status', {cache:'no-store'});
});
