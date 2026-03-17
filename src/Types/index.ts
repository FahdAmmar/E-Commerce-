/**
 * ============================================
 * Type Definitions - Centralized Type System
 * ============================================
 * This file contains all TypeScript interfaces and types
 * used throughout the application for better maintainability
 */

// ============================================
// Product Types
// ============================================

/**
 * Represents a single product from the API
 */
export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage?: number;
    rating: number;
    stock: number;
    brand?: string;
    category: string;
    thumbnail: string;
    images: string[];
    tags?: string[];
    sku?: string;
    weight?: number;
    dimensions?: {
        width: number;
        height: number;
        depth: number;
    };
    warrantyInformation?: string;
    shippingInformation?: string;
    availabilityStatus?: string;
    reviews?: Review[];
    returnPolicy?: string;
    minimumOrderQuantity?: number;
    meta?: {
        createdAt: string;
        updatedAt: string;
        barcode: string;
        qrCode: string;
    };
}

/**
 * Product review interface
 */
export interface Review {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
}

/**
 * API response for products list
 */
export interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

// ============================================
// Cart Types
// ============================================

/**
 * Item in the shopping cart
 */
export interface CartItem {
    id: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
    category?: string;
}

/**
 * Cart state interface
 */
export interface CartState {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
}

/**
 * Cart action types for useReducer
 */
export type CartActionType =
    | { type: 'ADD_TO_CART'; payload: Omit<CartItem, 'quantity'> }
    | { type: 'REMOVE_FROM_CART'; payload: { id: string } }
    | { type: 'INCREASE_QUANTITY'; payload: { id: string } }
    | { type: 'DECREASE_QUANTITY'; payload: { id: string } }
    | { type: 'CLEAR_CART' }
    | { type: 'LOAD_CART'; payload: CartItem[] };

// ============================================
// Filter Types
// ============================================

/**
 * Filter state interface
 */
export interface FilterState {
    searchQuery: string;
    selectedCategory: string;
    minPrice: number | undefined;
    maxPrice: number | undefined;
    keyword: string;
    sortBy: SortOption;
}

/**
 * Sort options available
 */
export type SortOption = 'all' | 'cheap' | 'expensive' | 'popular';

/**
 * Filter action types for useReducer
 */
export type FilterActionType =
    | { type: 'SET_SEARCH_QUERY'; payload: string }
    | { type: 'SET_CATEGORY'; payload: string }
    | { type: 'SET_MIN_PRICE'; payload: number | undefined }
    | { type: 'SET_MAX_PRICE'; payload: number | undefined }
    | { type: 'SET_KEYWORD'; payload: string }
    | { type: 'SET_SORT'; payload: SortOption }
    | { type: 'RESET_FILTERS' };

// ============================================
// UI Types
// ============================================

/**
 * Loading states
 */
export interface LoadingState {
    products: boolean;
    categories: boolean;
    productDetail: boolean;
}

/**
 * Error states
 */
export interface ErrorState {
    products: string | null;
    categories: string | null;
    productDetail: string | null;
}

/**
 * Pagination state
 */
export interface PaginationState {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
}