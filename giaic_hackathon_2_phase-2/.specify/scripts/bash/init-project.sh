#!/bin/bash
# Script to initialize the complete full-stack project

set -e

echo "Initializing complete full-stack project..."

# Make sure we're in the project root
PROJECT_ROOT=$(pwd)

# Create main project directories
mkdir -p docs
mkdir -p tests/e2e
mkdir -p scripts
mkdir -p .github/workflows

# Create root README
cat > README.md << 'EOF'
# Full Stack Web Application

This is a full-stack web application built with Next.js (frontend) and FastAPI (backend).

## Project Structure

- `src/frontend/` - Next.js frontend application
- `src/backend/` - FastAPI backend application
- `src/database/` - Database models and migrations
- `docs/` - Documentation files
- `tests/` - Test files

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python (v3.9 or higher)
- PostgreSQL (for database)

### Setup

1. Clone the repository
2. Run the initialization script: `./scripts/init-project.sh`
3. Start the development environment: `./scripts/start-dev-env.sh`

### Frontend Development

Navigate to `src/frontend/` and run:
- `npm install` - Install dependencies
- `npm run dev` - Start development server
- `npm run build` - Build for production

### Backend Development

Navigate to `src/backend/` and run:
- `pip install -r requirements.txt` - Install dependencies
- `uvicorn main:app --reload` - Start development server

## Environment Variables

Copy `.env.example` to `.env` and update the values as needed.

## Testing

Run tests from the project root:
- Frontend: `cd src/frontend && npm run test`
- Backend: `cd src/backend && pytest`

## Deployment

TODO: Add deployment instructions
EOF

# Create main package.json for project management
cat > package.json << 'EOF'
{
  "name": "fullstack-app",
  "version": "1.0.0",
  "description": "Full stack web application with Next.js and FastAPI",
  "scripts": {
    "dev": "bash .specify/scripts/bash/start-dev-env.sh",
    "setup": "bash .specify/scripts/bash/init-project.sh",
    "init-frontend": "bash .specify/scripts/bash/init-frontend.sh",
    "init-backend": "bash .specify/scripts/bash/init-backend.sh",
    "init-db": "bash .specify/scripts/bash/init-database.sh"
  },
  "keywords": ["nextjs", "fastapi", "fullstack", "typescript", "python"],
  "author": "Your Name",
  "license": "MIT"
}
EOF

# Create .gitignore for the root
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
env/
venv/
.venv/
pip-log.txt
pip-delete-this-directory.txt
.tox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.log
.DS_Store

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Next.js
.next/
out/

# FastAPI
*.db
*.db-journal

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Database
*.db
*.db-journal
migrations/
alembic_version

# Tests
coverage/
htmlcov/
.pytest_cache/
.cov/
EOF

echo "Complete project structure initialized!"
echo "Project initialized successfully at: $PROJECT_ROOT"