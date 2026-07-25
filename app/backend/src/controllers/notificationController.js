
const notificationService = require('../services/notificationService');
const ApiResponse = require('../utils/ApiResponse');

async function list(req, res, next) {
  try {
    const { data, pagination } = await notificationService.listNotifications(req.user.id, req.query);
    return ApiResponse.paginated(res, { data, pagination });
  } catch(e){ next(e); }
}
async function markRead(req, res, next) {
  try { const n = await notificationService.markAsRead(req.params.id, req.user.id); return ApiResponse.success(res, { data: n }); } catch(e){ next(e); }
}
module.exports = { list, markRead };
