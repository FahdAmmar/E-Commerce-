// src/pages/Cart.tsx
// =================== صفحة السلة المحسنة ===================

import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
    const { state, updateCartQuantity, removeFromCart } = useAppContext();
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);

    // حساب المجموع الكلي
    const subtotal = state.cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.1; // 10% ضريبة
    const discount = promoApplied ? subtotal * 0.1 : 0; // 10% خصم
    const total = subtotal + shipping + tax - discount;

    const handleApplyPromo = () => {
        if (promoCode.toUpperCase() === 'SAVE10') {
            setPromoApplied(true);
        }
    };

    if (state.cart.length === 0) {
        return (
            <div className="container-custom py-12">
                <div className="max-w-md mx-auto text-center">
                    {/* أيقونة سلة فارغة */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-24 w-24 mx-auto text-[var(--border-color)] mb-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>

                    <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                    <p className="text-[var(--text-primary)]/60 mb-6">
                        Looks like you haven't added anything to your cart yet.
                    </p>

                    <Link to="/" className="btn-primary inline-block px-8">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container-custom py-8">
            <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* قائمة المنتجات */}
                <div className="lg:col-span-2 space-y-4">
                    {state.cart.map(item => (
                        <div key={item.id} className="card p-4 group">
                            <div className="flex items-center">
                                {/* صورة المنتج */}
                                <div className="relative">
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                                        title="Remove from cart"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>

                                {/* معلومات المنتج */}
                                <div className="flex-1 ml-4">
                                    <Link to={`/product/${item.id}`}>
                                        <h3 className="font-semibold text-lg hover:text-[var(--accent-color)] transition">
                                            {item.title}
                                        </h3>
                                    </Link>
                                    <p className="text-[var(--accent-color)] font-bold mt-1">
                                        ${item.price} each
                                    </p>
                                </div>

                                {/* التحكم في الكمية */}
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                        className="w-8 h-8 bg-[var(--border-color)] rounded-full hover:bg-[var(--accent-color)] hover:text-white transition"
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                    <button
                                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                        className="w-8 h-8 bg-[var(--border-color)] rounded-full hover:bg-[var(--accent-color)] hover:text-white transition"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* السعر الإجمالي للمنتج */}
                                <div className="ml-6 w-24 text-right">
                                    <p className="font-bold text-lg">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* رابط العودة للتسوق */}
                    <Link
                        to="/products"
                        className="inline-flex items-center text-[var(--accent-color)] hover:underline mt-4"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Continue Shopping
                    </Link>
                </div>

                {/* ملخص الطلب المحسن */}
                <div className="lg:col-span-1">
                    <div className="card p-6 sticky top-20">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                        {/* تفاصيل الأسعار */}
                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between">
                                <span className="text-[var(--text-primary)]/60">Subtotal</span>
                                <span className="font-semibold">${subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-[var(--text-primary)]/60">Shipping</span>
                                <span className="font-semibold">
                                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-[var(--text-primary)]/60">Tax (10%)</span>
                                <span className="font-semibold">${tax.toFixed(2)}</span>
                            </div>

                            {promoApplied && (
                                <div className="flex justify-between text-green-500">
                                    <span>Discount (SAVE10)</span>
                                    <span>-${discount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="border-t border-[var(--border-color)] pt-3 mt-3">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-[var(--accent-color)]">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* حقل الكود الترويجي */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Promo Code
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    placeholder="Enter code"
                                    className="search-input flex-1"
                                    disabled={promoApplied}
                                />
                                <button
                                    onClick={handleApplyPromo}
                                    disabled={promoApplied || !promoCode}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${promoApplied
                                        ? 'bg-green-500 text-white cursor-not-allowed'
                                        : 'bg-[var(--border-color)] hover:bg-[var(--accent-color)] hover:text-white'
                                        }`}
                                >
                                    {promoApplied ? 'Applied' : 'Apply'}
                                </button>
                            </div>
                            {!promoApplied && (
                                <p className="text-xs text-[var(--text-primary)]/40 mt-1">
                                    Try "SAVE10" for 10% off
                                </p>
                            )}
                        </div>

                        {/* زر الدفع */}
                        <button className="w-full btn-primary mb-3">
                            Proceed to Checkout
                        </button>

                        {/* طرق الدفع المقبولة */}
                        <div className="text-center">
                            <p className="text-xs text-[var(--text-primary)]/40 mb-2">
                                We accept
                            </p>
                            <div className="flex justify-center space-x-2">
                                <span className="px-2 py-1 bg-[var(--border-color)] rounded text-sm">Visa</span>
                                <span className="px-2 py-1 bg-[var(--border-color)] rounded text-sm">Mastercard</span>
                                <span className="px-2 py-1 bg-[var(--border-color)] rounded text-sm">PayPal</span>
                            </div>
                        </div>

                        {/* ضمان الأمان */}
                        <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                            <div className="flex items-center justify-center space-x-2 text-sm text-[var(--text-primary)]/60">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span>Secure Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;