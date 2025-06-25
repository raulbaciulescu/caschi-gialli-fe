import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { cgService } from '../services/cg.service';
import { mockCGService } from '../services/mockCG.service';
import { ServiceRequestResponse, AssignCGResponse } from '../types/api';

interface UseCGRequestsState {
  availableRequests: ServiceRequestResponse[];
  myRequests: ServiceRequestResponse[];
  loading: boolean;
  error: string | null;
  assignLoading: boolean;
}

interface UseCGRequestsReturn extends UseCGRequestsState {
  loadAvailableRequests: () => Promise<void>;
  loadMyRequests: () => Promise<void>;
  assignToRequest: (requestId: string) => Promise<AssignCGResponse>;
  reset: () => void;
}

export function useCGRequests(): UseCGRequestsReturn {
  const { useMockData } = useAuth();
  const [state, setState] = useState<UseCGRequestsState>({
    availableRequests: [],
    myRequests: [],
    loading: false,
    error: null,
    assignLoading: false,
  });

  const loadAvailableRequests = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const service = useMockData ? mockCGService : cgService;
      const requests = await service.getAvailableRequests();

      setState(prev => ({
        ...prev,
        availableRequests: requests,
        loading: false,
      }));
    } catch (error) {
      let errorMessage = 'Failed to load available requests';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, [useMockData]);

  const loadMyRequests = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const service = useMockData ? mockCGService : cgService;
      const requests = await service.getMyCGRequests();

      setState(prev => ({
        ...prev,
        myRequests: requests,
        loading: false,
      }));
    } catch (error) {
      let errorMessage = 'Failed to load your requests';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, [useMockData]);

  const assignToRequest = useCallback(async (requestId: string): Promise<AssignCGResponse> => {
    setState(prev => ({ ...prev, assignLoading: true, error: null }));

    try {
      const service = useMockData ? mockCGService : cgService;
      const result = await service.assignToRequest(requestId);

      // Refresh both lists after successful assignment
      await Promise.all([loadAvailableRequests(), loadMyRequests()]);

      setState(prev => ({ ...prev, assignLoading: false }));
      
      return result;
    } catch (error) {
      let errorMessage = 'Failed to assign to request';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState(prev => ({
        ...prev,
        assignLoading: false,
        error: errorMessage,
      }));

      throw error;
    }
  }, [useMockData, loadAvailableRequests, loadMyRequests]);

  const reset = useCallback(() => {
    setState({
      availableRequests: [],
      myRequests: [],
      loading: false,
      error: null,
      assignLoading: false,
    });
  }, []);

  return {
    ...state,
    loadAvailableRequests,
    loadMyRequests,
    assignToRequest,
    reset,
  };
}