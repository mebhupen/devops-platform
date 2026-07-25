
const request = require('supertest');
const app = require('../../app');
const { setupTestEnv, teardownTestEnv, truncateAll } = require('../helpers/testEnv');
const { createUser } = require('../helpers/factories');
const { generateAccessToken } = require('../../src/utils/token');
const projectRepo = require('../../src/repositories/projectRepository');

beforeAll(async () => { await setupTestEnv(); });
afterAll(async () => { await teardownTestEnv(); });
afterEach(async () => { await truncateAll(); });

async function tokenFor(role) {
  const user = await createUser({ email: `${role.replace(/\s/g, '')}@example.com`, role });
  return { token: generateAccessToken(user), user };
}

describe('Deployments API', () => {
  it('rejects a deployment with no project_id (previously allowed via mass assignment)', async () => {
    const { token } = await tokenFor('Admin');
    const res = await request(app)
      .post('/api/v1/deployments')
      .set('Authorization', `Bearer ${token}`)
      .send({ environment: 'production' });
    expect(res.status).toBe(400);
  });

  it('rejects a deployment referencing a nonexistent project with a clean 404', async () => {
    const { token } = await tokenFor('Admin');
    const res = await request(app)
      .post('/api/v1/deployments')
      .set('Authorization', `Bearer ${token}`)
      .send({ project_id: '00000000-0000-0000-0000-000000000000', environment: 'production' });
    expect(res.status).toBe(404);
  });

  // Regression test: previously the whole request body was spread into the
  // insert, so a client could set arbitrary columns like `id` or `status`.
  it('ignores a client-supplied status and forces it to queued', async () => {
    const { token, user } = await tokenFor('Admin');
    const project = await projectRepo.create({ name: 'Deploy Target', status: 'active', created_by: user.id });
    const res = await request(app)
      .post('/api/v1/deployments')
      .set('Authorization', `Bearer ${token}`)
      .send({ project_id: project.id, environment: 'production', status: 'success' });
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('queued');
  });

  it('blocks a Developer from creating a deployment (Admin/DevOps only)', async () => {
    const { token: adminToken, user: admin } = await tokenFor('Admin');
    const project = await projectRepo.create({ name: 'RBAC Target', status: 'active', created_by: admin.id });
    const { token: devToken } = await tokenFor('Developer');
    const res = await request(app)
      .post('/api/v1/deployments')
      .set('Authorization', `Bearer ${devToken}`)
      .send({ project_id: project.id, environment: 'production' });
    expect(res.status).toBe(403);
  });

  it('lists deployments', async () => {
    const { token, user } = await tokenFor('Admin');
    const project = await projectRepo.create({ name: 'List Target', status: 'active', created_by: user.id });
    await request(app)
      .post('/api/v1/deployments')
      .set('Authorization', `Bearer ${token}`)
      .send({ project_id: project.id, environment: 'staging' });

    const res = await request(app).get('/api/v1/deployments').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
  });
});
