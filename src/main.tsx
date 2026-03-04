import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { FilterProvider } from './context/FilterContext.tsx'
import { CartProvider } from './context/CartContext.tsx'
import 'sweetalert2/dist/sweetalert2.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <FilterProvider>
          <App />
        </FilterProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)
