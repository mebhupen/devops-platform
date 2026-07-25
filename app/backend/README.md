# Enterprise DevOps Platform - Backend v2.0

Production-ready Node.js backend with JWT rotation, RBAC, soft delete, realtime, BullMQ, Redis caching, observability.

## Project Overview
Enterprise DevOps Platform backend powers DevOps with Auth (JWT rotation, lockout, email verify), RBAC (Admin, DevOps Engineer, Developer, Viewer), Projects/Deployments, Realtime (Socket.IO), Jobs (BullMQ+Redis), Logging (Winston), Monitoring (Prometheus).

Stack: Node.js 20, Express 4, PostgreSQL 16, Redis 7, Socket.IO, BullMQ, Winston, prom-client.

## Architecture Diagram
```
Client -> Express (Helmet,CORS,RateLimiter,RequestId,Auth,RBAC) -> Service -> Repository (BaseRepo pagination/search/filter/sort/soft delete) -> PG/Redis -> ApiResponse
       -> Socket.IO (rooms) -> Realtime
       -> BullMQ -> Workers (email, notification, deployment, cleanup)
       -> Prometheus /metrics, Winston logs
```

## Folder Structure
```
backend
├── app.js (middlewares, Swagger, /health, /api/v1)
├── server.js (DB, Redis, queues, sockets, graceful shutdown)
├── Dockerfile (multi-stage, non-root, healthcheck)
├── docker-compose.yml (backend, postgres, redis, prometheus, grafana, pgadmin, volumes, network, healthchecks)
├── k8s/ (namespace, configmap, secret, deployment with probes+resources+RollingUpdate+securityContext, service, ingress TLS, hpa, pdb, networkPolicy)
├── src/config (env Joi, db Knex, redis ioredis, logger Winston, swagger)
├── src/middleware (auth JWT, rbac 4 roles, errorHandler, requestId, validate Joi, rateLimiter, cache Redis, metrics prom-client)
├── src/controllers (auth, project, deployment, notification, health enterprise format)
├── src/routes (/api/v1/* versioned, /health root for K8s)
├── src/services (auth lockout+rotation, project cache invalidation, deployment queue+socket)
├── src/repositories (BaseRepository pagination/search ILIKE/filter/sort/soft delete)
├── src/utils (ApiResponse consistent, AppError, pagination, token rotation, password bcrypt)
├── src/jobs (BullMQ queues+workers)
├── src/schedulers (node-cron hourly token cleanup, daily notification cleanup)
├── src/realtime (Socket.IO auth rooms)
├── database/migrations (users with failed_attempts, locked_until, deleted_at, refresh_tokens, projects, deployments, notifications)
└── tests
```

## Installation
```bash
git clone https://github.com/mebhupen/enterprise-devops-platform
cd app/backend
cp .env.example .env
npm install
npm run migrate
npm run seed
npm run dev
# API http://localhost:3000
# Docs http://localhost:3000/api-docs
# Health http://localhost:3000/health
```

## Docker
Multi-stage, non-root nodejs:1001, healthcheck.
```bash
docker build -t devops-backend:latest .
docker run -p 3000:3000 --env-file .env devops-backend:latest
```
.dockerignore excludes node_modules, logs, .env, git, tests, k8s.

## Docker Compose
Full stack with observability:
```bash
docker-compose up --build
```
Services:
- backend:3000 healthcheck /health/live, depends_on postgres+redis healthy, restart unless-stopped, volume backend_logs
- postgres:5432 healthcheck pg_isready, volume postgres_data
- redis:6379 healthcheck redis-cli ping, volume redis_data, appendonly
- prometheus:9090 volume prometheus_data scrapes /metrics
- grafana:3001 admin/admin volume grafana_data
- pgadmin:5050 admin@devops.local/admin volume pgadmin_data
Named volumes, devops-network bridge, restart policies, depends_on condition.

