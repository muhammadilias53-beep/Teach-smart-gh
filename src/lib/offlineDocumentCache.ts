import { 
  saveOffline, 
  getOffline, 
  getAllOfflineDocuments, 
  deleteOffline, 
  cacheFirestoreItems,
  OfflineDocument, 
  StoreName 
} from './indexedDB';
import { safeLocalStorage } from './storage';

const LOCAL_MRU_KEY = 'teachsmart_recent_offline_docs_v2';
const SW_DOCS_CACHE_NAME = 'teachsmartgh-documents-v3';

/**
 * Cache a generated document across all offline layers:
 * 1. Service Worker Cache (via postMessage or Cache API)
 * 2. IndexedDB store
 * 3. LocalStorage MRU cache
 */
export async function cacheGeneratedDocument(doc: OfflineDocument): Promise<void> {
  if (!doc || !doc.id) return;

  const storeName: StoreName = 
    doc.type === 'lessonPlan' ? 'lessonPlans' :
    doc.type === 'note' ? 'notes' :
    doc.type === 'scheme' ? 'schemes' :
    doc.type === 'exam' ? 'exams' :
    doc.type === 'assignment' ? 'assignments' :
    doc.type === 'quiz' ? 'quizzes' :
    doc.type === 'report' ? 'reports' : 'recent_docs';

  const enrichedDoc: OfflineDocument = {
    ...doc,
    cachedAt: Date.now(),
    offlineAvailable: true
  };

  // 1. Save to IndexedDB
  try {
    await saveOffline(storeName, enrichedDoc, doc.synced ?? false);
  } catch (err) {
    console.warn('[OfflineCache] IndexedDB save failed:', err);
  }

  // 2. Post to Service Worker to cache for offline retrieval
  try {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_GENERATED_DOCUMENT',
        payload: enrichedDoc
      });
    }
  } catch (err) {
    console.warn('[OfflineCache] ServiceWorker postMessage failed:', err);
  }

  // 3. Direct CacheStorage API save if accessible in current window context
  try {
    if (typeof window !== 'undefined' && 'caches' in window) {
      const cache = await window.caches.open(SW_DOCS_CACHE_NAME);
      const url = `/offline-document-store/${enrichedDoc.id}`;
      const response = new Response(JSON.stringify(enrichedDoc), {
        headers: {
          'Content-Type': 'application/json',
          'X-TeachSmart-Cached': 'true'
        }
      });
      await cache.put(url, response);
    }
  } catch (err) {
    // CacheStorage might be restricted in some sandboxed frames
  }

  // 4. Save to LocalStorage MRU buffer (keeps last 20 docs for instant synchronous fallback)
  try {
    const existingRaw = safeLocalStorage.getItem(LOCAL_MRU_KEY);
    let list: OfflineDocument[] = existingRaw ? JSON.parse(existingRaw) : [];
    list = list.filter(item => item.id !== enrichedDoc.id);
    list.unshift(enrichedDoc);
    if (list.length > 25) list = list.slice(0, 25);
    safeLocalStorage.setItem(LOCAL_MRU_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('[OfflineCache] LocalStorage MRU save failed:', err);
  }
}

/**
 * Fetch all offline cached documents combining IndexedDB, SW Cache, and LocalStorage
 */
