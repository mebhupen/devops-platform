
const Joi = require('joi');

const createDeploymentSchema = Joi.object({
  project_id: Joi.string().uuid().required(),
  environment: Joi.string().min(2).max(50).required(),
  metadata: Joi.object().unknown(true).default({})
});

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required()
});

module.exports = { createDeploymentSchema, idParamSchema };
