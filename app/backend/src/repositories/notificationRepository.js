
const BaseRepository = require('./baseRepository');
class NotificationRepository extends BaseRepository {
  constructor() { super('notifications'); }
  async findByUser(userId, opts) {
    return this.findAll({ ...opts, filters: { ...opts.filters, user_id: userId } });
  }
  async markAsRead(id, userId) {
    const [row] = await this.query().where({ id, user_id: userId }).update({ is_read: true }).returning('*');
    return row;
  }
}
module.exports = new NotificationRepository();
