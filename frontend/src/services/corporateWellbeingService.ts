import { api } from './api';
import { getApiBaseUrl } from './api';

export interface CorporateWellbeingResponse {
  success?: boolean;
  contract?: string;
  generated_at?: string;
  workspace?: Record<string, unknown>;
  sharing_policy?: Record<string, unknown>;
  global_wellbeing?: Record<string, unknown>;
  if_variable_aggregate?: Record<string, unknown>;
  experience_intelligence?: Record<string, unknown>;
  active_breaks_corporate?: Record<string, unknown>;
  risk_map?: Record<string, unknown>;
  corporate_wellbeing_analysis?: Record<string, unknown>;
  insights?: unknown[];
  requested_window_days?: number;
  [key: string]: unknown;
}

export interface CorporateWellbeingParams {
  org?: string;
  days?: number;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

const DEFAULT_CORPORATE_API_BASE_URL = 'https://api.gotogym.store';
const CORPORATE_WELLBEING_PATH = '/api/business/wellbeing/corporate/';

const corporateWellbeingUrl = (): string => {
  const baseUrl = (getApiBaseUrl() || DEFAULT_CORPORATE_API_BASE_URL).replace(/\/+$/, '');
  return `${baseUrl}${CORPORATE_WELLBEING_PATH}`;
};

const unwrapCorporateWellbeing = (
  payload: ApiEnvelope<CorporateWellbeingResponse> | CorporateWellbeingResponse,
): CorporateWellbeingResponse => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiEnvelope<CorporateWellbeingResponse>).data;
  }

  return payload as CorporateWellbeingResponse;
};

export const getCorporateWellbeing = async (
  params: CorporateWellbeingParams = {},
): Promise<CorporateWellbeingResponse> => {
  const response = await api.get<ApiEnvelope<CorporateWellbeingResponse> | CorporateWellbeingResponse>(
    corporateWellbeingUrl(),
    { params },
  );

  return unwrapCorporateWellbeing(response.data);
};
