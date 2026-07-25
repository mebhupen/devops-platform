
const request = require('supertest');
const app = require('../../app');
const { setupTestEnv, teardownTestEnv, truncateAll } = require('../helpers/testEnv');
const { createUser } = require('../helpers/factories');
const { generateAccessToken } = require('../../src/utils/token');
const notificationRepo = require('../../src/repositories/notificationRepository');

beforeAll(async () => { await setupTestEnv(); });
afterAll(async () => { await teardownTestEnv(); });
afterEach(async () => { await truncateAll(); });

describe('Notifications API', () => {
  it('only returns the authenticated user\'s own notifications', async () => {
    const userA = await createUser({ email: 'usera@example.com' });
    const userB = await createUser({ email: 'userb@example.com' });
    await notificationRepo.create({ user_id: userA.id, title: 'For A', message: 'msg', type: 'info', channel: 'database', is_read: false });
    await notificationRepo.create({ user_id: userB.id, title: 'For B', message: 'msg', type: 'info', channel: 'database', is_read: false });

    const tokenA = generateAccessToken(userA);
    const res = await request(app).get('/api/v1/notifications').set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('For A');
  });

  // Regression test: markAsRead previously returned 200 with null data for
  // both "not found" and "belongs to someone else" instead of a 404.
  it('returns 404 when marking a notification that does not belong to the user', async () => {
    const userA = await createUser({ email: 'ownera@example.com' });
    const userB = await createUser({ email: 'ownerb@example.com' });
    const notif = await notificationRepo.create({ user_id: userB.id, title: 'Not yours', message: 'msg', type: 'info', channel: 'database', is_read: false });

    const tokenA = generateAccessToken(userA);
    const res = await request(app)
      .patch(`/api/v1/notifications/${notif.id}/read`)
      .set('Authorization', `Bearer ${tokenA}`);
    expect(res.status).toBe(404);
  });

  it('marks its own notification as read', async () => {
    const user = await createUser({ email: 'reader@example.com' });
    const notif = await notificationRepo.create({ user_id: user.id, title: 'Mine', message: 'msg', type: 'info', channel: 'database', is_read: false });

    const token = generateAccessToken(user);
    const res = await request(app)
      .patch(`/api/v1/notifications/${notif.id}/read`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.is_read).toBe(true);
  });

  it('returns 400 for a non-UUID notification id', async () => {
    const user = await createUser({ email: 'baduuid@example.com' });
    const token = generateAccessToken(user);
    const res = await request(app)
      .patch('/api/v1/notifications/not-a-uuid/read')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });
});
