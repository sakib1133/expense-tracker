import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
        
        // Check for updates immediately after registration
        registration.update();
        
        // Listen for controller changes to detect when new SW takes control
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('Service Worker controller changed - new version activated');
          window.location.reload();
        });
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
