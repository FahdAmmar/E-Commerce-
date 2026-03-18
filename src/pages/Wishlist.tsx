// src/pages/Wishlist.tsx
// =================== صفحة المفضلة ===================

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
    }, []);

    // فلترة المنتجات الموجودة في المفضلة
    const wishlistProducts = state.products.filter(
        product => state.wishlist.includes(product.id)
    );

    if (state.wishlist.length === 0) {
        return (
            <div className="container-custom py-12">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
                    <p className="text-gray-600 mb-6">
                        Save your favorite items here and shop them later!
                    </p>
                    <Link to="/" className="btn-primary inline-block">
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container-custom py-8">
            <h1 className="text-2xl font-bold mb-6">My Wishlist ({wishlistProducts.length})</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlistProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Wishlist;