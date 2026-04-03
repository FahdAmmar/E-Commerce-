import { describe, it, expect } from 'vitest'
import type { Product, CartItem } from '../types/index'

const mockProduct: Product = {
  id: 1,
  title: 'iPhone 9',
  description: 'An apple mobile which is nothing like apple',
  price: 549,
  discountPercentage: 12.96,
  rating: 4.69,
  stock: 94,
  brand: 'Apple',
  category: 'smartphones',
  thumbnail: 'https://cdn.dummyjson.com/products-images/1/thumbnail.jpg',
  images: ['https://example.com/1.jpg']
}

const mockProducts: Product[] = [
  mockProduct,
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
    title: 'Samsung Universe 9',
    description: 'Samsung new widescreen smartphone',
    price: 1249,
    discountPercentage: 0,
    rating: 4.09,
    stock: 36,
    brand: 'Samsung',
    category: 'smartphones',
    thumbnail: 'https://cdn.dummyjson.com/products-images/3/thumbnail.jpg'
  }
]

describe('Product Data Structure', () => {
  it('should have all required fields', () => {
    expect(mockProduct.id).toBeDefined()
    expect(mockProduct.title).toBeDefined()
    expect(mockProduct.description).toBeDefined()
    expect(mockProduct.price).toBeGreaterThan(0)
    expect(mockProduct.category).toBeDefined()
    expect(mockProduct.thumbnail).toBeDefined()
  })

  it('should calculate final price with discount', () => {
    const discount = mockProduct.discountPercentage ?? 0
    const finalPrice = mockProduct.price * (1 - discount / 100)
    expect(finalPrice).toBeCloseTo(477.85, 1)
  })

  it('should validate optional fields', () => {
    expect(mockProduct.discountPercentage).toBe(12.96)
    expect(mockProduct.rating).toBe(4.69)
    expect(mockProduct.stock).toBe(94)
  })
})

describe('Cart Operations', () => {
  it('should calculate cart total correctly', () => {
    const cartItems: CartItem[] = [
      { ...mockProduct, quantity: 2 },
      { ...mockProducts[1], quantity: 1 }
    ]
    
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    expect(total).toBe(1997)
  })

  it('should handle quantity updates', () => {
    const item: CartItem = { ...mockProduct, quantity: 1 }
    item.quantity += 1
    expect(item.quantity).toBe(2)
    
    item.quantity -= 1
    expect(item.quantity).toBe(1)
    
    item.quantity = 0
    expect(item.quantity).toBe(0)
  })
})

describe('Wishlist Operations', () => {
  it('should add and remove items from wishlist', () => {
    let wishlist: number[] = []
    
    wishlist.push(1)
    expect(wishlist).toContain(1)
    
    wishlist = wishlist.filter(id => id !== 1)
    expect(wishlist).not.toContain(1)
  })

  it('should toggle wishlist item correctly', () => {
    const toggleWishlist = (wishlist: number[], id: number): number[] => {
      return wishlist.includes(id)
        ? wishlist.filter(wishlistId => wishlistId !== id)
        : [...wishlist, id]
    }
    
    let wishlist: number[] = []
    wishlist = toggleWishlist(wishlist, 1)
    expect(wishlist).toEqual([1])
    
    wishlist = toggleWishlist(wishlist, 1)
    expect(wishlist).toEqual([])
  })
})

describe('Product Filtering', () => {
  it('should filter products by category', () => {
    const filterByCategory = (products: Product[], category: string) => {
      return products.filter(p => p.category === category)
    }
    
    const filtered = filterByCategory(mockProducts, 'smartphones')
    expect(filtered.length).toBe(3)
  })

  it('should filter products by price range', () => {
    const filterByPrice = (products: Product[], min: number, max: number) => {
      return products.filter(p => p.price >= min && p.price <= max)
    }
    
    const filtered = filterByPrice(mockProducts, 500, 1000)
    expect(filtered.length).toBe(2)
    expect(filtered.map(p => p.id)).toEqual([1, 2])
  })

  it('should filter products by search term', () => {
    const searchProducts = (products: Product[], term: string) => {
      const lowerTerm = term.toLowerCase()
      return products.filter(p => 
        p.title.toLowerCase().includes(lowerTerm) ||
        p.description.toLowerCase().includes(lowerTerm)
      )
    }
    
    const results = searchProducts(mockProducts, 'iphone')
    expect(results.length).toBe(2)
    
    const brandResults = searchProducts(mockProducts, 'samsung')
    expect(brandResults.length).toBe(1)
  })
})

