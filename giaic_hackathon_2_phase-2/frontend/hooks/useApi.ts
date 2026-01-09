// Custom hook for API calls with loading and error states
import { useState, useEffect, useCallback } from 'react';
import { ApiResponse } from '@/lib/types';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useApi = <T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = [],
  initialData: T | null = null
): UseApiState<T> => {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);

  const executeApiCall = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      if (response.success) {
        setData(response.data || null);
      } else {
        setError(response.error || response.message || 'An error occurred');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since we'll manage updates manually

  // Initial data fetch
  useEffect(() => {
    executeApiCall();
  }, [...dependencies, refetchTrigger]); // Include refetchTrigger in dependencies

  const refetch = useCallback(() => {
    setRefetchTrigger(prev => prev + 1);
  }, []);

  return { data, loading, error, refetch };
};

// Custom hook for making API mutations (POST, PUT, PATCH, DELETE)
export interface UseApiMutationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: () => Promise<ApiResponse<T>>;
}

export const useApiMutation = <T>(
  apiCall: () => Promise<ApiResponse<T>>
): UseApiMutationState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await apiCall();
      if (response.success) {
        setData(response.data || null);
        return response;
      } else {
        setError(response.error || response.message || 'An error occurred');
        return response;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  return { data, loading, error, execute };
};