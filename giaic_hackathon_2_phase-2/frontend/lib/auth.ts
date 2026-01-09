// Authentication utilities for token management (always authenticated)
import { User } from './types';

// Mock user object
const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  name: 'User',
  createdAt: new Date(),
  updatedAt: new Date()
};

// Always return a mock token
export const getAuthToken = (): string => {
  return 'mock-token'; // Always return a mock token
};

// Mock function - no actual token storage
export const setAuthToken = (token: string): void => {
  // No-op in demo mode
};

// Mock function - no actual token removal
export const removeAuthToken = (): void => {
  // No-op in demo mode
};

// Mock function - token is never expired in demo mode
export const isTokenExpired = (token: string): boolean => {
  return false; // Never expired in demo mode
};

// Always return true - always authenticated
export const isAuthenticated = (): boolean => {
  return true; // Always authenticated in demo mode
};

// Always return the mock user
export const getUserFromToken = (): User => {
  return mockUser;
};

// Mock function - no actual refresh token storage
export const setRefreshToken = (token: string): void => {
  // No-op in demo mode
};

// Mock function - no actual refresh token retrieval
export const getRefreshToken = (): string | null => {
  return 'mock-refresh-token'; // Return a mock refresh token
};

// Mock function - no actual token clearing
export const clearAuthTokens = (): void => {
  // No-op in demo mode
};

// Mock function - no actual token setting
export const setAuthTokens = (accessToken: string, refreshToken?: string): void => {
  // No-op in demo mode
};

// Always return true - has refresh token in demo mode
export const hasRefreshToken = (): boolean => {
  return true; // Always has refresh token in demo mode
};

// Mock function - no actual error handling
export const handleAuthError = (error: any): void => {
  console.error('Authentication error (demo mode):', error);
  // Don't redirect in demo mode
};

// Mock function - always return a mock token
export const refreshToken = async (): Promise<string | null> => {
  return 'mock-token'; // Always return a mock token
};

// Always return true - token is always valid in demo mode
export const verifyToken = async (): Promise<boolean> => {
  return true; // Always valid in demo mode
};