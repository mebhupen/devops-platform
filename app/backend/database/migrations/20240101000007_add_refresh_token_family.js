
exports.up = async function(knex) {
  await knex.schema.alterTable('refresh_tokens', table => {
    // Tokens issued from the same login session share a family_id. On
    // rotation the new token keeps its predecessor's family_id. If a
    // revoked (already-rotated-out) token is ever presented again, that's
    // a strong signal of token theft/replay - we revoke the entire family,
    // not just the one token, forcing re-authentication for that session.
    table.uuid('family_id').nullable();
    table.index(['family_id']);
  });
};

exports.down = async function(knex) {
  await knex.schema.alterTable('refresh_tokens', table => {
    table.dropIndex(['family_id']);
    table.dropColumn('family_id');
  });
};
