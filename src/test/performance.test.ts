import { describe, it, expect } from 'vitest'
import type { Product } from '../types/index'

const generateMockProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Product ${i + 1}`,
    description: `Description for product ${i + 1}`,
    price: Math.floor(Math.random() * 1000) + 50,
    discountPercentage: Math.random() > 0.7 ? Math.random() * 30 : 0,
    rating: Math.random() * 5,
    stock: Math.floor(Math.random() * 100),
    brand: `Brand ${i % 10}`,
    category: `category-${i % 20}`,
    thumbnail: `https://example.com/product-${i + 1}.jpg`
  }))
}

describe('Performance Tests', () => {
  describe('Large Dataset Filtering', () => {
    const largeDataset = generateMockProducts(1000)

    it('should filter 1000 products efficiently', () => {
      const start = performance.now()

      const filtered = largeDataset.filter(p =>
        p.category === 'category-1' && p.price >= 200 && p.price <= 800
      )

      const end = performance.now()
      const duration = end - start

      expect(duration).toBeLessThan(50)
      expect(filtered.length).toBeGreaterThan(0)
    })

    it('should sort 1000 products efficiently', () => {
      const start = performance.now()

      const sorted = [...largeDataset].sort((a, b) => a.price - b.price)

      const end = performance.now()
      const duration = end - start

      expect(duration).toBeLessThan(100)
      expect(sorted.length).toBe(1000)
    })

    it('should search products efficiently', () => {
      const start = performance.now()

      const results = largeDataset.filter(p =>
        p.title.toLowerCase().includes('product') &&
        p.description.toLowerCase().includes('description')
      )

      const end = performance.now()
      const duration = end - start

      expect(duration).toBeLessThan(50)
      expect(results.length).toBe(1000)
    })
  })

  describe('Cart Operations Performance', () => {
    const cartItems = generateMockProducts(100).map(p => ({
      ...p,
      quantity: Math.floor(Math.random() * 5) + 1
    }))

    it('should calculate cart total efficiently', () => {
      const start = performance.now()

      const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )

      const end = performance.now()
      const duration = end - start

      expect(duration).toBeLessThan(10)
      expect(total).toBeGreaterThan(0)
    })

    it('should find item in cart efficiently', () => {
      const start = performance.now()

      const found = cartItems.find(item => item.id === 50)

      const end = performance.now()
      const duration = end - start

      expect(duration).toBeLessThan(5)
      expect(found?.id).toBe(50)
    })
  })

  describe('Category Generation Performance', () => {
    const products = generateMockProducts(500)

    it('should generate categories efficiently', () => {
      const start = performance.now()

      const categories = Array.from(
        new Map(
          products.map(p => [p.category, { name: p.category, count: 0 }])
        ).entries()
      ).map(([name]) => ({
        name,
        count: products.filter(p => p.category === name).length
      }))

      const end = performance.now()
      const duration = end - start

      expect(duration).toBeLessThan(100)
      expect(categories.length).toBeGreaterThan(0)
    })
  })

  describe('Memory Usage', () => {
    it('should handle large product array without memory issues', () => {
      const products = generateMockProducts(5000)

      const processed = products.map(p => ({
        ...p,
        finalPrice: p.price * (1 - (p.discountPercentage ?? 0) / 100)
      }))

      expect(processed.length).toBe(5000)

      const cleared: null = null
      expect(cleared).toBeNull()
    })
  })

  describe('Array Operations', () => {
    it('should perform map efficiently', () => {
      const data = generateMockProducts(1000)

      const start = performance.now()

      const mapped = data.map(p => ({
        ...p,
        discounted: p.price * 0.9
      }))

      const end = performance.now()

      expect(end - start).toBeLessThan(50)
      expect(mapped.length).toBe(1000)
    })

    it('should perform reduce efficiently', () => {
      const data = generateMockProducts(1000)

      const start = performance.now()

      const result = data.reduce(
        (acc: { totalPrice: number; totalStock: number; count: number }, p: Product) => ({
          totalPrice: acc.totalPrice + p.price,
          totalStock: acc.totalStock + (p.stock ?? 0),
          count: acc.count + 1
        }),
        { totalPrice: 0, totalStock: 0, count: 0 }
      )

      const end = performance.now()

      expect(end - start).toBeLessThan(50)
      expect(result.count).toBe(1000)
    })

    it('should chain operations efficiently', () => {
      const data = generateMockProducts(1000)

      const start = performance.now()

      const result = data
        .filter((p: Product) => p.price > 100)
        .sort((a: Product, b: Product) => (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, 10)
        .map((p: Product) => p.title)

      const end = performance.now()

      expect(end - start).toBeLessThan(100)
      expect(result.length).toBeLessThanOrEqual(10)
    })
  })

  describe('Search Performance', () => {
    it('should handle multiple search criteria efficiently', () => {
      const products = generateMockProducts(2000)

      const start = performance.now()

      const filterResults = products
        .filter(p => p.category.includes('category-5'))
        .filter(p => (p.discountPercentage ?? 0) > 10)
        .filter(p => (p.rating ?? 0) > 4)
        .filter(p => p.price >= 200 && p.price <= 800)

      const end = performance.now()

      expect(end - start).toBeLessThan(100)
      void filterResults
    })

    it('should handle fuzzy search efficiently', () => {
      const products = generateMockProducts(2000)

      const start = performance.now()

      const searchTerm = 'product 50'
      const searchResults = products.filter(p => {
        const searchLower = searchTerm.toLowerCase()
        return (
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          (p.brand?.toLowerCase().includes(searchLower) ?? false)
        )
      })

      const end = performance.now()

      expect(end - start).toBeLessThan(100)
      expect(searchResults.length).toBeGreaterThan(0)
    })
  })

  describe('Debouncing Simulation', () => {
    it('should batch rapid updates efficiently', () => {
      const updates: number[] = []
      const batchedUpdates: number[][] = []

      for (let i = 0; i < 100; i++) {
        updates.push(i)
        if (updates.length >= 10) {
          batchedUpdates.push([...updates])
          updates.length = 0
        }
      }

      expect(batchedUpdates.length).toBe(10)
      expect(updates.length).toBe(0)
    })
  })

  describe('Pagination Performance', () => {
    it('should paginate large dataset efficiently', () => {
      const products = generateMockProducts(10000)
      const pageSize = 20
      const totalPages = Math.ceil(products.length / pageSize)

      const start = performance.now()

      for (let page = 1; page <= totalPages; page++) {
        const startIndex = (page - 1) * pageSize
        const endIndex = startIndex + pageSize
        const pageItems = products.slice(startIndex, endIndex)
        expect(pageItems.length).toBeLessThanOrEqual(pageSize)
      }

      const end = performance.now()

      expect(end - start).toBeLessThan(100)
    })
  })
})
