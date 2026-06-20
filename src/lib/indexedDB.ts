import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const DB_NAME = 'teachsmart-offline';
const DB_VERSION = 1;

export interface OfflineDocument {
  id: string; // Document ID (Firestore ID, or custom local ID)
  authorId: string;
  createdAt: any; // Date object or timestamp
  synced: boolean;
  type: 'lessonPlan' | 'note' | 'scheme' | 'exam';
  [key: string]: any; // Store all other keys matching each document's structure
}

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('IndexedDB is not available on server-side'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB opening error');
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      
      // Create stores for lessonPlans, notes, schemes, exams
      const stores = ['lessonPlans', 'notes', 'schemes', 'exams'];
      stores.forEach(storeName => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      });
    };
  });
}

/**
 * Cache an array of documents retrieved from Firestore to IndexedDB
 */
export async function cacheFirestoreItems(storeName: 'lessonPlans' | 'notes' | 'schemes' | 'exams', items: any[]): Promise<void> {
  try {
    const dbInstance = await initDB();
    const transaction = dbInstance.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    for (const item of items) {
      if (!item.id) continue;
      
      // Standardize the createdAt field to a plain timestamp or string if it is a Firestore Timestamp
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

      const docToStore: OfflineDocument = {
        ...item,
        id: item.id,
        synced: true, // Marked as synced because it was retrieved from Firestore server-side
        createdAt: createdAtValue,
        type: storeName === 'lessonPlans' ? 'lessonPlan' : storeName === 'notes' ? 'note' : storeName === 'schemes' ? 'scheme' : 'exam'
      };

      store.put(docToStore);
    }
  } catch (error) {
    console.error(`Failed to cache Firestore items to IndexedDB ${storeName}:`, error);
  }
}

/**
 * Save an item locally in IndexedDB (offline-first)
 */
export async function saveOffline(
  storeName: 'lessonPlans' | 'notes' | 'schemes' | 'exams',
  item: any,
  synced = false
): Promise<OfflineDocument> {
  const dbInstance = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = dbInstance.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    const id = item.id || `local_${storeName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Process createdAt
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

    const offlineDoc: OfflineDocument = {
      ...item,
      id,
      synced,
      createdAt,
      type: storeName === 'lessonPlans' ? 'lessonPlan' : storeName === 'notes' ? 'note' : storeName === 'schemes' ? 'scheme' : 'exam'
    };

    const request = store.put(offlineDoc);

    request.onsuccess = () => {
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
  storeName: 'lessonPlans' | 'notes' | 'schemes' | 'exams',
  authorId?: string
): Promise<OfflineDocument[]> {
  const dbInstance = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = dbInstance.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => {
      let results = request.result || [];
      if (authorId) {
        results = results.filter(doc => doc.authorId === authorId);
      }
      // Sort newest first
      results.sort((a, b) => b.createdAt - a.createdAt);
      resolve(results);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Delete a document from IndexedDB
 */
export async function deleteOffline(
  storeName: 'lessonPlans' | 'notes' | 'schemes' | 'exams',
  id: string
): Promise<void> {
  const dbInstance = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = dbInstance.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Push pending unsynced documents from IndexedDB up to Firestore
 */
export async function syncPendingToFirebase(authorId: string): Promise<number> {
  if (typeof window === 'undefined' || !navigator.onLine) {
    return 0; // Offline, can't sync
  }

  const stores: Array<'lessonPlans' | 'notes' | 'schemes' | 'exams'> = ['lessonPlans', 'notes', 'schemes', 'exams'];
  let syncedCount = 0;

  for (const storeName of stores) {
    try {
      const allItems = await getOffline(storeName, authorId);
      const unsyncedItems = allItems.filter(item => !item.synced);

      if (unsyncedItems.length === 0) continue;

      for (const item of unsyncedItems) {
        // Strip off custom local status fields to match firestore schema
        const { id, synced, type, ...firebasePayload } = item;
        
        // Use current server timestamp
        firebasePayload.createdAt = serverTimestamp();
        firebasePayload.authorId = authorId;

        // Save to firestore
        const collectionName = storeName; // matched
        const docRef = await addDoc(collection(db, collectionName), firebasePayload);
        
        // Remove locally stored local_ item and save the synced document with official Firestore doc.id
        await deleteOffline(storeName, id);
        await saveOffline(storeName, {
          ...firebasePayload,
          id: docRef.id,
          createdAt: Date.now()
        }, true);

        syncedCount++;
      }
    } catch (error) {
      console.warn(`Sync failed for store ${storeName}:`, error);
    }
  }

  return syncedCount;
}
