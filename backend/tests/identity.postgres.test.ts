/** CI integration: real PostgreSQL; skipped explicitly when no DB URL is provided. */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Pool } from 'pg';
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
