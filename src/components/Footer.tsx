// src/components/Footer.tsx
// =================== مكون الفوتر ===================

import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white mt-auto">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">About Us</h3>
                        <p className="text-gray-400">
                            Your one-stop shop for all your needs. Quality products, best prices.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
                            <li><Link to="/products" className="text-gray-400 hover:text-white transition">Products</Link></li>
                            <li><Link to="/cart" className="text-gray-400 hover:text-white transition">Cart</Link></li>
                            <li><Link to="/wishlist" className="text-gray-400 hover:text-white transition">Wishlist</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Categories</h3>
                        <ul className="space-y-2">
                            <li className="text-gray-400">Electronics</li>
                            <li className="text-gray-400">Fashion</li>
                            <li className="text-gray-400">Home & Garden</li>
                            <li className="text-gray-400">Sports</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Contact</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>Email: support@eshop.com</li>
                            <li>Phone: +1 234 567 890</li>
                            <li>Address: 123 Main St, City</li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {currentYear} E-Shop. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;