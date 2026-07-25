// Must run before any other require - several config modules read
// process.env at module-load time. Previously only server.js called this,
// so anything importing app.js directly (tests, alternate entry points)
// silently never loaded .env at all. Safe in production/K8s where env vars
// are injected directly and no .env file exists - dotenv just no-ops.
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const xss = require('xss-clean');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const { requestIdMiddleware } = require('./src/middleware/requestId');
const { httpLogger } = require('./src/config/logger');
const { globalRateLimiter } = require('./src/middleware/rateLimiter');
const { errorHandler, notFound } = require('./src/middleware/errorHandler');
const { metricsMiddleware, metricsEndpoint } = require('./src/middleware/metrics');
const swaggerSpec = require('./src/config/swagger');
const routes = require('./src/routes');
const healthController = require('./src/controllers/healthController');

const app = express();

// Trust the reverse proxy / ingress / load balancer this app always runs
// behind in Docker Compose and Kubernetes, so req.ip reflects the real
// client instead of the proxy. Without this, express-rate-limit keys every
// request off the same proxy IP, effectively rate-limiting all clients
// together instead of individually.
// TRUST_PROXY can override the hop count for non-default proxy chains.
if (process.env.TRUST_PROXY !== undefined) {
  const asNum = Number(process.env.TRUST_PROXY);
  app.set('trust proxy', Number.isNaN(asNum) ? process.env.TRUST_PROXY : asNum);
} else {
  app.set('trust proxy', 1);
}

// Security & Core middlewares
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  // This API authenticates via a Bearer token in the Authorization header,
  // not cookies, so CORS credentials (cookies/TLS client certs) are not
  // needed. credentials:true combined with a wildcard origin is also
  // rejected by browsers per spec, so leaving it true with no explicit
  // CORS_ORIGIN configured was a broken/no-op configuration anyway.
  credentials: false
}));
app.use(hpp());
app.use(xss());
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestIdMiddleware);
app.use(httpLogger);
app.use(globalRateLimiter);
app.use(metricsMiddleware);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// Enterprise health endpoints for K8s (root level) - MUST be before /api/v1
app.get('/health', healthController.health);
app.get('/health/live', healthController.liveness);
app.get('/health/ready', healthController.readiness);

// Backward compatibility: also support /healthz
app.get('/healthz', healthController.health);

// API Routes (versioned)
app.use('/api/v1', routes);

// Prometheus metrics endpoint
app.get('/metrics', metricsEndpoint);

// Root
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Enterprise DevOps Platform API v2.0', 
    docs: '/api-docs',
    health: '/health',
    version: 'v1',
    timestamp: new Date().toISOString()
  });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
