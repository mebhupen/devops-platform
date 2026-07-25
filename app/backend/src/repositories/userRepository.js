
const BaseRepository = require('./baseRepository');

class UserRepository extends BaseRepository {
  constructor() { super('users'); }
  async findByEmail(email, includeDeleted=false) {
    const q = this.query().where({ email }).first();
    if (!includeDeleted) q.whereNull('deleted_at');
    return q;
  }
  async findByVerificationToken(token) {
    return this.query().where({ email_verification_token: token }).whereNull('deleted_at').first();
  }
  async findByResetToken(token) {
    return this.query().where({ password_reset_token: token }).whereNull('deleted_at').first();
  }
  async incrementFailedAttempts(id) {
    return this.query().where({ id }).increment('failed_login_attempts', 1);
  }
  async resetFailedAttempts(id) {
    return this.query().where({ id }).update({ failed_login_attempts: 0, locked_until: null });
  }
  async lockAccount(id, until) {
    return this.query().where({ id }).update({ is_locked: true, locked_until: until });
  }
}
module.exports = new UserRepository();
