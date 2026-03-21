// src/components/ProductCard.tsx
// =================== مكون بطاقة المنتج المحسن ===================

import React from 'react';
import type { Product } from '../types/index';
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
        <div className="card group hover:transform hover:-translate-y-1">
            {/* صورة المنتج */}
            <div
                onClick={() => navigate(`/product/${product.id}`)}
                className="relative cursor-pointer overflow-hidden rounded-t-lg"
            >
                <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 product-image"
                />

                {/* طبقة التدرج على الصورة في Dark Mode */}
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* زر المفضلة */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                    }}
                    className={`absolute top-2 right-2 p-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${isInWishlist
                        ? 'bg-(--highlight-color) text-white'
                        : 'bg-(--card-bg) text-(--text-primary) hover:bg-(--highlight-color) hover:text-white'
                        }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill={isInWishlist ? 'currentColor' : 'none'}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>

                {/* علامة الخصم */}
                {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-(--highlight-color) text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{discount}%
                    </span>
                )}

                {/* مؤشر التقييم */}
                <div className="absolute bottom-2 left-2 flex items-center bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                    <span className="text-yellow-400 mr-1">★</span>
                    {product.rating}
                </div>
            </div>

            {/* معلومات المنتج */}
            <div className="p-4">
                <h3
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="font-semibold text-lg mb-2 hover:text-(--accent-color) cursor-pointer transition line-clamp-1"
                >
                    {product.title}
                </h3>

                <p className="text-(--text-primary)/70 text-sm mb-3 line-clamp-2">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-(--text-primary)/60">
                            {product.brand}
                        </span>
                        <span className="text-xs px-2 py-1 bg-(--border-color) rounded-full">
                            {product.stock} left
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-xl font-bold text-(--accent-color)">
                            ${finalPrice}
                        </span>
                        {discount > 0 && (
                            <span className="text-sm text-(--text-primary)/50 line-through ml-2">
                                ${product.price}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={() => addToCart(product)}
                        className="bg-(--accent-color) hover:bg-opacity-90 text-white p-2 rounded-full transition-all transform hover:scale-110 hover:rotate-12"
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