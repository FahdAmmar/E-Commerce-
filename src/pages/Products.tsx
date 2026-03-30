// src/pages/Products.tsx
// =================== نسخة سريعة للإصلاح ===================

import React, { useEffect, useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating-desc' | 'discount-desc';

const Products: React.FC = () => {
    const { state, fetchProducts } = useAppContext();
    const [searchParams, setSearchParams] = useSearchParams();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
    const [sortBy, setSortBy] = useState<SortOption>('default');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        if (selectedCategory === 'all') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', selectedCategory);
        }
        setSearchParams(searchParams);
    }, [selectedCategory, searchParams, setSearchParams]);

    const maxPrice = useMemo(() => {
        if (state.products.length === 0) return 2000;
        return Math.max(...state.products.map((p) => p.price));
    }, [state.products]);

    // استخدام any مؤقتاً لحل المشكلة
    const filteredAndSortedProducts = useMemo(() => {
        const filtered = state.products.filter((product) => {
            const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
            const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

            return matchesSearch && matchesCategory && matchesPrice;
        });

        switch (sortBy) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating-desc':
                filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
                break;
            case 'discount-desc':
                filtered.sort((a, b) => (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0));
                break;
            default:
                break;
        }

        return filtered;
    }, [state.products, searchTerm, selectedCategory, sortBy, priceRange]);

    return (
        <div className="container-custom py-8">
            <h1 className="text-2xl font-bold mb-6">All Products</h1>

            <div className="mb-8 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input w-full pl-10"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="md:hidden btn-primary flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                        </svg>
                        Filters
                    </button>
                </div>

                <div className={`${showFilters ? 'block' : 'hidden md:block'} space-y-4 md:space-y-0 md:flex md:gap-4`}>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="custom-select flex-1"
                    >
                        <option value="all">🏷️ All Categories</option>
                        {state.categories.map((category) => (
                            <option key={category.name} value={category.name}>
                                {category.icon} {category.name.replace('-', ' ')} ({category.count})
                            </option>
                        ))}
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="custom-select flex-1"
                    >
                        <option value="default">🔄 Default</option>
                        <option value="price-asc">💰 Price: Low to High</option>
                        <option value="price-desc">💰 Price: High to Low</option>
                        <option value="rating-desc">⭐ Top Rated</option>
                        <option value="discount-desc">🏷️ Biggest Discounts</option>
                    </select>

                    <div className="flex-1 flex items-center space-x-4">
                        <span className="text-sm text-\[var\(--text-primary\)\] whitespace-nowrap">
                            ${priceRange[0]} - ${priceRange[1]}
                        </span>
                        <input
                            type="range"
                            min="0"
                            max={maxPrice}
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                            className="flex-1 accent-\[var\(--accent-color\)\]"
                        />
                    </div>
                </div>
            </div>

            {state.loading && state.products.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-\[var\(--accent-color\)\]"></div>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-[var\(\--text-primary\)\]">
                            Found <span className="font-bold text-\[var\(--accent-color\)\]">{filteredAndSortedProducts.length}</span> products
                        </p>

                        {selectedCategory !== 'all' && (
                            <div className="flex items-center space-x-2">
                                <span className="text-sm bg-\[var\(--accent-color\)\]/10 text-\[var\(--accent-color\)\] px-3 py-1 rounded-full">
                                    {state.categories.find((c) => c.name === selectedCategory)?.icon} {selectedCategory.replace('-', ' ')}
                                </span>
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className="text-sm text-\[var\(--text-primary\)\] hover:text-\[var\(--accent-color\)\]"
                                >
                                    ✕ Clear
                                </button>
                            </div>
                        )}
                    </div>

                    {filteredAndSortedProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <h3 className="text-xl font-semibold mb-2">No products found</h3>
                            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('all');
                                    setSortBy('default');
                                    setPriceRange([0, maxPrice]);
                                }}
                                className="mt-4 btn-primary"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredAndSortedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Products;