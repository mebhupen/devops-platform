
// Fields that must never leave the API in a response body.
// - password: obviously never returned
// - email_verification_token / password_reset_token / password_reset_expires:
//     these are account-takeover secrets, only ever sent via email
// - failed_login_attempts / is_locked / locked_until: internal auth-state, not user-facing
const SENSITIVE_FIELDS = [
  'password',
  'email_verification_token',
  'password_reset_token',
  'password_reset_expires',
  'failed_login_attempts',
  'is_locked',
  'locked_until',
];

function sanitizeUser(user) {
  if (!user) return user;
  const safe = { ...user };
  for (const field of SENSITIVE_FIELDS) {
    delete safe[field];
  }
  return safe;
}

module.exports = { sanitizeUser };
