
exports.up = async function(knex) {
  await knex.schema.createTable('deployments', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('project_id').references('id').inTable('projects').onDelete('CASCADE');
    table.string('environment').notNullable();
    table.enum('status', ['queued','cloning','building','testing','deploying','success','failed']).defaultTo('queued');
    table.jsonb('metadata').defaultTo('{}');
    table.uuid('created_by').references('id').inTable('users');
    table.timestamp('deleted_at').nullable();
    table.timestamps(true, true);
    table.index(['project_id']);
    table.index(['status']);
  });
};
exports.down = async function(knex) { await knex.schema.dropTableIfExists('deployments'); };
