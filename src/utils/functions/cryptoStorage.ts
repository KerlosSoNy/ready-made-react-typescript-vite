const DB_NAME = 'CryptoDB';
const STORE_NAME = 'keys';
const KEY_NAME = 'aesKey';

export async function getOrCreateKey(): Promise<CryptoKey> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Separate transaction for the get operation
      const getTx = db.transaction(STORE_NAME, 'readonly');
      const getStore = getTx.objectStore(STORE_NAME);
      const getRequest = getStore.get(KEY_NAME);

      getRequest.onsuccess = async (e) => {
        const existingKey = (e.target as IDBRequest).result;
        if (existingKey) {
          resolve(existingKey);
          return;
        }

        // Create new key if none exists
        const newKey = await crypto.subtle.generateKey(
          { name: 'AES-GCM', length: 256 },
          true,
          ['encrypt', 'decrypt']
        );

        // Separate transaction for the put operation
        const putTx = db.transaction(STORE_NAME, 'readwrite');
        const putStore = putTx.objectStore(STORE_NAME);
        putStore.put(newKey, KEY_NAME);
        
        putTx.oncomplete = () => resolve(newKey);
        putTx.onerror = () => reject(putTx.error);
    };

    getRequest.onerror = () => reject(getRequest.error);
};

request.onerror = () => reject(request.error);
});
}