describe('Product Sorting', () => {
  it('should sort by price ascending', () => {
    const sorted = [...mockProducts].sort((a, b) => a.price - b.price)
    expect(sorted[0].id).toBe(1)
    expect(sorted[2].id).toBe(3)
  })

  it('should sort by price descending', () => {
    const sorted = [...mockProducts].sort((a, b) => b.price - a.price)
    expect(sorted[0].id).toBe(3)
    expect(sorted[2].id).toBe(1)
  })

  it('should sort by rating descending', () => {
    const sorted = [...mockProducts].sort((a, b) => 
      (b.rating ?? 0) - (a.rating ?? 0)
    )
    expect(sorted[0].id).toBe(1)
  })

  it('should sort by discount descending', () => {
    const sorted = [...mockProducts].sort((a, b) => 
      (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0)
    )
    expect(sorted[0].id).toBe(2)
    expect(sorted[2].discountPercentage).toBe(0)
  })
})

describe('Category Operations', () => {
  it('should generate categories from products', () => {
    const generateCategories = (products: Product[]) => {
      const categoryMap = new Map<string, number>()
      
      products.forEach(product => {
        const count = categoryMap.get(product.category) || 0
        categoryMap.set(product.category, count + 1)
      })
      
      return Array.from(categoryMap.entries()).map(([name, count]) => ({
        name,
        count
      }))
    }
    
    const categories = generateCategories(mockProducts)
    expect(categories.length).toBe(1)
    expect(categories[0].name).toBe('smartphones')
    expect(categories[0].count).toBe(3)
  })
})

describe('Theme Management', () => {
  it('should toggle theme between light and dark', () => {
    const toggleTheme = (theme: 'light' | 'dark'): 'light' | 'dark' => {
      return theme === 'light' ? 'dark' : 'light'
    }
    
    expect(toggleTheme('light')).toBe('dark')
    expect(toggleTheme('dark')).toBe('light')
  })
})

describe('localStorage Operations', () => {
  it('should save and load state from localStorage', () => {
    const testState = {
      cart: [{ ...mockProduct, quantity: 1 }] as CartItem[],
      wishlist: [1, 2],
      theme: 'dark' as const
    }
    
    localStorage.setItem('test_key', JSON.stringify(testState))
    const loaded = JSON.parse(localStorage.getItem('test_key') || '{}')
    
    expect(loaded.cart).toEqual(testState.cart)
    expect(loaded.wishlist).toEqual(testState.wishlist)
    expect(loaded.theme).toBe('dark')
    
    localStorage.removeItem('test_key')
  })

  it('should handle localStorage errors gracefully', () => {
    const loadStateFromStorage = (key: string) => {
      try {
        const saved = localStorage.getItem(key)
        return saved ? JSON.parse(saved) : {}
      } catch {
        return {}
      }
    }
    
    expect(loadStateFromStorage('nonexistent')).toEqual({})
  })
})

describe('API Response Handling', () => {
  it('should handle successful API response', () => {
    const mockResponse = {
      products: mockProducts,
      total: 100,
      skip: 0,
      limit: 30
    }
    
    expect(mockResponse.products).toHaveLength(3)
    expect(mockResponse.total).toBeGreaterThan(0)
  })

  it('should handle API error responses', () => {
    const handleError = (error: { response?: { data?: { message?: string } }; message: string }) => {
      return error.response?.data?.message || error.message
    }
    
    const networkError = { message: 'Network Error' }
    expect(handleError(networkError)).toBe('Network Error')
    
    const serverError = { 
      message: 'Request failed', 
      response: { data: { message: 'Product not found' } } 
    }
    expect(handleError(serverError)).toBe('Product not found')
  })
})

describe('Price Calculation Utilities', () => {
  it('should calculate discounted price correctly', () => {
    const calculateDiscountedPrice = (price: number, discountPercent: number): number => {
      return price * (1 - discountPercent / 100)
    }
    
    expect(calculateDiscountedPrice(100, 10)).toBe(90)
    expect(calculateDiscountedPrice(549, 12.96)).toBeCloseTo(477.85, 1)
    expect(calculateDiscountedPrice(899, 17.94)).toBeCloseTo(737.72, 1)
  })

  it('should calculate savings correctly', () => {
    const calculateSavings = (originalPrice: number, discountPercent: number): number => {
      return originalPrice * (discountPercent / 100)
    }
    
    expect(calculateSavings(100, 10)).toBe(10)
    expect(calculateSavings(549, 12.96)).toBeCloseTo(71.15)
  })

  it('should handle zero discount', () => {
    const calculateDiscountedPrice = (price: number, discountPercent: number): number => {
      return discountPercent > 0 
        ? price * (1 - discountPercent / 100)
        : price
    }
    
    expect(calculateDiscountedPrice(100, 0)).toBe(100)
    expect(calculateDiscountedPrice(1249, 0)).toBe(1249)
  })
})

