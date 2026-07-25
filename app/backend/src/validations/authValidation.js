const Joi = require('joi');

// NOTE: Public self-registration must never allow choosing a privileged role.
// 'Admin' and 'DevOps Engineer' are intentionally excluded here - those roles
// must only be granted by an existing Admin through a separate, authenticated
// admin-only endpoint (not yet implemented - flagged for a future user-management
// module). Previously this schema allowed 'Admin' here, which let anyone
// register themselves as an administrator.
const registerSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(8).max(128).required(),
  name: Joi.string().min(2).max(100).required(),
  role: Joi.string().valid('Developer','Viewer').default('Developer')
});

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().required()
});

const refreshSchema = Joi.object({ refreshToken: Joi.string().required() });
const forgotSchema = Joi.object({ email: Joi.string().email({ tlds: { allow: false } }).required() });
const resetSchema = Joi.object({ token: Joi.string().required(), password: Joi.string().min(8).required() });
const changePasswordSchema = Joi.object({ currentPassword: Joi.string().required(), newPassword: Joi.string().min(8).required() });
const verifyEmailSchema = Joi.object({ token: Joi.string().required() });

module.exports = { registerSchema, loginSchema, refreshSchema, forgotSchema, resetSchema, changePasswordSchema, verifyEmailSchema };
