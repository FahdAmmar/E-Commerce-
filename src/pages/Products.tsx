// src/pages/Products.tsx
// =================== صفحة جميع المنتجات ===================

import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const Products: React.FC = () => {
    const { state, fetchProducts } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    // استخراج الفئات من المنتجات
    useEffect(() => {
        if (state.products.length > 0) {
            const uniqueCategories = Array.from(
                new Set(state.products.map(p => p.category))
            );
            setCategories(uniqueCategories);
        }
    }, [state.products]);

    // فلترة المنتجات حسب البحث والفئة
    const filteredProducts = state.products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="container-custom py-8">
            <h1 className="text-2xl font-bold mb-6">All Products</h1>

            {/* شريط البحث والفلاتر */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                        <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {/* عرض المنتجات */}
            {state.loading && state.products.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <>
                    <p className="mb-4 text-gray-600">
                        Found {filteredProducts.length} products
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Products;