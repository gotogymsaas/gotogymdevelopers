import { createHash, generateKeyPairSync } from 'crypto';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../src/app';
import * as identity from '../src/services/identity.service';
import { resetIdentityTestStore } from '../src/repositories/identity.repository';
import { verifyAccessToken, loginWithEmailPassword } from '../src/services/auth.service';
const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: 'jwk' }), kid: 'key1', use: 'sig', alg: 'RS256' };
const issuer='https://idp.example/tenant/v2.0';
const metadata={ issuer, authorization_endpoint:'https://idp.example/authorize', token_endpoint:'https://idp.example/token', jwks_uri:'https://idp.example/keys' };
const verifier='v'.repeat(43);
const challenge=createHash('sha256').update(verifier).digest('base64url');
const provision = [{ issuer, oid:'stable-oid', active:true, user:{id:'real-user',email:'ana@example.com',role:'end_user',scopes:['profile:read:self'],permissions:['profile:read:self'],tenant:{tenantId:'personal-ana',organizationId:'personal-ana',membershipId:'membership-ana'},tokenType:'user'} }];
let tokenOverrides: Record<string, unknown> = {};
let badKey = false;
beforeEach(() => {
  Object.assign(process.env,{OIDC_ENABLED:'true',OIDC_ISSUER:issuer,OIDC_CLIENT_ID:'developers',OIDC_CLIENT_SECRET:'unit-test-secret',OIDC_REDIRECT_URI:'https://api.example/api/v1/auth/identity/callback',OIDC_FRONTEND_CALLBACK:'https://developers.gotogym.store/login',OIDC_BINDINGS_JSON:JSON.stringify(provision)});
  resetIdentityTestStore();
  tokenOverrides={}; badKey=false;
  global.fetch=jest.fn(async(url: any) => {
    let data: any;
    if(String(url).includes('openid-configuration')) data=metadata;
    else if(String(url).endsWith('/keys')) data={keys:[jwk]};
    else {
      const flowNonce = (global as any).identityTestNonce;
      const claims={sub:'pairwise',oid:'stable-oid',nonce:flowNonce,iss:issuer,aud:'developers',iat:Math.floor(Date.now()/1000),exp:Math.floor(Date.now()/1000)+300,role:'gotogym_admin',...tokenOverrides};
      data={id_token:jwt.sign(claims,badKey ? generateKeyPairSync('rsa',{modulusLength:2048}).privateKey : privateKey,{algorithm:'RS256',keyid:'key1'})};
    }
    return {ok:true,json:async()=>data} as Response;
  });
});
afterEach(()=> { jest.restoreAllMocks(); });
async function begin(){ const flow=await identity.begin(challenge); const state=new URL(flow.url).searchParams.get('state')!; (global as any).identityTestNonce=new URL(flow.url).searchParams.get('nonce'); return {...flow,state}; }
async function ticket(){const f=await begin(); const url=await identity.complete(f.state,'code',f.browser); return new URLSearchParams(new URL(url).hash.slice(1)).get('sso_ticket')!;}

test('signed claims never grant token-provided admin role',async()=>{ const t=await ticket();const result=await identity.exchange(t,verifier);expect(verifyAccessToken(result.token)?.role).toBe('end_user');expect(result.user.id).toBe('real-user'); });
test('ticket cannot be redeemed twice',async()=>{const t=await ticket();await identity.exchange(t,verifier);await expect(identity.exchange(t,verifier)).rejects.toThrow();});
test('wrong browser cannot finish flow',async()=>{const f=await begin();await expect(identity.complete(f.state,'code','other-browser')).rejects.toThrow();});
test('callback replay rejected',async()=>{const f=await begin();await identity.complete(f.state,'code',f.browser);await expect(identity.complete(f.state,'code',f.browser)).rejects.toThrow();});
test('wrong PKCE proof rejected',async()=>{const t=await ticket();await expect(identity.exchange(t,'x'.repeat(43))).rejects.toThrow();});
test('wrong audience rejected',async()=>{tokenOverrides={aud:'coach'};const f=await begin();await expect(identity.complete(f.state,'code',f.browser)).rejects.toThrow();});
test('wrong nonce rejected',async()=>{tokenOverrides={nonce:'other'};const f=await begin();await expect(identity.complete(f.state,'code',f.browser)).rejects.toThrow();});
test('invalid signature rejected',async()=>{badKey=true;const f=await begin();await expect(identity.complete(f.state,'code',f.browser)).rejects.toThrow();});
test('unknown oid cannot get demo permissions',async()=>{tokenOverrides={oid:'unknown'};const f=await begin();await expect(identity.complete(f.state,'code',f.browser)).rejects.toThrow();});
test('binding revoked before redemption is refused',async()=>{const t=await ticket();process.env.OIDC_BINDINGS_JSON='[]';await expect(identity.exchange(t,verifier)).rejects.toThrow();});
test('exchange blocks other browser origin',async()=>{const t=await ticket();const r=await request(app).post('/api/v1/auth/identity/exchange').set('Origin','https://evil.example').send({ticket:t,verifier});expect(r.status).toBe(403);});
test('expired ticket rejected',async()=>{const t=await ticket();jest.spyOn(Date,'now').mockReturnValue(Date.now()+61000);await expect(identity.exchange(t,verifier)).rejects.toThrow();});
test('disabled SSO hidden and unavailable',async()=>{process.env.OIDC_ENABLED='false';expect((await request(app).get('/api/v1/auth/identity/status')).body.enabled).toBe(false);expect((await request(app).get('/api/v1/auth/identity/start?challenge='+challenge)).status).toBe(404);});
test('demo password login disabled in production by default',async()=>{const prior=process.env.NODE_ENV;process.env.NODE_ENV='production';delete process.env.ALLOW_DEMO_LOGIN;try{expect(await loginWithEmailPassword('user@test.com','123456')).toBeNull();expect(()=>identity.config()).toThrow('identity_database_not_configured');}finally{process.env.NODE_ENV=prior;}});
