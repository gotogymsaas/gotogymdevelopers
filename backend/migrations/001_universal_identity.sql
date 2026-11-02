-- Apply before enabling SSO. No application role or token is accepted from a browser.
BEGIN;
CREATE TABLE IF NOT EXISTS gotogym_identity_flows (
    state_hash varchar(43) PRIMARY KEY,
    browser_hash varchar(43) NOT NULL,
    verifier varchar(128) NOT NULL,
    nonce varchar(128) NOT NULL,
    challenge varchar(43) NOT NULL,
    expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS gotogym_identity_flow_expiry ON gotogym_identity_flows(expires_at);
CREATE TABLE IF NOT EXISTS gotogym_identity_tickets (
    digest varchar(43) PRIMARY KEY,
    subject varchar(255) NOT NULL,
    challenge varchar(43) NOT NULL,
    expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS gotogym_identity_ticket_expiry ON gotogym_identity_tickets(expires_at);
COMMIT;
