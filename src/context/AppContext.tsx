// src/context/AppContext.tsx
// =================== إدارة الحالة باستخدام useContext و useReducer ===================

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { AppState, Action, AppContextType, Product, CartItem } from '../types/index'
import axios from 'axios';

// الحالة الابتدائية
const initialState: AppState = {
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
    cart: [],
    wishlist: [],
};

// إنشاء السياق
const AppContext = createContext<AppContextType | undefined>(undefined);

// الـ Reducer لإدارة الحالة
const appReducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case 'FETCH_PRODUCTS_START':
        case 'FETCH_PRODUCT_START':
            return {
                ...state,
                loading: true,
                error: null,
            };

        case 'FETCH_PRODUCTS_SUCCESS':
            return {
                ...state,
                loading: false,
                products: action.payload,
            };

        case 'FETCH_PRODUCT_SUCCESS':
            return {
                ...state,
                loading: false,
                currentProduct: action.payload,
            };

        case 'FETCH_PRODUCTS_ERROR':
        case 'FETCH_PRODUCT_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case 'ADD_TO_CART': {
            // التحقق من وجود المنتج في السلة
            const existingItem = state.cart.find(item => item.id === action.payload.id);

            if (existingItem) {
                // إذا كان موجوداً، نزيد الكمية
                return {
                    ...state,
                    cart: state.cart.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            }

            // إذا لم يكن موجوداً، نضيفه جديد
            const newCartItem: CartItem = {
                id: action.payload.id,
                title: action.payload.title,
                price: action.payload.price,
                quantity: 1,
                thumbnail: action.payload.thumbnail,
            };

            return {
                ...state,
                cart: [...state.cart, newCartItem],
            };
        }

        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cart: state.cart.filter(item => item.id !== action.payload),
            };

        case 'UPDATE_CART_QUANTITY':
            return {
                ...state,
                cart: state.cart.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
            };

        case 'TOGGLE_WISHLIST': {
            const isInWishlist = state.wishlist.includes(action.payload);

            return {
                ...state,
                wishlist: isInWishlist
                    ? state.wishlist.filter(id => id !== action.payload)
                    : [...state.wishlist, action.payload],
            };
        }

        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
};

// مزود السياق (Provider)
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // إعداد axios مع الأمان
    const api = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // =================== دوال API ===================

    // جلب جميع المنتجات
    const fetchProducts = async () => {
        try {
            dispatch({ type: 'FETCH_PRODUCTS_START' });

            const response = await api.get('/products');

            dispatch({
                type: 'FETCH_PRODUCTS_SUCCESS',
                payload: response.data.products
            });
        } catch (error) {
            let errorMessage = 'Failed to fetch products';

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message;
            }

            dispatch({
                type: 'FETCH_PRODUCTS_ERROR',
                payload: errorMessage
            });
        }
    };

    // جلب منتج محدد
    const fetchProductById = async (id: number) => {
        try {
            dispatch({ type: 'FETCH_PRODUCT_START' });

            const response = await api.get(`/products/${id}`);

            dispatch({
                type: 'FETCH_PRODUCT_SUCCESS',
                payload: response.data
            });
        } catch (error) {
            let errorMessage = 'Failed to fetch product';

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message;
            }

            dispatch({
                type: 'FETCH_PRODUCT_ERROR',
                payload: errorMessage
            });
        }
    };

    // إضافة إلى السلة
    const addToCart = (product: Product) => {
        dispatch({ type: 'ADD_TO_CART', payload: product });
    };

    // إزالة من السلة
    const removeFromCart = (id: number) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    };

    // تحديث كمية المنتج في السلة
    const updateCartQuantity = (id: number, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(id);
            return;
        }

        dispatch({
            type: 'UPDATE_CART_QUANTITY',
            payload: { id, quantity }
        });
    };

    // إضافة/إزالة من المفضلة
    const toggleWishlist = (id: number) => {
        dispatch({ type: 'TOGGLE_WISHLIST', payload: id });
    };

    // القيمة التي سيوفرها السياق
    const contextValue: AppContextType = {
        state,
        dispatch,
        fetchProducts,
        fetchProductById,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleWishlist,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

// Hook مخصص لاستخدام السياق
export const useAppContext = () => {
    const context = useContext(AppContext);

    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }

    return context;
};