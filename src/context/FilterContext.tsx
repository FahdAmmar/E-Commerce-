import { createContext, useContext, useState, ReactNode } from "react";

// تعريف نوع البيانات التي سيحملها السياق (مع تصحيح الأسماء)
interface FilterContextType {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;  // تصحيح اسم الدالة
    minPrice: number | undefined;
    setMinPrice: (price: number | undefined) => void;
    maxPrice: number | undefined;
    setMaxPrice: (price: number | undefined) => void;
    keyword: string;
    setKeyword: (keyword: string) => void;
}

// إنشاء السياق بقيمة افتراضية undefined لفرض استخدامه داخل Provider فقط
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// مكون الـ Provider الذي يغلف الشجرة ويوفر القيم الفعلية
export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [keyword, setKeyword] = useState<string>('');

    return (
        <FilterContext.Provider
            value={{
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
            }}
        >
            {children}
        </FilterContext.Provider>
    );
};

// خطاف مخصص لاستخدام السياق بطريقة آمنة
export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilter must be used within a FilterProvider');
    }
    return context;
};