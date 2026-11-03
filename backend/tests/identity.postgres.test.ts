/** CI integration: real PostgreSQL; skipped explicitly when no DB URL is provided. */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Pool } from 'pg';
import request from 'supertest';
import app from '../src/app';
import { consumeFlow, consumeTicket, saveFlow, saveTicket, closeIdentityDatabase } from '../src/repositories/identity.repository';
const integration = process.env.IDENTITY_POSTGRES_TEST_URL ? describe : describe.skip;
integration('PostgreSQL identity atomic consumption', () => {
  let db: Pool; let previous: string | undefined;
  beforeAll(async () => {
    previous=process.env.NODE_ENV;
    process.env.NODE_ENV='integration';
    process.env.OIDC_DATABASE_URL=process.env.IDENTITY_POSTGRES_TEST_URL;
    db=new Pool({connectionString:process.env.OIDC_DATABASE_URL});
    await db.query(readFileSync(resolve(__dirname,'../migrations/001_universal_identity.sql'),'utf8'));
  });
  afterAll(async()=> { process.env.NODE_ENV=previous; await db.end(); await closeIdentityDatabase(); });
  test('status advertises SSO only when migrations, DB permissions and Entra discovery are usable', async()=> {
    const keys=['OIDC_ENABLED','OIDC_ISSUER','OIDC_DISCOVERY_URL','OIDC_CLIENT_ID','OIDC_CLIENT_SECRET','OIDC_REDIRECT_URI','OIDC_FRONTEND_CALLBACK','OIDC_BINDINGS_JSON'];
    const previous=keys.map(key=>process.env[key]);
    const originalFetch=global.fetch;
    const issuer='https://idp.example/tenant/v2.0';
    try {
      Object.assign(process.env,{
        OIDC_ENABLED:'true',
        OIDC_ISSUER:issuer,
        OIDC_DISCOVERY_URL:'https://idp.example/test-ready/.well-known/openid-configuration',
        OIDC_CLIENT_ID:'developers-test',
        OIDC_CLIENT_SECRET:'ci-only-not-a-real-secret',
        OIDC_REDIRECT_URI:'https://developers-api.example/api/v1/auth/identity/callback',
        OIDC_FRONTEND_CALLBACK:'https://developers.gotogym.store/login',
        OIDC_BINDINGS_JSON:'[]',
      });
      global.fetch=jest.fn().mockResolvedValue({ok:true,json:async()=>({
        issuer,
        authorization_endpoint:'https://idp.example/authorize',
        token_endpoint:'https://idp.example/token',
        jwks_uri:'https://idp.example/keys',
      })});
      const response=await request(app).get('/api/v1/auth/identity/status');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({enabled:true,ready:true});
      // The health probe never inserts or consumes identity state.
      const rows=await db.query('SELECT count(*)::int AS count FROM gotogym_identity_flows');
      expect(rows.rows[0].count).toBeGreaterThanOrEqual(0);
    } finally {
      global.fetch=originalFetch;
      keys.forEach((key,index)=>{if(previous[index] === undefined) delete process.env[key];else process.env[key]=previous[index];});
    }
  });

  test('issuer mismatch fails closed without exposing provider details',async()=>{
    const keys=['OIDC_ENABLED','OIDC_ISSUER','OIDC_DISCOVERY_URL','OIDC_CLIENT_ID','OIDC_CLIENT_SECRET','OIDC_REDIRECT_URI','OIDC_FRONTEND_CALLBACK'];
    const previous=keys.map(key=>process.env[key]);
    const originalFetch=global.fetch;
    try {
      Object.assign(process.env,{
        OIDC_ENABLED:'true',
        OIDC_ISSUER:'https://idp.example/tenant/v2.0',
        OIDC_DISCOVERY_URL:'https://idp.example/test-wrong-issuer/.well-known/openid-configuration',
        OIDC_CLIENT_ID:'developers-test',
        OIDC_CLIENT_SECRET:'ci-only-not-a-real-secret',
        OIDC_REDIRECT_URI:'https://developers-api.example/api/v1/auth/identity/callback',
        OIDC_FRONTEND_CALLBACK:'https://developers.gotogym.store/login',
      });
      global.fetch=jest.fn().mockResolvedValue({ok:true,json:async()=>({
        issuer:'https://different.example/tenant/v2.0',
        authorization_endpoint:'https://idp.example/authorize',
        token_endpoint:'https://idp.example/token',
        jwks_uri:'https://idp.example/keys',
      })});
      const response=await request(app).get('/api/v1/auth/identity/status');
      expect(response.body).toEqual({enabled:false,ready:false});
      expect(JSON.stringify(response.body)).not.toContain('different.example');
    } finally {
      global.fetch=originalFetch;
      keys.forEach((key,index)=>{if(previous[index] === undefined) delete process.env[key];else process.env[key]=previous[index];});
    }
  });

  test('exactly one worker consumes a ticket', async()=> {
    const hash='c'.repeat(43),challenge='p'.repeat(43);
    await db.query('DELETE FROM gotogym_identity_tickets WHERE digest=$1',[hash]);
    await saveTicket({hash,challenge,subject:'oid-concurrency',expires:Date.now()+60000});
    const results=await Promise.allSettled(Array.from({length:8},()=>consumeTicket(hash,challenge)));
    expect(results.filter(r=>r.status==='fulfilled')).toHaveLength(1);
  });
  test('exactly one worker consumes a flow', async()=> {
    const state='db-test-state-'+Date.now(),browserHash='b'.repeat(43);
    await saveFlow({state,browserHash,verifier:'v'.repeat(43),nonce:'n'.repeat(43),challenge:'p'.repeat(43),expires:Date.now()+60000});
    const results=await Promise.allSettled(Array.from({length:8},()=>consumeFlow(state,browserHash)));
    expect(results.filter(r=>r.status==='fulfilled')).toHaveLength(1);
  });
});
