
const AppError = require('../utils/AppError');

const ROLES = {
  ADMIN: 'Admin',
  DEVOPS: 'DevOps Engineer',
  DEVELOPER: 'Developer',
  VIEWER: 'Viewer'
};

const ROLE_HIERARCHY = {
  [ROLES.ADMIN]: 4,
  [ROLES.DEVOPS]: 3,
  [ROLES.DEVELOPER]: 2,
  [ROLES.VIEWER]: 1
};

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return next(new AppError('Not authenticated', 401));
    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      return next(new AppError(`Forbidden: Requires one of [${allowedRoles.join(', ')}]`, 403));
    }
    next();
  };
}

function authorizeMinRole(minRole) {
  return (req, res, next) => {
    if (!req.user) return next(new AppError('Not authenticated', 401));
    const userLevel = ROLE_HIERARCHY[req.user.role] || 0;
    const minLevel = ROLE_HIERARCHY[minRole] || 0;
    if (userLevel < minLevel) return next(new AppError(`Forbidden: Requires at least ${minRole}`, 403));
    next();
  };
}

module.exports = { authorize, authorizeMinRole, ROLES };
