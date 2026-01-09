# Implementation Plan: Backend Todo API

**Feature**: Backend Todo API
**Branch**: `001-backend-todo-api`
**Created**: 2026-01-08
**Status**: Ready for Implementation

## Technical Context

This plan implements a comprehensive backend API for a full-stack todo web application using FastAPI, SQLModel, and Neon PostgreSQL. The implementation includes JWT-based authentication, user isolation, and full CRUD operations for todo management with advanced features like priority management, tags, due dates, and recurrence patterns.

### Architecture
- **Framework**: FastAPI for high-performance API with automatic OpenAPI documentation
- **ORM**: SQLModel for database modeling with SQLAlchemy and Pydantic integration
- **Database**: Neon PostgreSQL for cloud-native PostgreSQL with branching capabilities
- **Authentication**: JWT-based with secure token handling and user isolation
- **Structure**: Clean architecture with models, services, API routes, and utilities

### Key Technologies
- Python 3.12+
- FastAPI 0.104+
- SQLModel 0.0.8+
- Neon PostgreSQL
- PyJWT for token handling
- BCrypt for password hashing
- Uvicorn for ASGI server

## Constitution Check

This implementation adheres to the project constitution by:
- Implementing security-by-design with JWT authentication and user isolation
- Following spec-first development with comprehensive API contracts
- Enabling full-stack integration with well-defined API endpoints
- Maintaining agentic development compliance through Claude Code
- Using API-first design with proper request/response formats
- Ensuring proper error handling and user isolation

## Gates

### Security Gate
- ✅ All endpoints enforce user authentication with JWT tokens
- ✅ User isolation implemented - users can only access their own data
- ✅ Passwords stored with bcrypt hashing
- ✅ Proper input validation and sanitization implemented

### Architecture Gate
- ✅ Clean separation of concerns (models, services, API routes)
- ✅ Proper error handling with appropriate HTTP status codes
- ✅ Type safety with Pydantic models
- ✅ Database models defined with SQLModel

### Performance Gate
- ✅ Efficient database queries with proper indexing
- ✅ Pagination implemented for large datasets
- ✅ Proper caching headers where appropriate
- ✅ Asynchronous operations where beneficial

## Phase 0: Research & Unknowns Resolution

### Research Tasks
- [x] **R001**: Determine optimal JWT token expiration strategy for todo application
- [x] **R002**: Research best practices for user password hashing with bcrypt in FastAPI
- [x] **R003**: Investigate optimal PostgreSQL schema design for todo application with Neon
- [x] **R004**: Evaluate pagination strategies for large todo lists
- [x] **R005**: Research proper error handling patterns in FastAPI applications
- [x] **R006**: Best practices for API versioning in FastAPI
- [x] **R007**: Optimal deployment strategies for FastAPI with Neon PostgreSQL

### Research Findings

