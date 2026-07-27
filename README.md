# 🚀 Enterprise DevOps Platform

<p align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?style=for-the-badge&logo=vite)
![NodeJS](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-API-black?style=for-the-badge&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-Cache-red?style=for-the-badge&logo=redis)
![Docker](https://img.shields.io/badge/Docker-Container-2496ED?style=for-the-badge&logo=docker)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Orchestration-326CE5?style=for-the-badge&logo=kubernetes)
![Prometheus](https://img.shields.io/badge/Prometheus-Monitoring-E6522C?style=for-the-badge&logo=prometheus)
![Jest](https://img.shields.io/badge/Jest-Testing-C21325?style=for-the-badge&logo=jest)

</p>

---

# 📖 Overview

Enterprise DevOps Platform is a production-inspired full-stack DevOps management application built to simulate real-world software deployment workflows.

The platform enables DevOps engineers and administrators to manage projects, deployments, users, pipelines, queues, monitoring, notifications, Docker resources, and Kubernetes workloads from a centralized dashboard.

Unlike a basic CRUD application, this project follows enterprise software architecture with layered backend design, authentication, authorization, monitoring, caching, background jobs, testing, and containerized deployment.

---

# ✨ Key Features

## 🔐 Authentication & Security

- JWT Authentication
- Refresh Token Support
- Role Based Access Control (RBAC)
- Protected Routes
- Password Hashing
- Request Validation
- API Rate Limiting
- Secure Middleware
- Error Handling

---

## 📊 Dashboard

- Deployment Statistics
- System Health
- Recent Deployments
- Activity Timeline
- Alerts
- Cluster Status
- Charts
- Monitoring Widgets

---

## 📁 Project Management

- Create Projects
- Update Projects
- Delete Projects
- Project Status
- Search Projects
- Deployment History

---

## 🚀 Deployment Management

- Deployment Dashboard
- Deployment History
- Deployment Status
- Deployment Monitoring
- Deployment Statistics

---

## 🔄 Pipeline Management

- CI/CD Pipeline List
- Pipeline Status
- Pipeline Monitoring
- Pipeline Dashboard

---

## 👥 User Management

- User Listing
- User Roles
- Profile Management
- Role Assignment
- Permission Based Access

---

## 🔔 Notifications

- Notification Center
- Real-Time Updates
- Notification History

---

## 📦 Docker Management

- Container Dashboard
- Docker Statistics
- Docker Events
- Running Containers
- Quick Actions

---

## ☸ Kubernetes

- Kubernetes Dashboard
- Cluster Overview
- Namespace Support
- Deployment Monitoring

---

## 📈 Monitoring

- Prometheus Integration
- Metrics Middleware
- Health Check API
- System Monitoring
- Logging

---

## ⚡ Background Jobs

- Queue Management
- Worker Services
- Job Scheduler
- Async Processing

---

# 🏗 Architecture

```

                        +--------------------+
                        |   React Frontend   |
                        +---------+----------+
                                  |
                           Nginx Reverse Proxy
                                  |
                    +-------------+-------------+
                    |                           |
              Express REST API             Socket.IO
                    |
        +-----------+-----------+
        |           |           |
    PostgreSQL    Redis     Background Jobs
        |           |           |
        +-----------+-----------+
                    |
              Monitoring Layer
                    |
               Prometheus

```

---

# 🛠 Technology Stack

## Frontend

- React
- Vite
- React Context API
- React Router
- Axios
- Charts
- Responsive UI

---

## Backend

- Node.js
- Express.js
- Knex.js
- JWT
- Redis
- Socket.IO
- Middleware Architecture

---

## Database

- PostgreSQL
- Knex Migrations
- Database Seeding

---

## DevOps

- Docker
- Docker Compose
- Kubernetes
- Nginx
- Prometheus

---

## Testing

- Jest
- Unit Testing
- Integration Testing

---

# 📂 Project Structure

```

devops-platform
│
├── app
│   ├── frontend
│   └── backend
│
├── docker-compose.yml
├── nginx
├── monitoring
├── k8s
├── LICENSE
└── README.md

```

---

# 📁 Backend Structure

```

backend
│
├── controllers
├── services
├── repositories
├── routes
├── middleware
├── validations
├── config
├── realtime
├── schedulers
├── jobs
├── utils
├── database
│   ├── migrations
│   └── seeds
└── tests

```

---

# 🎨 Frontend Structure

```

frontend
│
├── components
├── pages
├── api
├── context
├── routes
├── hooks
├── services
├── theme
└── utils

```

---

# 🚀 Getting Started

## Prerequisites

Install the following software:

- Node.js 20+
- npm
- Docker
- Docker Compose
- PostgreSQL
- Redis
- Git

---

# 📥 Clone Repository

```bash
git clone https://github.com/mebhupen/devops-platform.git

cd devops-platform
```

---

# ⚙ Backend Setup

```bash
cd app/backend

npm install
```

Create environment file

```env
PORT=5000

DATABASE_URL=postgresql://username:password@localhost:5432/devops_platform

JWT_SECRET=your-secret

REDIS_URL=redis://localhost:6379
```

Run migrations

```bash
npm run migrate
```

Seed admin user

```bash
npm run seed
```

Start backend

```bash
npm run dev
```

---

# 🎨 Frontend Setup

```bash
cd app/frontend

npm install

npm run dev
```

Frontend runs at

```
http://localhost:5173
```

Backend runs at

```
http://localhost:5000
```

---

# 🐳 Running with Docker

```bash
docker compose up --build
```

To stop

```bash
docker compose down
```

---

# 📊 Database

This project uses PostgreSQL with Knex migrations.

Current schema includes:

- Users
- Refresh Tokens
- Projects
- Deployments
- Notifications
- Pipelines

---

# 🌐 API Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | User login |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/logout` | Logout user |

---

## Users

| Method | Endpoint |
|---------|----------|
| GET | `/api/v1/users` |
| GET | `/api/v1/users/:id` |
| POST | `/api/v1/users` |
| PUT | `/api/v1/users/:id` |
| DELETE | `/api/v1/users/:id` |

---

## Projects

| Method | Endpoint |
|---------|----------|
| GET | `/api/v1/projects` |
| POST | `/api/v1/projects` |
| PUT | `/api/v1/projects/:id` |
| DELETE | `/api/v1/projects/:id` |

---

## Deployments

| Method | Endpoint |
|---------|----------|
| GET | `/api/v1/deployments` |
| POST | `/api/v1/deployments` |
| PUT | `/api/v1/deployments/:id` |
| DELETE | `/api/v1/deployments/:id` |

---

## Pipelines

| Method | Endpoint |
|---------|----------|
| GET | `/api/v1/pipelines` |
| POST | `/api/v1/pipelines` |
| PUT | `/api/v1/pipelines/:id` |
| DELETE | `/api/v1/pipelines/:id` |

---

## Notifications

| Method | Endpoint |
|---------|----------|
| GET | `/api/v1/notifications` |
| POST | `/api/v1/notifications` |

---

## Health Check

| Method | Endpoint |
|---------|----------|
| GET | `/api/v1/health` |

---

# 🐳 Docker Support

The application is fully containerized using Docker and Docker Compose.

Services include:

- Frontend
- Backend
- PostgreSQL
- Redis
- Nginx Reverse Proxy

Run the complete application:

```bash
docker compose up --build
```

Stop all containers:

```bash
docker compose down
```

---

# ☸ Kubernetes Deployment

Production-ready Kubernetes manifests are included.

Resources available:

- Namespace
- Backend Deployment
- Backend Service
- PostgreSQL Deployment
- Persistent Volume Claim
- ConfigMap
- Secret
- Horizontal Pod Autoscaler (HPA)
- Ingress
- Network Policies
- Pod Disruption Budget

Deploy:

```bash
kubectl apply -f k8s/
```

Verify:

```bash
kubectl get pods
kubectl get svc
kubectl get ingress
```

---

# 📈 Monitoring

Monitoring is implemented using Prometheus.

Features include:

- Application Metrics
- Request Metrics
- Health Endpoints
- Alert Rules
- Prometheus Configuration
- Logging Support

Future integrations can include:

- Grafana
- Loki
- Alertmanager

---

# 🔒 Security Features

- JWT Authentication
- Refresh Token Rotation
- Password Hashing
- Role-Based Access Control (RBAC)
- Protected API Routes
- Input Validation
- Request Sanitization
- Rate Limiting
- Error Handling Middleware
- Request ID Tracking
- Secure HTTP Headers
- Environment Variable Configuration

---

# ⚡ Performance Features

- Redis Caching
- Repository Pattern
- Modular Services
- Async Background Jobs
- Queue Processing
- Efficient Pagination
- Reusable API Layer
- Optimized React Components

---

# 🧪 Testing

Backend testing is implemented using Jest.

Included tests:

- Unit Tests
- Integration Tests
- Middleware Tests
- Authentication Tests
- Project API Tests
- Deployment API Tests
- Notification Tests
- Utility Tests

Run tests:

```bash
npm test
```

Coverage:

```bash
npm run test:coverage
```

---

# 📸 Screenshots

## Login


![Login](docs/images/login.png)

---

## Dashboard


![Dashboard](docs/images/dashboard.png)


---

## Projects


![Projects](docs/images/projects.png)


---

## Deployments


![Deployments](docs/images/deployments.png)


---

## Monitoring


![Monitoring](docs/images/monitoring.png)


---

## Docker Dashboard


![Docker Dashboard](docs/images/docker.png)


---

## Kubernetes Dashboard


![Kubernetes Dashboard](docs/images/kubernetes.png)


---

# 🚀 Future Improvements

- CI/CD using GitHub Actions
- Grafana Dashboard Integration
- ELK / Loki Log Aggregation
- Multi-Cluster Kubernetes Support
- Helm Charts
- Terraform Infrastructure Provisioning
- OAuth2 / SSO Authentication
- Multi-Tenant Support
- Email & Slack Notifications
- Audit Logs
- Webhook Integration
- AI-powered Deployment Insights

---

# 💼 Resume Highlights

This project demonstrates practical experience with:

- Full Stack Development
- Enterprise Backend Architecture
- REST API Design
- Authentication & Authorization
- PostgreSQL Database Design
- Redis Caching
- Docker & Docker Compose
- Kubernetes Deployment
- Prometheus Monitoring
- Nginx Reverse Proxy
- Background Job Processing
- Secure API Development
- Testing with Jest
- Modular & Scalable Codebase

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/my-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to your branch

```bash
git push origin feature/my-feature
```

5. Open a Pull Request

---

# 📜 License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for details.

---

# 👨‍💻 Author

**Bhupendra Singh**

DevOps Engineer | Full Stack Developer | Cloud & Kubernetes Enthusiast

**Skills**

- Linux
- Docker
- Kubernetes
- Jenkins
- Terraform
- Ansible
- AWS
- React
- Node.js
- PostgreSQL
- Redis
- Prometheus

---

# ⭐ Support

If you found this project useful:

- ⭐ Star this repository
- 🍴 Fork the repository
- 🐛 Report issues
- 💡 Suggest improvements

---

<p align="center">

**Built with ❤️ using React, Node.js, PostgreSQL, Docker & Kubernetes**

⭐ **If you like this project, don't forget to give it a Star!** ⭐

</p>
