import request from 'supertest';
import app from '../src/app';

const loginAs = async (email: string): Promise<string> => {
  const loginRes = await request(app)
    .post('/api/v1/auth/login')
    .send({ email, password: '123456' });

  return loginRes.body?.data?.token as string;
};

describe('Auth API', () => {
  it('POST /api/v1/auth/login debe devolver un JWT para credenciales validas', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'user@test.com', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('token');
    expect(typeof res.body.data.token).toBe('string');
    expect(res.body.data).toHaveProperty('role', 'end_user');
    expect(res.body.data.user).toMatchObject({
      id: 'user-001',
      email: 'user@test.com',
      role: 'end_user',
      tenant: {
        tenantId: 'tenant-user-001',
      },
    });
    expect(res.body.data.user.permissions).toContain('smartwatch:read:self');
  });

  it('POST /api/v1/auth/login debe devolver 401 con credenciales invalidas', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'user@test.com', password: 'bad-pass' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toHaveProperty('code', 'UNAUTHORIZED');
  });

  it('GET /api/v1/auth/me debe devolver el usuario autenticado', async () => {
    const token = await loginAs('admin@test.com');

    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toMatchObject({
      id: 'admin-001',
      role: 'gotogym_admin',
      tenant: {
        tenantId: 'tenant-platform',
      },
    });
    expect(res.body.data.permissions).toContain('audit_logs:read:platform');
  });
});

describe('Integrations API', () => {
  it('GET /api/integrations debe devolver la lista de integraciones con response estandar', async () => {
    const token = await loginAs('admin@test.com');
    const res = await request(app)
      .get('/api/integrations')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('id');
    expect(res.body.data[0]).toHaveProperty('name');
  });

  it('POST /api/integrations/1/sync debe simular una sincronizacion y devolver response estandar', async () => {
    const token = await loginAs('admin@test.com');
    const res = await request(app)
      .post('/api/integrations/1/sync')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('integrationId', '1');
    expect(res.body.data).toHaveProperty('status');
  });

  it('POST /api/integrations/999/sync debe devolver error NOT_FOUND', async () => {
    const token = await loginAs('admin@test.com');
    const res = await request(app)
      .post('/api/integrations/999/sync')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toHaveProperty('code', 'NOT_FOUND');
  });

  it('POST /api/integrations/1/sync debe rechazar usuarios sin permiso de sincronizacion', async () => {
    const token = await loginAs('user@test.com');
    const res = await request(app)
      .post('/api/integrations/1/sync')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toHaveProperty('code', 'FORBIDDEN');
  });
});

describe('BodyGraph API', () => {
  it('GET /api/bodygraph/1 debe devolver un payload BodyGraph con response estandar', async () => {
    const token = await loginAs('user@test.com');
    const res = await request(app)
      .get('/api/bodygraph/1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('heart_rate');
    expect(res.body.data).toHaveProperty('steps');
    expect(res.body.data).toHaveProperty('sleep');
    expect(res.body.data).toHaveProperty('stress');
    expect(res.body.data).toHaveProperty('source', '1');
    expect(res.body.data).toHaveProperty('timestamp');
  });
});

describe('Smartwatch API', () => {
  it('GET /api/v1/smartwatch/metrics debe devolver metricas del usuario autenticado', async () => {
    const token = await loginAs('user@test.com');

    const res = await request(app)
      .get('/api/v1/smartwatch/metrics')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('id');
    expect(res.body.data[0]).toHaveProperty('title');
    expect(res.body.data[0]).toHaveProperty('value');
    expect(res.body.data[0]).toHaveProperty('note');
  });

  it('GET /api/v1/smartwatch/metrics debe requerir Authorization Bearer token', async () => {
    const res = await request(app).get('/api/v1/smartwatch/metrics');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toHaveProperty('code', 'UNAUTHORIZED');
  });

  it('GET /api/v1/smartwatch/metrics debe rechazar roles sin permiso smartwatch', async () => {
    const token = await loginAs('gym@test.com');

    const res = await request(app)
      .get('/api/v1/smartwatch/metrics')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toHaveProperty('code', 'FORBIDDEN');
  });

  it('GET /api/smartwatch/metrics no versionado debe devolver 404', async () => {
    const res = await request(app).get('/api/smartwatch/metrics');

    expect(res.status).toBe(404);
  });
});

describe('Corporate Wellbeing API', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('GET /api/v1/business/wellbeing/corporate debe requerir Authorization Bearer token', async () => {
    const res = await request(app).get('/api/v1/business/wellbeing/corporate');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toHaveProperty('code', 'UNAUTHORIZED');
  });

  it('OPTIONS /api/v1/business/wellbeing/corporate debe responder 200', async () => {
    const res = await request(app).options('/api/v1/business/wellbeing/corporate');

    expect(res.status).toBe(200);
  });

  it('GET /api/v1/business/wellbeing/corporate debe consumir el endpoint corporativo con JWT y query params', async () => {
    const token = await loginAs('gym@test.com');
    const upstreamPayload = {
      success: true,
      contract: 'wellbeing_corporativo_business_v1',
      requested_window_days: 45,
      workspace: { organization_id: 123 },
      sharing_policy: { aggregate_only: true },
    };

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => upstreamPayload,
    } as Response);
    global.fetch = fetchMock;

    const res = await request(app)
      .get('/api/v1/business/wellbeing/corporate?org=org-gym-001&days=45')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('contract', 'wellbeing_corporativo_business_v1');
    expect(res.body.data).toHaveProperty('requested_window_days', 45);

    const [url, options] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/api/business/wellbeing/corporate/');
    expect(String(url)).toContain('org=org-gym-001');
    expect(String(url)).toContain('days=45');
    expect(options.headers.Authorization).toBe(`Bearer ${token}`);
  });

  it('GET /api/v1/business/wellbeing/corporate debe limitar days entre 7 y 180', async () => {
    const token = await loginAs('gym@test.com');
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        contract: 'wellbeing_corporativo_business_v1',
      }),
    } as Response);
    global.fetch = fetchMock;

    await request(app)
      .get('/api/v1/business/wellbeing/corporate?days=999')
      .set('Authorization', `Bearer ${token}`);

    const [url] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('days=180');
  });

  it('GET /api/v1/business/wellbeing/corporate debe rechazar usuarios finales', async () => {
    const token = await loginAs('user@test.com');

    const res = await request(app)
      .get('/api/v1/business/wellbeing/corporate')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toHaveProperty('code', 'FORBIDDEN');
  });
});
