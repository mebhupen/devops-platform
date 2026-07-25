
const deploymentService = require('../services/deploymentService');
const ApiResponse = require('../utils/ApiResponse');

async function list(req, res, next) { try { const r = await deploymentService.listDeployments(req.query); return ApiResponse.paginated(res, { data: r.data, pagination: r.pagination }); } catch(e){ next(e);} }
async function create(req, res, next) { try { const d = await deploymentService.createDeployment(req.body, req.user.id); return ApiResponse.success(res, { data: d, statusCode: 201 }); } catch(e){ next(e);} }

module.exports = { list, create };
