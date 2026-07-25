
const { hashToken, generateAccessToken, generateRefreshToken, verifyAccessToken } = require('../../../src/utils/token');

beforeAll(() => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-min-32-characters-long-x';
  process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret-min-32-characters';
});

test('hashToken is deterministic and one-way-looking', () => {
  const a = hashToken('same-input');
  const b = hashToken('same-input');
  expect(a).toBe(b);
  expect(a).not.toBe('same-input');
  expect(a).toHaveLength(64); // sha256 hex
});

test('hashToken produces different output for different input', () => {
  expect(hashToken('a')).not.toBe(hashToken('b'));
});

test('generateAccessToken produces a verifiable JWT carrying the user role', () => {
  const token = generateAccessToken({ id: '123', email: 'x@y.com', role: 'Admin' });
  const decoded = verifyAccessToken(token);
  expect(decoded.id).toBe('123');
  expect(decoded.role).toBe('Admin');
});

test('generateRefreshToken returns a token and a matching tokenId', () => {
  const { token, tokenId } = generateRefreshToken({ id: '123' });
  expect(token).toBeDefined();
  expect(tokenId).toBeDefined();
});
