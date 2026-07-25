
const Joi = require('joi');
const createProjectSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).allow('', null),
  status: Joi.string().valid('active','archived','inactive').default('active'),
  repository_url: Joi.string().uri().allow('', null)
});
const updateProjectSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  description: Joi.string().max(500).allow('', null),
  status: Joi.string().valid('active','archived','inactive'),
  repository_url: Joi.string().uri().allow('', null)
}).min(1);

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required()
});

module.exports = { createProjectSchema, updateProjectSchema, idParamSchema };
