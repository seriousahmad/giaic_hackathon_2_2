# Quickstart Guide: Backend Todo API

**Feature**: Backend Todo API
**Created**: 2026-01-08
**Status**: Ready for Implementation

## Overview

This guide provides instructions for setting up and running the Backend Todo API built with FastAPI, SQLModel, and Neon PostgreSQL.

## Prerequisites

- Python 3.12 or higher
- pip package manager
- Neon PostgreSQL account or local PostgreSQL installation
- Git (for cloning the repository)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd backend
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Environment Configuration

Create a `.env` file in the backend root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/todo_db
NEON_DATABASE_URL=your_neon_connection_string_here
JWT_SECRET_KEY=your_super_secret_jwt_key_here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7
BCRYPT_ROUNDS=12
```

### 5. Database Setup

Initialize the database with the required tables:

```bash
# Run database migrations
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

### 6. Run the Application

```bash
# For development
uvicorn main:app --reload

# For production
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

The API will be available at `http://localhost:8000`.

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate user and get JWT token
- `POST /auth/logout` - Log out user
- `GET /auth/me` - Get current user info

### Todo Management

- `GET /todos` - Get all todos for authenticated user (with optional filters)
- `POST /todos` - Create a new todo
- `GET /todos/{id}` - Get a specific todo
- `PUT /todos/{id}` - Update a specific todo
- `DELETE /todos/{id}` - Delete a specific todo
- `PATCH /todos/{id}/complete` - Toggle completion status

## Testing the API

### Register a New User

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepassword",
    "name": "Test User"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepassword"
  }'
```

### Create a Todo (with JWT token from login)

```bash
curl -X POST http://localhost:8000/api/v1/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "title": "Sample Todo",
    "description": "This is a sample todo item",
    "priority": "HIGH",
    "tags": ["work", "important"]
  }'
```

## API Documentation

Interactive API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Verify DATABASE_URL in .env file
   - Check that database credentials are correct

2. **JWT Token Issues**
   - Ensure JWT_SECRET_KEY is properly set in .env
   - Check that tokens are being sent in Authorization header with "Bearer " prefix

3. **Migration Issues**
   - Run `alembic upgrade head` to ensure database schema is up to date
   - Check that SQLModel models match the expected database schema

### Environment Variables

All required environment variables must be set in the `.env` file. The application will not start if required variables are missing.

## Next Steps

1. Implement the frontend application that consumes this API
2. Add additional security measures as needed
3. Set up monitoring and logging
4. Deploy to production environment