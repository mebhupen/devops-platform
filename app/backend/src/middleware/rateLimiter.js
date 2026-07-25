const rateLimit = require('express-rate-limit');

const globalRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60*1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 1000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path.includes('/health'),
  message: { success: false, message: 'Too many requests, try later' }
});

const authRateLimiter = rateLimit({
  windowMs: 15*60*1000,
  max: 50,
  message: { success: false, message: 'Too many auth attempts' }
});

module.exports = { globalRateLimiter, authRateLimiter };
