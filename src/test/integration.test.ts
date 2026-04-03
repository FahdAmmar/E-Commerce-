import { describe, it, expect } from 'vitest'
import type { Product, CartItem, Category, AppState } from '../types/index'

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'iPhone 9',
    description: 'An apple mobile which is nothing like apple',
    price: 549,
    discountPercentage: 12.96,
    rating: 4.69,
    stock: 94,
    brand: 'Apple',
    category: 'smartphones',
    thumbnail: 'https://cdn.dummyjson.com/products-images/1/thumbnail.jpg'
  },
  {
    id: 2,
    title: 'iPhone X',
    description: 'SIM-Free, Model A19211',
    price: 899,
    discountPercentage: 17.94,
    rating: 4.44,
    stock: 34,
    brand: 'Apple',
    category: 'smartphones',
    thumbnail: 'https://cdn.dummyjson.com/products-images/2/thumbnail.jpg'
  },
  {
    id: 3,
    title: 'MacBook Pro',
    description: 'MacBook Pro with M2 chip',
    price: 1999,
    discountPercentage: 0,
    rating: 4.9,
    stock: 50,
    brand: 'Apple',
    category: 'laptops',
    thumbnail: 'https://cdn.dummyjson.com/products-images/4/thumbnail.jpg'
  }
]

const initialState: AppState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  cart: [],
  wishlist: [],
  theme: 'light',
  categories: []
}

describe('Cart-Wishlist Integration', () => {
  it('should sync cart and wishlist operations', () => {
    let state = { ...initialState }
    
    const addToCart = (product: Product) => {
      const existing = state.cart.find(item => item.id === product.id)
      if (existing) {
        state.cart = state.cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        state.cart = [...state.cart, { ...product, quantity: 1 }]
      }
    }
    
    const toggleWishlist = (id: number) => {
      state.wishlist = state.wishlist.includes(id)
        ? state.wishlist.filter(wid => wid !== id)
        : [...state.wishlist, id]
    }
    
    addToCart(mockProducts[0])
    expect(state.cart.length).toBe(1)
    expect(state.cart[0].quantity).toBe(1)
    
    addToCart(mockProducts[0])
    expect(state.cart.length).toBe(1)
    expect(state.cart[0].quantity).toBe(2)
    
    toggleWishlist(mockProducts[0].id)
    expect(state.wishlist).toContain(1)
    
    toggleWishlist(mockProducts[0].id)
    expect(state.wishlist).not.toContain(1)
  })
})

describe('Category-Product Integration', () => {
  it('should correctly link categories with products', () => {
    const generateCategoriesFromProducts = (products: Product[]): Category[] => {
      const categoryMap = new Map<string, { count: number; image?: string; icon?: string }>()
      
      products.forEach(product => {
        const existing = categoryMap.get(product.category) || { count: 0 }
        categoryMap.set(product.category, {
          count: existing.count + 1,
          image: existing.image,
          icon: existing.icon
        })
      })
      
      return Array.from(categoryMap.entries()).map(([name, data]) => ({
        name,
        count: data.count,
        image: data.image || '',
        icon: data.icon || ''
      }))
    }
    
    const categories = generateCategoriesFromProducts(mockProducts)
    
    expect(categories.find(c => c.name === 'smartphones')?.count).toBe(2)
    expect(categories.find(c => c.name === 'laptops')?.count).toBe(1)
  })
})

describe('Price Calculation Integration', () => {
  it('should calculate order totals with all components', () => {
    const cartItems: CartItem[] = [
      { ...mockProducts[0], quantity: 2 },
      { ...mockProducts[1], quantity: 1 }
    ]
    
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = subtotal >= 50 ? 0 : 5.99
    const tax = subtotal * 0.1
    const promoDiscount = 0
    const total = subtotal + shipping + tax - promoDiscount
    
    expect(subtotal).toBe(1997)
    expect(shipping).toBe(0)
    expect(tax).toBeCloseTo(199.7)
    expect(total).toBeCloseTo(2196.7)
  })
  
  it('should apply discount and recalculate totals', () => {
    const subtotal = 100
    const shipping = 0
    const tax = subtotal * 0.1
    const promoDiscount = subtotal * 0.1
    const total = subtotal + shipping + tax - promoDiscount
    
    expect(total).toBe(100)
  })
})

