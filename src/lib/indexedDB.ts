import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const DB_NAME = 'teachsmart-offline-v2';
const DB_VERSION = 2;

export interface OfflineDocument {
  id: string; // Document ID (Firestore ID, or custom local ID)
  authorId?: string;
  userId?: string;
  createdAt: any; // Date object, timestamp number, or Firestore Timestamp
  updatedAt?: any;
  synced: boolean;
  type: 'lessonPlan' | 'note' | 'scheme' | 'exam' | 'assignment' | 'quiz' | 'report' | 'bstem' | 'other';
  title?: string;
  subject?: string;
  level?: string;
  class?: string;
  term?: string | number;
  strand?: string;
  subStrand?: string;
  indicator?: string;
  content?: any;
  phase1?: string;
  phase2?: string;
  phase3?: string;
  questions?: any;
  markingScheme?: string;
  rubric?: string;
  summary?: string[];
  offlineAvailable?: boolean;
  cachedAt?: number;
  [key: string]: any; // Store all other keys matching each document's structure
}

export const ALL_STORES = [
  'lessonPlans',
  'notes',
  'schemes',
  'exams',
  'assignments',
  'quizzes',
  'reports',
  'recent_docs'
] as const;

export type StoreName = (typeof ALL_STORES)[number];

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not available in this environment'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.warn('[IndexedDB] Opening error:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event: any) => {
      const dbInstance = event.target.result;
      
      ALL_STORES.forEach(storeName => {
        if (!dbInstance.objectStoreNames.contains(storeName)) {
          const store = dbInstance.createObjectStore(storeName, { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt', { unique: false });
          store.createIndex('authorId', 'authorId', { unique: false });
          store.createIndex('type', 'type', { unique: false });
        }
      });
    };
  });
}

/**
 * Cache an array of documents retrieved from Firestore to IndexedDB
 */
export async function cacheFirestoreItems(
  storeName: StoreName, 
  items: any[]
): Promise<void> {
  try {
    const dbInstance = await initDB();
    const transaction = dbInstance.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    for (const item of items) {
      if (!item.id) continue;
      
      let createdAtValue = Date.now();
      if (item.createdAt) {
        if (typeof item.createdAt.toMillis === 'function') {
          createdAtValue = item.createdAt.toMillis();
        } else if (item.createdAt.seconds) {
          createdAtValue = item.createdAt.seconds * 1000;
        } else if (typeof item.createdAt === 'string' || typeof item.createdAt === 'number') {
          createdAtValue = new Date(item.createdAt).getTime();
        }
      }

      const docType = item.type || (
        storeName === 'lessonPlans' ? 'lessonPlan' :
        storeName === 'notes' ? 'note' :
        storeName === 'schemes' ? 'scheme' :
        storeName === 'exams' ? 'exam' :
        storeName === 'assignments' ? 'assignment' :
        storeName === 'quizzes' ? 'quiz' :
        storeName === 'reports' ? 'report' : 'other'
      );

      const docToStore: OfflineDocument = {
        ...item,
        id: item.id,
        synced: true,
        createdAt: createdAtValue,
        type: docType,
        cachedAt: Date.now(),
        offlineAvailable: true
      };

      store.put(docToStore);
    }
  } catch (error) {
    console.warn(`[IndexedDB] Failed to cache Firestore items to ${storeName}:`, error);
  }
}

/**
 * Save an item locally in IndexedDB (offline-first)
 */
