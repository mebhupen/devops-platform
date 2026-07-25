
const request = require('supertest');
const app = require('../../app');
const { setupTestEnv, teardownTestEnv, truncateAll } = require('../helpers/testEnv');
const { createUser } = require('../helpers/factories');
const { generateAccessToken } = require('../../src/utils/token');

beforeAll(async () => { await setupTestEnv(); });
afterAll(async () => { await teardownTestEnv(); });
afterEach(async () => { await truncateAll(); });

async function tokenFor(role) {
  const user = await createUser({ email: `${role.replace(/\s/g, '')}@example.com`, role });
  return { token: generateAccessToken(user), user };
}

describe('Projects API', () => {
  it('rejects unauthenticated requests', async () => {
    const res = await request(app).get('/api/v1/projects');
    expect(res.status).toBe(401);
  });

  it('allows a Developer to create a project', async () => {
    const { token } = await tokenFor('Developer');
    const res = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'My Project', status: 'active' });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('My Project');
  });

  it('blocks a Viewer from creating a project', async () => {
    const { token } = await tokenFor('Viewer');
    const res = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Nope', status: 'active' });
    expect(res.status).toBe(403);
  });

  it('rejects invalid create bodies', async () => {
    const { token } = await tokenFor('Developer');
    const res = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'active' }); // missing required `name`
    expect(res.status).toBe(400);
  });

  // Regression test: :id params previously reached the DB unvalidated,
  // producing a masked 500 instead of a clean 400.
  it('returns 400 for a non-UUID id instead of a raw DB error', async () => {
    const { token } = await tokenFor('Viewer');
    const res = await request(app)
      .get('/api/v1/projects/not-a-uuid')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  it('returns 404 for a well-formed but nonexistent id', async () => {
    const { token } = await tokenFor('Viewer');
    const res = await request(app)
      .get('/api/v1/projects/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  // Regression test: parsePagination previously turned any query key into a
  // raw WHERE clause, crashing on unexpected filter keys.
  it('ignores unexpected filter keys instead of crashing', async () => {
    const { token } = await tokenFor('Viewer');
    const res = await request(app)
      .get('/api/v1/projects?totallyMadeUpFilterKey=whatever')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it('only Admin/DevOps can update, only Admin can delete', async () => {
    const { token: devToken } = await tokenFor('Developer');
    const created = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${devToken}`)
      .send({ name: 'Editable', status: 'active' });

    const blockedUpdate = await request(app)
      .put(`/api/v1/projects/${created.body.data.id}`)
      .set('Authorization', `Bearer ${devToken}`)
      .send({ name: 'Hacked' });
    expect(blockedUpdate.status).toBe(403);

    const { token: adminToken } = await tokenFor('Admin');
    const allowedUpdate = await request(app)
      .put(`/api/v1/projects/${created.body.data.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated By Admin' });
    expect(allowedUpdate.status).toBe(200);
    expect(allowedUpdate.body.data.name).toBe('Updated By Admin');

    const blockedDelete = await request(app)
      .delete(`/api/v1/projects/${created.body.data.id}`)
      .set('Authorization', `Bearer ${devToken}`);
    expect(blockedDelete.status).toBe(403);

    const allowedDelete = await request(app)
      .delete(`/api/v1/projects/${created.body.data.id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(allowedDelete.status).toBe(200);
  });

  it('paginates results', async () => {
    const { token } = await tokenFor('Developer');
    for (let i = 0; i < 15; i++) {
      await request(app)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: `Project ${i}`, status: 'active' });
    }
    const res = await request(app)
      .get('/api/v1/projects?page=1&limit=10')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(10);
    expect(res.body.meta.pagination.total).toBe(15);
  });
});
