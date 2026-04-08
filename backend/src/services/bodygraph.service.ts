export async function getBodyGraphPayload(integrationId: string) {
  // Métricas normalizadas con el shape que espera el frontend
  return {
    heart_rate: 78 + Math.floor(Math.random() * 10),
    steps: 1100 + Math.floor(Math.random() * 500),
    sleep: 7.2,
    stress: 30 + Math.floor(Math.random() * 20),
    source: integrationId,
    timestamp: new Date().toISOString(),
  };
}
