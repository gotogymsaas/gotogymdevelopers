import type { CorporateWellbeingQuery, CorporateWellbeingResponse } from '../types/corporate-wellbeing';

const DEFAULT_API_BASE_URL = 'https://api.gotogym.store';
const CORPORATE_WELLBEING_PATH = '/api/business/wellbeing/corporate/';

const apiBaseUrl = () =>
  (process.env.GOTOGYM_API_BASE_URL ?? process.env.VITE_API_URL ?? DEFAULT_API_BASE_URL).replace(/\/+$/, '');

const normalizeDays = (value: unknown): number => {
  const parsed = Number.parseInt(String(value ?? ''), 10);

  if (Number.isNaN(parsed)) {
    return 30;
  }

  return Math.max(7, Math.min(parsed, 180));
};

export function buildCorporateWellbeingQuery(rawQuery: Record<string, unknown>): CorporateWellbeingQuery {
  const query: CorporateWellbeingQuery = {
    days: normalizeDays(rawQuery.days),
  };

  const org = typeof rawQuery.org === 'string' ? rawQuery.org.trim() : '';
  if (org) {
    query.org = org;
  }

  return query;
}

export function buildCorporateWellbeingUrl(query: CorporateWellbeingQuery): string {
  const url = new URL(`${apiBaseUrl()}${CORPORATE_WELLBEING_PATH}`);

  if (query.org) {
    url.searchParams.set('org', query.org);
  }

  url.searchParams.set('days', String(query.days ?? 30));

  return url.toString();
}

export async function getCorporateWellbeing(
  bearerToken: string,
  query: CorporateWellbeingQuery,
): Promise<CorporateWellbeingResponse> {
  const response = await fetch(buildCorporateWellbeingUrl(query), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${bearerToken}`,
    },
  });

  const payload = await response.json().catch(() => null) as CorporateWellbeingResponse | null;

  if (!response.ok) {
    const error: any = new Error(
      typeof payload?.detail === 'string'
        ? payload.detail
        : 'No se pudo consultar el bienestar corporativo.',
    );
    error.status = response.status;
    error.code = response.status === 401
      ? 'UNAUTHORIZED'
      : response.status === 403
        ? 'FORBIDDEN'
        : 'CORPORATE_WELLBEING_UPSTREAM_ERROR';
    error.details = payload ?? undefined;
    throw error;
  }

  if (!payload || typeof payload !== 'object') {
    const error: any = new Error('El endpoint corporativo devolvio una respuesta invalida.');
    error.status = 502;
    error.code = 'CORPORATE_WELLBEING_INVALID_RESPONSE';
    throw error;
  }

  return payload;
}
