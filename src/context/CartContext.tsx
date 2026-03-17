/**
 * ============================================
 * Cart Context - State Management with useReducer
 * ============================================
 * Manages shopping cart state using React Context and useReducer
 * Provides type-safe actions and persistent storage
 */

import React, {
    createContext,
    useContext,
    useReducer,
    useEffect,
    ReactNode,
} from 'react';
import type {
    CartItem,
    CartState,
    CartActionType,
} from '../Types/index';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../utils/helpers';

// ============================================
// Initial State
// ============================================

/**
 * Default cart state
 */
const initialCartState: CartState = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
};

// ============================================
// Reducer Function
// ============================================

/**
 * Cart reducer function for state management
 * Handles all cart-related actions
 * @param state - Current cart state
 * @param action - Action to perform
 * @returns New cart state
 */
function cartReducer(state: CartState, action: CartActionType): CartState {
    switch (action.type) {
        // ========================================
        // ADD_TO_CART: Add item or increase quantity
        // ========================================
        case 'ADD_TO_CART': {
            const existingItemIndex = state.items.findIndex(
                (item) => item.id === action.payload.id
            );

            // If item exists, increase quantity
            if (existingItemIndex !== -1) {
                const updatedItems = state.items.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );

                return {
                    ...state,
                    items: updatedItems,
                    totalItems: state.totalItems + 1,
                    totalPrice: state.totalPrice + action.payload.price,
                };
            }

            // If new item, add to cart
            const newItem: CartItem = {
                ...action.payload,
                quantity: 1,
            };

            return {
                ...state,
                items: [...state.items, newItem],
                totalItems: state.totalItems + 1,
                totalPrice: state.totalPrice + action.payload.price,
            };
        }

        // ========================================
        // REMOVE_FROM_CART: Remove item completely
        // ========================================
        case 'REMOVE_FROM_CART': {
            const itemToRemove = state.items.find(
                (item) => item.id === action.payload.id
            );

            if (!itemToRemove) return state;

            return {
                ...state,
                items: state.items.filter((item) => item.id !== action.payload.id),
                totalItems: state.totalItems - itemToRemove.quantity,
                totalPrice:
                    state.totalPrice - itemToRemove.price * itemToRemove.quantity,
            };
        }

        // ========================================
        // INCREASE_QUANTITY: Increment item quantity
        // ========================================
        case 'INCREASE_QUANTITY': {
            const updatedItems = state.items.map((item) =>
                item.id === action.payload.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );

            const item = state.items.find((item) => item.id === action.payload.id);
            const priceToAdd = item?.price || 0;

            return {
                ...state,
                items: updatedItems,
                totalItems: state.totalItems + 1,
                totalPrice: state.totalPrice + priceToAdd,
            };
        }

        // ========================================
        // DECREASE_QUANTITY: Decrement or remove
        // ========================================
        case 'DECREASE_QUANTITY': {
            const item = state.items.find((item) => item.id === action.payload.id);

            if (!item) return state;

            // If quantity is 1, remove item
            if (item.quantity === 1) {
                return {
                    ...state,
                    items: state.items.filter((item) => item.id !== action.payload.id),
                    totalItems: state.totalItems - 1,
                    totalPrice: state.totalPrice - item.price,
                };
            }

            // Otherwise, decrease quantity
            const updatedItems = state.items.map((item) =>
                item.id === action.payload.id
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            );

            return {
                ...state,
                items: updatedItems,
                totalItems: state.totalItems - 1,
                totalPrice: state.totalPrice - item.price,
            };
        }

        // ========================================
        // CLEAR_CART: Empty the cart
        // ========================================
        case 'CLEAR_CART': {
            return initialCartState;
        }

        // ========================================
        // LOAD_CART: Load cart from storage
        // ========================================
        case 'LOAD_CART': {
            const items = action.payload;
            const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            return {
                items,
                totalItems,
                totalPrice,
            };
        }

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
 * Cart context interface
 */
interface CartContextType {
    state: CartState;
    addToCart: (product: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: string) => void;
    increaseQuantity: (id: string) => void;
    decreaseQuantity: (id: string) => void;
    clearCart: () => void;
}

// Create context with undefined default
const CartContext = createContext<CartContextType | undefined>(undefined);

// ============================================
// Provider Component
// ============================================

/**
 * Cart Provider component
 * Wraps the application to provide cart state
 */
export const CartProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    // Initialize reducer with stored data
    const [state, dispatch] = useReducer(cartReducer, initialCartState);

    // ========================================
    // Load cart from localStorage on mount
    // ========================================
    useEffect(() => {
        const storedCart = loadFromStorage<CartItem[]>(STORAGE_KEYS.CART, []);
        if (storedCart.length > 0) {
            dispatch({ type: 'LOAD_CART', payload: storedCart });
        }
    }, []);

    // ========================================
    // Save cart to localStorage on changes
    // ========================================
    useEffect(() => {
        saveToStorage(STORAGE_KEYS.CART, state.items);
    }, [state.items]);

    // ========================================
    // Action dispatchers
    // ========================================

    /**
     * Add product to cart
     */
    const addToCart = (product: Omit<CartItem, 'quantity'>) => {
        dispatch({ type: 'ADD_TO_CART', payload: product });
    };

    /**
     * Remove product from cart
     */
    const removeFromCart = (id: string) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
    };

    /**
     * Increase product quantity
     */
    const increaseQuantity = (id: string) => {
        dispatch({ type: 'INCREASE_QUANTITY', payload: { id } });
    };

    /**
     * Decrease product quantity
     */
    const decreaseQuantity = (id: string) => {
        dispatch({ type: 'DECREASE_QUANTITY', payload: { id } });
    };

    /**
     * Clear entire cart
     */
    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    // ========================================
    // Context value
    // ========================================
    const value: CartContextType = {
        state,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// ============================================
// Custom Hook
// ============================================

/**
 * Custom hook to use cart context
 * @returns Cart context value
 * @throws Error if used outside provider
 */
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error(
            'useCart must be used within a CartProvider. ' +
            'Make sure your component is wrapped with <CartProvider>.'
        );
    }

    return context;
};