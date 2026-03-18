// src/pages/ProductDetails.tsx
// =================== صفحة تفاصيل المنتج ===================

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { state, fetchProductById, addToCart, toggleWishlist } = useAppContext();
    const [selectedImage, setSelectedImage] = useState<string>('');

    useEffect(() => {
        if (id) {
            fetchProductById(parseInt(id));
        }
    }, [id]);

    useEffect(() => {
        if (state.currentProduct) {
            setSelectedImage(state.currentProduct.thumbnail);
        }
    }, [state.currentProduct]);

    // عرض حالة التحميل
    if (state.loading) {
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
                        onClick={() => navigate('/')}
                        className="mt-2 text-sm underline"
                    >
                        Back to home
                    </button>
                </div>
            </div>
        );
    }

    const product = state.currentProduct;
    if (!product) {
        return null;
    }

    const isInWishlist = state.wishlist.includes(product.id);
    const discount = product.discountPercentage;
    const finalPrice = discount > 0
        ? (product.price * (1 - discount / 100)).toFixed(2)
        : product.price;

    return (
        <div className="container-custom py-8">
            {/* زر الرجوع */}
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* قسم الصور */}
                <div>
                    {/* الصورة الرئيسية */}
                    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                        <img
                            src={selectedImage}
                            alt={product.title}
                            className="w-full h-96 object-contain"
                        />
                    </div>

                    {/* الصور المصغرة */}
                    {product.images && product.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                            {product.images.slice(0, 4).map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(image)}
                                    className={`border-2 rounded-lg overflow-hidden ${selectedImage === image ? 'border-blue-600' : 'border-transparent'
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.title} ${index + 1}`}
                                        className="w-full h-20 object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* معلومات المنتج */}
                <div>
                    <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

                    <p className="text-gray-600 mb-4">{product.description}</p>

                    <div className="flex items-center mb-4">
                        <span className="text-yellow-400 text-xl">★</span>
                        <span className="text-lg ml-1">{product.rating}</span>
                        <span className="text-gray-500 ml-2">({product.stock} in stock)</span>
                    </div>

                    <div className="mb-6">
                        <p className="text-3xl font-bold text-blue-600 mb-2">
                            ${finalPrice}
                        </p>
                        {discount > 0 && (
                            <p className="text-gray-500">
                                Original price: <span className="line-through">${product.price}</span>
                                <span className="text-green-600 ml-2">Save {discount}%</span>
                            </p>
                        )}
                    </div>

                    <div className="mb-6">
                        <p className="text-gray-700">
                            <span className="font-semibold">Brand:</span> {product.brand}
                        </p>
                        <p className="text-gray-700">
                            <span className="font-semibold">Category:</span> {product.category}
                        </p>
                    </div>

                    {/* أزرار الإجراءات */}
                    <div className="flex space-x-4">
                        <button
                            onClick={() => addToCart(product)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
                        >
                            Add to Cart
                        </button>

                        <button
                            onClick={() => toggleWishlist(product.id)}
                            className={`p-3 rounded-lg border-2 transition ${isInWishlist
                                ? 'border-red-500 text-red-500 hover:bg-red-50'
                                : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isInWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;