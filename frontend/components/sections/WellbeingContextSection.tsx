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
      {data ? (
        <>
          <p><strong>Bienestar global:</strong> {data.global_wellbeing}</p>
          <p><strong>Generado en:</strong> {new Date(data.generated_at).toLocaleString()}</p>
          <p><strong>Resumen de portafolio:</strong> {data.portfolio_summary}</p>
          <p><strong>Valor de experiencia:</strong> {data.experience_value_pack}</p>
        </>
      ) : null}
    </DataStatePanel>
  );
};
