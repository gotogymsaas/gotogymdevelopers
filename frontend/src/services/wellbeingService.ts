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

const FALLBACK_COACH_CONTEXT: CoachContextResponse = {
  wellbeing_experience_value_v1: {
    contract: 'wellbeing_experience_value_v1',
    generated_at: new Date().toISOString(),
    global_wellbeing: 'No disponible',
    portfolio_summary: 'No se pudo cargar el resumen de bienestar.',
    experience_value_pack: 'Datos no disponibles en este momento.',
  },
};

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
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      throw new Error('Forbidden');
    }

    console.warn('Fallo al recuperar coach context, usando fallback:', error);
    return FALLBACK_COACH_CONTEXT;
  }
};
