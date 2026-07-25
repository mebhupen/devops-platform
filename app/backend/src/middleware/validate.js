
const AppError = require('../utils/AppError');

function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false, stripUnknown: true });
    if (error) {
      const errors = error.details.map(d => ({ field: d.path.join('.'), message: d.message }));
      return next(new AppError('Validation failed', 400, errors));
    }
    req[property] = value;
    next();
  };
}

module.exports = { validate };
