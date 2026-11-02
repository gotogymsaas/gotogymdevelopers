import { createHash } from 'crypto';
import { Pool } from 'pg';
import type { IdentityFlow, IdentityTicket } from '../services/identity.service';
let pool: Pool | undefined;
const flows = new Map<string, IdentityFlow>();
const tickets = new Map<string, IdentityTicket>();
const hash = (value: string) => createHash('sha256').update(value).digest('base64url');
const testing = () => process.env.NODE_ENV === 'test';
function database() {
  if (!process.env.OIDC_DATABASE_URL) throw new Error('identity_database_not_configured');
  if (!pool) pool = new Pool({ connectionString: process.env.OIDC_DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : undefined, max: 5, connectionTimeoutMillis: 5000, statement_timeout: 5000 });
  return pool;
}
export function resetIdentityTestStore() {
  if (!testing()) throw new Error('test_only');
  flows.clear(); tickets.clear();
}
export async function saveFlow(flow: IdentityFlow) {
  if (testing()) { flows.set(hash(flow.state), flow); return; }
  const db = database();
  await db.query('DELETE FROM gotogym_identity_flows WHERE expires_at <= now()');
  await db.query('INSERT INTO gotogym_identity_flows (state_hash,browser_hash,verifier,nonce,challenge,expires_at) VALUES ($1,$2,$3,$4,$5,$6)', [hash(flow.state),flow.browserHash,flow.verifier,flow.nonce,flow.challenge,new Date(flow.expires)]);
}
export async function consumeFlow(state: string, browserHash: string): Promise<IdentityFlow> {
  if (testing()) {
    const key=hash(state), row=flows.get(key);
    if (!row || row.browserHash !== browserHash || row.expires <= Date.now()) throw new Error('identity_flow');
    flows.delete(key); return row;
  }
  // DELETE RETURNING is a single cross-worker atomic consumption operation.
  const result = await database().query('DELETE FROM gotogym_identity_flows WHERE state_hash=$1 AND browser_hash=$2 AND expires_at > now() RETURNING verifier,nonce,challenge,expires_at', [hash(state),browserHash]);
  if (result.rowCount !== 1) throw new Error('identity_flow');
  const row=result.rows[0];
  return {state,browserHash,verifier:row.verifier,nonce:row.nonce,challenge:row.challenge,expires:new Date(row.expires_at).getTime()};
}
export async function saveTicket(ticket: IdentityTicket) {
  if (testing()) { tickets.set(ticket.hash,ticket); return; }
  await database().query('DELETE FROM gotogym_identity_tickets WHERE expires_at <= now()');
  await database().query('INSERT INTO gotogym_identity_tickets (digest,subject,challenge,expires_at) VALUES ($1,$2,$3,$4)',[ticket.hash,ticket.subject,ticket.challenge,new Date(ticket.expires)]);
}
export async function consumeTicket(digest: string, challenge: string): Promise<string> {
  if (testing()) {
    const row=tickets.get(digest);
    if (!row || row.challenge !== challenge || row.expires <= Date.now()) throw new Error('identity_ticket');
    tickets.delete(digest); return row.subject;
  }
  const result=await database().query('DELETE FROM gotogym_identity_tickets WHERE digest=$1 AND challenge=$2 AND expires_at > now() RETURNING subject',[digest,challenge]);
  if (result.rowCount !== 1) throw new Error('identity_ticket');
  return result.rows[0].subject;
}

export async function closeIdentityDatabase() {
  if (pool) { await pool.end(); pool = undefined; }
}
