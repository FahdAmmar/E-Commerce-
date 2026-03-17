/**
 * ============================================
 * Application Entry Point
 * ============================================
 * Renders the root React component with providers
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// ============================================
// Error Boundary for Production
// ============================================

/**
 * Global error handler for uncaught errors
 */
window.onerror = (message, source, lineno, colno, error) => {
  console.error('Global error:', { message, source, lineno, colno, error });
  // In production, you might want to send this to an error tracking service
  return false;
};

/**
 * Global handler for unhandled promise rejections
 */
window.onunhandledrejection = (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // In production, you might want to send this to an error tracking service
};

// ============================================
// Render Application
// ============================================

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    {/* BrowserRouter enables client-side routing */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);