// src/components/Slider.tsx
// =================== مكون السلايدر التلقائي ===================

import React, { useState, useEffect } from 'react';
import type { Product } from '../types/index';
import { useNavigate } from 'react-router-dom';

interface SliderProps {
    products: Product[];
}

const Slider: React.FC<SliderProps> = ({ products }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    // تغيير السلايد تلقائياً كل ثانية
    useEffect(() => {
        if (products.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === products.length - 1 ? 0 : prevIndex + 1
            );
        }, 1000); // يتغير كل ثانية

        // تنظيف الـ interval عند إلغاء تحميل المكون
        return () => clearInterval(interval);
    }, [products]);

    // إذا لم تكن هناك منتجات، لا نظهر السلايدر
    if (products.length === 0) {
        return null;
    }

    const currentProduct = products[currentIndex];

    return (
        <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-xl mb-8">
            {/* خلفية الصورة مع تأثير التعتيم */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                style={{
                    backgroundImage: `url(${currentProduct.thumbnail})`,
                }}
            >
                <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* محتوى السلايد */}
            <div className="relative h-full flex items-center justify-center text-center text-white">
                <div className="max-w-2xl px-4">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
                        {currentProduct.title}
                    </h2>
                    <p className="text-lg md:text-xl mb-6 text-gray-200">
                        {currentProduct.description}
                    </p>
                    <div className="flex items-center justify-center space-x-4">
                        <span className="text-2xl font-bold text-green-400">
                            ${currentProduct.price}
                        </span>
                        {currentProduct.discountPercentage > 0 && (
                            <span className="text-lg line-through text-gray-400">
                                ${(currentProduct.price / (1 - currentProduct.discountPercentage / 100)).toFixed(2)}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => navigate(`/product/${currentProduct.id}`)}
                        className="mt-6 btn-primary"
                    >
                        View Product
                    </button>
                </div>
            </div>

            {/* مؤشرات السلايد */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {products.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                            ? 'w-8 bg-white'
                            : 'bg-white/50 hover:bg-white/75'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slider;