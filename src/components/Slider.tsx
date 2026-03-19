// src/components/Slider.tsx
// =================== مكون السلايدر المحسن ===================

import React, { useState, useEffect } from 'react';
import type { Product } from '../types/index';
import { useNavigate } from 'react-router-dom';

interface SliderProps {
    products: Product[];
}

const Slider: React.FC<SliderProps> = ({ products }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const navigate = useNavigate();

    // تغيير السلايد تلقائياً كل ثانية
    useEffect(() => {
        if (products.length === 0 || !isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === products.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000); // 3 ثواني أفضل من ثانية واحدة

        return () => clearInterval(interval);
    }, [products, isAutoPlaying]);

    // دوال التحكم اليدوي
    const goToNext = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prevIndex) =>
            prevIndex === products.length - 1 ? 0 : prevIndex + 1
        );
    };

    const goToPrev = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? products.length - 1 : prevIndex - 1
        );
    };

    const goToSlide = (index: number) => {
        setIsAutoPlaying(false);
        setCurrentIndex(index);
    };

    // إذا لم تكن هناك منتجات، لا نظهر السلايدر
    if (products.length === 0) {
        return null;
    }

    const currentProduct = products[currentIndex];

    return (
        <div className="relative h-[500px] md:h-[600px] overflow-hidden rounded-2xl mb-8 group">
            {/* خلفية الصورة مع تأثير التدرج */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105 group-hover:scale-110"
                style={{
                    backgroundImage: `url(${currentProduct.thumbnail})`,
                }}
            >
                {/* طبقة التدرج المظلم */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

                {/* تأثير بصري إضافي في Dark Mode */}
                <div className="absolute inset-0 bg-[var(--accent-color)]/10 mix-blend-overlay" />
            </div>

            {/* محتوى السلايد */}
            <div className="relative h-full flex items-center">
                <div className="container-custom">
                    <div className="max-w-2xl text-white animate-fadeIn">
                        {/* شارة الفئة */}
                        <span className="inline-block px-3 py-1 bg-[var(--accent-color)] rounded-full text-sm mb-4">
                            {currentProduct.category}
                        </span>

                        <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                            {currentProduct.title}
                        </h2>

                        <p className="text-lg md:text-xl mb-6 text-gray-200 line-clamp-3">
                            {currentProduct.description}
                        </p>

                        <div className="flex items-center space-x-4 mb-6">
                            <div className="flex items-center">
                                <span className="text-yellow-400 text-xl">★</span>
                                <span className="ml-1 text-lg">{currentProduct.rating}</span>
                            </div>

                            <span className="w-1 h-1 bg-gray-400 rounded-full" />

                            <span className="text-[var(--highlight-color)] font-semibold">
                                {currentProduct.brand}
                            </span>
                        </div>

                        <div className="flex items-center space-x-6 mb-8">
                            <span className="text-4xl font-bold text-[var(--highlight-color)]">
                                ${(currentProduct.price * (1 - currentProduct.discountPercentage / 100)).toFixed(2)}
                            </span>
                            {currentProduct.discountPercentage > 0 && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg line-through text-gray-400">
                                        ${currentProduct.price}
                                    </span>
                                    <span className="px-2 py-1 bg-red-500 text-white text-sm rounded-full">
                                        -{currentProduct.discountPercentage}%
                                    </span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => navigate(`/product/${currentProduct.id}`)}
                            className="bg-[var(--accent-color)] hover:bg-opacity-90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 hover:shadow-2xl"
                        >
                            View Product
                        </button>
                    </div>
                </div>
            </div>

            {/* أزرار التحكم */}
            <button
                onClick={goToPrev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                aria-label="Previous slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                aria-label="Next slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* مؤشرات السلايد */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {products.slice(0, 5).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 ${index === currentIndex
                            ? 'w-10 h-2 bg-[var(--accent-color)]'
                            : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                            } rounded-full`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
                {products.length > 5 && (
                    <span className="text-white/50 text-sm ml-2">
                        +{products.length - 5} more
                    </span>
                )}
            </div>

            {/* زر التشغيل التلقائي */}
            <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="absolute top-6 right-6 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                aria-label={isAutoPlaying ? 'Pause autoplay' : 'Start autoplay'}
            >
                {isAutoPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default Slider;