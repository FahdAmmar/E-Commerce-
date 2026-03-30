// src/pages/Wishlist.tsx
// =================== نسخة سريعة للإصلاح ===================

import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

const Wishlist: React.FC = () => {
    const { state, fetchProducts } = useAppContext();

    useEffect(() => {
        if (state.products.length === 0) {
            fetchProducts();
        }
    }, [fetchProducts, state.products.length]);

    // استخدام any مؤقتاً
    const wishlistProducts = state.products.filter(
        (product) => state.wishlist.includes(product.id)
    );

    if (state.wishlist.length === 0) {
        return (
            <div className="container-custom py-12">
                <div className="max-w-md mx-auto text-center">
                    <div className="relative mb-6">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-24 w-24 mx-auto text-(--border-color)"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>

                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-bounce">
                            <svg className="h-6 w-6 text-(--accent-color)/30" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
                    <p className="text-(--text-primary)/60 mb-6">
                        Save your favorite items here and shop them later!
                    </p>

                    <div className="space-y-3">
                        <Link to="/" className="btn-primary inline-block px-8">
                            Browse Products
                        </Link>

                        <p className="text-sm text-(--text-primary)/40">
                            Click the heart icon on any product to add it to your wishlist
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-custom py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold">My Wishlist</h1>
                    <p className="text-(--text-primary)/60">
                        You have {wishlistProducts.length} saved items
                    </p>
                </div>

                <Link
                    to="/products"
                    className="text-(--accent-color) hover:underline flex items-center"
                >
                    Continue Shopping
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlistProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {wishlistProducts.length > 0 && (
                <section className="mt-16">
                    <h2 className="text-xl font-bold mb-4">You might also like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {state.products
                            .filter((p) => !state.wishlist.includes(p.id))
                            .filter((p) => p.category === wishlistProducts[0]?.category)
                            .slice(0, 4)
                            .map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default Wishlist;