describe('Search and Filter Integration', () => {
  it('should combine search and filter criteria', () => {
    const filterProducts = (
      products: Product[],
      searchTerm: string,
      category: string,
      minPrice: number,
      maxPrice: number
    ) => {
      return products.filter(product => {
        const matchesSearch = searchTerm === '' ||
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesCategory = category === 'all' || product.category === category
        
        const matchesPrice = product.price >= minPrice && product.price <= maxPrice
        
        return matchesSearch && matchesCategory && matchesPrice
      })
    }
    
    const results = filterProducts(mockProducts, 'iphone', 'all', 0, 2000)
    expect(results.length).toBe(2)
    
    const filteredResults = filterProducts(mockProducts, 'iphone', 'smartphones', 500, 1000)
    expect(filteredResults.length).toBe(2)
    
    const noResults = filterProducts(mockProducts, 'macbook', 'smartphones', 0, 1000)
    expect(noResults.length).toBe(0)
  })
})

describe('Sort and Pagination Integration', () => {
  it('should sort products correctly', () => {
    const sortProducts = (products: Product[], sortBy: string) => {
      const sorted = [...products]
      switch (sortBy) {
        case 'price-asc':
          return sorted.sort((a, b) => a.price - b.price)
        case 'price-desc':
          return sorted.sort((a, b) => b.price - a.price)
        case 'rating-desc':
          return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        case 'discount-desc':
          return sorted.sort((a, b) => (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0))
        default:
          return sorted
      }
    }
    
    const sortedAsc = sortProducts(mockProducts, 'price-asc')
    expect(sortedAsc[0].price).toBe(549)
    expect(sortedAsc[2].price).toBe(1999)
    
    const sortedDesc = sortProducts(mockProducts, 'price-desc')
    expect(sortedDesc[0].price).toBe(1999)
    expect(sortedDesc[2].price).toBe(549)
  })
  
  it('should paginate results correctly', () => {
    const paginateProducts = (products: Product[], page: number, pageSize: number) => {
      const start = (page - 1) * pageSize
      const end = start + pageSize
      return products.slice(start, end)
    }
    
    const page1 = paginateProducts(mockProducts, 1, 2)
    expect(page1.length).toBe(2)
    expect(page1[0].id).toBe(1)
    
    const page2 = paginateProducts(mockProducts, 2, 2)
    expect(page2.length).toBe(1)
    expect(page2[0].id).toBe(3)
  })
})

describe('Theme-LocalStorage Integration', () => {
  it('should persist theme preference', () => {
    const saveTheme = (theme: 'light' | 'dark') => {
      localStorage.setItem('ecommerce_theme', theme)
    }
    
    const loadTheme = (): 'light' | 'dark' => {
      return (localStorage.getItem('ecommerce_theme') as 'light' | 'dark') || 'light'
    }
    
    saveTheme('dark')
    expect(loadTheme()).toBe('dark')
    
    saveTheme('light')
    expect(loadTheme()).toBe('light')
    
    localStorage.removeItem('ecommerce_theme')
  })
})

