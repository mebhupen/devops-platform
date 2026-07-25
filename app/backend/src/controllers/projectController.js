
const projectService = require('../services/projectService');
const ApiResponse = require('../utils/ApiResponse');

async function list(req, res, next) { try { const { data, pagination } = await projectService.listProjects(req.query); return ApiResponse.paginated(res, { data, pagination }); } catch(e){ next(e);} }
async function getOne(req, res, next) { try { const p = await projectService.getProject(req.params.id); return ApiResponse.success(res, { data: p }); } catch(e){ next(e);} }
async function create(req, res, next) { try { const p = await projectService.createProject(req.body, req.user.id); return ApiResponse.success(res, { data: p, statusCode: 201 }); } catch(e){ next(e);} }
async function update(req, res, next) { try { const p = await projectService.updateProject(req.params.id, req.body); return ApiResponse.success(res, { data: p }); } catch(e){ next(e);} }
async function remove(req, res, next) { try { const r = await projectService.deleteProject(req.params.id); return ApiResponse.success(res, { message: r.message }); } catch(e){ next(e);} }
async function restore(req, res, next) { try { const p = await projectService.restoreProject(req.params.id); return ApiResponse.success(res, { data: p }); } catch(e){ next(e);} }

module.exports = { list, getOne, create, update, remove, restore };
