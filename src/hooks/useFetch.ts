/**
 * ============================================
 * Custom Fetch Hook
 * ============================================
 * Reusable hook for data fetching with loading and error states
 */

import { useState, useEffect, useCallback } from 'react';

// ============================================
// Types
// ============================================

interface UseFetchResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

// ============================================
// Hook Implementation
// ============================================

/**
 * Custom hook for fetching data with automatic state management
 * @param fetchFunction - Async function that returns data
 * @param dependencies - Array of dependencies to trigger refetch
 * @returns Object with data, loading, error, and refetch
 */
function useFetch<T>(
    fetchFunction: () => Promise<T>,
    dependencies: any[] = []
): UseFetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Memoized fetch function
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await fetchFunction();
            setData(result);
        } catch (err) {
            // Handle error messages
            const errorMessage =
                err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(errorMessage);
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [fetchFunction]);

    // Effect to fetch data on mount and dependency changes
    useEffect(() => {
        fetchData();
    }, [...dependencies, fetchData]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
}

export default useFetch;