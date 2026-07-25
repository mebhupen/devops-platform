
const Joi = require('joi');

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required()
});

module.exports = { idParamSchema };
