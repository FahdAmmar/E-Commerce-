// ThemeContext.tsx
import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

// تعريف نوع الثيم
type Theme = "light" | "dark";

// تعريف نوع السياق
interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    colors: {
        background: string;
        text: string;
        accent: string;
        border: string;
        highlight: string;
    };
}

// إنشاء السياق
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// مقدم السياق
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    // الحصول على الثيم من localStorage أو استخدام الثيم الافتراضي
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem("ecommerce-theme") as Theme;
        return savedTheme || "light";
    });

    // تحديد الألوان بناءً على الثيم الحالي
    const colors = {
        light: {
            background: "#FFFFFF",
            text: "#121212",
            accent: "#0A58CA",
            border: "#E9ECEF",
            highlight: "#FD7E14",
        },
        dark: {
            background: "#121212",
            text: "#E9ECEF",
            accent: "#3D8BFD",
            border: "#495057",
            highlight: "#FF922B",
        },
    }[theme];

    // تبديل الثيم
    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    // تحديث localStorage عند تغيير الثيم
    useEffect(() => {
        localStorage.setItem("ecommerce-theme", theme);
        document.body.style.backgroundColor = colors.background;
        document.body.style.color = colors.text;
    }, [theme, colors]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

// هوك لاستخدام السياق
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};