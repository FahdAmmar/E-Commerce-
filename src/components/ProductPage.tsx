import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    rating: number;
    images: string[];
    // قد يكون هناك المزيد مثل brand, category, stock etc.
    brand?: string;
    category?: string;
    stock?: number;
}

const ProductPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("Product ID is missing");
            setLoading(false);
            return;
        }

        setLoading(true);
        axios
            .get<Product>(`https://dummyjson.com/products/${id}`)
            .then((res) => {
                setProduct(res.data);
                setError(null);
            })
            .catch((err) => {
                console.error("Error fetching product:", err);
                setError("Failed to load product. Please try again.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleGoBack = () => {
        navigate(-1);
    };

    // عرض حالة التحميل
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
            </div>
        );
    }

    // عرض الخطأ
    if (error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <p className="mb-4 text-center text-red-600">{error}</p>
                <button
                    onClick={handleGoBack}
                    className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // إذا لم يوجد منتج (ربما id غير صحيح)
    if (!product) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <p className="mb-4 text-center text-gray-600">Product not found.</p>
                <button
                    onClick={handleGoBack}
                    className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // صورة العرض (الاولى أو صورة افتراضية)
    const displayImage = product.images?.[0] || "/placeholder-image.jpg"; // تأكد من وجود placeholder

    return (
        <main className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* زر العودة */}
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

                {/* محتوى المنتج */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* الصورة */}
                    <div className="overflow-hidden rounded-lg bg-white p-4 shadow-md">
                        <img
                            src={displayImage}
                            alt={product.title}
                            className="h-auto w-full object-contain"
                            loading="lazy"
                        />
                        {/* صور إضافية (إذا وجدت) */}
                        {product.images && product.images.length > 1 && (
                            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                                {product.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`${product.title} - ${index + 1}`}
                                        className="h-16 w-16 cursor-pointer rounded-md border object-cover transition-opacity hover:opacity-80"
                                        onClick={() => {/* يمكن إضافة وظيفة لعرض الصورة الكبيرة */ }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* التفاصيل */}
                    <div className="rounded-lg bg-white p-6 shadow-md">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">
                            {product.title}
                        </h1>

                        {/* التقييم */}
                        <div className="mb-4 flex items-center">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`h-5 w-5 ${i < Math.round(product.rating)
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                            }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                                <span className="ml-2 text-sm text-gray-600">
                                    ({product.rating.toFixed(1)})
                                </span>
                            </div>
                            {/* يمكن إضافة عدد التقييمات لو موجود */}
                        </div>

                        {/* السعر */}
                        <div className="mb-6 text-3xl font-bold text-gray-900">
                            ${product.price.toFixed(2)}
                        </div>

                        {/* الوصف */}
                        <div className="mb-6">
                            <h2 className="mb-2 text-lg font-semibold text-gray-900">
                                Description
                            </h2>
                            <p className="text-gray-700">{product.description}</p>
                        </div>

                        {/* معلومات إضافية إذا كانت متوفرة */}
                        {(product.brand || product.category || product.stock !== undefined) && (
                            <div className="mb-6 border-t pt-4">
                                <h2 className="mb-2 text-lg font-semibold text-gray-900">
                                    Details
                                </h2>
                                <ul className="space-y-1 text-gray-700">
                                    {product.brand && (
                                        <li>
                                            <span className="font-medium">Brand:</span> {product.brand}
                                        </li>
                                    )}
                                    {product.category && (
                                        <li>
                                            <span className="font-medium">Category:</span> {product.category}
                                        </li>
                                    )}
                                    {product.stock !== undefined && (
                                        <li>
                                            <span className="font-medium">Availability:</span>{" "}
                                            {product.stock > 0 ? (
                                                <span className="text-green-600">In Stock ({product.stock})</span>
                                            ) : (
                                                <span className="text-red-600">Out of Stock</span>
                                            )}
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}

                        {/* أزرار الإجراءات */}
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button className="flex-1 rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700">
                                Add to Cart
                            </button>
                            <button className="flex-1 rounded-md border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductPage;