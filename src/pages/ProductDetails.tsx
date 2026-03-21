// src/pages/ProductDetails.tsx
// =================== صفحة تفاصيل المنتج المحسنة ===================

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { state, fetchProductById, addToCart, toggleWishlist, getProductsByCategory } = useAppContext();
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<'description' | 'details'>('description');

    useEffect(() => {
        if (id) {
            fetchProductById(parseInt(id));
            window.scrollTo(0, 0);
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
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--accent-color)"></div>
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
    const finalPrice = (product.price * (1 - discount / 100)).toFixed(2);

    // منتجات مشابهة من نفس الفئة
    const similarProducts = getProductsByCategory(product.category)
        .filter(p => p.id !== product.id)
        .slice(0, 4);

    return (
        <div className="container-custom py-8">
            {/* مسار التنقل (Breadcrumb) */}
            <nav className="flex items-center space-x-2 text-sm mb-6">
                <button onClick={() => navigate('/')} className="text-(--text-primary)/60 hover:text-(--accent-color)">
                    Home
                </button>
                <span className="text-(--text-primary)/60">/</span>
                <button onClick={() => navigate('/products')} className="text-(--text-primary)/60 hover:text-(--accent-color)">
                    Products
                </button>
                <span className="text-(--text-primary)/60">/</span>
                <button
                    onClick={() => navigate(`/products?category=${product.category}`)}
                    className="text-(--text-primary)/60 hover:text-(--accent-color)"
                >
                    {product.category}
                </button>
                <span className="text-(--text-primary)/60">/</span>
                <span className="text-(--accent-color) font-semibold">{product.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* قسم الصور المحسن */}
                <div className="space-y-4">
                    {/* الصورة الرئيسية مع تأثيرات */}
                    <div className="relative card p-4 group">
                        <img
                            src={selectedImage}
                            alt={product.title}
                            className="w-full h-96 object-contain product-image"
                        />

                        {/* أيقونة التكبير */}
                        <button
                            onClick={() => window.open(selectedImage, '_blank')}
                            className="absolute bottom-4 right-4 bg-(--card-bg)/90 backdrop-blur p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                        </button>

                        {/* شارة التوفير */}
                        {discount > 0 && (
                            <div className="absolute top-4 left-4 bg-(--highlight-color) text-white px-3 py-1 rounded-full font-bold">
                                Save ${(product.price - Number(finalPrice)).toFixed(2)}
                            </div>
                        )}
                    </div>

                    {/* الصور المصغرة */}
                    {product.images && product.images.length > 0 && (
                        <div className="grid grid-cols-5 gap-2">
                            {product.images.slice(0, 5).map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(image)}
                                    className={`card p-2 transition-all duration-300 ${selectedImage === image
                                        ? 'ring-2 ring-(--accent-color) scale-105'
                                        : 'hover:scale-105'
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.title} ${index + 1}`}
                                        className="w-full h-16 object-cover rounded"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* معلومات المنتج المحسنة */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm px-3 py-1 bg-(--border-color) rounded-full">
                                SKU: {product.id}
                            </span>
                            <div className="flex items-center">
                                <span className="text-yellow-400">★</span>
                                <span className="ml-1 font-semibold">{product.rating}</span>
                                <span className="text-(--text-primary)/60 ml-1">/5</span>
                            </div>
                        </div>
                    </div>

                    {/* علامات التبويب */}
                    <div className="flex border-b border-(--border-color)">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`px-4 py-2 font-medium transition-colors relative ${activeTab === 'description'
                                ? 'text-(--accent-color)'
                                : 'text-(--text-primary)/60 hover:text-(--text-primary)'
                                }`}
                        >
                            Description
                            {activeTab === 'description' && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-(--accent-color)" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`px-4 py-2 font-medium transition-colors relative ${activeTab === 'details'
                                ? 'text-(--accent-color)'
                                : 'text-(--text-primary)/60 hover:text-(--text-primary)'
                                }`}
                        >
                            Product Details
                            {activeTab === 'details' && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-(--accent-color)" />
                            )}
                        </button>
                    </div>

                    {/* محتوى التبويبات */}
                    <div className="min-h-30">
                        {activeTab === 'description' ? (
                            <p className="text-(--text-primary)/80 leading-relaxed">
                                {product.description}
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-(--text-primary)/60">Brand</p>
                                    <p className="font-semibold">{product.brand}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-(--text-primary)/60">Category</p>
                                    <p className="font-semibold capitalize">{product.category.replace('-', ' ')}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-(--text-primary)/60">Stock</p>
                                    <p className={`font-semibold ${product.stock < 10 ? 'text-red-500' : 'text-green-500'}`}>
                                        {product.stock} units
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-(--text-primary)/60">Warranty</p>
                                    <p className="font-semibold">12 months</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* السعر */}
                    <div className="card p-6">
                        <div className="flex items-baseline justify-between mb-4">
                            <div>
                                <span className="text-3xl font-bold text-(--accent-color)">
                                    ${finalPrice}
                                </span>
                                {discount > 0 && (
                                    <span className="text-lg text-(--text-primary)/50 line-through ml-2">
                                        ${product.price}
                                    </span>
                                )}
                            </div>
                            {discount > 0 && (
                                <span className="text-lg font-bold text-(--highlight-color)">
                                    {discount}% OFF
                                </span>
                            )}
                        </div>

                        {/* اختيار الكمية */}
                        <div className="flex items-center space-x-4 mb-4">
                            <span className="text-(--text-primary)/60">Quantity:</span>
                            <div className="flex items-center border border-(--border-color) rounded-lg">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-3 py-1 hover:bg-(--hover-bg) transition"
                                >
                                    -
                                </button>
                                <span className="px-4 py-1 border-x border-(--border-color)">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="px-3 py-1 hover:bg-(--hover-bg) transition"
                                >
                                    +
                                </button>
                            </div>
                            <span className="text-sm text-(--text-primary)/60">
                                Max: {product.stock}
                            </span>
                        </div>

                        {/* أزرار الإجراءات */}
                        <div className="flex space-x-4">
                            <button
                                onClick={() => {
                                    for (let i = 0; i < quantity; i++) {
                                        addToCart(product);
                                    }
                                }}
                                disabled={product.stock === 0}
                                className={`flex-1 bg-(--accent-color) text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'
                                    }`}
                            >
                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>

                            <button
                                onClick={() => toggleWishlist(product.id)}
                                className={`p-3 rounded-lg border-2 transition-all transform hover:scale-110 ${isInWishlist
                                    ? 'border-(--highlight-color) text-(--highlight-color) bg-(--highlight-color)/10'
                                    : 'border-(--border-color) text-(--text-primary) hover:border-(--highlight-color) hover:text-(--highlight-color)'
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isInWishlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>

                        {/* شحن مجاني */}
                        <div className="mt-4 p-3 bg-(--border-color)/30 rounded-lg flex items-center space-x-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-(--accent-color)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                            </svg>
                            <span className="text-sm">Free shipping on orders over $50</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* منتجات مشابهة */}
            {similarProducts.length > 0 && (
                <section className="mt-16">
                    <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {similarProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default ProductDetails;