describe('Order Summary Calculations', () => {
  it('should calculate subtotal correctly', () => {
    const calculateSubtotal = (items: CartItem[]): number => {
      return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }
    
    const items: CartItem[] = [
      { ...mockProduct, quantity: 2 },
      { ...mockProducts[1], quantity: 1 }
    ]
    
    expect(calculateSubtotal(items)).toBe(1997)
  })

  it('should determine shipping cost based on subtotal', () => {
    const calculateShipping = (subtotal: number, freeShippingThreshold: number, shippingCost: number): number => {
      return subtotal >= freeShippingThreshold ? 0 : shippingCost
    }
    
    expect(calculateShipping(30, 50, 5.99)).toBe(5.99)
    expect(calculateShipping(50, 50, 5.99)).toBe(0)
    expect(calculateShipping(100, 50, 5.99)).toBe(0)
  })

  it('should calculate tax correctly', () => {
    const calculateTax = (subtotal: number, taxRate: number): number => {
      return subtotal * taxRate
    }
    
    expect(calculateTax(100, 0.1)).toBe(10)
    expect(calculateTax(549, 0.1)).toBeCloseTo(54.9)
  })

  it('should apply promo code discount', () => {
    const applyPromoDiscount = (subtotal: number, promoCode: string): number => {
      return promoCode.toUpperCase() === 'SAVE10' ? subtotal * 0.1 : 0
    }
    
    expect(applyPromoDiscount(100, 'save10')).toBe(10)
    expect(applyPromoDiscount(100, 'SAVE10')).toBe(10)
    expect(applyPromoDiscount(100, 'INVALID')).toBe(0)
  })

  it('should calculate total correctly', () => {
    const calculateTotal = (subtotal: number, shipping: number, tax: number, discount: number): number => {
      return subtotal + shipping + tax - discount
    }
    
    const subtotal = 549
    const shipping = 0
    const tax = 54.9
    const discount = 54.9
    
    expect(calculateTotal(subtotal, shipping, tax, discount)).toBe(549)
  })
})

describe('Product Availability', () => {
  it('should check if product is in stock', () => {
    const isInStock = (product: Product): boolean => {
      return (product.stock ?? 0) > 0
    }
    
    expect(isInStock(mockProduct)).toBe(true)
    
    const outOfStockProduct = { ...mockProduct, stock: 0 }
    expect(isInStock(outOfStockProduct)).toBe(false)
  })

  it('should check if stock is low', () => {
    const isLowStock = (product: Product, threshold: number = 10): boolean => {
      const stock = product.stock ?? 0
      return stock > 0 && stock <= threshold
    }
    
    expect(isLowStock(mockProduct)).toBe(false)
    
    const lowStockProduct = { ...mockProduct, stock: 5 }
    expect(isLowStock(lowStockProduct)).toBe(true)
  })

  it('should limit quantity to available stock', () => {
    const clampQuantity = (quantity: number, maxStock: number): number => {
      return Math.min(Math.max(1, quantity), maxStock)
    }
    
    expect(clampQuantity(5, 10)).toBe(5)
    expect(clampQuantity(15, 10)).toBe(10)
    expect(clampQuantity(0, 10)).toBe(1)
    expect(clampQuantity(-5, 10)).toBe(1)
  })
})

describe('URL Query Parameter Handling', () => {
  it('should parse category from query params', () => {
    const getCategoryFromParams = (search: string): string => {
      const params = new URLSearchParams(search)
      return params.get('category') || 'all'
    }
    
    expect(getCategoryFromParams('?category=smartphones')).toBe('smartphones')
    expect(getCategoryFromParams('?category=laptops')).toBe('laptops')
    expect(getCategoryFromParams('')).toBe('all')
  })

  it('should build query string for navigation', () => {
    const buildQueryString = (params: Record<string, string | number>): string => {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== 'all' && value !== '') {
          searchParams.set(key, String(value))
        }
      })
      return searchParams.toString()
    }
    
    expect(buildQueryString({ category: 'smartphones', sort: 'price-asc' }))
      .toBe('category=smartphones&sort=price-asc')
    expect(buildQueryString({ category: 'all' }))
      .toBe('')
  })
})
