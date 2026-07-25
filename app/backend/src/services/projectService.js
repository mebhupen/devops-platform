
const projectRepo = require('../repositories/projectRepository');
const { parsePagination, buildMeta } = require('../utils/pagination');
const cacheService = require('./cacheService');
const AppError = require('../utils/AppError');

// Only these columns are safe/intended to be filtered or sorted on via the API.
// parsePagination() otherwise turns *any* query string key into a raw WHERE
// clause and *any* sortBy value into a raw ORDER BY column, which previously
// meant a typo'd or unexpected query param would crash with a raw DB error.
const ALLOWED_FILTERS = ['status'];
const ALLOWED_SORT_FIELDS = ['name', 'status', 'created_at', 'updated_at'];

function pickAllowedFilters(filters) {
  const safe = {};
  for (const key of ALLOWED_FILTERS) {
    if (filters[key] !== undefined) safe[key] = filters[key];
  }
  return safe;
}

async function listProjects(query) {
  const { page, limit, offset, search, sortBy, sortOrder, filters } = parsePagination(query);
  const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'created_at';
  const safeFilters = pickAllowedFilters(filters);
  const { data, total } = await projectRepo.findAll({ page, limit, offset, search, searchFields: ['name','description'], sortBy: safeSortBy, sortOrder, filters: safeFilters });
  const meta = buildMeta(total, page, limit);
  return { data, pagination: meta };
}

async function getProject(id) {
  const project = await projectRepo.findById(id);
  if (!project) throw new AppError('Project not found', 404);
  return project;
}

async function createProject(data, userId) {
  const project = await projectRepo.create({ ...data, created_by: userId });
  await cacheService.del('projects:*');
  return project;
}

async function updateProject(id, data) {
  const existing = await projectRepo.findById(id);
  if (!existing) throw new AppError('Project not found', 404);
  const updated = await projectRepo.update(id, data);
  await cacheService.del('projects:*');
  return updated;
}

async function deleteProject(id) {
  const existing = await projectRepo.findById(id);
  if (!existing) throw new AppError('Project not found', 404);
  await projectRepo.softDelete(id);
  await cacheService.del('projects:*');
  return { message: 'Deleted' };
}

async function restoreProject(id) {
  const restored = await projectRepo.restore(id);
  if (!restored) throw new AppError('Project not found or not deleted', 404);
  await cacheService.del('projects:*');
  return restored;
}

module.exports = { listProjects, getProject, createProject, updateProject, deleteProject, restoreProject };
