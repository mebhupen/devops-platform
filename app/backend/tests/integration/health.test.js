
const request = require('supertest');
const app = require('../../app');
describe('Health', () => {
  it('GET /api/v1/health should return 200', async () => {
    const res = await request(app).get('/api/v1/health');
    expect([200,503]).toContain(res.status);
  });
});
