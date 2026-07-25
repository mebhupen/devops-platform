
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, jti: uuidv4() },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
}

function generateRefreshToken(user) {
  const tokenId = uuidv4();
  const token = jwt.sign(
    { id: user.id, tokenId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
  return { token, tokenId };
}

function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

// Email-verification and password-reset tokens are single-use random UUIDs
// emailed to the user, but were being stored in the DB in plaintext. If the
// DB were ever exposed (backup leak, read-only SQLi elsewhere, insider
// access) those rows would hand over ready-to-use account-takeover tokens.
// Hashing before storage means a DB leak alone is not enough - the raw
// token was only ever transmitted via the email itself.
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken, hashToken };
