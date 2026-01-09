# Research Findings: Backend Todo API Implementation

**Feature**: Backend Todo API
**Created**: 2026-01-08
**Status**: Final

## Executive Summary

This document captures the research and decision-making process for implementing the Backend Todo API. Key decisions include technology stack choices, authentication strategy, database design, and API architecture.

## Technology Stack Decisions

### Framework Choice: FastAPI vs Flask vs Django

**Decision**: FastAPI
**Rationale**:
- Automatic OpenAPI/Swagger documentation generation
- High performance comparable to Node.js and Go frameworks
- Built-in support for Pydantic models and type validation
- Asynchronous support out of the box
- Excellent developer experience with automatic request/response validation

**Alternatives Considered**:
- Flask: More lightweight but requires more manual setup
- Django: Heavy framework with built-in admin, overkill for API-only use case

### Database ORM: SQLModel vs SQLAlchemy vs Tortoise ORM

**Decision**: SQLModel
**Rationale**:
- Combines SQLAlchemy and Pydantic in one package
- Type safety with Pydantic models
- Designed specifically for FastAPI integration
- Support for both sync and async operations
- Clean, declarative model definitions

**Alternatives Considered**:
- Pure SQLAlchemy: More complex setup, no built-in Pydantic integration
- Tortoise ORM: Good async support but less mature ecosystem

### Database: Neon PostgreSQL vs Traditional PostgreSQL vs MongoDB

**Decision**: Neon PostgreSQL
**Rationale**:
- Cloud-native PostgreSQL with serverless scaling
- Built-in branching and isolation features
- Seamless integration with modern deployment workflows
- Familiar SQL interface with PostgreSQL compatibility
- Good performance characteristics for the use case

**Alternatives Considered**:
- Traditional PostgreSQL: More setup required, no built-in branching
- MongoDB: NoSQL approach would complicate relational queries needed for user isolation

## Authentication Strategy

### JWT vs Sessions vs OAuth

**Decision**: JWT with short-lived access tokens + refresh tokens
**Rationale**:
- Stateless authentication suitable for API-only architecture
- Scalable without server-side session storage
- Compatible with frontend applications
- Secure when properly implemented with short expiration times
- Refresh tokens provide good UX while maintaining security

**Token Strategy**:
- Access tokens: 15 minutes expiration
- Refresh tokens: 7 days expiration
- Secure storage in HTTP-only cookies or localStorage with proper security measures

### Password Hashing: bcrypt vs Argon2 vs PBKDF2

**Decision**: bcrypt
**Rationale**:
- Industry standard for password hashing
- Well-tested and widely supported
- Good security characteristics
- Easy to implement with python-bcrypt or passlib
- Properly handles salt generation

**Alternatives Considered**:
- Argon2: More modern but slightly more complex setup
- PBKDF2: Less preferred due to weaker resistance to GPU attacks

## API Design Decisions

### REST vs GraphQL vs gRPC

**Decision**: REST API with JSON
**Rationale**:
- Simpler to implement and document
- Widespread understanding and tooling
- Sufficient for the use case requirements
- Good integration with frontend applications
- Automatic OpenAPI documentation with FastAPI

### Pagination Strategy

**Decision**: Offset-based pagination with page/size parameters
**Rationale**:
- Simple to implement and understand
- Adequate for todo application use case
- Good performance for smaller datasets
- Easy to implement with SQL LIMIT/OFFSET

**Considerations**:
- For very large datasets, cursor-based pagination would be more efficient
- Offset pagination can be inefficient for very large offsets

### Error Handling Pattern

**Decision**: Consistent JSON error responses with success flag
**Rationale**:
- Predictable format for frontend error handling
- Clear indication of success/failure
- Consistent field names across all endpoints
- Separation of error message for display vs error code for programmatic handling

## Database Design Decisions

### Schema Design: Single Table vs Normalized

**Decision**: Single table with JSONB for flexible attributes
**Rationale**:
- Flexibility for storing tags and recurrence patterns
- Simpler queries for most use cases
- Good performance with proper indexing
- Easier to modify schema for future requirements

**Considerations**:
- JSONB fields require different indexing strategies
- Less strict validation compared to normalized approach
- Potential performance impact for complex queries on JSONB fields

### Indexing Strategy

**Decisions**:
- Primary keys on all ID fields
- Foreign key indexes for relationships
- Individual indexes on frequently queried fields (completed, priority, due_date)
- GIN indexes for JSONB fields (tags)
- Composite indexes for common query patterns (user_id, completed)

## Security Considerations

### User Isolation Implementation

**Decision**: Row-level security enforced at multiple layers
**Rationale**:
- Database-level enforcement through user_id foreign key constraints
- Application-level enforcement in service layer
- API-level enforcement with user ID validation in all endpoints
- Multiple layers provide defense in depth

### Input Validation

**Decision**: Pydantic models with FastAPI automatic validation
**Rationale**:
- Type safety with automatic conversion
- Built-in validation rules
- Consistent error messages
- Automatic documentation of expected data formats

## Performance Considerations

### Caching Strategy

**Decision**: Minimal caching initially, add as needed
**Rationale**:
- Todo application likely to have low traffic initially
- Premature optimization can add complexity
- Monitor performance and add caching where needed
- Potential candidates: JWT validation, user data

### Database Connection Pooling

**Decision**: Use SQLModel's built-in connection pooling with Neon
**Rationale**:
- Neon provides built-in connection pooling
- Proper disposal of connections in FastAPI lifespan
- Async support for better concurrency handling