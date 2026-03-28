// src/pages/Home.tsx
// =================== نسخة سريعة للإصلاح ===================

import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Slider from '../components/Slider';
import ProductCard from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';
import type { Product } from '@/types/index';

const Home: React.FC = () => {
    const { state, fetchProducts } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    if (state.loading && state.products.length === 0) {
        return (
            <div className="container-custom py-12">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-\[var\(--accent-color\)\]"></div>
                </div>
            </div>
        );
    }

    if (state.error) {
        return (
            <div className="container-custom py-12">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>Error: {state.error}</p>
                    <button
                        onClick={fetchProducts}
                        className="mt-2 text-sm underline"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    const featuredCategories: any[] = state.categories.slice(0, 4);

    return (
        <div className="container-custom py-8">
            {state.products.length > 0 && (
                <Slider products={state.products.slice(0, 10)} />
            )}

            {featuredCategories.length > 0 && (
                <section className="mt-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold">Shop by Category</h2>
                        <button
                            onClick={() => navigate('/products')}
                            className="text-\[var\(--accent-color\)\] hover:underline flex items-center"
                        >
                            View All
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredCategories.map((category: any) => {
                            const categoryProducts: any[] = state.products.filter((p: any) => p.category === category.name);
                            const firstProduct: any = categoryProducts[0];

                            return (
                                <div
                                    key={category.name}
                                    onClick={() => navigate(`/products?category=${category.name}`)}
                                    className="category-card group"
                                >
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="category-card-image"
                                    />

                                    <div className="category-card-overlay">
                                        <div className="flex items-center mb-2">
                                            <span className="text-2xl mr-2">{category.icon}</span>
                                            <h3 className="text-xl font-semibold capitalize">
                                                {category.name.replace('-', ' ')}
                                            </h3>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-200">
                                                {category.count} Products
                                            </p>

                                            {firstProduct && (
                                                <div className="flex items-center space-x-1">
                                                    <span className="text-(--highlight-color) font-bold">
                                                        ${firstProduct.price}
                                                    </span>
                                                    {firstProduct.discountPercentage > 0 && (
                                                        <span className="text-xs line-through text-gray-400">
                                                            ${firstProduct.price}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {categoryProducts.some((p: any) => p.discountPercentage > 0) && (
                                            <div className="mt-3">
                                                <div className="flex items-center text-xs text-(--highlight-color)">
                                                    <span>Up to</span>
                                                    <span className="font-bold ml-1">
                                                        {Math.max(...categoryProducts.map((p: any) => p.discountPercentage))}% OFF
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                                                    <div
                                                        className="bg-(--highlight-color) h-1 rounded-full transition-all duration-500 group-hover:w-full"
                                                        style={{
                                                            width: `${Math.max(...categoryProducts.map((p: any) => p.discountPercentage))}%`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-(--accent-color) rounded-xl transition-all duration-300 pointer-events-none" />
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            <section className="mt-16">
                <h2 className="text-2xl font-bold mb-6">Featured Products</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {state.products.slice(0, 8).map((product: Product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            <section className="mt-16">
                <div className="relative overflow-hidden rounded-xl bg-linear-to-r from-(--accent-color) to-(--highlight-color) p-8">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="relative z-10 text-white text-center">
                        <h2 className="text-3xl font-bold mb-4">Special Offers</h2>
                        <p className="text-xl mb-6">Get up to 50% off on selected items</p>
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-white text-(--accent-color) px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
                        >
                            Shop Now
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;