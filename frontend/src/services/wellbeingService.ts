import axios from 'axios';
import { api } from './api';

export interface CoachContextResponse {
  global_wellbeing: string;
  generated_at: string;
  portfolio_summary: string;
  experience_value_pack: string;
  [key: string]: unknown;
}

interface CoachContextParams {
  username?: string;
  include_text?: boolean;
}

const FALLBACK_COACH_CONTEXT: CoachContextResponse = {
  global_wellbeing: 'No disponible',
  generated_at: new Date().toISOString(),
  portfolio_summary: 'No se pudo cargar el resumen de bienestar.',
  experience_value_pack: 'Datos no disponibles en este momento.',
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