#### Decision: JWT Token Strategy
- **Chosen**: Short-lived access tokens (15 minutes) with refresh tokens (7 days)
- **Rationale**: Balances security (short expiration) with user experience (refresh tokens)
- **Alternatives**: Long-lived tokens (security risk), session-based auth (doesn't fit requirements)

#### Decision: Password Hashing
- **Chosen**: bcrypt with 12 rounds
- **Rationale**: Industry standard for password hashing, well-supported in Python ecosystem
- **Alternatives**: Argon2, scrypt (more complex setup, minimal security gain)

#### Decision: PostgreSQL Schema
- **Chosen**: Single-table design with JSONB for flexible attributes (tags, recurrence)
- **Rationale**: Flexible for future requirements while maintaining relational integrity
- **Alternatives**: Separate tables for tags/recurrence (more complex joins)

#### Decision: Pagination
- **Chosen**: Offset-based pagination with configurable page size
- **Rationale**: Simple to implement and understand, adequate for todo application
- **Alternatives**: Cursor-based pagination (better for large datasets but more complex)

#### Decision: Error Handling
- **Chosen**: Custom HTTPException subclasses with standardized error responses
- **Rationale**: Consistent error format, easy for frontend to parse
- **Alternatives**: Generic exception handlers (less structured)

## Phase 1: Design & Contracts

### Data Model

#### User Model
```
- id: UUID (Primary Key)
- email: String (Unique, Indexed)
- hashed_password: String (Indexed for security)
- name: String (Optional)
- created_at: DateTime (Default: now)
- updated_at: DateTime (Default: now, Updated: now)
```

#### Todo Model
```
- id: UUID (Primary Key)
- title: String (Required, Indexed)
- description: Text (Optional)
- completed: Boolean (Default: False)
- priority: Enum (HIGH, MEDIUM, LOW) (Default: MEDIUM)
- tags: JSONB (Array of strings, Optional, Indexed)
- due_date: DateTime (Optional, Indexed)
- recurrence_pattern: JSONB (Object with type, interval, etc., Optional)
- user_id: UUID (Foreign Key to User, Indexed)
- created_at: DateTime (Default: now)
- updated_at: DateTime (Default: now, Updated: now)
```

### API Contracts

#### Authentication Endpoints
```
POST /auth/register
Request: {email: str, password: str, name?: str}
Response: 201 {success: bool, data: {user: User, token: str}}

POST /auth/login
Request: {email: str, password: str}
Response: 200 {success: bool, data: {user: User, token: str}}

POST /auth/logout
Request: Headers: {Authorization: Bearer <token>}
Response: 200 {success: bool}

GET /auth/me
Request: Headers: {Authorization: Bearer <token>}
Response: 200 {success: bool, data: User}
```

#### Todo Management Endpoints
```
GET /todos
Query Params: completed?: bool, priority?: str, tags?: [str], due_date?: str, search?: str, page?: int, size?: int
Request: Headers: {Authorization: Bearer <token>}
Response: 200 {success: bool, data: [Todo], meta: {total: int, page: int, size: int, total_pages: int}}

POST /todos
Request: Headers: {Authorization: Bearer <token>}, Body: {title: str, description?: str, priority?: str, tags?: [str], due_date?: str, recurrence_pattern?: object}
Response: 201 {success: bool, data: Todo}

GET /todos/{id}
Request: Headers: {Authorization: Bearer <token>}
Response: 200 {success: bool, data: Todo}

PUT /todos/{id}
Request: Headers: {Authorization: Bearer <token>}, Body: {title?: str, description?: str, priority?: str, tags?: [str], due_date?: str, recurrence_pattern?: object}
Response: 200 {success: bool, data: Todo}

DELETE /todos/{id}
Request: Headers: {Authorization: Bearer <token>}
Response: 204 No Content

PATCH /todos/{id}/complete
Request: Headers: {Authorization: Bearer <token>}, Body: {completed: bool}
Response: 200 {success: bool, data: Todo}
```

### Quickstart Guide

1. **Setup Environment**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   # Update .env with your Neon PostgreSQL connection string and JWT secret
   ```

3. **Run Database Migrations**:
   ```bash
   alembic revision --autogenerate -m "Initial migration"
   alembic upgrade head
   ```

4. **Start Development Server**:
   ```bash
   uvicorn main:app --reload
   ```

5. **Access API Documentation**:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## Phase 2: Implementation Approach

### Implementation Strategy
1. **Models First**: Implement SQLModel models with proper relationships and validation
2. **Services Layer**: Create service classes with business logic and data access
3. **API Layer**: Build FastAPI endpoints with proper authentication and validation
4. **Utilities**: Implement JWT handling, password hashing, and other utilities
5. **Testing**: Develop comprehensive tests for all components

### Component Breakdown
- **Models**: User and Todo SQLModel definitions with relationships
- **Services**: Business logic for user management, todo operations, authentication
- **API**: FastAPI routes with JWT authentication middleware
- **Utils**: JWT token handling, password hashing, database utilities
- **Tests**: Unit and integration tests for all functionality

### Success Criteria
- All API endpoints return proper HTTP status codes
- User isolation enforced at all levels (database, service, API)
- JWT tokens properly validated and refreshed
- Passwords securely hashed with bcrypt
- Comprehensive test coverage (>80%)
- Proper error handling with user-friendly messages
- API documentation generated automatically
- Performance benchmarks met (response times < 500ms)

---

## Implementation Artifacts

- **Data Model**: `specs/001-backend-todo-api/data-model.md`
- **API Contracts**: `specs/001-backend-todo-api/contracts/openapi.json`
- **Quickstart Guide**: `specs/001-backend-todo-api/quickstart.md`
- **Research Findings**: `specs/001-backend-todo-api/research.md`