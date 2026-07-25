
const { v4: uuidv4 } = require('uuid');
const userRepo = require('../repositories/userRepository');
const refreshRepo = require('../repositories/refreshTokenRepository');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, hashToken } = require('../utils/token');
const AppError = require('../utils/AppError');
const { sendVerificationEmail, sendPasswordResetEmail } = require('./emailService');
const { addJob } = require('../jobs/queues');
const { sanitizeUser } = require('../utils/sanitizeUser');
// NOT destructured - config/database.js exposes knex via a getter so it
// reflects the live connection once connectDB() runs. Destructuring here
// would capture whatever the getter returned at require-time (undefined,
// since app modules load before connectDB() runs), permanently freezing
// it as undefined even after the real connection is established.
const database = require('../config/database');

// Roles a user is allowed to grant themselves at self-registration time.
// Admin / DevOps Engineer must be assigned by an existing Admin elsewhere.
const SELF_SERVICE_ROLES = ['Developer', 'Viewer'];

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 30*60*1000;

async function register({ email, password, name, role }) {
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new AppError('Email already registered', 409);
  const hashed = await hashPassword(password);
  const verificationToken = uuidv4();
  // Defense-in-depth: even though the Joi schema already restricts self-service
  // roles, never trust client input for something as sensitive as role directly.
  const safeRole = SELF_SERVICE_ROLES.includes(role) ? role : 'Developer';
  const user = await userRepo.create({
    email, password: hashed, name, role: safeRole,
    is_email_verified: false,
    email_verification_token: hashToken(verificationToken),
    failed_login_attempts: 0,
    is_locked: false
  });
  await addJob('emailQueue', 'verification', { userId: user.id, token: verificationToken });
  // Never return the verification token itself in the API response - it is a
  // credential and must only ever reach the user via the email it's sent in.
  return sanitizeUser(user);
}

async function login(email, password) {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new AppError('Invalid credentials', 401);

  if (user.is_locked && user.locked_until && new Date(user.locked_until) > new Date()) {
    throw new AppError(`Account locked until ${user.locked_until}`, 423);
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    await userRepo.incrementFailedAttempts(user.id);
    const updated = await userRepo.findById(user.id);
    if (updated.failed_login_attempts >= MAX_FAILED_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + LOCK_TIME_MS);
      await userRepo.lockAccount(user.id, lockUntil);
      throw new AppError('Account locked due to many failed attempts. Try after 30 mins', 423);
    }
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.is_email_verified) throw new AppError('Please verify your email', 403);

  await userRepo.resetFailedAttempts(user.id);

  const accessToken = generateAccessToken(user);
  const { token: refreshToken, tokenId } = generateRefreshToken(user);
  const familyId = uuidv4();

  await refreshRepo.createToken({
    user_id: user.id,
    token_id: tokenId,
    token: refreshToken,
    family_id: familyId,
    expires_at: new Date(Date.now() + 7*24*60*60*1000),
    is_revoked: false
  });

  return { user: sanitizeUser(user), accessToken, refreshToken };
}

async function refresh(refreshToken) {
  let decoded;
  try { decoded = verifyRefreshToken(refreshToken); } catch { throw new AppError('Invalid refresh token', 401); }
  const stored = await refreshRepo.findByTokenId(decoded.tokenId);
  if (!stored) throw new AppError('Invalid refresh token', 401);
  if (stored.is_revoked) {
    // This token was already rotated out. Being presented again is a strong
    // signal of theft/replay (either an attacker replaying a stolen token,
    // or the legitimate token having leaked and been used elsewhere) - kill
    // the entire session family so both parties are forced to re-authenticate.
    await refreshRepo.revokeFamily(stored.family_id);
    throw new AppError('Refresh token reuse detected. All sessions in this family have been revoked - please log in again.', 401);
  }
  const user = await userRepo.findById(decoded.id);
  if (!user) throw new AppError('User not found', 401);
  const accessToken = generateAccessToken(user);
  const { token: newRefresh, tokenId: newId } = generateRefreshToken(user);
  // Rotation: revoke old + issue new must be atomic. Previously these were two
  // separate writes - if the process died or the DB errored between them, the
  // old token was already revoked but the new one never got created, locking
  // the user out of their session entirely.
  await database.knex.transaction(async (trx) => {
    await refreshRepo.revokeByTokenId(decoded.tokenId, trx);
    await refreshRepo.createToken({
      user_id: user.id,
      token_id: newId,
      token: newRefresh,
      family_id: stored.family_id,
      expires_at: new Date(Date.now() + 7*24*60*60*1000),
      is_revoked: false
    }, trx);
  });
  return { accessToken, refreshToken: newRefresh };
}

async function logout(userId, tokenId) {
  if (tokenId) await refreshRepo.revokeByTokenId(tokenId);
  else await refreshRepo.revokeAllForUser(userId);
}

async function verifyEmail(token) {
  const user = await userRepo.findByVerificationToken(hashToken(token));
  if (!user) throw new AppError('Invalid verification token', 400);
  await userRepo.update(user.id, { is_email_verified: true, email_verification_token: null });
  return { message: 'Email verified' };
}

async function forgotPassword(email) {
  const user = await userRepo.findByEmail(email);
  if (!user) return { message: 'If email exists, reset link sent' };
  const resetToken = uuidv4();
  const expires = new Date(Date.now() + 60*60*1000);
  await userRepo.update(user.id, { password_reset_token: hashToken(resetToken), password_reset_expires: expires });
  await addJob('emailQueue', 'passwordReset', { userId: user.id, token: resetToken });
  return { message: 'If email exists, reset link sent' };
}

async function resetPassword(token, newPassword) {
  const user = await userRepo.findByResetToken(hashToken(token));
  if (!user) throw new AppError('Invalid token', 400);
  if (new Date(user.password_reset_expires) < new Date()) throw new AppError('Token expired', 400);
  const hashed = await hashPassword(newPassword);
  // Atomic: password change + session revocation must both happen or neither -
  // otherwise a failed revoke after a successful password change would leave
  // old sessions valid despite the password having changed.
  await database.knex.transaction(async (trx) => {
    await userRepo.update(user.id, { password: hashed, password_reset_token: null, password_reset_expires: null }, trx);
    await refreshRepo.revokeAllForUser(user.id, trx);
  });
  return { message: 'Password reset successful' };
}

async function changePassword(userId, currentPassword, newPassword) {
  const user = await userRepo.findById(userId);
  const valid = await comparePassword(currentPassword, user.password);
  if (!valid) throw new AppError('Current password incorrect', 400);
  const hashed = await hashPassword(newPassword);
  await database.knex.transaction(async (trx) => {
    await userRepo.update(userId, { password: hashed }, trx);
    await refreshRepo.revokeAllForUser(userId, trx);
  });
  return { message: 'Password changed' };
}

module.exports = { register, login, refresh, logout, verifyEmail, forgotPassword, resetPassword, changePassword };
