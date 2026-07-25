
class ApiResponse {
  static success(res, { message = 'Success', data = null, meta = null, statusCode = 200 }) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta,
      requestId: res.locals?.requestId || res.req?.requestId
    });
  }
  static paginated(res, { message = 'Success', data, pagination, statusCode = 200 }) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta: { pagination },
      requestId: res.locals?.requestId || res.req?.requestId
    });
  }
  static error(res, { message = 'Error', errors = null, statusCode = 500 }) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      requestId: res.locals?.requestId || res.req?.requestId
    });
  }
}
module.exports = ApiResponse;
