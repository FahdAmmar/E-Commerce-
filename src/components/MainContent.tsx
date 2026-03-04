import { useEffect, useState, useMemo, useRef } from "react";
import { useFilter } from "../context/FilterContext";
import { useCart } from "../context/CartContext";
import { Tally3, ChevronLeft, ChevronRight, Loader2, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import BookCard from "./BookCard";

interface SliderProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

function MainContent({ isOpen, toggleSidebar }: SliderProps) {
  const { searchQuery, selectedCategory, minPrice, maxPrice, keyword } = useFilter();
  const { totalItems } = useCart();

  // تصحيح التسمية: products بدلاً من produects
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  // Reference لإغلاق القائمة عند النقر خارجها
  const dropdownRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 12;

  // Fetch Data
  useEffect(() => {
    setIsLoading(true);
    let URL = `https://dummyjson.com/products?limit=${itemsPerPage}&skip=${(currentPage - 1) * itemsPerPage}`;

    if (keyword) {
      URL = `https://dummyjson.com/products/search?q=${keyword}`;
    }

    axios.get(URL).then(res => {
      setProducts(res.data.products);
    }).catch(error => {
      console.error("Error Fetching data ", error);
    }).finally(() => {
      setIsLoading(false);
    });

  }, [keyword, currentPage]);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // تحسين منطق الفلترة باستخدام useMemo للأداء
  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory) {
      result = result.filter((product) => product.category === selectedCategory);
    }

    if (minPrice !== undefined) {
      result = result.filter(pro => pro.price >= minPrice); // استخدمت >= لتكون أكثر دقة
    }
    if (maxPrice !== undefined) {
      result = result.filter(pro => pro.price <= maxPrice);
    }
    if (searchQuery) {
      result = result.filter(pro =>
        pro.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (filter) {
      case 'expensive':
        return result.sort((a, b) => b.price - a.price);
      case 'cheap':
        return result.sort((a, b) => a.price - b.price);
      case 'popular':
        return result.sort((a, b) => b.rating - a.rating);
      default:
        return result;
    }
  }, [products, selectedCategory, minPrice, maxPrice, searchQuery, filter]);

  // Pagination Logic
  const totalProducts = 100; // يفضل جلب هذا العدد من الـ API
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // العودة لأعلى الصفحة
    }
  };

  const getPaginationButtons = () => {
    const buttons: number[] = [];
    // منطق مبسط وأوضح
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    for (let page = startPage; page <= endPage; page++) { // تم تصحيح الشرط إلى <=
      buttons.push(page);
    }
    return buttons;
  };

  // دالة مساعدة لتنسيق نص الفلتر
  const getFilterLabel = () => {
    if (filter === 'all') return "Sort by";
    return filter.charAt(0).toUpperCase() + filter.slice(1);
  };

  return (
    <main className="w-full min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">

      {/* Container with max-width for better readability on large screens */}
      <div className="max-w-7xl mx-auto">

        {/* Header Section: Title and Filter Dropdown */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">

          <h1 onClick={() => toggleSidebar(!isOpen)} className="text-2xl font-bold text-gray-900">All Books</h1>

          <Link to="/cart" className="relative group p-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all shadow-sm">
            <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-black" />

            {/* الدائرة الحمراء التي تعرض العدد (Badge) */}
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                {totalItems}
              </span>
            )}
          </Link>



          {/* Filter Dropdown Container */}
          <div className="relative w-full sm:w-auto" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full sm:w-48 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all flex items-center justify-between"
            >
              <span className="font-medium">{getFilterLabel()}</span>
              <Tally3 className="w-4 h-4 text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden transform transition-all duration-200 origin-top-right">
                {['all', 'cheap', 'expensive', 'popular'].map((option) => (
                  <button
                    key={option}
                    onClick={() => { setFilter(option); setDropdownOpen(false); }}
                    className={`block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors capitalize ${filter === option ? 'bg-gray-100 font-semibold text-black' : 'text-gray-700'
                      }`}
                  >
                    {option === 'all' ? 'Default' : option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-black" />
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <BookCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  image={product.thumbnail}
                  price={product.price}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">No books found matching your criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-full border flex items-center justify-center transition-all ${currentPage === 1
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-black hover:text-white hover:border-black'
                }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page Numbers */}
            <div className="flex gap-2">
              {getPaginationButtons().map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${page === currentPage
                    ? 'bg-black text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full border flex items-center justify-center transition-all ${currentPage === totalPages
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-black hover:text-white hover:border-black'
                }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>
    </main>
  );
}

export default MainContent;