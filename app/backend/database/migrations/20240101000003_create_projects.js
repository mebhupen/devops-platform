
exports.up = async function(knex) {
  await knex.schema.createTable('projects', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.text('description').nullable();
    table.enum('status', ['active','archived','inactive']).defaultTo('active');
    table.string('repository_url').nullable();
    table.uuid('created_by').references('id').inTable('users');
    table.timestamp('deleted_at').nullable();
    table.timestamps(true, true);
    table.index(['status']);
    table.index(['deleted_at']);
  });
};
exports.down = async function(knex) { await knex.schema.dropTableIfExists('projects'); };
