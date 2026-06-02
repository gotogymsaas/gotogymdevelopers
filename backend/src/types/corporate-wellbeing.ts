export interface CorporateWellbeingResponse {
  success?: boolean;
  contract?: 'wellbeing_corporativo_business_v1' | string;
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

export interface CorporateWellbeingQuery {
  org?: string;
  days?: number;
}