export async function saveOffline(
  storeName: StoreName,
  item: any,
  synced = false
): Promise<OfflineDocument> {
  const dbInstance = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = dbInstance.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    const id = item.id || `local_${storeName}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    let createdAt = Date.now();
    if (item.createdAt) {
      if (typeof item.createdAt.toMillis === 'function') {
        createdAt = item.createdAt.toMillis();
      } else if (item.createdAt.seconds) {
        createdAt = item.createdAt.seconds * 1000;
      } else {
        createdAt = new Date(item.createdAt).getTime();
      }
    }

    const docType = item.type || (
      storeName === 'lessonPlans' ? 'lessonPlan' :
      storeName === 'notes' ? 'note' :
      storeName === 'schemes' ? 'scheme' :
      storeName === 'exams' ? 'exam' :
      storeName === 'assignments' ? 'assignment' :
      storeName === 'quizzes' ? 'quiz' :
      storeName === 'reports' ? 'report' : 'other'
    );

    const offlineDoc: OfflineDocument = {
      ...item,
      id,
      synced,
      createdAt,
      type: docType,
      cachedAt: Date.now(),
      offlineAvailable: true
    };

    const request = store.put(offlineDoc);

    request.onsuccess = () => {
      // Also maintain in recent_docs store for fast dashboard retrieval
      if (storeName !== 'recent_docs') {
        try {
          const recTx = dbInstance.transaction('recent_docs', 'readwrite');
          const recStore = recTx.objectStore('recent_docs');
          recStore.put(offlineDoc);
        } catch (_) {}
      }
      resolve(offlineDoc);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Get all saved offline documents for a specific store
 */
export async function getOffline(
  storeName: StoreName,
  authorId?: string
): Promise<OfflineDocument[]> {
  try {
    const dbInstance = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = dbInstance.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        let results: OfflineDocument[] = request.result || [];
        if (authorId) {
          results = results.filter(doc => (doc.authorId === authorId || doc.userId === authorId));
        }
        // Sort newest first
        results.sort((a, b) => (b.createdAt || b.cachedAt || 0) - (a.createdAt || a.cachedAt || 0));
        resolve(results);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.warn(`[IndexedDB] Could not retrieve from store ${storeName}:`, err);
    return [];
  }
}

/**
 * Get all offline documents across all stores
 */
export async function getAllOfflineDocuments(authorId?: string): Promise<OfflineDocument[]> {
  try {
    const promises = ALL_STORES.map(store => getOffline(store, authorId).catch(() => []));
    const allResults = await Promise.all(promises);
    
    // Deduplicate by ID
    const map = new Map<string, OfflineDocument>();
    allResults.flat().forEach(doc => {
      if (doc && doc.id) {
        map.set(doc.id, doc);
      }
    });

    const combined = Array.from(map.values());
    combined.sort((a, b) => (b.createdAt || b.cachedAt || 0) - (a.createdAt || a.cachedAt || 0));
    return combined;
  } catch (err) {
    console.warn('[IndexedDB] getAllOfflineDocuments failed:', err);
    return [];
  }
}

/**
 * Delete a document from IndexedDB
 */
export async function deleteOffline(
  storeName: StoreName,
  id: string
): Promise<void> {
  try {
    const dbInstance = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = dbInstance.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        // Also remove from recent_docs
        try {
          const recTx = dbInstance.transaction('recent_docs', 'readwrite');
          recTx.objectStore('recent_docs').delete(id);
        } catch (_) {}
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.warn(`[IndexedDB] deleteOffline error on ${storeName}:`, err);
  }
}

/**
 * Push pending unsynced documents from IndexedDB up to Firestore when internet returns
 */
export async function syncPendingToFirebase(authorId: string): Promise<number> {
  if (typeof window === 'undefined' || !navigator.onLine) {
    return 0; // Offline, can't sync
  }

  const syncableStores: StoreName[] = ['lessonPlans', 'notes', 'schemes', 'exams', 'assignments', 'quizzes'];
  let syncedCount = 0;

  for (const storeName of syncableStores) {
    try {
      const allItems = await getOffline(storeName, authorId);
      const unsyncedItems = allItems.filter(item => !item.synced);

      if (unsyncedItems.length === 0) continue;

      for (const item of unsyncedItems) {
        const { id, synced, type, cachedAt, offlineAvailable, ...firebasePayload } = item;
        
        firebasePayload.createdAt = serverTimestamp();
        firebasePayload.authorId = authorId;

        const collectionName = storeName;
        const docRef = await addDoc(collection(db, collectionName), firebasePayload);
        
        // Remove locally generated local_ ID and save official Firestore doc.id
        await deleteOffline(storeName, id);
        await saveOffline(storeName, {
          ...firebasePayload,
          id: docRef.id,
          createdAt: Date.now()
        }, true);

        syncedCount++;
      }
    } catch (error) {
      console.warn(`[IndexedDB] Sync failed for store ${storeName}:`, error);
    }
  }

  return syncedCount;
}
