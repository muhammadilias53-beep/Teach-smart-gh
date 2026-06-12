const CACHE_NAME = 'teachsmartgh-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.jpg',
  '/icon-512.jpg'
];

// Install Event - Pre-cache critical application shells
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching static assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up stale, old caches and claim control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Clear old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Handle caching strategy based on asset types
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip tracking, API, search grounded metrics, and real-time firebase updates
  if (
    requestUrl.pathname.startsWith('/api') || 
    requestUrl.href.includes('pagead2.googlesyndication.com') ||
    requestUrl.href.includes('firestore.googleapis.com') ||
    requestUrl.href.includes('identitytoolkit.googleapis.com') ||
    requestUrl.href.includes('securetoken.googleapis.com')
  ) {
    return; // Pass through to network directly
  }

  // Handle navigate request (SPA fallback for routing)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // Stale-While-Revalidate strategy for internal assets (JS, CSS, static media)
  if (requestUrl.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Fetch new version in the background to update cache
          fetch(event.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          });
          return cachedResponse;
        }

        // Cache miss - retrieve from network and cache for next time
        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        });
      })
    );
  }
});
