
exports.up = async function(knex) {
  await knex.schema.createTable('users', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.string('name').notNullable();
    table.enum('role', ['Admin','DevOps Engineer','Developer','Viewer']).defaultTo('Developer');
    table.boolean('is_email_verified').defaultTo(false);
    table.string('email_verification_token').nullable();
    table.string('password_reset_token').nullable();
    table.timestamp('password_reset_expires').nullable();
    table.integer('failed_login_attempts').defaultTo(0);
    table.boolean('is_locked').defaultTo(false);
    table.timestamp('locked_until').nullable();
    table.timestamp('deleted_at').nullable();
    table.timestamps(true, true);
    table.index(['email']);
    table.index(['role']);
    table.index(['deleted_at']);
  });
};
exports.down = async function(knex) { await knex.schema.dropTableIfExists('users'); };
