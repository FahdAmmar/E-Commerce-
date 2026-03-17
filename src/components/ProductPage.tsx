/**
 * ============================================
 * ProductPage Component - Product Detail View
 * ============================================
 * Displays detailed information about a single product
 * with images, description, and add to cart functionality
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchProductById } from '../services/api';
import { formatPrice, isInStock } from '../utils/helpers';
import type { Product } from '../Types/index';
import {
    ArrowLeft,
    ShoppingCart,
    Star,
    Package,
    Truck,
    Shield,
} from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// ============================================
// Types
// ============================================

interface ProductPageState {
    product: Product | null;
    loading: boolean;
    error: string | null;
    selectedImage: number;
}

// ============================================
// SweetAlert Configuration
// ============================================

const MySwal = withReactContent(Swal);

// ============================================
// Component
// ============================================

const ProductPage = () => {
    // ========================================
    // Hooks
    // ========================================
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart, state: cartState } = useCart();

    // ========================================
    // State
    // ========================================
    const [state, setState] = useState<ProductPageState>({
        product: null,
        loading: true,
        error: null,
        selectedImage: 0,
    });

    // ========================================
    // Fetch product data
    // ========================================
    useEffect(() => {
        // Validate ID
        if (!id) {
            setState((prev) => ({
                ...prev,
                error: 'Product ID is missing. Please select a valid product.',
                loading: false,
            }));
            return;
        }

        // Fetch product
        const loadProduct = async () => {
            setState((prev) => ({ ...prev, loading: true, error: null }));

            try {
                const product = await fetchProductById(id);

                if (!product) {
                    throw new Error('Product not found');
                }

                setState((prev) => ({
                    ...prev,
                    product,
                    loading: false,
                }));
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : 'Failed to load product. Please try again.';

                setState((prev) => ({
                    ...prev,
                    error: errorMessage,
                    loading: false,
                }));
            }
        };

        loadProduct();
    }, [id]);

    // ========================================
    // Handlers
    // ========================================

    /**
     * Navigate back to previous page
     */
    const handleGoBack = () => {
        navigate(-1);
    };

    /**
     * Add product to cart with notification
     */
    const handleAddToCart = () => {
        if (!state.product) return;

        addToCart({
            id: state.product.id.toString(),
            title: state.product.title,
            image: state.product.thumbnail,
            price: state.product.price,
            category: state.product.category,
        });

        MySwal.fire({
            title: 'Added to Cart!',
            text: `${state.product.title} has been added to your cart.`,
            icon: 'success',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
        });
    };

    /**
     * Change selected image
     */
    const handleImageSelect = (index: number) => {
        setState((prev) => ({ ...prev, selectedImage: index }));
    };

    // ========================================
    // Render Functions
    // ========================================

    /**
     * Render loading state
     */
    if (state.loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    /**
     * Render error state
     */
    if (state.error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                        Oops! Something went wrong
                    </h2>
                    <p className="text-red-600 mb-6">{state.error}</p>
                    <button
                        onClick={handleGoBack}
                        className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    /**
     * Render product not found
     */
    if (!state.product) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                        Product Not Found
                    </h2>
                    <p className="text-gray-600 mb-6">
                        The product you're looking for doesn't exist.
                    </p>
                    <button
                        onClick={handleGoBack}
                        className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const { product } = state;
    const inStock = isInStock(product.stock);

    return (
        <main className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Back button */}
                <button
                    onClick={handleGoBack}
                    className="mb-6 inline-flex items-center rounded-xl bg-white px-5 py-3 text-gray-700 shadow-sm transition-all hover:bg-gray-100 hover:shadow-md"
                >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to Products
                </button>

                {/* Product content */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* ========================================
              Image Gallery Section
              ======================================== */}
                    <div className="space-y-4">
                        {/* Main image */}
                        <div className="overflow-hidden rounded-2xl bg-white p-4 shadow-lg">
                            <img
                                src={
                                    product.images?.[state.selectedImage] || product.thumbnail
                                }
                                alt={product.title}
                                className="h-auto w-full object-contain max-h-[500px]"
                                loading="lazy"
                            />
                        </div>
                        {/* Thumbnail gallery */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleImageSelect(index)}
                                        className={`flex-shrink-0 h-20 w-20 rounded-xl overflow-hidden border-2 transition-all ${state.selectedImage === index
                                            ? 'border-blue-600 ring-2 ring-blue-200'
                                            : 'border-gray-200 hover:border-gray-400'
                                            }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${product.title} - ${index + 1}`}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ========================================
              Product Details Section
              ======================================== */}
                    <div className="space-y-6">
                        {/* Category & Brand */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                                {product.category}
                            </span>
                            {product.brand && (
                                <>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-sm text-gray-600">{product.brand}</span>
                                </>
                            )}
                        </div>

                        {/* Product Title */}
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                            {product.title}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-5 w-5 ${i < Math.round(product.rating)
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-600">
                                {product.rating.toFixed(1)} rating
                            </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-bold text-gray-900">
                                {formatPrice(product.price)}
                            </span>
                            {product.discountPercentage && (
                                <span className="text-lg text-gray-500 line-through">
                                    {formatPrice(
                                        product.price / (1 - product.discountPercentage / 100)
                                    )}
                                </span>
                            )}
                            {product.discountPercentage && (
                                <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-1 rounded">
                                    -{product.discountPercentage.toFixed(0)}%
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <div className="border-t border-gray-200 pt-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                Description
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${inStock
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                    }`}
                            >
                                <Package className="w-4 h-4" />
                                {inStock
                                    ? `In Stock (${product.stock} available)`
                                    : 'Out of Stock'}
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="border-t border-gray-200 pt-6 space-y-4">
                            {/* Shipping */}
                            {product.shippingInformation && (
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Truck className="w-5 h-5 text-blue-600" />
                                    <span>{product.shippingInformation}</span>
                                </div>
                            )}

                            {/* Warranty */}
                            {product.warrantyInformation && (
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                    <span>{product.warrantyInformation}</span>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={!inStock}
                                className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all ${inStock
                                    ? 'bg-black hover:bg-gray-800 hover:shadow-lg'
                                    : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </button>

                            <button
                                disabled={!inStock}
                                className={`flex-1 px-8 py-4 rounded-xl font-bold border-2 transition-all ${inStock
                                    ? 'border-black text-black hover:bg-black hover:text-white'
                                    : 'border-gray-300 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Buy Now
                            </button>
                        </div>

                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-4">
                                {product.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ========================================
            Reviews Section
            ======================================== */}
                {product.reviews && product.reviews.length > 0 && (
                    <div className="mt-12 border-t border-gray-200 pt-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Customer Reviews ({product.reviews.length})
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {product.reviews.map((review, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 font-bold">
                                                {review.reviewerName.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {review.reviewerName}
                                            </p>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-3 h-3 ${i < review.rating
                                                            ? 'text-yellow-400 fill-yellow-400'
                                                            : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600">{review.comment}</p>
                                    <p className="text-xs text-gray-400 mt-3">
                                        {new Date(review.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default ProductPage;