// src/context/AppContext.tsx
// =================== إدارة الحالة مع localStorage و Dark Mode ===================

import React, { createContext, useContext, useReducer, type ReactNode, useEffect } from 'react';
import type { AppState, Action, AppContextType, Product, CartItem, Category } from '../types/index';
import axios from 'axios';

// صور للفئات (يمكنك استخدام صور حقيقية من API)
const categoryImages: Record<string, { image: string; icon: string }> = {
    smartphones: {
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
        icon: '📱'
    },
    laptops: {
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
        icon: '💻'
    },
    fragrances: {
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500',
        icon: '🌸'
    },
    skincare: {
        image: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=500',
        icon: '🧴'
    },
    groceries: {
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
        icon: '🛒'
    },
    'home-decoration': {
        image: 'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=500',
        icon: '🏠'
    },
    furniture: {
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',
        icon: '🪑'
    },
    tops: {
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500',
        icon: '👕'
    },
    'womens-dresses': {
        image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500',
        icon: '👗'
    },
    'womens-shoes': {
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500',
        icon: '👠'
    },
    'mens-shirts': {
        image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500',
        icon: '👔'
    },
    'mens-shoes': {
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
        icon: '👞'
    },
    'mens-watches': {
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500',
        icon: '⌚'
    },
    'womens-watches': {
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500',
        icon: '⌚'
    },
    'womens-bags': {
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500',
        icon: '👜'
    },
    'womens-jewellery': {
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500',
        icon: '💍'
    },
    sunglasses: {
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500',
        icon: '🕶️'
    },
    automotive: {
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500',
        icon: '🚗'
    },
    motorcycle: {
        image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500',
        icon: '🏍️'
    },
    lighting: {
        image: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?w=500',
        icon: '💡'
    }
};

// الحالة الابتدائية
const initialState: AppState = {
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
    cart: [],
    wishlist: [],
    theme: 'light', // القيمة الافتراضية
    categories: [],
};

// مفتاح التخزين في localStorage
const STORAGE_KEY = 'ecommerce_app_state';

// تحميل الحالة من localStorage
const loadStateFromStorage = (): Partial<AppState> => {
    try {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
            return JSON.parse(savedState);
        }
    } catch (error) {
        console.error('Failed to load state from localStorage:', error);
    }
    return {};
};

// إنشاء السياق
const AppContext = createContext<AppContextType | undefined>(undefined);

// الـ Reducer لإدارة الحالة
const appReducer = (state: AppState, action: Action): AppState => {
    let newState: AppState;

    switch (action.type) {
        case 'FETCH_PRODUCTS_START':
        case 'FETCH_PRODUCT_START':
            newState = {
                ...state,
                loading: true,
                error: null,
            };
            break;

        case 'FETCH_PRODUCTS_SUCCESS':
            newState = {
                ...state,
                loading: false,
                products: action.payload,
            };
            break;

        case 'FETCH_PRODUCT_SUCCESS':
            newState = {
                ...state,
                loading: false,
                currentProduct: action.payload,
            };
            break;

        case 'FETCH_PRODUCTS_ERROR':
        case 'FETCH_PRODUCT_ERROR':
            newState = {
                ...state,
                loading: false,
                error: action.payload,
            };
            break;

        case 'ADD_TO_CART': {
            const existingItem = state.cart.find((item: CartItem) => item.id === action.payload.id);

            if (existingItem) {
                newState = {
                    ...state,
                    cart: state.cart.map((item: CartItem) =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            } else {
                const newCartItem: CartItem = {
                    id: action.payload.id,
                    title: action.payload.title,
                    price: action.payload.price,
                    quantity: 1,
                    thumbnail: action.payload.thumbnail,
                };
                newState = {
                    ...state,
                    cart: [...state.cart, newCartItem],
                };
            }
            break;
        }

        case 'REMOVE_FROM_CART':
            newState = {
                ...state,
                cart: state.cart.filter((item: CartItem) => item.id !== action.payload),
            };
            break;

        case 'UPDATE_CART_QUANTITY':
            newState = {
                ...state,
                cart: state.cart.map((item: CartItem) =>
                    item.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ).filter((item: CartItem) => item.quantity > 0),
            };
            break;

        case 'TOGGLE_WISHLIST': {
            const isInWishlist = state.wishlist.includes(action.payload);
            newState = {
                ...state,
                wishlist: isInWishlist
                    ? state.wishlist.filter((id: number) => id !== action.payload)
                    : [...state.wishlist, action.payload],
            };
            break;
        }

        case 'TOGGLE_THEME':
            newState = {
                ...state,
                theme: state.theme === 'light' ? 'dark' : 'light',
            };
            break;

        case 'SET_CATEGORIES':
            newState = {
                ...state,
                categories: action.payload,
            };
            break;

        case 'LOAD_STATE_FROM_STORAGE':
            newState = {
                ...state,
                ...action.payload,
            };
            break;

        case 'CLEAR_ERROR':
            newState = {
                ...state,
                error: null,
            };
            break;

        default:
            return state;
    }

    // حفظ الحالة في localStorage بعد كل تغيير
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            cart: newState.cart,
            wishlist: newState.wishlist,
            theme: newState.theme,
        }));
    } catch (error) {
        console.error('Failed to save state to localStorage:', error);
    }

    return newState;
};

// مزود السياق (Provider)
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // تحميل الحالة المحفوظة
    const savedState = loadStateFromStorage();
    const [state, dispatch] = useReducer(appReducer, {
        ...initialState,
        ...savedState,
    });

    // إعداد axios
    const api = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL || "https://dummyjson.com",
        timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // تطبيق الثيم على عنصر html
    useEffect(() => {
        const root = document.documentElement;
        if (state.theme === 'dark') {
            root.classList.add('dark');
            root.style.colorScheme = 'dark';
        } else {
            root.classList.remove('dark');
            root.style.colorScheme = 'light';
        }
    }, [state.theme]);

    // جلب جميع المنتجات
    const fetchProducts = async () => {
        try {
            dispatch({ type: 'FETCH_PRODUCTS_START' });

            const response = await api.get('/products');
            const products: Product[] = response.data.products;

            dispatch({
                type: 'FETCH_PRODUCTS_SUCCESS',
                payload: products
            });

            // إنشاء الفئات من المنتجات
            const categories: Category[] = [];

            products.forEach((product: Product) => {
                const existing = categories.find((c: Category) => c.name === product.category);

                if (existing) {
                    existing.count++;
                } else {
                    categories.push({
                        name: product.category,
                        count: 1,
                        image: categoryImages[product.category]?.image || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500',
                        icon: categoryImages[product.category]?.icon || '📦'
                    });
                }
            });

            dispatch({ type: 'SET_CATEGORIES', payload: categories });
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
        dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id, quantity } });
    };

    // إضافة/إزالة من المفضلة
    const toggleWishlist = (id: number) => {
        dispatch({ type: 'TOGGLE_WISHLIST', payload: id });
    };

    // تبديل الثيم
    const toggleTheme = () => {
        dispatch({ type: 'TOGGLE_THEME' });
    };

    // جلب المنتجات حسب الفئة
    const getProductsByCategory = (category: string) => {
        return state.products.filter((product: Product) => product.category === category);
    };

    const contextValue: AppContextType = {
        state,
        dispatch,
        fetchProducts,
        fetchProductById,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleWishlist,
        toggleTheme,
        getProductsByCategory,
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