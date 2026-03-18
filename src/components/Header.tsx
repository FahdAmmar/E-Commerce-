// src/components/Header.tsx
// =================== مكون الهيدر ===================

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Header: React.FC = () => {
    const { state } = useAppContext();
    const navigate = useNavigate();

    // حساب عدد المنتجات في السلة
    const cartItemsCount = state.cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container-custom py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-blue-600">
                        E-Shop
                    </Link>

                    {/* روابط التنقل */}
                    <div className="flex items-center space-x-6">
                        <Link to="/" className="hover:text-blue-600 transition">
                            Home
                        </Link>

                        <Link to="/products" className="hover:text-blue-600 transition">
                            Products
                        </Link>

                        {/* أيقونة المفضلة */}
                        <Link to="/wishlist" className="relative hover:text-blue-600 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {state.wishlist.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {state.wishlist.length}
                                </span>
                            )}
                        </Link>

                        {/* أيقونة السلة */}
                        <button
                            onClick={() => navigate('/cart')}
                            className="relative hover:text-blue-600 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItemsCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;