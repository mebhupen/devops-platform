
exports.up = async function(knex) {
  await knex.schema.createTable('refresh_tokens', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('token_id').notNullable().unique();
    table.text('token').notNullable();
    table.timestamp('expires_at').notNullable();
    table.boolean('is_revoked').defaultTo(false);
    table.timestamp('deleted_at').nullable();
    table.timestamps(true, true);
    table.index(['user_id']);
    table.index(['token_id']);
    table.index(['expires_at']);
  });
};
exports.down = async function(knex) { await knex.schema.dropTableIfExists('refresh_tokens'); };
