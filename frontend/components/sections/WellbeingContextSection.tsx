import React from 'react';
import type { CoachContextResponse } from '../../src/services/wellbeingService';
import { DataStatePanel } from '../ui/DataStatePanel';

interface WellbeingContextSectionProps {
  data: CoachContextResponse | null;
  loading: boolean;
  error: string | null;
  forbidden: boolean;
}

export const WellbeingContextSection: React.FC<WellbeingContextSectionProps> = ({
  data,
  loading,
  error,
  forbidden,
}) => {
  const wellbeing = data?.wellbeing_experience_value_v1;
  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) {
      return 'No disponible';
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    return JSON.stringify(value, null, 2);
  };

  return (
    <DataStatePanel
      title="Contexto de Bienestar"
      description="Información protegida consumida desde el backend con JWT."
      loading={loading}
      forbidden={forbidden}
      error={error}
      loadingMessage="Cargando datos de bienestar..."
      forbiddenMessage="Acceso prohibido. Verifica tu sesión o token de autorización."
      emptyMessage="No se encontraron datos de bienestar."
    >
      {wellbeing ? (
        <>
          <p><strong>Contrato:</strong> {wellbeing.contract ?? 'wellbeing_experience_value_v1'}</p>
          <p><strong>Generado en:</strong> {wellbeing.generated_at ? new Date(wellbeing.generated_at).toLocaleString() : 'No disponible'}</p>
          <p><strong>Bienestar global:</strong> {formatValue(wellbeing.global_wellbeing)}</p>
          <p><strong>Resumen de portafolio:</strong> {formatValue(wellbeing.portfolio_summary)}</p>
          <p><strong>Valor de experiencia:</strong> {formatValue(wellbeing.experience_value_pack)}</p>
        </>
      ) : null}
    </DataStatePanel>
  );
};
