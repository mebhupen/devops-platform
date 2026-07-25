
exports.seed = async function(knex) {
  const bcrypt = require('bcryptjs');
  const hashed = await bcrypt.hash('Admin@123', 12);
  const existing = await knex('users').where({ email: 'admin@devops.local' }).first();
  if (!existing) {
    await knex('users').insert({
      email: 'admin@devops.local',
      password: hashed,
      name: 'Admin User',
      role: 'Admin',
      is_email_verified: true
    });
  }
};
