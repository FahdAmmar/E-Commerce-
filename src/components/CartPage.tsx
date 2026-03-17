/**
 * ============================================
 * CartPage Component - Shopping Cart View
 * ============================================
 * Displays all items in the shopping cart with
 * quantity controls, removal options, and checkout
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
    Minus,
    Plus,
    Trash2,
    ShoppingBag,
    ArrowRight,
    ArrowLeft,
} from 'lucide-react';
import { formatPrice, TAX_RATE } from '../utils/helpers';

// ============================================
// Component
// ============================================

const CartPage: React.FC = () => {
    // ========================================
    // Hooks
    // ========================================
    const {
        state: cart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
    } = useCart();
    const navigate = useNavigate();

    // ========================================
    // Calculations
    // ========================================
    const subtotal = cart.totalPrice;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    // ========================================
    // Handlers
    // ========================================

    /**
     * Navigate back to products
     */
    const handleGoBack = () => {
        navigate(-1);
    };

    /**
     * Handle checkout process
     */
    const handleCheckout = () => {
        // In a real app, this would redirect to checkout
        alert('Checkout functionality would be implemented here!');
    };

    // ========================================
    // Empty Cart State
    // ========================================
    if (cart.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="bg-white p-12 rounded-3xl shadow-lg text-center max-w-md">
                    {/* Icon */}
                    <div className="bg-gray-100 p-6 rounded-full inline-block mb-6">
                        <ShoppingBag className="w-16 h-16 text-gray-400" />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        Your Cart is Empty
                    </h2>

                    {/* Description */}
                    <p className="text-gray-500 mb-8">
                        Looks like you haven't added anything to your cart yet. Start
                        shopping to fill it up!
                    </p>

                    {/* CTA Button */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all hover:shadow-lg"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    // ========================================
    // Main Render
    // ========================================
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Shopping Cart
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'}
                        </p>
                    </div>

                    {/* Clear Cart Button */}
                    <button
                        onClick={clearCart}
                        className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                    >
                        <Trash2 className="w-4 h-4" />
                        Clear Cart
                    </button>
                </div>

                {/* Back Button */}
                <button
                    onClick={handleGoBack}
                    className="mb-6 inline-flex items-center rounded-xl bg-white px-5 py-3 text-gray-700 shadow-sm transition-all hover:bg-gray-100"
                >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Continue Shopping
                </button>

                {/* Main Content */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* ========================================
              Cart Items List
              ======================================== */}
                    <div className="flex-1 space-y-4">
                        {cart.items.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 sm:items-center"
                            >
                                {/* Product Image */}
                                <Link
                                    to={`/product/${item.id}`}
                                    className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                                        loading="lazy"
                                    />
                                </Link>

                                {/* Product Details */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <Link to={`/product/${item.id}`}>
                                            <h3 className="font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">
                                                {item.title}
                                            </h3>
                                        </Link>
                                        {item.category && (
                                            <p className="text-sm text-gray-500 capitalize mt-1">
                                                {item.category}
                                            </p>
                                        )}
                                    </div>

                                    {/* Quantity & Price Controls */}
                                    <div className="flex items-center justify-between mt-4">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => decreaseQuantity(item.id)}
                                                className="p-2 hover:bg-gray-100 transition-colors text-gray-600 hover:text-red-600"
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="px-4 font-medium text-sm min-w-[3rem] text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => increaseQuantity(item.id)}
                                                className="p-2 hover:bg-gray-100 transition-colors text-gray-600 hover:text-green-600"
                                                aria-label="Increase quantity"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Price & Remove */}
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-lg text-gray-900">
                                                {formatPrice(item.price * item.quantity)}
                                            </span>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all"
                                                aria-label="Remove item"
                                                title="Remove from cart"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ========================================
              Order Summary Sidebar
              ======================================== */}
                    <div className="w-full lg:w-96">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                Order Summary
                            </h2>

                            {/* Summary Details */}
                            <div className="space-y-4 text-sm">
                                {/* Subtotal */}
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Subtotal ({cart.totalItems} items)
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {formatPrice(subtotal)}
                                    </span>
                                </div>

                                {/* Shipping */}
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium text-green-600">Free</span>
                                </div>

                                {/* Tax */}
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Tax ({(TAX_RATE * 100).toFixed(0)}%)
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {formatPrice(tax)}
                                    </span>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200 pt-4">
                                    {/* Total */}
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900">
                                            Total
                                        </span>
                                        <span className="text-2xl font-bold text-gray-900">
                                            {formatPrice(total)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={handleCheckout}
                                className="w-full mt-6 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group hover:shadow-lg"
                            >
                                Proceed to Checkout
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            {/* Security Note */}
                            <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                </svg>
                                Secure checkout powered by Stripe
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;