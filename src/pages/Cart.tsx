// src/pages/Cart.tsx
// =================== صفحة السلة ===================

import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
    const { state, updateCartQuantity, removeFromCart } = useAppContext();

    // حساب المجموع الكلي
    const totalAmount = state.cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    if (state.cart.length === 0) {
        return (
            <div className="container-custom py-12">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/" className="btn-primary inline-block">
                        Continue Shopping
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
                <div className="lg:col-span-2">
                    {state.cart.map(item => (
                        <div key={item.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
                            <div className="flex items-center">
                                {/* صورة المنتج */}
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="w-24 h-24 object-cover rounded"
                                />

                                {/* معلومات المنتج */}
                                <div className="flex-1 ml-4">
                                    <h3 className="font-semibold text-lg">{item.title}</h3>
                                    <p className="text-blue-600 font-bold">${item.price}</p>
                                </div>

                                {/* التحكم في الكمية */}
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                        className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                        className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* السعر الإجمالي للمنتج */}
                                <div className="ml-6 w-24 text-right">
                                    <p className="font-bold">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>

                                {/* زر الحذف */}
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="ml-4 text-red-500 hover:text-red-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ملخص الطلب */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full btn-primary">
                            Proceed to Checkout
                        </button>

                        <Link
                            to="/"
                            className="block text-center mt-4 text-blue-600 hover:underline"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;