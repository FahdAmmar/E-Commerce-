import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, CheckCircle } from "lucide-react"; // استيراد الأيقونات
import { useCart } from "../context/CartContext";
// استيراد المكتبة
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// تهيئة SweetAlert للعمل مع React
const MySwal = withReactContent(Swal);

interface BookCardProps {
    id: string;
    title: string;
    image: string;
    price: number;
}

const BookCard: React.FC<BookCardProps> = ({ id, title, image, price }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();

        addToCart({
            id: id.toString(),
            title,
            image,
            price,
            quantity: 1,
        });

        // --- هنا يظهر الإشعار الجميل ---
        MySwal.fire({
            title: <strong>Added to Cart!</strong>,
            html: <i>{title} has been added.</i>,
            icon: 'success',
            toast: true, // يجعله إشعاراً صغيراً بدلاً من نافذة منبثقة كبيرة
            position: 'top-end', // مكان ظهور الإشعار (أعلى اليمين)
            showConfirmButton: false, // إخفاء زر "OK" ليغلق تلقائياً
            timer: 2000, // مدة ظهور الإشعار (ثانيتين)
            timerProgressBar: true, // شريط تقدم يوضح متى سيغلق
            background: '#fff', // لون الخلفية
            iconColor: '#10B981', // لون الأيقونة (أخضر)
            customClass: {
                popup: 'rounded-xl shadow-2xl', // تخصيص شكل الظل والزوايا
                title: 'text-lg',
            }
        });
    };

    return (
        <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden border border-gray-100 relative flex flex-col">

            <Link to={`/product/${id}`} className="block h-full">
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                <div className="p-5 flex flex-col items-start flex-grow">
                    <h2 className="text-lg font-bold text-gray-800 line-clamp-2 mb-2 min-h-[3.5rem] leading-snug">
                        {title}
                    </h2>
                    <p className="text-xl font-semibold text-blue-600 mt-auto">
                        ${price}
                    </p>
                </div>
            </Link>

            <button
                onClick={handleAddToCart}
                className="absolute bottom-4 right-4 bg-black text-white p-3 rounded-full shadow-lg  translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-blue-600 hover:scale-110 z-10"
                title="Add to Cart"
            >
                <ShoppingCart className="w-5 h-5" />
            </button>
        </div>
    );
};

export default BookCard;