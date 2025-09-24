import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'

import App from './App';

// Create root and render the App component
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: Performance monitoring
const reportWebVitals = async (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    const { onCLS, onFCP, onLCP, onTTFB, onINP } = await import('web-vitals');
    onCLS(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
    onINP(onPerfEntry); // replaces onFID
  }
};

reportWebVitals(console.log);
