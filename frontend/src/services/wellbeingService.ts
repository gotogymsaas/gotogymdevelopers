import type { AxiosError } from 'axios';
import { apiClient } from './api';

export interface CoachContext {
  global_wellbeing?: string;
  generated_at?: string;
  portfolio_summary?: string;
  experience_value_pack?: string;
  wellbeing_experience_value_v1?: string | number;
  if_variable_payload?: any;
}

export interface CoachContextResponse {
  success: boolean;
  data: CoachContext;
}

export type CoachContextStatus = 'success' | 'fallback' | 'forbidden' | 'error';

export interface GetCoachContextResult {
  status: CoachContextStatus;
  data: CoachContext;
  errorMessage?: string;
  rawStatus: number | null;
}

const fallbackCoachContext: CoachContext = {
  global_wellbeing: 'No disponible en este momento.',
  generated_at: new Date().toISOString(),
  portfolio_summary: 'No hay resumen disponible. Intenta nuevamente más tarde.',
  experience_value_pack: 'N/A',
};

const getErrorResponse = (error: unknown): { message: string; status: number | null } => {
  if (error instanceof Error) {
    return { message: error.message, status: null };
  }

  const axiosError = error as AxiosError;

  if (axiosError?.isAxiosError && axiosError.response) {
    return {
      message: axiosError.response.data?.detail || axiosError.response.statusText || 'Error de red inesperado.',
      status: axiosError.response.status,
    };
  }

  return { message: 'Error inesperado al contactar al backend.', status: null };
};

export async function getCoachContext(
  username?: string,
  includeText = true,
): Promise<GetCoachContextResult> {
  try {
    const response = await apiClient.get<CoachContextResponse>('/api/coach_context/', {
      params: {
        username,
        include_text: includeText,
      },
    });

    if (!response.data || !response.data.success) {
      return {
        status: 'fallback',
        data: response.data?.data ?? fallbackCoachContext,
        errorMessage: 'Respuesta inesperada del backend. Mostrando datos de respaldo.',
        rawStatus: response.status,
      };
    }

    return {
      status: 'success',
      data: response.data.data,
      rawStatus: response.status,
    };
  } catch (error) {
    const { message, status } = getErrorResponse(error);

    if (status === 403) {
      return {
        status: 'forbidden',
        data: fallbackCoachContext,
        errorMessage: 'Acceso denegado. El token JWT no es válido o no tiene permiso para este endpoint.',
        rawStatus: status,
      };
    }

    return {
      status: 'fallback',
      data: fallbackCoachContext,
      errorMessage: `No se pudo obtener coach context: ${message}`,
      rawStatus: status,
    };
  }
}
