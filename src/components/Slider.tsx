/**
 * ============================================
 * Slider Component - Sidebar Filter Panel
 * ============================================
 * Provides filtering options including search,
 * price range, categories, and keywords
 */

import { useEffect, useState } from 'react';
import { useFilter } from '../context/FilterContext';
import {
    Search,
    X,
    RotateCcw,
    Check,
    SlidersHorizontal,
    Tag,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../services/api';
import { capitalizeFirst } from '../utils/helpers';



// ============================================
// Types
// ============================================

interface SliderProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

// ============================================
// Constants
// ============================================

const POPULAR_KEYWORDS = [
    'apple',
    'watch',
    'fashion',
    'trend',
    'shoes',
    'shirt',
    'laptop',
    'phone',
];

// ============================================
// Component
// ============================================

const Slider: React.FC<SliderProps> = ({ isOpen, toggleSidebar }) => {
    // ========================================
    // Context
    // ========================================
    const {
        state: filterState,
        setSearchQuery,
        setCategory,
        setMinPrice,
        setMaxPrice,
        setKeyword,
        resetFilters,
    } = useFilter();

    // ========================================
    // State
    // ========================================
    const [categories, setCategories] = useState<string[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [activeKeyword, setActiveKeyword] = useState<string | null>(
        filterState.keyword || null
    );

    // ========================================
    // Fetch Categories
    // ========================================
    useEffect(() => {
        const loadCategories = async () => {
            try {
                setCategoriesLoading(true);
                const data = await fetchCategories();
                setCategories(data.sort());
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setCategoriesLoading(false);
            }
        };

        loadCategories();
    }, []);

    // ========================================
    // Handlers
    // ========================================

    /**
     * Handle minimum price input
     */
    const handleMinPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMinPrice(value ? parseFloat(value) : undefined);
    };

    /**
     * Handle maximum price input
     */
    const handleMaxPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMaxPrice(value ? parseFloat(value) : undefined);
    };

    /**
     * Toggle category selection
     */
    const handleCategoryChange = (category: string) => {
        setCategory(filterState.selectedCategory === category ? '' : category);
    };

    /**
     * Toggle keyword selection
     */
    const handleKeywordClick = (kw: string) => {
        if (activeKeyword === kw) {
            setKeyword('');
            setActiveKeyword(null);
        } else {
            setKeyword(kw);
            setActiveKeyword(kw);
        }
    };

    /**
     * Reset all filters and close sidebar on mobile
     */
    const handleResetFilter = () => {
        resetFilters();
        setActiveKeyword(null);
        if (window.innerWidth < 768) {
            toggleSidebar();
        }
    };

    // ========================================
    // Render
    // ========================================
    return (
        <>
            {/* ========================================
          Mobile Overlay
          ======================================== */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* ========================================
          Sidebar Container
          ======================================== */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-50
          w-80 bg-white border-r border-gray-100 shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:shadow-none md:z-auto
          md:h-screen md:block
          ${!isOpen ? 'hidden md:block' : ''}
        `}
            >
                <div className="h-full flex flex-col p-6 gap-6 overflow-y-auto">
                    {/* ========================================
              Header: Logo & Close Button
              ======================================== */}
                    <div className="flex items-center justify-between">
                        <Link to="/" onClick={() => window.innerWidth < 768 && toggleSidebar()}>
                            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                                React<span className="text-blue-600">Store</span>
                            </h1>
                        </Link>

                        {/* Close button - Mobile only */}
                        <button
                            onClick={toggleSidebar}
                            className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Close sidebar"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* ========================================
              Search Section
              ======================================== */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                            placeholder="Search products..."
                            value={filterState.searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search products"
                        />
                        {filterState.searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Clear search"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* ========================================
              Price Range Section
              ======================================== */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                                Price Range
                            </h3>
                        </div>
                        <div className="flex gap-3">
                            {/* Min Price */}
                            <div className="relative w-1/2">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">
                                    $
                                </span>
                                <input
                                    type="number"
                                    className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                                    placeholder="Min"
                                    value={filterState.minPrice ?? ''}
                                    onChange={handleMinPrice}
                                    min="0"
                                    aria-label="Minimum price"
                                />
                            </div>
                            {/* Max Price */}
                            <div className="relative w-1/2">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">
                                    $
                                </span>
                                <input
                                    type="number"
                                    className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                                    placeholder="Max"
                                    value={filterState.maxPrice ?? ''}
                                    onChange={handleMaxPrice}
                                    min="0"
                                    aria-label="Maximum price"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ========================================
              Popular Keywords Section
              ======================================== */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-gray-500" />
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                                Popular Tags
                            </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {POPULAR_KEYWORDS.map((kw) => (
                                <button
                                    key={kw}
                                    onClick={() => handleKeywordClick(kw)}
                                    className={`px-4 py-2 text-xs rounded-full border transition-all duration-200 capitalize ${activeKeyword === kw
                                        ? 'bg-black text-white border-black shadow-md'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'
                                        }`}
                                >
                                    {kw}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ========================================
              Categories Section
              ======================================== */}
                    <div className="space-y-4 flex-grow">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                            Categories
                        </h3>

                        {categoriesLoading ? (
                            <div className="flex justify-center py-4">
                                <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {categories.slice(0, 8).map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => handleCategoryChange(category)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${filterState.selectedCategory === category
                                            ? 'bg-black text-white shadow-md'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span>{capitalizeFirst(category)}</span>
                                        {filterState.selectedCategory === category && (
                                            <Check className="w-4 h-4" />
                                        )}
                                    </button>
                                ))}

                                {/* Show more categories indicator */}
                                {categories.length > 8 && (
                                    <p className="text-xs text-gray-400 text-center py-2">
                                        +{categories.length - 8} more categories
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ========================================
              Reset Filters Button
              ======================================== */}
                    <button
                        onClick={handleResetFilter}
                        className="w-full py-3.5 flex items-center justify-center gap-2 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 hover:text-black hover:border-black transition-all active:scale-95 mt-auto"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset Filters
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Slider;