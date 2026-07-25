
const AppError = require('../utils/AppError');
const { logger } = require('../config/logger');
const ApiResponse = require('../utils/ApiResponse');

function notFound(req, res, next) {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational !== undefined ? err.isOperational : false;

  logger.error(err.message, {
    statusCode,
    stack: err.stack,
    requestId: req.requestId,
    path: req.originalUrl,
    method: req.method,
    isOperational
  });

  if (!isOperational && process.env.NODE_ENV === 'production') {
    return ApiResponse.error(res, { message: 'Internal Server Error', statusCode: 500 });
  }

  return ApiResponse.error(res, {
    message: err.message || 'Internal Server Error',
    errors: err.errors || null,
    statusCode
  });
}

module.exports = { notFound, errorHandler };
