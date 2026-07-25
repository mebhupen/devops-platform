
const { sanitizeUser } = require('../../../src/utils/sanitizeUser');

test('strips all sensitive fields', () => {
  const safe = sanitizeUser({
    id: '1',
    email: 'a@b.com',
    password: 'hash',
    email_verification_token: 'tok',
    password_reset_token: 'tok2',
    password_reset_expires: new Date(),
    failed_login_attempts: 3,
    is_locked: true,
    locked_until: new Date(),
    name: 'A',
    role: 'Developer',
  });
  expect(safe.password).toBeUndefined();
  expect(safe.email_verification_token).toBeUndefined();
  expect(safe.password_reset_token).toBeUndefined();
  expect(safe.password_reset_expires).toBeUndefined();
  expect(safe.failed_login_attempts).toBeUndefined();
  expect(safe.is_locked).toBeUndefined();
  expect(safe.locked_until).toBeUndefined();
  expect(safe.email).toBe('a@b.com');
  expect(safe.name).toBe('A');
});

test('handles null/undefined gracefully', () => {
  expect(sanitizeUser(null)).toBeNull();
  expect(sanitizeUser(undefined)).toBeUndefined();
});
