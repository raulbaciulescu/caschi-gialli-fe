import { useState, useCallback } from 'react';
import { ApiException } from '../types/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  errors: Record<string, string[]> | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    errors: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T> => {
      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
        errors: null,
      }));

      try {
        const result = await apiFunction(...args);
        setState(prev => ({
          ...prev,
          data: result,
          loading: false,
        }));
        return result;
      } catch (error) {
        let errorMessage = 'An unexpected error occurred';
        let validationErrors: Record<string, string[]> | null = null;

        if (error instanceof ApiException) {
          errorMessage = error.message;
          validationErrors = error.errors || null;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
          errors: validationErrors,
        }));

        throw error;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      errors: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}