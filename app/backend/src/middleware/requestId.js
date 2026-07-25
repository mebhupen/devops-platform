
const { v4: uuidv4 } = require('uuid');
// Loose but bounded validation: UUID-like or short alphanumeric/hyphen
// tokens only. A client-supplied X-Request-Id was previously trusted
// verbatim into logs and the response header with no format or length
// check, which is a log-injection / log-storage-abuse surface (e.g.
// newlines to forge fake log lines, or very large values bloating logs).
const SAFE_REQUEST_ID = /^[a-zA-Z0-9-]{1,64}$/;

function requestIdMiddleware(req, res, next) {
  const incoming = req.headers['x-request-id'];
  const id = (typeof incoming === 'string' && SAFE_REQUEST_ID.test(incoming)) ? incoming : uuidv4();
  req.requestId = id;
  res.locals.requestId = id;
  res.setHeader('X-Request-Id', id);
  next();
}
module.exports = { requestIdMiddleware };
