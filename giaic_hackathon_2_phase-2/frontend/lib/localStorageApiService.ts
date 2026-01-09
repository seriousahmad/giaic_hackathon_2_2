// Local storage API service utilities
import { ApiResponse, Task, CreateTaskData, UpdateTaskData } from './types';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  clearAllTasks,
  loadTasks
} from './localStorageUtils';

// Local API service functions
export const localStorageApiService = {
  // Authentication endpoints (will be mocked)
  auth: {
    async login(email: string, password: string): Promise<ApiResponse<{ user: any; token: string }>> {
      // Mock authentication - always successful
      const mockUser = {
        id: '1',
        email,
        name: email.split('@')[0],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Store a mock token
      localStorage.setItem('auth_token', 'mock_token');
      
      return { 
        success: true, 
        data: { 
          user: mockUser, 
          token: 'mock_token' 
        } 
      };
    },

    async register(email: string, password: string, name?: string): Promise<ApiResponse<{ user: any; token: string }>> {
      // Mock registration - always successful
      const mockUser = {
        id: '1',
        email,
        name: name || email.split('@')[0],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Store a mock token
      localStorage.setItem('auth_token', 'mock_token');
      
      return { 
        success: true, 
        data: { 
          user: mockUser, 
          token: 'mock_token' 
        } 
      };
    },

    async logout(): Promise<ApiResponse<void>> {
      // Clear mock tokens from localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      return { success: true };
    },

    async getProfile(): Promise<ApiResponse<any>> {
      // Return mock user profile
      const mockUser = {
        id: '1',
        email: 'user@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return { success: true, data: mockUser };
    },
  },

  // Task endpoints using local storage
  tasks: {
    async getAll(): Promise<ApiResponse<Task[]>> {
      try {
        const tasks = getAllTasks();
        return { success: true, data: tasks };
      } catch (error) {
        return { success: false, error: 'Failed to load tasks' };
      }
    },

    async getById(id: number): Promise<ApiResponse<Task>> {
      try {
        const task = getTaskById(id);
        if (!task) {
          return { success: false, error: 'Task not found' };
        }
        return { success: true, data: task };
      } catch (error) {
        return { success: false, error: 'Failed to load task' };
      }
    },

    async create(taskData: CreateTaskData): Promise<ApiResponse<Task>> {
      try {
        const newTask = createTask(taskData);
        return { success: true, data: newTask };
      } catch (error) {
        return { success: false, error: 'Failed to create task' };
      }
    },

    async update(id: number, taskData: UpdateTaskData): Promise<ApiResponse<Task>> {
      try {
        const updatedTask = updateTask(id, taskData);
        if (!updatedTask) {
          return { success: false, error: 'Task not found' };
        }
        return { success: true, data: updatedTask };
      } catch (error) {
        return { success: false, error: 'Failed to update task' };
      }
    },

    async delete(id: number): Promise<ApiResponse<void>> {
      try {
        const success = deleteTask(id);
        if (!success) {
          return { success: false, error: 'Task not found' };
        }
        return { success: true };
      } catch (error) {
        return { success: false, error: 'Failed to delete task' };
      }
    },

    async toggleComplete(id: number, completed: boolean): Promise<ApiResponse<Task>> {
      try {
        const updatedTask = toggleTaskCompletion(id, completed);
        if (!updatedTask) {
          return { success: false, error: 'Task not found' };
        }
        return { success: true, data: updatedTask };
      } catch (error) {
        return { success: false, error: 'Failed to toggle task completion' };
      }
    },
  },

  // Utility function to set tokens
  setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem('auth_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  },

  // Utility function to get token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  // Utility function to check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token; // Always return true if we have a token
  },
};

export default localStorageApiService;