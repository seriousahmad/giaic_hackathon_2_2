#!/bin/bash
# Script to generate API documentation and project documentation

set -e

echo "Generating project documentation..."

# Create docs directory if it doesn't exist
mkdir -p docs/api docs/development docs/deployment

# Generate API documentation
cat > docs/api/overview.md << 'EOF'
# API Documentation

## Base URL
`http://localhost:8000` (development)
`https://yourdomain.com/api` (production)

## Authentication
All API endpoints require authentication using Bearer tokens.

## Error Handling
The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting
All endpoints are rate-limited to prevent abuse.
EOF

# Generate development documentation
cat > docs/development/setup.md << 'EOF'
# Development Setup

## Prerequisites
- Node.js v18 or higher
- Python v3.9 or higher
- PostgreSQL v12 or higher
- Docker (optional, for containerization)

## Initial Setup

1. Clone the repository
```bash
git clone <repository-url>
cd <project-name>
```

2. Install backend dependencies
```bash
cd src/backend
pip install -r requirements.txt
```

3. Install frontend dependencies
```bash
cd src/frontend
npm install
```

4. Set up environment variables
```bash
cp .env.example .env
# Update the values in .env as needed
```

## Running the Application

### Development Mode
```bash
# Terminal 1: Start the backend
cd src/backend
uvicorn main:app --reload

# Terminal 2: Start the frontend
cd src/frontend
npm run dev
```

### Using the Dev Script
```bash
./scripts/start-dev-env.sh
```

## Database Migrations
```bash
cd src/backend
alembic revision --autogenerate -m "Description of changes"
alembic upgrade head
```
EOF

# Generate deployment documentation
cat > docs/deployment/docker.md << 'EOF'
# Docker Deployment

## Building the Docker Images

### Backend
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY src/backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/backend/ .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY src/frontend/package*.json ./
RUN npm ci

COPY src/frontend/ .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/out ./

EXPOSE 3000

CMD ["serve", "-s", "."]
```

## Docker Compose
```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: fullstack_app
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/fullstack_app
    depends_on:
      - db

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```
EOF

# Generate main README with all documentation links
cat > docs/README.md << 'EOF'
# Project Documentation

## Table of Contents
- [API Documentation](./api/overview.md)
- [Development Guide](./development/setup.md)
- [Deployment Guide](./deployment/docker.md)
- [Architecture Decision Records](../history/adr/)
- [Prompt History Records](../history/prompts/)

## Quick Links
- [Local Development](./development/setup.md)
- [API Endpoints](./api/overview.md)
- [Deployment](./deployment/docker.md)
- [Testing Strategy](./testing/strategy.md)
EOF

echo "Documentation generated successfully!"
echo "Documentation structure created in docs/ directory"