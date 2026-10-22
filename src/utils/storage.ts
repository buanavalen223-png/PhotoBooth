import { GalleryWorkItem } from '../types/photobooth';

const DB_NAME = 'MochiBoothGalleryDB';
const DB_VERSION = 1;
const STORE_NAME = 'works';

function openGalleryDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB is not supported in this browser environment.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error || new Error('Failed to open local IndexedDB database.'));
  });
}

export async function saveWorkToGallery(item: GalleryWorkItem): Promise<void> {
  const db = await openGalleryDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(item);

    req.onsuccess = () => resolve();
    req.onerror = () => {
      if (req.error?.name === 'QuotaExceededError') {
        reject(
          new Error(
            'Browser storage is full! Please delete some older creations in the Gallery to free up space.'
          )
        );
      } else {
        reject(req.error || new Error('Could not save photo to local gallery.'));
      }
    };
    tx.oncomplete = () => db.close();
  });
}

export async function getAllGalleryWorks(): Promise<GalleryWorkItem[]> {
  const db = await openGalleryDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();

    req.onsuccess = () => {
      const results = (req.result as GalleryWorkItem[]) || [];
      results.sort((a, b) => b.createdAt - a.createdAt);
      resolve(results);
    };
    req.onerror = () => reject(req.error || new Error('Failed to load gallery items.'));
    tx.oncomplete = () => db.close();
  });
}

export async function renameGalleryWork(id: string, newTitle: string): Promise<void> {
  const db = await openGalleryDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);

    getReq.onsuccess = () => {
      const item = getReq.result as GalleryWorkItem | undefined;
      if (!item) {
        reject(new Error('Gallery item not found.'));
        return;
      }
      item.title = newTitle.trim() || 'Mochi Memory';
      const putReq = store.put(item);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error || new Error('Failed to rename item.'));
    };
    getReq.onerror = () => reject(getReq.error || new Error('Failed to read item for rename.'));
    tx.oncomplete = () => db.close();
  });
}

export async function deleteGalleryWork(id: string): Promise<void> {
  const db = await openGalleryDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error || new Error('Failed to delete gallery item.'));
    tx.oncomplete = () => db.close();
  });
}

export async function clearAllGalleryWorks(): Promise<void> {
  const db = await openGalleryDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.clear();

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error || new Error('Failed to clear gallery.'));
    tx.oncomplete = () => db.close();
  });
}

