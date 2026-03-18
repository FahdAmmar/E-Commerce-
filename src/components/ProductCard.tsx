// src/components/ProductCard.tsx
// =================== مكون بطاقة المنتج ===================

import React from 'react';
import type { Product } from '..//types/index';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate();
    const { state, addToCart, toggleWishlist } = useAppContext();

    const isInWishlist = state.wishlist.includes(product.id);
    const discount = product.discountPercentage;
    const finalPrice = discount > 0
        ? (product.price * (1 - discount / 100)).toFixed(2)
        : product.price;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* صورة المنتج */}
            <div
                onClick={() => navigate(`/product/${product.id}`)}
                className="relative cursor-pointer group"
            >
                <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* زر المفضلة */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                    }}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                        fill={isInWishlist ? 'currentColor' : 'none'}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>

                {/* علامة الخصم */}
                {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {discount}% OFF
                    </span>
                )}
            </div>

            {/* معلومات المنتج */}
            <div className="p-4">
                <h3
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="font-semibold text-lg mb-2 hover:text-blue-600 cursor-pointer"
                >
                    {product.title}
                </h3>

                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {product.description}
                </p>

                <div className="flex items-center mb-2">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600 ml-1">
                        {product.rating} ({product.stock} in stock)
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-xl font-bold text-blue-600">
                            ${finalPrice}
                        </span>
                        {discount > 0 && (
                            <span className="text-sm text-gray-400 line-through ml-2">
                                ${product.price}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={() => addToCart(product)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition"
                        title="Add to cart"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;