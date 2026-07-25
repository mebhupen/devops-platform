
const BaseRepository = require('./baseRepository');
class RefreshTokenRepository extends BaseRepository {
  constructor() { super('refresh_tokens'); }
  // Deliberately does NOT filter is_revoked here - the caller needs to see
  // revoked rows too, to distinguish "token never existed" from "token was
  // already rotated out and is now being replayed" (theft signal).
  async findByTokenId(tokenId, trx) { return this.query(trx).where({ token_id: tokenId }).first(); }
  async revokeByTokenId(tokenId, trx) { return this.query(trx).where({ token_id: tokenId }).update({ is_revoked: true }); }
  async revokeAllForUser(userId, trx) { return this.query(trx).where({ user_id: userId }).update({ is_revoked: true }); }
  // Revokes every token in a rotation family - used when a revoked token is
  // replayed, which is a strong signal that token was stolen: killing the
  // whole family forces re-authentication for that session, covering both
  // the legitimate user's current token and the attacker's.
  async revokeFamily(familyId, trx) {
    if (!familyId) return 0; // legacy tokens issued before family_id existed - nothing to do
    return this.query(trx).where({ family_id: familyId }).update({ is_revoked: true });
  }
  async createToken(data, trx) { const [row] = await this.query(trx).insert(data).returning('*'); return row; }
  async deleteExpired(trx) { return this.query(trx).where('expires_at', '<', new Date()).del(); }
}
module.exports = new RefreshTokenRepository();
