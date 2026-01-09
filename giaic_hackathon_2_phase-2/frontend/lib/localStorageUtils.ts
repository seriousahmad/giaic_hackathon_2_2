import { Task, CreateTaskData, UpdateTaskData } from './types';

const TASKS_KEY = 'todo_tasks';

// Initialize with sample tasks if none exist
const initializeSampleTasks = () => {
  if (!localStorage.getItem(TASKS_KEY)) {
    const sampleTasks: Task[] = [
      {
        id: 1,
        title: 'Sample Task 1',
        description: 'This is a sample task to get you started',
        completed: false,
        priority: 'Medium',
        tags: ['sample'],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        recurrence: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        title: 'Sample Task 2',
        description: 'Another sample task',
        completed: true,
        priority: 'High',
        tags: ['important'],
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        recurrence: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    localStorage.setItem(TASKS_KEY, JSON.stringify(sampleTasks));
  }
};

// Load tasks from localStorage
export const loadTasks = (): Task[] => {
  initializeSampleTasks();
  const tasksStr = localStorage.getItem(TASKS_KEY);
  if (!tasksStr) return [];
  
  try {
    const tasks = JSON.parse(tasksStr);
    // Convert date strings back to Date objects
    return tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : null
    }));
  } catch (error) {
    console.error('Error parsing tasks from localStorage:', error);
    return [];
  }
};

// Save tasks to localStorage
export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
};

// Get all tasks
export const getAllTasks = (): Task[] => {
  return loadTasks();
};

// Get task by ID
export const getTaskById = (id: number): Task | undefined => {
  const tasks = loadTasks();
  return tasks.find(task => task.id === id);
};

// Create a new task
export const createTask = (taskData: CreateTaskData): Task => {
  const tasks = loadTasks();
  const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  
  const newTask: Task = {
    id: newId,
    ...taskData,
    completed: false, // New tasks are not completed by default
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
};

// Update a task
export const updateTask = (id: number, taskData: UpdateTaskData): Task | null => {
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) return null;
  
  const updatedTask = {
    ...tasks[taskIndex],
    ...taskData,
    updatedAt: new Date()
  };
  
  tasks[taskIndex] = updatedTask;
  saveTasks(tasks);
  return updatedTask;
};

// Delete a task
export const deleteTask = (id: number): boolean => {
  const tasks = loadTasks();
  const initialLength = tasks.length;
  const filteredTasks = tasks.filter(task => task.id !== id);
  
  if (filteredTasks.length === initialLength) {
    return false; // Task not found
  }
  
  saveTasks(filteredTasks);
  return true;
};

// Toggle task completion
export const toggleTaskCompletion = (id: number, completed?: boolean): Task | null => {
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) return null;
  
  const task = tasks[taskIndex];
  const newCompletedValue = completed !== undefined ? completed : !task.completed;
  
  const updatedTask = {
    ...task,
    completed: newCompletedValue,
    updatedAt: new Date()
  };
  
  tasks[taskIndex] = updatedTask;
  saveTasks(tasks);
  return updatedTask;
};

// Clear all tasks
export const clearAllTasks = (): void => {
  localStorage.removeItem(TASKS_KEY);
};