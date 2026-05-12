import { renderHook, waitFor } from '@testing-library/react';
import { smartwatchMetricsMock } from '../../mocks/smartwatchMetrics';
import { useSmartwatchMetrics } from '../../hooks/useSmartwatchMetrics';

describe('useSmartwatchMetrics', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  test('usa datos de API cuando la respuesta es correcta', async () => {
    const apiData = [
      {
        id: 'heart_rate',
        title: 'Ritmo cardiaco',
        value: '72 bpm',
        note: 'Lectura API',
      },
    ];

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: apiData }),
    } as Response);

    // In tests include `email` so `getStoredSession` parses the session and
    // `getAuthToken()` returns the token used in request headers.
    window.localStorage.setItem('gotogym_session', JSON.stringify({
      token: 'fake-token',
      role: 'user',
      email: 'user@test.com',
    }));

    const { result } = renderHook(() => useSmartwatchMetrics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.dataSource).toBe('api');
    expect(result.current.metrics).toEqual(apiData);
    expect(result.current.error).toBeNull();
    expect(global.fetch).toHaveBeenCalledWith('/api/v1/smartwatch/metrics', {
      headers: {
        Authorization: 'Bearer fake-token',
      },
    });
  });

  test('usa fallback mock cuando falla la API', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useSmartwatchMetrics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.dataSource).toBe('mock');
    expect(result.current.metrics).toEqual(smartwatchMetricsMock);
    expect(result.current.error).toMatch(/Mostrando datos simulados/i);
  });
});
