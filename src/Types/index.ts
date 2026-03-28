// src/types/index.ts

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage?: number;
    rating?: number;
    stock?: number;
    brand?: string;
    category: string;
    thumbnail: string;
    images?: string[];
}

export interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    thumbnail: string;
}

export interface Category {
    name: string;
    count: number;
    image: string;
    icon: string;
}

export interface AppState {
    products: Product[];
    currentProduct: Product | null;
    loading: boolean;
    error: string | null;
    cart: CartItem[];
    wishlist: number[];
    theme: 'light' | 'dark';
    categories: Category[];
}

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
    | { type: 'TOGGLE_THEME' }
    | { type: 'SET_CATEGORIES'; payload: Category[] }
    | { type: 'LOAD_STATE_FROM_STORAGE'; payload: Partial<AppState> }
    | { type: 'CLEAR_ERROR' };

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