/**
 * ============================================
 * BookCard Component - Product Card Display
 * ============================================
 * Displays individual product information with
 * add to cart functionality and navigation
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// ============================================
// Types
// ============================================

interface BookCardProps {
    id: string | number;
    title: string;
    image: string;
    price: number;
    category?: string;
    rating?: number;
}

// ============================================
// SweetAlert Configuration
// ============================================

const MySwal = withReactContent(Swal);

// ============================================
// Component
// ============================================

const BookCard: React.FC<BookCardProps> = ({
    id,
    title,
    image,
    price,
    category,
    rating,
}) => {
    const { addToCart } = useCart();

    /**
     * Handle add to cart action
     * Shows success notification using SweetAlert
     */
    const handleAddToCart = (e: React.MouseEvent) => {
        // Prevent navigation when clicking the button
        e.preventDefault();
        e.stopPropagation();

        // Add item to cart
        addToCart({
            id: id.toString(),
            title,
            image,
            price,
            category,
        });

        // Show success notification
        MySwal.fire({
            title: <strong>Added to Cart!</strong>,
            html: <i>{title} has been added to your cart.</i>,
            icon: 'success',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            background: '#fff',
            iconColor: '#10B981',
            customClass: {
                popup: 'rounded-xl shadow-2xl',
                title: 'text-lg font-semibold',
            },
        });
    };

    return (
        <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden border border-gray-100 relative flex flex-col h-full">
            {/* Product link */}
            <Link
                to={`/product/${id}`}
                className="block h-full flex flex-col"
                aria-label={`View details for ${title}`}
            >
                {/* Image container */}
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />

                    {/* Rating badge (if available) */}
                    {rating && (
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <svg
                                className="w-3 h-3 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-gray-700">{rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>

                {/* Content section */}
                <div className="p-5 flex flex-col flex-grow">
                    {/* Category tag */}
                    {category && (
                        <span className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">
                            {category}
                        </span>
                    )}

                    {/* Product title */}
                    <h2 className="text-lg font-bold text-gray-800 line-clamp-2 mb-3 min-h-[3.5rem] leading-snug group-hover:text-blue-600 transition-colors">
                        {title}
                    </h2>

                    {/* Price */}
                    <p className="text-2xl font-bold text-gray-900 mt-auto">
                        {formatPrice(price)}
                    </p>
                </div>
            </Link>

            {/* Add to cart button */}
            <button
                onClick={handleAddToCart}
                className="absolute bottom-4 right-4 bg-black text-white p-3 rounded-full shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-blue-600 hover:scale-110 z-10"
                title="Add to Cart"
                aria-label="Add to Cart"
            >
                <ShoppingCart className="w-5 h-5" />
            </button>
        </div>
    );
};

export default BookCard;