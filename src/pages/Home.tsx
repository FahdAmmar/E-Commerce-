// src/pages/Home.tsx
// =================== الصفحة الرئيسية ===================

import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import Slider from '../components/Slider';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
    const { state, fetchProducts } = useAppContext();

    // جلب المنتجات عند تحميل الصفحة
    useEffect(() => {
        fetchProducts();
    }, []);

    // عرض حالة التحميل
    if (state.loading && state.products.length === 0) {
        return (
            <div className="container-custom py-12">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    // عرض رسالة الخطأ
    if (state.error) {
        return (
            <div className="container-custom py-12">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>Error: {state.error}</p>
                    <button
                        onClick={fetchProducts}
                        className="mt-2 text-sm underline"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-custom py-8">
            {/* السلايدر */}
            {state.products.length > 0 && (
                <Slider products={state.products.slice(0, 10)} />
            )}

            {/* قسم المنتجات المميزة */}
            <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Featured Products</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {state.products.slice(0, 8).map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            {/* قسم الفئات */}
            <section className="mt-16">
                <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Electronics', 'Fashion', 'Home', 'Sports'].map(category => (
                        <div
                            key={category}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg text-center cursor-pointer hover:from-blue-600 hover:to-blue-700 transition"
                        >
                            <h3 className="text-xl font-semibold">{category}</h3>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;