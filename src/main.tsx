import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Force TeachSmartGH to remain in light theme always for all users as per branding rules
localStorage.setItem('theme', 'light');
document.documentElement.classList.remove('dark');

// Automatically reset route to Dashboard on page refresh / initial load unless on a public page
try {
  const rawHash = window.location.hash || '';
  const currentPath = rawHash.replace(/^#\/?/, '/');
  const publicPrefixes = ['/login', '/about', '/features', '/blog'];
  const isPublicRoute = publicPrefixes.some(p => currentPath === p || currentPath.startsWith(`${p}/`) || currentPath.startsWith(`${p}?`));
  
  if (!isPublicRoute && currentPath !== '/' && currentPath !== '') {
    window.location.hash = '#/';
  }
} catch (e) {
  console.warn('[TeachSmart] Route reset check:', e);
}

// Register PWA Service Worker for offline asset caching and resilient routing
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[PWA] Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('[PWA] Service Worker registration failed:', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
