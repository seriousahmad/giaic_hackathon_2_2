// Custom hook for authentication state management (always authenticated)
import { useState, useEffect } from 'react';
import { User } from '@/lib/types';

export const useAuth = () => {
  // Create a mock user object
  const mockUser: User = {
    id: '1',
    email: 'user@example.com',
    name: 'User',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const [user, setUser] = useState<User>(mockUser);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // No need to check auth status since we're always authenticated
  useEffect(() => {
    setLoading(false);
  }, []);

  // Mock login function
  const login = (userData: User, token: string) => {
    setUser(userData);
    setError(null);
  };

  // Mock logout function - prevent logging out
  const logout = () => {
    // Don't actually log out, just keep the mock user
    console.log('Logout prevented in demo mode');
  };

  // Update user function
  const updateUser = (updatedUser: Partial<User>) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedUser }));
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: true, // Always authenticated
    login,
    logout,
    updateUser,
  };
};