describe('State Persistence Integration', () => {
  it('should save and restore cart state', () => {
    const cartItems: CartItem[] = [
      { ...mockProducts[0], quantity: 2 },
      { ...mockProducts[1], quantity: 1 }
    ]
    
    localStorage.setItem('ecommerce_cart', JSON.stringify(cartItems))
    
    const restoredCart: CartItem[] = JSON.parse(
      localStorage.getItem('ecommerce_cart') || '[]'
    )
    
    expect(restoredCart.length).toBe(2)
    expect(restoredCart[0].quantity).toBe(2)
    
    localStorage.removeItem('ecommerce_cart')
  })
  
  it('should save and restore wishlist state', () => {
    const wishlistIds = [1, 2, 3]
    
    localStorage.setItem('ecommerce_wishlist', JSON.stringify(wishlistIds))
    
    const restoredWishlist: number[] = JSON.parse(
      localStorage.getItem('ecommerce_wishlist') || '[]'
    )
    
    expect(restoredWishlist.length).toBe(3)
    expect(restoredWishlist).toContain(1)
    
    localStorage.removeItem('ecommerce_wishlist')
  })
})

describe('Product Details Integration', () => {
  it('should find similar products from same category', () => {
    const getSimilarProducts = (products: Product[], currentProduct: Product, limit: number) => {
      return products
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, limit)
    }
    
    const similar = getSimilarProducts(mockProducts, mockProducts[0], 4)
    expect(similar.length).toBe(1)
    expect(similar[0].id).toBe(2)
  })
  
  it('should calculate related category products', () => {
    const getProductsByCategory = (products: Product[], category: string) => {
      return products.filter(p => p.category === category)
    }
    
    const smartphones = getProductsByCategory(mockProducts, 'smartphones')
    expect(smartphones.length).toBe(2)
    
    const laptops = getProductsByCategory(mockProducts, 'laptops')
    expect(laptops.length).toBe(1)
  })
})

describe('Error Handling Integration', () => {
  it('should handle API errors gracefully', () => {
    const handleApiError = (error: unknown): string => {
      if (error && typeof error === 'object' && 'message' in error) {
        const err = error as { message: string; response?: { data?: { message?: string } } }
        return err.response?.data?.message || err.message
      }
      return 'An unexpected error occurred'
    }
    
    const networkError = { message: 'Network Error' }
    expect(handleApiError(networkError)).toBe('Network Error')
    
    const serverError = { 
      message: 'Server Error', 
      response: { data: { message: 'Product not found' } } 
    }
    expect(handleApiError(serverError)).toBe('Product not found')
    
    expect(handleApiError('string error')).toBe('An unexpected error occurred')
    expect(handleApiError(null)).toBe('An unexpected error occurred')
  })
})

describe('Currency Formatting Integration', () => {
  it('should format prices correctly', () => {
    const formatPrice = (price: number): string => {
      return `$${price.toFixed(2)}`
    }
    
    expect(formatPrice(549)).toBe('$549.00')
    expect(formatPrice(477.85)).toBe('$477.85')
    expect(formatPrice(1999.99)).toBe('$1999.99')
  })
  
  it('should format discount percentages', () => {
    const formatDiscount = (percentage: number): string => {
      return percentage > 0 ? `-${percentage.toFixed(2)}%` : ''
    }
    
    expect(formatDiscount(12.96)).toBe('-12.96%')
    expect(formatDiscount(0)).toBe('')
    expect(formatDiscount(17.94)).toBe('-17.94%')
  })
})

describe('Stock Management Integration', () => {
  it('should validate stock before adding to cart', () => {
    const canAddToCart = (product: Product, quantity: number): boolean => {
      const availableStock = product.stock ?? 0
      return quantity > 0 && quantity <= availableStock
    }
    
    expect(canAddToCart(mockProducts[0], 1)).toBe(true)
    expect(canAddToCart(mockProducts[0], 94)).toBe(true)
    expect(canAddToCart(mockProducts[0], 95)).toBe(false)
    expect(canAddToCart(mockProducts[0], 0)).toBe(false)
  })
  
  it('should handle stock depletion', () => {
    let stock = 94
    
    const decrementStock = (quantity: number): boolean => {
      if (stock >= quantity) {
        stock -= quantity
        return true
      }
      return false
    }
    
    expect(decrementStock(10)).toBe(true)
    expect(stock).toBe(84)
    
    expect(decrementStock(100)).toBe(false)
    expect(stock).toBe(84)
  })
})
