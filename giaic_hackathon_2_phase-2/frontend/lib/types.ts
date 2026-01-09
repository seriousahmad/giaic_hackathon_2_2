// TypeScript types based on the data model specification

export enum Priority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export enum Recurrence {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  NONE = null,
}

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
  priority: Priority;
  tags: string[];
  dueDate?: Date | null;
  recurrence: Recurrence | null;
  createdAt: Date;
  updatedAt: Date;
}

// Task creation DTO (without auto-generated fields)
export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: Priority;
  tags?: string[];
  dueDate?: Date;
  recurrence?: Recurrence | null;
}

// Task update DTO (partial fields)
export interface UpdateTaskData {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  tags?: string[];
  dueDate?: Date | null;
  recurrence?: Recurrence | null;
}

// Task filter options
export interface TaskFilter {
  completed?: boolean;
  priority?: Priority;
  tags?: string[];
  search?: string; // For searching in title/description
}

// Task sort options
export interface TaskSort {
  field: 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'title';
  direction: 'asc' | 'desc';
}

// User interface (for authentication context)
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Authentication response
export interface AuthResponse {
  user: User;
  token: string;
}

// API response structure
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}