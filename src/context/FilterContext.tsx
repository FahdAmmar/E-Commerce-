/**
 * ============================================
 * Filter Context - State Management with useReducer
 * ============================================
 * Manages filter and search state using React Context and useReducer
 * Provides type-safe actions for filtering products
 */

import React, {
    createContext,
    useContext,
    useReducer,
    ReactNode,
} from 'react';
import type {
    FilterState,
    FilterActionType,
    SortOption,
} from '../Types/index';

// ============================================
// Initial State
// ============================================

/**
 * Default filter state
 */
const initialFilterState: FilterState = {
    searchQuery: '',
    selectedCategory: '',
    minPrice: undefined,
    maxPrice: undefined,
    keyword: '',
    sortBy: 'all',
};

// ============================================
// Reducer Function
// ============================================

/**
 * Filter reducer function for state management
 * Handles all filter-related actions
 * @param state - Current filter state
 * @param action - Action to perform
 * @returns New filter state
 */
function filterReducer(
    state: FilterState,
    action: FilterActionType
): FilterState {
    switch (action.type) {
        // ========================================
        // SET_SEARCH_QUERY: Update search text
        // ========================================
        case 'SET_SEARCH_QUERY':
            return {
                ...state,
                searchQuery: action.payload,
            };

        // ========================================
        // SET_CATEGORY: Update selected category
        // ========================================
        case 'SET_CATEGORY':
            return {
                ...state,
                selectedCategory: action.payload,
            };

        // ========================================
        // SET_MIN_PRICE: Update minimum price
        // ========================================
        case 'SET_MIN_PRICE':
            return {
                ...state,
                minPrice: action.payload,
            };

        // ========================================
        // SET_MAX_PRICE: Update maximum price
        // ========================================
        case 'SET_MAX_PRICE':
            return {
                ...state,
                maxPrice: action.payload,
            };

        // ========================================
        // SET_KEYWORD: Update keyword filter
        // ========================================
        case 'SET_KEYWORD':
            return {
                ...state,
                keyword: action.payload,
            };

        // ========================================
        // SET_SORT: Update sort option
        // ========================================
        case 'SET_SORT':
            return {
                ...state,
                sortBy: action.payload,
            };

        // ========================================
        // RESET_FILTERS: Clear all filters
        // ========================================
        case 'RESET_FILTERS':
            return initialFilterState;

        // ========================================
        // Default case
        // ========================================
        default:
            return state;
    }
}

// ============================================
// Context Definition
// ============================================

/**
 * Filter context interface
 */
interface FilterContextType {
    state: FilterState;
    setSearchQuery: (query: string) => void;
    setCategory: (category: string) => void;
    setMinPrice: (price: number | undefined) => void;
    setMaxPrice: (price: number | undefined) => void;
    setKeyword: (keyword: string) => void;
    setSort: (sort: SortOption) => void;
    resetFilters: () => void;
}

// Create context with undefined default
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// ============================================
// Provider Component
// ============================================

/**
 * Filter Provider component
 * Wraps the application to provide filter state
 */
export const FilterProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(filterReducer, initialFilterState);

    // ========================================
    // Action dispatchers
    // ========================================

    /**
     * Set search query
     */
    const setSearchQuery = (query: string) => {
        dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    };

    /**
     * Set selected category
     */
    const setCategory = (category: string) => {
        dispatch({ type: 'SET_CATEGORY', payload: category });
    };

    /**
     * Set minimum price
     */
    const setMinPrice = (price: number | undefined) => {
        dispatch({ type: 'SET_MIN_PRICE', payload: price });
    };

    /**
     * Set maximum price
     */
    const setMaxPrice = (price: number | undefined) => {
        dispatch({ type: 'SET_MAX_PRICE', payload: price });
    };

    /**
     * Set keyword filter
     */
    const setKeyword = (keyword: string) => {
        dispatch({ type: 'SET_KEYWORD', payload: keyword });
    };

    /**
     * Set sort option
     */
    const setSort = (sort: SortOption) => {
        dispatch({ type: 'SET_SORT', payload: sort });
    };

    /**
     * Reset all filters
     */
    const resetFilters = () => {
        dispatch({ type: 'RESET_FILTERS' });
    };

    // ========================================
    // Context value
    // ========================================
    const value: FilterContextType = {
        state,
        setSearchQuery,
        setCategory,
        setMinPrice,
        setMaxPrice,
        setKeyword,
        setSort,
        resetFilters,
    };

    return (
        <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
    );
};

// ============================================
// Custom Hook
// ============================================

/**
 * Custom hook to use filter context
 * @returns Filter context value
 * @throws Error if used outside provider
 */
export const useFilter = (): FilterContextType => {
    const context = useContext(FilterContext);

    if (!context) {
        throw new Error(
            'useFilter must be used within a FilterProvider. ' +
            'Make sure your component is wrapped with <FilterProvider>.'
        );
    }

    return context;
};