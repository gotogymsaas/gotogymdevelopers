import request from 'supertest';
import app from '../src/app';

describe('Auth API', () => {
  it('POST /api/v1/auth/login debe devolver un JWT para credenciales validas', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'user@test.com', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('token');
    expect(typeof res.body.data.token).toBe('string');
    expect(res.body.data).toHaveProperty('role', 'user');
  });

  it('POST /api/v1/auth/login debe devolver 401 con credenciales invalidas', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'user@test.com', password: 'bad-pass' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toHaveProperty('code', 'UNAUTHORIZED');
  });
});

describe('Integrations API', () => {
  it('GET /api/integrations debe devolver la lista de integraciones con response estándar', async () => {
    const res = await request(app).get('/api/integrations');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('id');
    expect(res.body.data[0]).toHaveProperty('name');
  });

  it('POST /api/integrations/1/sync debe simular una sincronización y devolver response estándar', async () => {
    const res = await request(app).post('/api/integrations/1/sync');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('integrationId', '1');
    expect(res.body.data).toHaveProperty('status');
  });

  it('POST /api/integrations/999/sync debe devolver error NOT_FOUND', async () => {
    const res = await request(app).post('/api/integrations/999/sync');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toHaveProperty('code', 'NOT_FOUND');
  });
});

describe('BodyGraph API', () => {
  it('GET /api/bodygraph/1 debe devolver un payload BodyGraph con response estándar', async () => {
    const res = await request(app).get('/api/bodygraph/1');
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
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'user@test.com', password: '123456' });

    const token = loginRes.body?.data?.token;

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

  it('GET /api/smartwatch/metrics no versionado debe devolver 404', async () => {
    const res = await request(app).get('/api/smartwatch/metrics');

    expect(res.status).toBe(404);
  });
});
