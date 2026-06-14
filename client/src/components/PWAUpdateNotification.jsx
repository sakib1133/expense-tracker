import { useState, useEffect } from 'react';

export default function PWAUpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    // Check for service worker updates
    if ('serviceWorker' in navigator) {
      console.log('PWA: Service worker is supported');
      navigator.serviceWorker.ready.then((reg) => {
        console.log('PWA: Service worker is ready:', reg);
        setRegistration(reg);
        
        // Listen for updates
        reg.addEventListener('updatefound', () => {
          console.log('PWA: Update found');
          const newWorker = reg.installing;
          
          newWorker.addEventListener('statechange', () => {
            console.log('PWA: Worker state changed to:', newWorker.state);
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is available, waiting to be activated
              console.log('PWA: New version available, showing update notification');
              setShowUpdate(true);
            }
          });
        });
        
        // Also check for waiting service worker on page load
        if (reg.waiting) {
          console.log('PWA: Waiting service worker found, showing update notification');
          setShowUpdate(true);
        }
      }).catch((error) => {
        console.error('PWA: Service worker ready failed:', error);
      });
      
      // Periodically check for updates (every 5 minutes)
      const interval = setInterval(() => {
        navigator.serviceWorker.ready.then((reg) => {
          console.log('PWA: Checking for updates...');
          reg.update();
        });
      }, 5 * 60 * 1000);
      
      return () => clearInterval(interval);
    } else {
      console.log('PWA: Service worker is not supported');
    }
  }, []);

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      // Send message to waiting service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // When the new service worker activates, reload the page
      registration.waiting.addEventListener('statechange', () => {
        if (registration.waiting.state === 'activated') {
          window.location.reload();
        }
      });
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">
            A new version of the app is available.
          </p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleUpdate}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Update Now
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-500"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
