import { api } from './api';

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

export const getCorporateWellbeing = async (
  params: CorporateWellbeingParams = {},
): Promise<CorporateWellbeingResponse> => {
  const response = await api.get<ApiEnvelope<CorporateWellbeingResponse>>(
    '/api/v1/business/wellbeing/corporate',
    { params },
  );

  return response.data.data;
};
