// src/components/Header.tsx
// =================== مكون الهيدر مع Dark Mode ===================

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Header: React.FC = () => {
    const { state, toggleTheme } = useAppContext();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);

    // حساب عدد المنتجات في السلة
    const cartItemsCount = state.cart.reduce((total, item) => total + item.quantity, 0);

    // تتبع التمرير لتغيير شكل الهيدر
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
            ? 'bg-[var(--card-bg)]/95 backdrop-blur-md shadow-lg'
            : 'bg-[var(--card-bg)] shadow-md'
            }`}>
            <nav className="container-custom py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-[var(--accent-color)]">
                        E-Shop
                    </Link>

                    {/* روابط التنقل */}
                    <div className="flex items-center space-x-6">
                        <Link to="/" className="hover:text-[var(--accent-color)] transition">
                            Home
                        </Link>

                        <Link to="/products" className="hover:text-[var(--accent-color)] transition">
                            Products
                        </Link>

                        {/* أيقونة المفضلة */}
                        <Link to="/wishlist" className="relative hover:text-[var(--accent-color)] transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {state.wishlist.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[var(--highlight-color)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {state.wishlist.length}
                                </span>
                            )}
                        </Link>

                        {/* أيقونة السلة */}
                        <button
                            onClick={() => navigate('/cart')}
                            className="relative hover:text-[var(--accent-color)] transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[var(--accent-color)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItemsCount}
                                </span>
                            )}
                        </button>

                        {/* زر تبديل الثيم */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-[var(--hover-bg)] transition"
                            aria-label="Toggle theme"
                        >
                            {state.theme === 'light' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;