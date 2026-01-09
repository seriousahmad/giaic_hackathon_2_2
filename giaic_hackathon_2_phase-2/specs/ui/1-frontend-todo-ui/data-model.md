# Data Model: Frontend for Phase II-Todo Hackathon: Fullstack Web App

## Overview
Frontend data models for the Todo application, defining TypeScript interfaces and data structures used in the UI layer.

## User Entity

### User Interface
```typescript
interface User {
  id: string;           // Unique identifier from authentication system
  email: string;        // User's email address (required for login)
  name?: string;        // Optional display name
  createdAt: string;    // ISO timestamp of account creation
  updatedAt: string;    // ISO timestamp of last update
}
```

### Validation Rules
- Email must be valid email format (RFC 5322)
- Email must be unique across all users
- Name (if provided) must be 1-50 characters
- ID must be UUID format

### State Transitions
- Unauthenticated → Authenticated (on successful login)
- Authenticated → Unauthenticated (on logout or session expiry)

## Todo Entity

### Todo Interface
```typescript
interface Todo {
  id: string;              // Unique identifier for the todo
  title: string;           // Title of the todo (required, max 200 chars)
  description?: string;    // Optional description (max 1000 chars)
  completed: boolean;      // Completion status (true/false)
  createdAt: string;       // ISO timestamp of creation
  updatedAt: string;       // ISO timestamp of last update
  userId: string;          // Foreign key to User who owns this todo
  completedAt?: string;    // Optional timestamp when marked complete
}
```

### Validation Rules
- Title must be 1-200 characters
- Description (if provided) must be 1-1000 characters
- ID must be UUID format
- UserId must reference a valid user
- CompletedAt only set when completed is true

### State Transitions
- Created (completed: false) → Updated (title/description changes)
- Created/Updated → Completed (completed: true, completedAt set)
- Completed → Uncompleted (completed: false, completedAt cleared)
- Any state → Deleted (removed from UI)

## API Response Models

### Auth Response
```typescript
interface AuthResponse {
  user: User;
  token: string;           // JWT token for authentication
  expiresIn: number;       // Token expiration in seconds
}
```

### Todo List Response
```typescript
interface TodoListResponse {
  todos: Todo[];
  count: number;           // Total number of todos for the user
}
```

### Error Response
```typescript
interface ErrorResponse {
  error: string;           // Error message
  code: string;            // Error code for client handling
  details?: Record<string, any>; // Additional error details
}
```

## UI State Models

### Loading States
```typescript
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

interface TodoState {
  data: Todo[] | null;
  loadingState: LoadingState;
  error: string | null;
  lastUpdated: string | null;
}
```

### Form State
```typescript
interface TodoFormState {
  title: string;
  description: string;
  isValid: boolean;
  errors: Record<string, string>;
}
```

## Type Safety Considerations

### Enums for Status Values
```typescript
enum TodoStatus {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed'
}

enum AuthStatus {
  UNAUTHENTICATED = 'unauthenticated',
  AUTHENTICATED = 'authenticated',
  LOADING = 'loading',
  ERROR = 'error'
}
```

## Data Transformation

### API to UI Transformation
- Backend API responses may include additional fields not needed in UI
- Date strings from API are converted to appropriate formats for display
- Error objects from API are transformed to user-friendly messages

### UI to API Transformation
- UI form data is validated before API submission
- UI-specific fields are stripped before API submission
- Date formats are converted to ISO strings for API

## Frontend-Specific Considerations

### Caching Strategy
- Todos are cached using SWR for offline availability
- Cache is invalidated on mutations (create, update, delete)
- Cache includes metadata about last fetch time

### Optimistic Updates
- UI updates immediately on user actions (add, edit, delete)
- API calls are made in background
- UI rolls back on API failure