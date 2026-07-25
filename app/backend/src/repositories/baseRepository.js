
class BaseRepository {
  constructor(tableName, knex) {
    this.table = tableName;
    this.getKnex = () => knex || require('../config/database').knex;
  }

  query(trx) { return (trx || this.getKnex())(this.table); }

  async findById(id, { includeDeleted = false, trx } = {}) {
    const q = this.query(trx).where({ id }).first();
    if (!includeDeleted) q.whereNull('deleted_at');
    return q;
  }

  async findAll({ page=1, limit=10, offset=0, search=null, searchFields=[], sortBy='created_at', sortOrder='desc', filters={}, includeDeleted=false } = {}) {
    const knex = this.getKnex();
    const baseQuery = knex(this.table);
    if (!includeDeleted) baseQuery.whereNull('deleted_at');
    for (const [k,v] of Object.entries(filters)) {
      if (v !== undefined && v !== null && v !== '') baseQuery.where(k, v);
    }
    if (search && searchFields.length) {
      baseQuery.where(builder => {
        searchFields.forEach((field, idx) => {
          if (idx===0) builder.whereILike(field, `%${search}%`);
          else builder.orWhereILike(field, `%${search}%`);
        });
      });
    }
    const countResult = await baseQuery.clone().count('* as total').first();
    const total = parseInt(countResult.total);
    const data = await baseQuery.clone().orderBy(sortBy, sortOrder).limit(limit).offset(offset);
    return { data, total };
  }

  async create(data) {
    const [row] = await this.query().insert(data).returning('*');
    return row;
  }

  async update(id, data, trx) {
    const [row] = await this.query(trx).where({ id }).whereNull('deleted_at').update({ ...data, updated_at: new Date() }).returning('*');
    return row;
  }

  async softDelete(id) {
    const [row] = await this.query().where({ id }).whereNull('deleted_at').update({ deleted_at: new Date() }).returning('*');
    return row;
  }

  async restore(id) {
    const [row] = await this.query().where({ id }).whereNotNull('deleted_at').update({ deleted_at: null }).returning('*');
    return row;
  }

  async hardDelete(id) {
    return this.query().where({ id }).del();
  }
}
module.exports = BaseRepository;
