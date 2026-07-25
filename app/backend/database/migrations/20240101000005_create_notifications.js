
exports.up = async function(knex) {
  await knex.schema.createTable('notifications', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('title').notNullable();
    table.text('message').notNullable();
    table.enum('type', ['info','warning','error','success']).defaultTo('info');
    table.enum('channel', ['database','email','both']).defaultTo('database');
    table.boolean('is_read').defaultTo(false);
    table.timestamp('deleted_at').nullable();
    table.timestamps(true, true);
    table.index(['user_id']);
    table.index(['is_read']);
  });
};
exports.down = async function(knex) { await knex.schema.dropTableIfExists('notifications'); };
