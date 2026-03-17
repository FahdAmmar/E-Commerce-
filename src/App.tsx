
import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';

// Context Providers
import { CartProvider } from './context/CartContext';
import { FilterProvider } from './context/FilterContext';

// Components
import Slider from './components/Slider';
import MainContent from './components/MainContent';
import ProductPage from './components/ProductPage';
import CartPage from './components/CartPage';

// ============================================
// App Component
// ============================================

function App() {
  // ========================================
  // State for sidebar toggle
  // ========================================
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  /**
   * Toggle sidebar visibility
   */
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    // ========================================
    // Wrap with providers
    // ========================================
    <CartProvider>
      <FilterProvider>
        {/* Main container */}
        <main className="w-screen min-h-screen flex overflow-x-hidden bg-gray-50">
          {/* Sidebar component */}
          <Slider isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

          {/* Main content area */}
          <div className="flex-1 w-full">
            <Routes>
              {/* Home route - Product listing */}
              <Route
                path="/"
                element={
                  <MainContent
                    isOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                  />
                }
              />

              {/* Product detail route */}
              <Route path="/product/:id" element={<ProductPage />} />

              {/* Shopping cart route */}
              <Route path="/cart" element={<CartPage />} />

              {/* 404 - Not found route */}
              <Route
                path="*"
                element={
                  <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                      404 - Page Not Found
                    </h1>
                    <p className="text-gray-600">
                      The page you're looking for doesn't exist.
                    </p>
                  </div>
                }
              />
            </Routes>
          </div>
        </main>
      </FilterProvider>
    </CartProvider>
  );
}

export default App;