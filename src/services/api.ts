/**
 * ============================================
 * API Service Layer
 * ============================================
 * Centralized API calls with error handling
 * Uses environment variables for security
 */

import type { Product, ProductsResponse } from '../Types/index';

// ============================================
// Configuration
// ============================================

/**
 * Base API URL from environment variables
 * Falls back to default if not set
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dummyjson.com';
const PRODUCTS_ENDPOINT = import.meta.env.VITE_API_PRODUCTS_ENDPOINT || '/products';
const SEARCH_ENDPOINT = import.meta.env.VITE_API_SEARCH_ENDPOINT || '/products/search';

// ============================================
// Error Messages
// ============================================

const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your internet connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    NOT_FOUND: 'Resource not found.',
    INVALID_RESPONSE: 'Invalid response from server.',
    TIMEOUT: 'Request timed out. Please try again.',
    UNKNOWN: 'An unexpected error occurred.',
};

// ============================================
// API Helper Functions
// ============================================

/**
 * Generic fetch wrapper with error handling
 * @param url - The URL to fetch
 * @returns Promise with typed response
 */
async function fetchAPI<T>(url: string): Promise<T> {
    try {
        // Set timeout for requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        clearTimeout(timeoutId);

        // Handle HTTP errors
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(ERROR_MESSAGES.NOT_FOUND);
            }
            if (response.status >= 500) {
                throw new Error(ERROR_MESSAGES.SERVER_ERROR);
            }
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        return data as T;
    } catch (error) {
        // Handle specific error types
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error(ERROR_MESSAGES.TIMEOUT);
            }
            if (error.message === 'Failed to fetch') {
                throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
            }
            throw error;
        }
        throw new Error(ERROR_MESSAGES.UNKNOWN);
    }
}

// ============================================
// Product API Functions
// ============================================

/**
 * Fetch products with pagination
 * @param limit - Number of products per page
 * @param skip - Number of products to skip
 * @returns ProductsResponse with products and metadata
 */
export async function fetchProducts(
    limit: number = 12,
    skip: number = 0
): Promise<ProductsResponse> {
    const url = `${API_BASE_URL}${PRODUCTS_ENDPOINT}?limit=${limit}&skip=${skip}`;
    return fetchAPI<ProductsResponse>(url);
}

/**
 * Search products by keyword
 * @param query - Search query string
 * @returns ProductsResponse with matching products
 */
export async function searchProducts(query: string): Promise<ProductsResponse> {
    const url = `${API_BASE_URL}${SEARCH_ENDPOINT}?q=${encodeURIComponent(query)}`;
    return fetchAPI<ProductsResponse>(url);
}

/**
 * Fetch single product by ID
 * @param id - Product ID
 * @returns Single product object
 */
export async function fetchProductById(id: string | number): Promise<Product> {
    const url = `${API_BASE_URL}${PRODUCTS_ENDPOINT}/${id}`;
    return fetchAPI<Product>(url);
}

/**
 * Fetch all product categories
 * @returns Array of category strings
 */
export async function fetchCategories(): Promise<string[]> {
    const url = `${API_BASE_URL}${PRODUCTS_ENDPOINT}/categories`;
    return fetchAPI<string[]>(url);
}

/**
 * Fetch products by category
 * @param category - Category name
 * @returns ProductsResponse with products in category
 */
export async function fetchProductsByCategory(
    category: string
): Promise<ProductsResponse> {
    const url = `${API_BASE_URL}${PRODUCTS_ENDPOINT}/category/${encodeURIComponent(category)}`;
    return fetchAPI<ProductsResponse>(url);
}

// ============================================
// Export Configuration
// ============================================

export { API_BASE_URL, ERROR_MESSAGES };