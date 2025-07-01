import { useState, useCallback } from 'react';
import { cgService, CGInRangeParams, CGDisplayData } from '../services/cg.service';

interface UseCGInRangeState {
    data: CGDisplayData[];
    loading: boolean;
    error: string | null;
}

interface UseCGInRangeReturn extends UseCGInRangeState {
    searchCGInRange: (params: CGInRangeParams) => Promise<void>;
    reset: () => void;
}

export function useCGInRange(): UseCGInRangeReturn {
    const [state, setState] = useState<UseCGInRangeState>({
        data: [],
        loading: false,
        error: null,
    });

    const searchCGInRange = useCallback(
        async (params: CGInRangeParams): Promise<void> => {
            setState(prev => ({
                ...prev,
                loading: true,
                error: null,
            }));

            try {
                const result = await cgService.getCGInRange(params);

                setState(prev => ({
                    ...prev,
                    data: result,
                    loading: false,
                }));
            } catch (error) {
                let errorMessage = 'Failed to search for service providers';

                if (error instanceof Error) {
                    errorMessage = error.message;
                }

                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: errorMessage,
                }));

                throw error;
            }
        },
        []
    );

    const reset = useCallback(() => {
        setState({
            data: [],
            loading: false,
            error: null,
        });
    }, []);

    return {
        ...state,
        searchCGInRange,
        reset,
    };
}