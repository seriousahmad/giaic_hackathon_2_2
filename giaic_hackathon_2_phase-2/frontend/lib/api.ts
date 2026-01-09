// Local storage API service utilities (backend-free version)
import { ApiResponse, Task, CreateTaskData, UpdateTaskData } from './types';
import { localStorageApiService } from './localStorageApiService';

// Export the localStorage API service as the main apiService
export const apiService = localStorageApiService;

export default apiService;