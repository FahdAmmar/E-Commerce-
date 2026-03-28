// src/components/Header.tsx
// =================== مكون الهيدر المحسّن مع Dark Mode و Responsive ===================

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Moon, Sun, Menu, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Header: React.FC = () => {
    const { state, toggleTheme } = useAppContext();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // حساب عدد المنتجات في السلة والمفضلة
    const cartItemsCount: number = state.cart.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0);
    const wishlistCount: number = state.wishlist.length;

    // تتبع التمرير لتغيير شكل الهيدر
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // منع التمرير خلف القائمة المفتوحة
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-(--card-bg)/95 backdrop-blur-md shadow-lg'
                : 'bg-(--card-bg) shadow-md'
                }`}>
                <nav className="container-custom py-4 px-4 md:px-6">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link
                            to="/"
                            className="text-2xl font-bold text-(--accent-color) hover:opacity-80 transition"
                            onClick={closeMobileMenu}
                        >
                            E-Shop
                        </Link>

                        {/* روابط سطح المكتب (Desktop) */}
                        <div className="hidden md:flex items-center space-x-6">
                            <Link to="/" className="hover:text-(--accent-color) transition">
                                Home
                            </Link>
                            <Link to="/products" className="hover:text-(--accent-color) transition">
                                Products
                            </Link>
                        </div>

                        {/* أيقونات الإجراءات (لجميع الشاشات) */}
                        <div className="flex items-center space-x-4">
                            {/* أيقونة المفضلة */}
                            <button
                                onClick={() => {
                                    navigate('/wishlist');
                                    closeMobileMenu();
                                }}
                                className="relative hover:text-(--accent-color) transition"
                                aria-label="Wishlist"
                            >
                                <Heart className="h-6 w-6" />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-(--highlight-color) text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </button>

                            {/* أيقونة السلة */}
                            <button
                                onClick={() => {
                                    navigate('/cart');
                                    closeMobileMenu();
                                }}
                                className="relative hover:text-(--accent-color) transition"
                                aria-label="Cart"
                            >
                                <ShoppingCart className="h-6 w-6" />
                                {cartItemsCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-(--accent-color) text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartItemsCount}
                                    </span>
                                )}
                            </button>

                            {/* زر تبديل الثيم */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg hover:bg-(--hover-bg) transition"
                                aria-label="Toggle theme"
                            >
                                {state.theme === 'light' ? (
                                    <Moon className="h-5 w-5" />
                                ) : (
                                    <Sun className="h-5 w-5" />
                                )}
                            </button>

                            {/* زر القائمة للهواتف */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg hover:bg-(--hover-bg) transition"
                                aria-label="Menu"
                            >
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* القائمة الجانبية للهواتف */}
            <div
                className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={closeMobileMenu}
            />
            <div
                className={`fixed top-0 right-0 h-full w-64 z-50 bg-(--card-bg) shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col p-6 space-y-4 mt-16">
                    <Link
                        to="/"
                        className="text-lg font-medium hover:text-(--accent-color) transition py-2"
                        onClick={closeMobileMenu}
                    >
                        Home
                    </Link>
                    <Link
                        to="/products"
                        className="text-lg font-medium hover:text-(--accent-color) transition py-2"
                        onClick={closeMobileMenu}
                    >
                        Products
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Header;