/**
 * ============================================
 * Utility Functions
 * ============================================
 * Helper functions used throughout the application
 */

// ============================================
// Formatting Functions
// ============================================

/**
 * Format price with currency symbol
 * @param price - Price number
 * @param currency - Currency code (default: USD)
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(price);
}

/**
 * Capitalize first letter of text
 * @param text - Text to format
 * @returns Text with first letter capitalized
 */
export function capitalizeFirst(text: string | null | undefined): string {
    if (!text || typeof text !== 'string') return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Truncate text to specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
    if (!text || typeof text !== 'string') return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

// ============================================
// Validation Functions
// ============================================

/**
 * Validate price range
 * @param min - Minimum price
 * @param max - Maximum price
 * @returns Boolean indicating valid range
 */
export function isValidPriceRange(
    min: number | undefined,
    max: number | undefined
): boolean {
    if (min === undefined || max === undefined) return true;
    return min >= 0 && max >= 0 && min <= max;
}

/**
 * Check if product is in stock
 * @param stock - Stock quantity
 * @returns Boolean indicating availability
 */
export function isInStock(stock: number): boolean {
    return stock > 0;
}

// ============================================
// Storage Functions
// ============================================

/**
 * Save data to localStorage
 * @param key - Storage key
 * @param value - Value to store
 */
export function saveToStorage<T>(key: string, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

/**
 * Load data from localStorage
 * @param key - Storage key
 * @param defaultValue - Default value if not found
 * @returns Stored value or default
 */
export function loadFromStorage<T>(key: string, defaultValue: T): T {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
}

// ============================================
// Constants
// ============================================

export const STORAGE_KEYS = {
    CART: 'reactstore_cart',
    FILTERS: 'reactstore_filters',
    THEME: 'reactstore_theme',
} as const;

export const ITEMS_PER_PAGE = parseInt(
    import.meta.env.VITE_ITEMS_PER_PAGE || '12'
);

export const TAX_RATE = parseFloat(import.meta.env.VITE_TAX_RATE || '0.08');