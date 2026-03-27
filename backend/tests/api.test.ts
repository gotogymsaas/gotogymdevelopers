import request from 'supertest';
import app from '../src/app.js';

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
    expect(res.body.data).toHaveProperty('integrationId', '1');
    expect(Array.isArray(res.body.data.metrics)).toBe(true);
  });
});
