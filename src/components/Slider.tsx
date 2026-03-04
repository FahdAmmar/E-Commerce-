import { useEffect, useState } from "react";
import { useFilter } from "../context/FilterContext";
import { Search, X, RotateCcw, Check, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
// تعريف واجهة البيانات القادمة من الـ API
interface Product {
    category: string;
    id: string;
}

interface FetchResponse {
    products: Product[];
}

// تعريف Props للتحكم في فتح/إغلاق السلايدر
interface SliderProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

function Slider({ isOpen, toggleSidebar }: SliderProps) {
    const {
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        keyword,
        setKeyword,
    } = useFilter();

    const [categories, setCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [keywords] = useState<string[]>([
        "apple",
        "watch",
        "Fashion",
        "trend",
        "shoes",
        "shirt",
    ]);

    const [activeKeyword, setActiveKeyword] = useState<string | null>(null);

    // جلب الفئات
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('https://dummyjson.com/products?limit=100');
                const data: FetchResponse = await response.json();
                const uniqCategories: string[] = Array.from(new Set(data.products.map(p => p.category)));
                uniqCategories.sort();
                setCategories(uniqCategories);
            } catch (error) {
                console.error("Error fetching categories", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleMinPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMinPrice(value ? parseFloat(value) : undefined);
    };

    const handleMaxPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMaxPrice(value ? parseFloat(value) : undefined);
    };

    const handleCategoryChange = (category: string) => {
        if (selectedCategory === category) {
            setSelectedCategory("");
        } else {
            setSelectedCategory(category);
        }
    };

    const handleKeywordClick = (kw: string) => {
        if (activeKeyword === kw) {
            setKeyword("");
            setActiveKeyword(null);
        } else {
            setKeyword(kw);
            setActiveKeyword(kw);
        }
    };

    const handleResetFilter = () => {
        setSearchQuery("");
        setSelectedCategory("");
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setKeyword("");
        setActiveKeyword(null);
        // إغلاق القائمة في الموبايل عند ضغط ريست
        if (window.innerWidth < 768) {
            toggleSidebar();
        }
    };

    const formatText = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

    return (
        <>

            {/* حاوية السلايدر */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-50 
          w-72 bg-white border-r border-gray-100 shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${!isOpen ? 'hidden md:block' : 'hidden'}
          
          md:relative md:translate-x-0 md:shadow-none md:z-auto 
          md:h-screen 
        `}
            >
                <div className="h-full flex flex-col p-6 gap-6 ">

                    {/* رأس القائمة: زر الإغلاق (موبايل) + الشعار */}
                    <div className="flex items-center justify-between">
                        {/* الشعار يخفي في الموبايل لترك مساحة للإغلاق، ويظهر في الدسك توب */}

                        <Link to='/'>
                            <h1 className={`text-2xl font-extrabold tracking-tight text-gray-900 ${!isOpen ? 'hidden md:block' : 'hidden'}`}>
                                React<span className="text-blue-600">Store</span>
                            </h1>
                        </Link>

                        {/* زر الإغلاق يظهر فقط في الموبايل */}
                        <button
                            onClick={toggleSidebar}
                            className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* قسم البحث */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* قسم السعر */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Price Range</h3>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative w-1/2">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">$</span>
                                <input
                                    type="number"
                                    className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                                    placeholder="Min"
                                    value={minPrice ?? ""}
                                    onChange={handleMinPrice}
                                />
                            </div>
                            <div className="relative w-1/2">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">$</span>
                                <input
                                    type="number"
                                    className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                                    placeholder="Max"
                                    value={maxPrice ?? ""}
                                    onChange={handleMaxPrice}
                                />
                            </div>
                        </div>
                    </div>

                    {/* قسم الكلمات المفتاحية */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Popular Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {keywords.map((kw) => (
                                <button
                                    key={kw}
                                    onClick={() => handleKeywordClick(kw)}
                                    className={`px-4 py-2 text-xs rounded-full border transition-all duration-200 capitalize ${activeKeyword === kw
                                        ? "bg-black text-white border-black shadow-md"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900"
                                        }`}
                                >
                                    {kw}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* قسم الفئات */}
                    <div className="space-y-8 flex-grow  pr-1">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Categories</h3>
                        <div className="space-y-5">
                            {
                                categories.slice(0, 4).map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => handleCategoryChange(category)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${selectedCategory === category
                                            ? "bg-black text-white shadow-md"
                                            : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        <span>{formatText(category)}</span>
                                        {selectedCategory === category && <Check className="w-4 h-4" />}
                                    </button>
                                ))
                            }
                        </div>
                    </div>



                    {/* زر إعادة التعيين */}
                    <button
                        onClick={handleResetFilter}
                        className="w-full py-3.5 flex items-center justify-center gap-2 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 hover:text-black hover:border-black transition-all active:scale-95 mt-auto"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset Filters
                    </button>

                </div>
            </aside>
        </>
    );
}

export default Slider;