import axios from 'axios';
import { api } from './api';

export interface CoachContextResponse {
  profile?: Record<string, unknown>;
  documents?: Record<string, unknown>;
  devices?: Record<string, unknown>;
  if_snapshot?: Record<string, unknown>;
  business?: Record<string, unknown>;
  wellbeing_experience_value_v1?: {
    contract?: string;
    generated_at?: string;
    global_wellbeing?: unknown;
    if_variable_payload?: unknown;
    experience_value_pack?: unknown;
    portfolio_summary?: unknown;
    guardrails?: unknown;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface CoachContextParams {
  username?: string;
  include_text?: boolean;
}

export const getCoachContext = async (
  username?: string,
): Promise<CoachContextResponse> => {
  const params: CoachContextParams = {
    include_text: true,
  };

  if (username) {
    params.username = username;
  }

  try {
    const response = await api.get<CoachContextResponse>('/api/coach_context/', {
      params,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error('Forbidden');
      }

      if (error.response?.status === 401) {
        throw new Error('Unauthorized');
      }
    }

    throw error;
  }
};
