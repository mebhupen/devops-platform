
function parsePagination(query) {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit) || 10, 1), 100);
  const offset = (page - 1) * limit;
  const search = query.search?.trim() || null;
  const sortBy = query.sortBy || query.sort || 'created_at';
  const sortOrder = (query.sortOrder || query.order || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc';
  const filters = {};
  const exclude = ['page','limit','search','sort','sortBy','sortOrder','order'];
  for (const [k,v] of Object.entries(query)) {
    if (!exclude.includes(k) && v !== undefined && v !== '') filters[k] = v;
  }
  return { page, limit, offset, search, sortBy, sortOrder, filters };
}

function buildMeta(total, page, limit) {
  const totalPages = Math.ceil(total / limit);
  return { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 };
}

module.exports = { parsePagination, buildMeta };
