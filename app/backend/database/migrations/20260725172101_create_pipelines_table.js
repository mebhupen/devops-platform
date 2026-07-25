exports.up = function(knex) {
  return knex.schema.createTable('pipelines', function(t){
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('project_id').references('id').inTable('projects').onDelete('CASCADE');
    t.string('name').notNullable();
    t.string('status').defaultTo('idle');
    t.jsonb('config').defaultTo('{}');
    t.timestamps(true,true);
  });
};
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('pipelines');
};
