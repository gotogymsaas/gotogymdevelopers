import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { applications as seedApplications } from '../data/mock-applications';
import { consentHistory as seedConsentHistory, consents as seedConsents } from '../data/mock-consents';
import type { DeveloperApplication } from '../models/application.model';
import type { ConsentHistoryEvent, IntegrationConsent } from '../models/consent.model';
import type { OAuthAuthorizationCode, OAuthRefreshToken, OAuthSigningKey } from '../models/oauth.model';
import type { AuditEvent } from '../services/audit.service';

interface OAuthState {
  authorizationCodes: OAuthAuthorizationCode[];
  refreshTokens: OAuthRefreshToken[];
  revokedAccessTokenIds: string[];
  signingKeys: OAuthSigningKey[];
}

interface PersistentState {
  applications: DeveloperApplication[];
  consents: IntegrationConsent[];
  consentHistory: ConsentHistoryEvent[];
  oauth: OAuthState;
  auditEvents: AuditEvent[];
}

const createSeedState = (): PersistentState => ({
  applications: seedApplications.map(application => ({ ...application })),
  consents: seedConsents.map(consent => ({ ...consent })),
  consentHistory: seedConsentHistory.map(event => ({ ...event })),
  oauth: {
    authorizationCodes: [],
    refreshTokens: [],
    revokedAccessTokenIds: [],
    signingKeys: [],
  },
  auditEvents: [],
});

const DATA_FILE = resolve(
  process.env.GTG_DATA_FILE
    ?? process.env.DATA_FILE
    ?? 'data/gotogym-developers-store.json',
);

let memoryState: PersistentState | undefined;
const useMemoryStore = process.env.NODE_ENV === 'test';

const ensureStoreFile = () => {
  if (existsSync(DATA_FILE)) {
    return;
  }

  mkdirSync(dirname(DATA_FILE), { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(createSeedState(), null, 2));
};

const normalizeState = (state: Partial<PersistentState>): PersistentState => {
  const seed = createSeedState();
  return {
    ...seed,
    ...state,
    oauth: {
      ...seed.oauth,
      ...(state.oauth ?? {}),
    },
    applications: (state.applications ?? seed.applications).map(application => ({
      ...application,
      redirectUris: application.redirectUris ?? [],
    })),
    consents: state.consents ?? seed.consents,
    consentHistory: state.consentHistory ?? seed.consentHistory,
    auditEvents: state.auditEvents ?? [],
  };
};

export function readStore(): PersistentState {
  if (useMemoryStore) {
    if (!memoryState) {
      memoryState = createSeedState();
    }
    return memoryState;
  }

  ensureStoreFile();
  return normalizeState(JSON.parse(readFileSync(DATA_FILE, 'utf8')) as Partial<PersistentState>);
}

export function writeStore(state: PersistentState): PersistentState {
  if (useMemoryStore) {
    memoryState = state;
    return state;
  }

  mkdirSync(dirname(DATA_FILE), { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(state, null, 2));
  return state;
}

export function updateStore(mutator: (state: PersistentState) => void): PersistentState {
  const state = readStore();
  mutator(state);
  return writeStore(state);
}

export function getStorePath(): string {
  return DATA_FILE;
}
