import type { GatewayUpstreamResponse } from '../types/gateway.types';

const DEFAULT_APPGOTOGYM_BASE_URL = 'https://api.gotogym.store';

export class GatewayUpstreamClient {
  constructor(private readonly baseUrl = process.env.GOTOGYM_API_BASE_URL ?? DEFAULT_APPGOTOGYM_BASE_URL) {}

  async get<T>(path: string, bearerToken: string, query: Record<string, string> = {}): Promise<GatewayUpstreamResponse<T>> {
    const url = new URL(path, this.baseUrl.replace(/\/+$/, '') + '/');
    Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, value));

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    const data = await response.json().catch(() => null) as T;
    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      data,
    };
  }
}
