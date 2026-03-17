/**
 * ============================================
 * MainContent Component - Product Listing
 * ============================================
 * Displays grid of products with filtering,
 * sorting, and pagination functionality
 */

import { useEffect, useState, useMemo, useRef } from 'react';
import { useFilter } from '../context/FilterContext';
import { useCart } from '../context/CartContext';
import {
  Tally3,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShoppingCart,
  Grid,
  List,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchProducts, searchProducts } from '../services/api';
import type { Product, SortOption } from '../Types/index';
import { ITEMS_PER_PAGE } from '../utils/helpers';
import BookCard from './BookCard';

// ============================================
// Types
// ============================================

interface MainContentProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  total: number;
}

// ============================================
// Component
// ============================================

const MainContent: React.FC<MainContentProps> = ({ isOpen, toggleSidebar }) => {
  // ========================================
  // Context Hooks
  // ========================================
  const {
    state: filterState,
    setSort,
    resetFilters,
  } = useFilter();
  const { state: cartState } = useCart();

  // ========================================
  // State
  // ========================================
  const [productsState, setProductsState] = useState<ProductsState>({
    products: [],
    loading: true,
    error: null,
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Reference for dropdown click outside
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ========================================
  // Fetch Products
  // ========================================
  useEffect(() => {
    const loadProducts = async () => {
      setProductsState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        let response;

        // Check if keyword search is active
        if (filterState.keyword) {
          response = await searchProducts(filterState.keyword);
        } else {
          // Regular paginated fetch
          response = await fetchProducts(
            ITEMS_PER_PAGE,
            (currentPage - 1) * ITEMS_PER_PAGE
          );
        }

        setProductsState({
          products: response.products,
          total: response.total,
          loading: false,
          error: null,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load products';

        setProductsState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
      }
    };

    loadProducts();
  }, [filterState.keyword, currentPage]);

  // ========================================
  // Close Dropdown on Outside Click
  // ========================================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ========================================
  // Filtered & Sorted Products
  // ========================================
  const filteredProducts = useMemo(() => {
    let result = [...productsState.products];

    // Filter by category
    if (filterState.selectedCategory) {
      result = result.filter(
        (product) => product.category === filterState.selectedCategory
      );
    }

    // Filter by price range
    if (filterState.minPrice !== undefined) {
      result = result.filter((product) => product.price >= filterState.minPrice!);
    }
    if (filterState.maxPrice !== undefined) {
      result = result.filter((product) => product.price <= filterState.maxPrice!);
    }

    // Filter by search query
    if (filterState.searchQuery) {
      const query = filterState.searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    // Sort products
    switch (filterState.sortBy) {
      case 'expensive':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'cheap':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'popular':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Keep original order
        break;
    }

    return result;
  }, [
    productsState.products,
    filterState.selectedCategory,
    filterState.minPrice,
    filterState.maxPrice,
    filterState.searchQuery,
    filterState.sortBy,
  ]);

  // ========================================
  // Pagination Logic
  // ========================================
  const totalPages = Math.ceil(productsState.total / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPaginationButtons = (): number[] => {
    const buttons: number[] = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let page = startPage; page <= endPage; page++) {
      buttons.push(page);
    }

    return buttons;
  };

  // ========================================
  // Sort Options
  // ========================================
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'all', label: 'Default' },
    { value: 'cheap', label: 'Price: Low to High' },
    { value: 'expensive', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
  ];

  const getSortLabel = () => {
    const option = sortOptions.find((opt) => opt.value === filterState.sortBy);
    return option?.label || 'Sort by';
  };

  // ========================================
  // Render
  // ========================================
  return (
    <main className="w-full min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ========================================
            Header Section
            ======================================== */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          {/* Title & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleSidebar()}
              className="lg:hidden p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              aria-label="Toggle filters"
            >
              <Tally3 className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              All Products
              {!productsState.loading && (
                <span className="text-gray-500 text-lg font-normal ml-2">
                  ({productsState.total} items)
                </span>
              )}
            </h1>
          </div>

          {/* Right Side: Cart & Sort */}
          <div className="flex items-center gap-4">
            {/* Cart Link */}
            <Link
              to="/cart"
              className="relative group p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
              aria-label="View cart"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-black" />
              {cartState.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                  {cartState.totalItems}
                </span>
              )}
            </Link>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-white border border-gray-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
                aria-label="Grid view"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full sm:w-48 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all flex items-center justify-between"
              >
                <span className="font-medium">{getSortLabel()}</span>
                <Tally3 className="w-4 h-4 text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSort(option.value);
                        setDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${filterState.sortBy === option.value
                        ? 'bg-gray-100 font-semibold text-black'
                        : 'text-gray-700'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================
            Loading State
            ======================================== */}
        {productsState.loading && (
          <div className="flex flex-col justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-black" />
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        )}

        {/* ========================================
            Error State
            ======================================== */}
        {productsState.error && !productsState.loading && (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-gray-200">
            <p className="text-red-600 mb-4">{productsState.error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ========================================
            Products Grid
            ======================================== */}
        {!productsState.loading && !productsState.error && (
          <>
            {filteredProducts.length > 0 ? (
              <div
                className={`grid gap-6 mb-10 ${viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
                  }`}
              >
                {filteredProducts.map((product) => (
                  <BookCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    image={product.thumbnail}
                    price={product.price}
                    category={product.category}
                    rating={product.rating}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <div className="text-gray-400 mb-4">
                  <ShoppingCart className="w-16 h-16" />
                </div>
                <p className="text-gray-500 text-lg mb-4">
                  No products found matching your criteria.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* ========================================
                Pagination
                ======================================== */}
            {filteredProducts.length > 0 && !filterState.keyword && (
              <div className="flex justify-center items-center gap-2 mt-8">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full border flex items-center justify-center transition-all ${currentPage === 1
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:bg-black hover:text-white hover:border-black'
                    }`}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page Numbers */}
                <div className="flex gap-2">
                  {getPaginationButtons().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${page === currentPage
                        ? 'bg-black text-white shadow-lg scale-105'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full border flex items-center justify-center transition-all ${currentPage === totalPages
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:bg-black hover:text-white hover:border-black'
                    }`}
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default MainContent;