
const notificationRepo = require('../repositories/notificationRepository');
const { addJob } = require('../jobs/queues');
const { parsePagination, buildMeta } = require('../utils/pagination');
const AppError = require('../utils/AppError');

// Only these are safe/intended to be filtered or sorted on via the API -
// parsePagination() otherwise turns any query key/value into a raw
// WHERE/ORDER BY clause, which crashes with an unmasked DB error on a typo.
const ALLOWED_FILTERS = ['is_read', 'type'];
const ALLOWED_SORT_FIELDS = ['created_at', 'is_read', 'type'];

function pickAllowedFilters(filters) {
  const safe = {};
  for (const key of ALLOWED_FILTERS) {
    if (filters[key] !== undefined) safe[key] = filters[key];
  }
  return safe;
}

async function listNotifications(userId, query) {
  const { page, limit, offset, search, sortBy, sortOrder, filters } = parsePagination(query);
  const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'created_at';
  const safeFilters = pickAllowedFilters(filters);
  const { data, total } = await notificationRepo.findByUser(userId, { page, limit, offset, search, sortBy: safeSortBy, sortOrder, filters: safeFilters });
  return { data, pagination: buildMeta(total, page, limit) };
}

async function markAsRead(id, userId) {
  const notif = await notificationRepo.markAsRead(id, userId);
  // markAsRead's WHERE clause matches on both id AND user_id, so this
  // covers "doesn't exist" and "belongs to someone else" the same way -
  // previously this fell through to a 200 with null data instead of a 404.
  if (!notif) throw new AppError('Notification not found', 404);
  return notif;
}

async function createNotification({ user_id, title, message, type='info', channel='database' }) {
  const notif = await notificationRepo.create({ user_id, title, message, type, channel, is_read: false });
  // Queue realtime broadcast
  await addJob('notificationQueue', 'broadcast', { notification: notif });
  return notif;
}

async function createBulkNotification(userIds, payload) {
  const promises = userIds.map(id => createNotification({ ...payload, user_id: id }));
  return Promise.all(promises);
}

module.exports = { listNotifications, markAsRead, createNotification, createBulkNotification };
