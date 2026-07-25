
const request = require('supertest');
const app = require('../../app');
const { setupTestEnv, teardownTestEnv, truncateAll } = require('../helpers/testEnv');
const { createUser } = require('../helpers/factories');

beforeAll(async () => { await setupTestEnv(); });
afterAll(async () => { await teardownTestEnv(); });
afterEach(async () => { await truncateAll(); });

describe('POST /api/v1/auth/register', () => {
  it('registers a user with valid data', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'alice@example.com',
      password: 'Password123!',
      name: 'Alice',
    });
    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe('alice@example.com');
    expect(res.body.data.role).toBe('Developer');
  });

  // Regression test: previously the Joi schema and service both allowed a
  // client to self-assign the Admin role at registration.
  it('never allows a client to self-register as Admin', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'wannabe-admin@example.com',
      password: 'Password123!',
      name: 'Wannabe Admin',
      role: 'Admin',
    });
    expect(res.status).toBe(400); // Joi rejects it outright
  });

  // Regression test: register() used to return the raw DB row (minus only
  // `password`), leaking email_verification_token and other sensitive
  // fields in the API response.
  it('never returns sensitive fields in the response', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'bob@example.com',
      password: 'Password123!',
      name: 'Bob',
    });
    expect(res.status).toBe(201);
    expect(res.body.data.password).toBeUndefined();
    expect(res.body.data.email_verification_token).toBeUndefined();
    expect(res.body.data.password_reset_token).toBeUndefined();
    expect(res.body.data.failed_login_attempts).toBeUndefined();
  });

  it('rejects a duplicate email', async () => {
    await createUser({ email: 'dup@example.com' });
    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'dup@example.com',
      password: 'Password123!',
      name: 'Dup',
    });
    expect(res.status).toBe(409);
  });

  it('rejects an invalid email', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'not-an-email',
      password: 'Password123!',
      name: 'X',
    });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/v1/auth/login', () => {
  it('logs in with correct credentials', async () => {
    await createUser({ email: 'login@example.com', password: 'Password123!' });
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'login@example.com',
      password: 'Password123!',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
  });

  it('rejects an unverified email with a generic message', async () => {
    await createUser({ email: 'unverified@example.com', password: 'Password123!', verified: false });
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'unverified@example.com',
      password: 'Password123!',
    });
    expect(res.status).toBe(403);
  });

  it('rejects the wrong password without revealing whether the account exists', async () => {
    await createUser({ email: 'wrongpw@example.com', password: 'Password123!' });
    const resWrongPassword = await request(app).post('/api/v1/auth/login').send({
      email: 'wrongpw@example.com',
      password: 'WrongPassword!',
    });
    const resNoSuchUser = await request(app).post('/api/v1/auth/login').send({
      email: 'doesnotexist@example.com',
      password: 'WrongPassword!',
    });
    expect(resWrongPassword.status).toBe(401);
    expect(resNoSuchUser.status).toBe(401);
    expect(resWrongPassword.body.message).toBe(resNoSuchUser.body.message);
  });

  it('locks the account after repeated failed attempts', async () => {
    await createUser({ email: 'lockout@example.com', password: 'Password123!' });
    for (let i = 0; i < 5; i++) {
      await request(app).post('/api/v1/auth/login').send({
        email: 'lockout@example.com',
        password: 'WrongPassword!',
      });
    }
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'lockout@example.com',
      password: 'Password123!', // even the correct password should now be rejected
    });
    expect(res.status).toBe(423);
  });
});

describe('GET /api/v1/auth/me', () => {
  it('never returns sensitive fields', async () => {
    await createUser({ email: 'me@example.com', password: 'Password123!' });
    const login = await request(app).post('/api/v1/auth/login').send({
      email: 'me@example.com',
      password: 'Password123!',
    });
    const res = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${login.body.data.accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.password).toBeUndefined();
    expect(res.body.data.password_reset_token).toBeUndefined();
    expect(res.body.data.email_verification_token).toBeUndefined();
    expect(res.body.data.failed_login_attempts).toBeUndefined();
    expect(res.body.data.locked_until).toBeUndefined();
  });

  it('rejects requests with no token', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/v1/auth/refresh', () => {
  async function loginAndGetTokens() {
    await createUser({ email: 'refresh@example.com', password: 'Password123!' });
    const login = await request(app).post('/api/v1/auth/login').send({
      email: 'refresh@example.com',
      password: 'Password123!',
    });
    return login.body.data;
  }

  it('rotates the refresh token and issues a new access token', async () => {
    const { refreshToken } = await loginAndGetTokens();
    const res = await request(app).post('/api/v1/auth/refresh').send({ refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.refreshToken).not.toBe(refreshToken);
  });

  it('rejects reuse of an already-rotated-out refresh token', async () => {
    const { refreshToken } = await loginAndGetTokens();
    const first = await request(app).post('/api/v1/auth/refresh').send({ refreshToken });
    expect(first.status).toBe(200);

    // Replay the original (now-revoked) token - this simulates a stolen
    // token being used after the legitimate user already rotated past it.
    const replay = await request(app).post('/api/v1/auth/refresh').send({ refreshToken });
    expect(replay.status).toBe(401);
  });

  // Regression test for the theft-detection fix: reusing a revoked token
  // must kill the whole token family, so even the *new* token issued by
  // the legitimate rotation stops working too.
  it('revokes the entire token family when a revoked token is replayed', async () => {
    const { refreshToken } = await loginAndGetTokens();
    const rotated = await request(app).post('/api/v1/auth/refresh').send({ refreshToken });
    const newRefreshToken = rotated.body.data.refreshToken;

    // Replay the old token -> triggers family revocation
    await request(app).post('/api/v1/auth/refresh').send({ refreshToken });

    // The legitimate, newly-rotated token should now also be dead
    const res = await request(app).post('/api/v1/auth/refresh').send({ refreshToken: newRefreshToken });
    expect(res.status).toBe(401);
  });

  it('rejects an invalid refresh token', async () => {
    const res = await request(app).post('/api/v1/auth/refresh').send({ refreshToken: 'not-a-real-token' });
    expect(res.status).toBe(401);
  });
});
