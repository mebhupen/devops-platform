
exports.up = async function(knex) {
  // --- users: token lookup columns are queried directly on every
  // email-verify / password-reset request but were never indexed ---
  await knex.schema.alterTable('users', table => {
    table.index(['email_verification_token']);
    table.index(['password_reset_token']);
  });

  // --- projects: created_by is a FK but Postgres doesn't auto-index FK
  // columns, and it had no ON DELETE action (defaulted to RESTRICT) ---
  await knex.schema.alterTable('projects', table => {
    table.dropForeign(['created_by']);
  });
  await knex.schema.alterTable('projects', table => {
    table.foreign('created_by').references('id').inTable('users').onDelete('SET NULL');
    table.index(['created_by']);
  });

  // --- deployments: same created_by issue ---
  await knex.schema.alterTable('deployments', table => {
    table.dropForeign(['created_by']);
  });
  await knex.schema.alterTable('deployments', table => {
    table.foreign('created_by').references('id').inTable('users').onDelete('SET NULL');
    table.index(['created_by']);
  });

  // --- refresh_tokens: token_id already gets an index for free from its
  // unique() constraint - the explicit index(['token_id']) below was a
  // redundant duplicate, doubling write overhead for no read benefit ---
  await knex.schema.alterTable('refresh_tokens', table => {
    table.dropIndex(['token_id']);
  });

  // --- notifications: composite index matching the actual access pattern
  // (findByUser filtered by is_read, ordered by created_at) ---
  await knex.schema.alterTable('notifications', table => {
    table.index(['user_id', 'is_read', 'created_at']);
  });
};

exports.down = async function(knex) {
  await knex.schema.alterTable('notifications', table => {
    table.dropIndex(['user_id', 'is_read', 'created_at']);
  });

  await knex.schema.alterTable('refresh_tokens', table => {
    table.index(['token_id']);
  });

  await knex.schema.alterTable('deployments', table => {
    table.dropForeign(['created_by']);
    table.dropIndex(['created_by']);
  });
  await knex.schema.alterTable('deployments', table => {
    table.foreign('created_by').references('id').inTable('users');
  });

  await knex.schema.alterTable('projects', table => {
    table.dropForeign(['created_by']);
    table.dropIndex(['created_by']);
  });
  await knex.schema.alterTable('projects', table => {
    table.foreign('created_by').references('id').inTable('users');
  });

  await knex.schema.alterTable('users', table => {
    table.dropIndex(['email_verification_token']);
    table.dropIndex(['password_reset_token']);
  });
};
