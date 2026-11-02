import { finishIdentity, identityAvailable } from '../../auth/identity';
import { getStoredSession } from '../../auth/rbac';
beforeEach(()=> { sessionStorage.clear(); localStorage.clear(); history.replaceState(null,'','/login'); });
afterEach(()=>jest.restoreAllMocks());
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
