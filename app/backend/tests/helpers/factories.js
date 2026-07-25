
const { hashPassword } = require('../../src/utils/password');
const userRepo = require('../../src/repositories/userRepository');

// Creates a user directly via the repository, bypassing the public
// /auth/register endpoint (which intentionally can't grant privileged
// roles). Used to seed Admin/DevOps Engineer test users, and pre-verifies
// the email so login tests don't need to go through the email flow.
async function createUser({ email, password = 'Password123!', role = 'Developer', verified = true }) {
  const hashed = await hashPassword(password);
  const user = await userRepo.create({
    email,
    password: hashed,
    name: 'Test User',
    role,
    is_email_verified: verified,
    failed_login_attempts: 0,
    is_locked: false,
  });
  return { ...user, rawPassword: password };
}

module.exports = { createUser };