export async function getOfflineDocuments(authorId?: string, type?: string): Promise<OfflineDocument[]> {
  const docsMap = new Map<string, OfflineDocument>();

  // A. Fetch from IndexedDB
  try {
    const idbDocs = await getAllOfflineDocuments(authorId);
    idbDocs.forEach(d => {
      if (d && d.id) docsMap.set(d.id, d);
    });
  } catch (err) {
    console.warn('[OfflineCache] Could not read from IndexedDB:', err);
  }

  // B. Fetch from Service Worker Cache
  try {
    if (typeof window !== 'undefined' && 'caches' in window) {
      const cache = await window.caches.open(SW_DOCS_CACHE_NAME);
      const requests = await cache.keys();
      for (const req of requests) {
        if (req.url.includes('/offline-document-store/')) {
          const res = await cache.match(req);
          if (res) {
            try {
              const docJson = await res.json();
              if (docJson && docJson.id && (!authorId || docJson.authorId === authorId || docJson.userId === authorId)) {
                if (!docsMap.has(docJson.id)) {
                  docsMap.set(docJson.id, docJson);
                }
              }
            } catch (_) {}
          }
        }
      }
    }
  } catch (err) {
    console.warn('[OfflineCache] Could not read from SW Cache:', err);
  }

  // C. Fallback to LocalStorage MRU
  try {
    const existingRaw = safeLocalStorage.getItem(LOCAL_MRU_KEY);
    if (existingRaw) {
      const list: OfflineDocument[] = JSON.parse(existingRaw);
      list.forEach(d => {
        if (d && d.id && (!authorId || d.authorId === authorId || d.userId === authorId)) {
          if (!docsMap.has(d.id)) {
            docsMap.set(d.id, d);
          }
        }
      });
    }
  } catch (_) {}

  let allDocs = Array.from(docsMap.values());

  if (type) {
    const normType = type.toLowerCase();
    allDocs = allDocs.filter(d => (d.type || '').toLowerCase().includes(normType));
  }

  // Sort newest first
  allDocs.sort((a, b) => {
    const timeA = (a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || a.cachedAt || 0).getTime()) || 0;
    const timeB = (b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || b.cachedAt || 0).getTime()) || 0;
    return timeB - timeA;
  });

  return allDocs;
}

/**
 * Delete a document from all offline caches
 */
export async function removeCachedDocument(id: string, type?: string): Promise<void> {
  const storeName: StoreName = 
    type === 'lessonPlan' ? 'lessonPlans' :
    type === 'note' ? 'notes' :
    type === 'scheme' ? 'schemes' :
    type === 'exam' ? 'exams' :
    type === 'assignment' ? 'assignments' :
    type === 'quiz' ? 'quizzes' :
    type === 'report' ? 'reports' : 'recent_docs';

  // 1. Remove from IndexedDB
  try {
    await deleteOffline(storeName, id);
  } catch (_) {}

  // 2. Remove from Service Worker via postMessage
  try {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'DELETE_CACHED_DOC',
        payload: { id }
      });
    }
  } catch (_) {}

  // 3. Remove from CacheStorage
  try {
    if (typeof window !== 'undefined' && 'caches' in window) {
      const cache = await window.caches.open(SW_DOCS_CACHE_NAME);
      await cache.delete(`/offline-document-store/${id}`);
    }
  } catch (_) {}

  // 4. Remove from LocalStorage MRU
  try {
    const existingRaw = safeLocalStorage.getItem(LOCAL_MRU_KEY);
    if (existingRaw) {
      let list: OfflineDocument[] = JSON.parse(existingRaw);
      list = list.filter(d => d.id !== id);
      safeLocalStorage.setItem(LOCAL_MRU_KEY, JSON.stringify(list));
    }
  } catch (_) {}
}

/**
 * Synchronize batch of Firestore items into SW Cache and IndexedDB
 */
export async function cacheBatchFirestoreItems(storeName: StoreName, items: any[]): Promise<void> {
  await cacheFirestoreItems(storeName, items);
  for (const item of items) {
    if (item && item.id) {
      await cacheGeneratedDocument({
        ...item,
        id: item.id,
        type: item.type || (
          storeName === 'lessonPlans' ? 'lessonPlan' :
          storeName === 'notes' ? 'note' :
          storeName === 'schemes' ? 'scheme' :
          storeName === 'exams' ? 'exam' :
          storeName === 'assignments' ? 'assignment' :
          storeName === 'quizzes' ? 'quiz' :
          storeName === 'reports' ? 'report' : 'other'
        ),
        synced: true
      });
    }
  }
}
