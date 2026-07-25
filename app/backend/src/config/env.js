
const Joi = require('joi');

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development','production','test').default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  REDIS_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  BCRYPT_ROUNDS: Joi.number().default(12),
  CORS_ORIGIN: Joi.string().default('*'),
  EMAIL_HOST: Joi.string().allow(''),
  EMAIL_PORT: Joi.number().allow(''),
  EMAIL_USER: Joi.string().allow(''),
  EMAIL_PASS: Joi.string().allow(''),
  EMAIL_FROM: Joi.string().default('noreply@devops.local'),
  FRONTEND_URL: Joi.string().default('http://localhost:5173'),
}).unknown(true);

function validateEnv() {
  const { error } = envSchema.validate(process.env);
  if (error) {
    throw new Error(`Env validation error: ${error.message}`);
  }
  if (process.env.NODE_ENV === 'production') {
    // Previously this only matched the exact string
    // 'super-strong-jwt-secret-min-32-chars', which never equals the actual
    // placeholder shipped in .env.example
    // ('super-strong-jwt-secret-min-32-chars-change-this-now') - so the
    // warning could never fire even when deploying straight from the
    // example file. Match on the shared placeholder prefix instead, and
    // check both secrets.
    const PLACEHOLDER_PREFIX = 'super-strong-jwt-secret-min-32-chars';
    const PLACEHOLDER_REFRESH_PREFIX = 'super-strong-refresh-secret-min-32-chars';
    if (process.env.JWT_SECRET?.startsWith(PLACEHOLDER_PREFIX)) {
      console.warn('WARNING: Using default/placeholder JWT_SECRET in production!');
    }
    if (process.env.JWT_REFRESH_SECRET?.startsWith(PLACEHOLDER_REFRESH_PREFIX)) {
      console.warn('WARNING: Using default/placeholder JWT_REFRESH_SECRET in production!');
    }
  }
}

module.exports = { validateEnv };
