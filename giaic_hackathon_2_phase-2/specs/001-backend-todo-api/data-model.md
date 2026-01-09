# Data Model: Backend Todo API

**Feature**: Backend Todo API
**Created**: 2026-01-08
**Status**: Final

## Overview

This document defines the data models for the Backend Todo API, including entities, relationships, and validation rules.

## Entities

### User
**Description**: Represents an authenticated user in the system

**Fields**:
- `id`: UUID (Primary Key)
  - Type: UUID
  - Required: Yes
  - Unique: Yes
  - Description: Unique identifier for the user

- `email`: String
  - Type: String (max_length=255)
  - Required: Yes
  - Unique: Yes
  - Indexed: Yes
  - Description: User's email address for authentication

- `hashed_password`: String
  - Type: String (max_length=255)
  - Required: Yes
  - Description: Bcrypt-hashed password

- `name`: String
  - Type: String (max_length=100)
  - Required: No
  - Description: User's display name (optional)

- `created_at`: DateTime
  - Type: DateTime
  - Required: Yes
  - Default: Current timestamp
  - Description: Timestamp when user account was created

- `updated_at`: DateTime
  - Type: DateTime
  - Required: Yes
  - Default: Current timestamp, updated on change
  - Description: Timestamp when user record was last updated

**Validation Rules**:
- Email must be a valid email format
- Email must be unique across all users
- Name length must be between 2 and 100 characters if provided

### Todo
**Description**: Represents a user's task or todo item

**Fields**:
- `id`: UUID (Primary Key)
  - Type: UUID
  - Required: Yes
  - Unique: Yes
  - Description: Unique identifier for the todo

- `title`: String
  - Type: String (max_length=255)
  - Required: Yes
  - Indexed: Yes
  - Description: Title of the todo item

- `description`: Text
  - Type: Text (optional)
  - Required: No
  - Description: Detailed description of the todo (optional)

- `completed`: Boolean
  - Type: Boolean
  - Required: Yes
  - Default: False
  - Description: Whether the todo is completed

- `priority`: Enum
  - Type: Enum (HIGH, MEDIUM, LOW)
  - Required: Yes
  - Default: MEDIUM
  - Description: Priority level of the todo

- `tags`: JSONB
  - Type: Array of strings (JSONB)
  - Required: No
  - Description: Array of tags associated with the todo (optional)
  - Indexed: Yes (GIN index for JSONB)

- `due_date`: DateTime
  - Type: DateTime (optional)
  - Required: No
  - Indexed: Yes
  - Description: Deadline for completing the todo (optional)

- `recurrence_pattern`: JSONB
  - Type: Object (JSONB) (optional)
  - Required: No
  - Description: Recurrence pattern if this is a recurring task (optional)
  - Structure: `{type: string, interval: integer, end_date?: string}`

- `user_id`: UUID (Foreign Key)
  - Type: UUID
  - Required: Yes
  - Indexed: Yes
  - Foreign Key: References User.id
  - Description: Owner of this todo

- `created_at`: DateTime
  - Type: DateTime
  - Required: Yes
  - Default: Current timestamp
  - Description: Timestamp when todo was created

- `updated_at`: DateTime
  - Type: DateTime
  - Required: Yes
  - Default: Current timestamp, updated on change
  - Description: Timestamp when todo was last updated

**Validation Rules**:
- Title length must be between 1 and 255 characters
- Priority must be one of HIGH, MEDIUM, or LOW
- Tags array length must be less than 20 items if provided
- Due date cannot be in the past if provided
- Recurrence pattern must follow the defined structure if provided
- User_id must reference an existing user

## Relationships

### User → Todo (One-to-Many)
- A User can own zero or more Todos
- A Todo belongs to exactly one User
- Foreign key constraint on Todo.user_id referencing User.id
- Cascade delete: When a User is deleted, all their Todos are also deleted

## Indexes

### User Table
- Primary Key: id
- Unique Index: email
- Regular Index: created_at

### Todo Table
- Primary Key: id
- Regular Index: user_id (foreign key)
- Regular Index: completed
- Regular Index: priority
- Regular Index: due_date
- Regular Index: created_at
- GIN Index: tags (for JSONB array queries)
- Composite Index: (user_id, completed) for efficient user-specific queries

## State Transitions

### Todo State Transitions
- `incomplete` → `completed`: When user marks todo as complete
- `completed` → `incomplete`: When user unmarks todo as complete
- For recurring todos: When marked complete, a new instance is created based on recurrence pattern

## Constraints

### User Constraints
- Email uniqueness constraint to prevent duplicate accounts
- Password must be properly hashed before storing

### Todo Constraints
- User ownership validation - users can only access their own todos
- Title cannot be empty
- Priority must be valid enum value
- Recurrence pattern structure validation