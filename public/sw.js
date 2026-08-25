const SHELL_CACHE_NAME = 'teachsmartgh-shell-v3';
const DOCS_CACHE_NAME = 'teachsmartgh-documents-v3';

const ASSETS_TO_PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.jpg',
  '/icon-512.jpg'
];

// Install Event - Pre-cache critical application shells resiliently
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE_NAME).then(async (cache) => {
      console.log('[Service Worker] Pre-caching static application shell');
      const cachePromises = ASSETS_TO_PRECACHE.map(async (url) => {
        try {
          const response = await fetch(url);
          if (response.ok) {
            await cache.put(url, response);
          }
        } catch (err) {
          console.warn('[Service Worker] Could not pre-cache asset:', url, err);
        }
      });
      await Promise.all(cachePromises);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up stale, old caches and claim control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== SHELL_CACHE_NAME && key !== DOCS_CACHE_NAME) {
            console.log('[Service Worker] Clearing legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Message Listener for Document Caching & Synchronization
self.addEventListener('message', async (event) => {
  if (!event.data || !event.data.type) return;

  const { type, payload } = event.data;

  // 1. Cache a newly generated document or updated teaching material
  if (type === 'CACHE_GENERATED_DOCUMENT' && payload && payload.id) {
    try {
      const docCache = await caches.open(DOCS_CACHE_NAME);
      const url = `/offline-document-store/${payload.id}`;
      const docData = {
        ...payload,
        cachedAt: Date.now(),
        offlineAvailable: true
      };
      
      const response = new Response(JSON.stringify(docData), {
        headers: {
          'Content-Type': 'application/json',
          'X-TeachSmart-Cached': 'true',
          'X-Document-Type': payload.type || 'generic',
          'X-Document-Title': encodeURIComponent(payload.title || 'Untitled Document'),
          'X-Document-Subject': encodeURIComponent(payload.subject || ''),
          'X-Document-Level': encodeURIComponent(payload.level || '')
        }
      });

      await docCache.put(url, response);

      // Reply back to the client that document is safely cached offline
      if (event.source && event.source.postMessage) {
        event.source.postMessage({
          type: 'DOCUMENT_CACHED_SUCCESS',
          id: payload.id,
          title: payload.title
        });
      }
    } catch (err) {
      console.warn('[Service Worker] Failed to cache generated document:', err);
    }
  }

  // 2. Retrieve all offline cached documents for poor connectivity access
  if (type === 'GET_ALL_CACHED_DOCS') {
    try {
      const docCache = await caches.open(DOCS_CACHE_NAME);
      const requests = await docCache.keys();
      const documents = [];

      for (const req of requests) {
        if (req.url.includes('/offline-document-store/')) {
          const res = await docCache.match(req);
          if (res) {
            try {
              const docJson = await res.json();
              documents.push(docJson);
            } catch (e) {
              console.warn('[Service Worker] Could not parse cached document JSON:', e);
            }
          }
        }
      }

      // Sort newest cached first
      documents.sort((a, b) => (b.cachedAt || b.createdAt || 0) - (a.cachedAt || a.createdAt || 0));

      if (event.source && event.source.postMessage) {
        event.source.postMessage({
          type: 'CACHED_DOCS_LIST_RESPONSE',
          documents
        });
      }
    } catch (err) {
      console.warn('[Service Worker] Failed to read cached documents:', err);
    }
  }

  // 3. Delete a specific cached document
  if (type === 'DELETE_CACHED_DOC' && payload && payload.id) {
    try {
      const docCache = await caches.open(DOCS_CACHE_NAME);
      await docCache.delete(`/offline-document-store/${payload.id}`);
      if (event.source && event.source.postMessage) {
        event.source.postMessage({
          type: 'DOCUMENT_DELETED_SUCCESS',
          id: payload.id
        });
      }
    } catch (err) {
      console.warn('[Service Worker] Failed to delete cached document:', err);
    }
  }

  // 4. Clear all cached documents
  if (type === 'CLEAR_ALL_CACHED_DOCS') {
    try {
      await caches.delete(DOCS_CACHE_NAME);
      await caches.open(DOCS_CACHE_NAME);
      if (event.source && event.source.postMessage) {
        event.source.postMessage({ type: 'ALL_CACHED_DOCS_CLEARED' });
      }
    } catch (err) {
      console.warn('[Service Worker] Failed to clear documents cache:', err);
    }
  }
});

// Fetch Event - Handle caching strategy based on request types
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // A. Synthetic offline document store requests - Cache First
  if (requestUrl.pathname.startsWith('/offline-document-store/')) {
    event.respondWith(
      caches.open(DOCS_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        return new Response(JSON.stringify({ error: 'Document not found in offline storage' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // B. Skip external telemetry, ads, and real-time live firebase requests
  if (
    requestUrl.href.includes('pagead2.googlesyndication.com') ||
    requestUrl.href.includes('identitytoolkit.googleapis.com') ||
    requestUrl.href.includes('securetoken.googleapis.com')
  ) {
    return; // Pass through to network directly
  }

  // C. Handle SPA navigation requests - Network with Offline App Shell Fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(async () => {
          const shellCache = await caches.open(SHELL_CACHE_NAME);
          return (await shellCache.match('/index.html')) || (await shellCache.match('/'));
        })
    );
    return;
  }

  // D. Stale-While-Revalidate strategy for internal assets (JS, CSS, static media)
  if (requestUrl.origin === self.location.origin) {
    event.respondWith(
      caches.open(SHELL_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        
        // Fetch new version in the background to update cache
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch((err) => {
            // If network fails and we have no cached copy, return null or fallback
            return null;
          });

        if (cachedResponse) {
          return cachedResponse;
        }

        const networkResponse = await fetchPromise;
        if (networkResponse) {
          return networkResponse;
        }

        // Return basic fallback for failed sub-resources
        return new Response('', { status: 408, statusText: 'Offline' });
      })
    );
  }
});