## Kubernetes
- namespace: devops-platform
- configmap: NODE_ENV, PORT, CORS, JWT expiry, FRONTEND_URL
- secret: DATABASE_URL, REDIS_URL, JWT secrets, EMAIL
- deployment: 3 replicas, RollingUpdate maxSurge1 maxUnavailable1, resources requests cpu250m mem256Mi limits cpu1000m mem512Mi, probes readiness /health/ready 15s delay 10s period, liveness /health/live 30s delay 20s period, startup /health/live 10s delay 5s period 12 failures, securityContext runAsNonRoot 1001 drop ALL
- service: ClusterIP 80->3000
- ingress: api.devops.example.com TLS nginx
- hpa: min2 max10 CPU70% MEM80%
- podDisruptionBudget: minAvailable 2
- networkPolicy: ingress from same namespace+ingress-nginx to 3000, egress to postgres 5432 redis 6379 DNS 53 HTTPS 443/80
Deploy:
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml
kubectl apply -f k8s/podDisruptionBudget.yaml
kubectl apply -f k8s/networkPolicy.yaml
```

## Swagger
At /api-docs OpenAPI 3.0, every endpoint has description, request example, response example, error responses.

## Monitoring
- Winston: console colorized + daily rotate combined-*.log error-*.log http-*.log 20m max 7-30d
- Health: GET /health {status,uptime,timestamp,version,checks:{api,database,redis}} 200/503, GET /health/live {status:ok,uptime,timestamp,message:Alive}, GET /health/ready {status,uptime,timestamp,checks,message} 200/503, also /api/v1/health/* backward compat
- Prometheus: /metrics histogram http_request_duration_seconds counter http_requests_total + default metrics
- Grafana, HTTP logging

## API Endpoints
Versioned /api/v1 except infra /health, /metrics, /api-docs, /.
Auth: POST /api/v1/auth/register, login, refresh (rotation), logout, verify-email, forgot-password, reset-password, change-password, GET me
Projects: GET /api/v1/projects?page=1&limit=10&search=test&status=active&sortBy=created_at&sortOrder=desc, GET :id, POST (Admin,DevOps,Developer), PUT (Admin,DevOps), DELETE soft (Admin), POST :id/restore
Deployments: GET, POST
Notifications: GET, PATCH :id/read
Health: GET /health, /health/live, /health/ready and /api/v1/health/*
Infra: GET /metrics, /api-docs, /

## Screenshots Placeholders
- [ ] Swagger UI
- [ ] Grafana dashboard
- [ ] Prometheus targets
- [ ] K8s pods
- [ ] Docker Compose logs

## Environment Variables
See .env.example: NODE_ENV, PORT, DATABASE_URL, REDIS_URL, JWT_SECRET 32+ chars, JWT_REFRESH_SECRET 32+, JWT_EXPIRES_IN 15m, JWT_REFRESH_EXPIRES_IN 7d, BCRYPT_ROUNDS 12, CORS_ORIGIN, EMAIL_HOST/PORT/USER/PASS/FROM, FRONTEND_URL

## Deployment Guide
1. Env: cp .env.example .env set strong secrets
2. Compose: docker-compose up --build -d, check ps, logs
3. K8s: update secrets, apply manifests, check pods, hpa, exec wget /health
4. CI/CD: build push image, update deployment, rollout restart
5. Monitoring: import Grafana dashboards, alerts for 503 high CPU

## ESLint & Prettier
ESLint Node.js CommonJS Express, npm run lint, lint:fix. Prettier .prettierrc singleQuote tabWidth2 printWidth100.

## Production Readiness
Env validation Joi, graceful shutdown SIGTERM/SIGINT close server redis knex 10s forced, Request ID X-Request-Id, centralized error handler, consistent ApiResponse, security Helmet CORS HPP XSS-clean rate limiting Joi bcrypt JWT rotation lockout non-root NetworkPolicy PDB securityContext, performance Redis cache Knex pool BullMQ compression pagination cap 100 indexes.
