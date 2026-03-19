// src/Types/index.ts
// =================== تعريف أنواع البيانات ===================

// نوع المنتج
export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
}

// نوع عنصر السلة
export interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    thumbnail: string;
}

// نوع الفئة مع صورتها
export interface Category {
    name: string;
    image: string;
    count: number;
    icon: string;
}

// نوع الثيم
export type ThemeMode = 'light' | 'dark';

// نوع حالة التطبيق
export interface AppState {
    products: Product[];
    currentProduct: Product | null;
    loading: boolean;
    error: string | null;
    cart: CartItem[];
    wishlist: number[];
    theme: ThemeMode;
    categories: Category[];
}

// أنواع الأكشنز
export type Action =
    | { type: 'FETCH_PRODUCTS_START' }
    | { type: 'FETCH_PRODUCTS_SUCCESS'; payload: Product[] }
    | { type: 'FETCH_PRODUCTS_ERROR'; payload: string }
    | { type: 'FETCH_PRODUCT_START' }
    | { type: 'FETCH_PRODUCT_SUCCESS'; payload: Product }
    | { type: 'FETCH_PRODUCT_ERROR'; payload: string }
    | { type: 'ADD_TO_CART'; payload: Product }
    | { type: 'REMOVE_FROM_CART'; payload: number }
    | { type: 'UPDATE_CART_QUANTITY'; payload: { id: number; quantity: number } }
    | { type: 'TOGGLE_WISHLIST'; payload: number }
    | { type: 'CLEAR_ERROR' }
    | { type: 'TOGGLE_THEME' }
    | { type: 'LOAD_STATE_FROM_STORAGE'; payload: Partial<AppState> }
    | { type: 'SET_CATEGORIES'; payload: Category[] };

// نوع السياق
export interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<Action>;
    fetchProducts: () => Promise<void>;
    fetchProductById: (id: number) => Promise<void>;
    addToCart: (product: Product) => void;
    removeFromCart: (id: number) => void;
    updateCartQuantity: (id: number, quantity: number) => void;
    toggleWishlist: (id: number) => void;
    toggleTheme: () => void;
    getProductsByCategory: (category: string) => Product[];
}