import React from 'react';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
    const { cart, increaseQuantity, decreaseQuantity, removeFromCart, totalPrice, totalItems } = useCart();
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    // حالة إذا كانت السلة فارغة
    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center p-4">
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                    <ShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                <Link
                    to="/"
                    className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Shopping Cart ({totalItems})</h1>

            <button
                onClick={handleGoBack}
                className="mb-6 inline-flex items-center rounded-md bg-white px-4 py-2 text-gray-700 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
                Back
            </button>

            <div className="flex flex-col lg:flex-row gap-8">

                {/* القائمة اليسرى: المنتجات */}
                <div className="flex-1 space-y-4">
                    {cart.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center sm:items-start">

                            {/* صورة المنتج */}
                            <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* تفاصيل المنتج والتحكم */}
                            <div className="flex-1 w-full flex flex-col justify-between h-32">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.title}</h3>
                                    <p className="text-gray-500 text-sm">Category</p> {/* يمكنك إضافة الفئة هنا */}
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    {/* أزرار التحكم بالكمية */}
                                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => decreaseQuantity(item.id)}
                                            className="p-2 hover:bg-gray-100 transition-colors text-gray-600"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="px-4 font-medium text-sm w-8 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => increaseQuantity(item.id)}
                                            className="p-2 hover:bg-gray-100 transition-colors text-gray-600"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* السعر وزر الحذف */}
                                    <div className="flex items-center gap-6">
                                        <span className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            title="Remove item"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* القائمة اليمنى: ملخص الطلب */}
                <div className="w-full lg:w-96">
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 sticky top-4">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                        <div className="space-y-3 text-sm text-gray-600 mb-6">
                            <div className="flex justify-between">
                                <span>Subtotal ({totalItems} items)</span>
                                <span className="font-medium text-gray-900">${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping Estimate</span>
                                <span className="font-medium text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax Estimate (8%)</span>
                                <span className="font-medium text-gray-900">${(totalPrice * 0.08).toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-200 my-4 pt-4 flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">Order Total</span>
                                <span className="text-2xl font-bold text-black">${(totalPrice * 1.08).toFixed(2)}</span>
                            </div>
                        </div>

                        <button className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group">
                            Checkout
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <p className="text-xs text-center text-gray-400 mt-4">
                            Secure Checkout powered by Stripe
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CartPage;