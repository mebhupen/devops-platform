
const deploymentRepo = require('../repositories/deploymentRepository');
const projectRepo = require('../repositories/projectRepository');
const { parsePagination, buildMeta } = require('../utils/pagination');
const AppError = require('../utils/AppError');
const { addJob } = require('../jobs/queues');

// Only these are safe/intended to be filtered or sorted on via the API -
// parsePagination() otherwise turns any query key/value into a raw
// WHERE/ORDER BY clause, which crashes with an unmasked DB error on a typo.
const ALLOWED_FILTERS = ['status', 'environment', 'project_id'];
const ALLOWED_SORT_FIELDS = ['environment', 'status', 'created_at', 'updated_at'];

function pickAllowedFilters(filters) {
  const safe = {};
  for (const key of ALLOWED_FILTERS) {
    if (filters[key] !== undefined) safe[key] = filters[key];
  }
  return safe;
}

async function listDeployments(query) {
  const { page, limit, offset, search, sortBy, sortOrder, filters } = parsePagination(query);
  const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'created_at';
  const safeFilters = pickAllowedFilters(filters);
  const { data, total } = await deploymentRepo.findAll({ page, limit, offset, search, searchFields: ['environment','status'], sortBy: safeSortBy, sortOrder, filters: safeFilters });
  return { data, pagination: buildMeta(total, page, limit) };
}

async function createDeployment({ project_id, environment, metadata }, userId) {
  const project = await projectRepo.findById(project_id);
  if (!project) throw new AppError('Project not found', 404);
  // Build the insert payload explicitly rather than spreading the raw request
  // body - previously a client could set id, deleted_at, or any other column
  // directly since the whole body was spread into the insert.
  const deployment = await deploymentRepo.create({
    project_id,
    environment,
    metadata: metadata || {},
    created_by: userId,
    status: 'queued'
  });
  await addJob('deploymentQueue', 'execute', { deploymentId: deployment.id });
  return deployment;
}

async function updateDeploymentStatus(id, status, io) {
  const dep = await deploymentRepo.update(id, { status });
  if (io) io.to(`deployment:${id}`).emit('deployment:status', dep);
  if (io) io.emit('deployment:update', dep);
  return dep;
}

module.exports = { listDeployments, createDeployment, updateDeploymentStatus };
