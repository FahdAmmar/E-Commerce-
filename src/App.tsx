import { Route, Routes } from "react-router-dom"
import Slider from "./components/Slider"
import MainContent from "./components/MainContent"
import ProductPage from "./components/ProductPage"
import CartPage from "./components/CartPage"
import { useState } from "react"
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);



  return (
    <main className="w-screen h-screen flex overflow-x-hidden">
      <Slider
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className="rounded w-full flex justify-between flex-wrap">
        <Routes>
          <Route path="/" element={<MainContent isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar} />}></Route>
          <Route path="/product/:id" element={<ProductPage />}></Route>
          <Route path="/cart" element={<CartPage />} />

        </Routes>

      </div>
    </main>

  )
}

export default App


