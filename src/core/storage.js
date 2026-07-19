const DB_NAME = 'ResiDueStorage';
const STORE_NAME = 'EncryptedLedgers';

/**
 * Initializes the local IndexedDB instance.
 */
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Persists the encrypted cryptographic package into the browser sandbox and OPFS backup.
 * @param {ArrayBuffer} encryptedData - The encrypted output.
 * @param {Uint8Array} salt - The derivation salt.
 * @param {Uint8Array} iv - The initialization vector.
 */
export async function saveTransactionHistory(encryptedData, salt, iv) {
  const payload = {
    id: 'active_ledger',
    encryptedData,
    salt: Array.from(salt), // IndexedDB structurally clones primitive arrays easily
    iv: Array.from(iv),
    updatedAt: new Date().toISOString()
  };

  // 1. Primary Write: IndexedDB
  const db = await initDB();
  await new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(payload);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });

  // 2. Redundant Fail-safe: Write to Origin Private File System (OPFS)
  try {
    const root = await navigator.storage.getDirectory();
    const fileHandle = await root.getFileHandle('backup_ledger.json', { create: true });
    const writable = await fileHandle.createWritable();
    
    // Stringify the payload structure for flat file serialization
    await writable.write(JSON.stringify(payload));
    await writable.close();
  } catch (err) {
    console.warn("OPFS local backup write failed, data remains inside IndexedDB:", err);
  }
}

/**
 * Attempts retrieval of the encrypted payload from primary or secondary storage layers.
 */
export async function loadTransactionHistory() {
  const db = await initDB();
  
  // Try IndexedDB first
  const data = await new Promise((resolve) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get('active_ledger');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });

  if (data) return data;

  // Fallback to OPFS if IndexedDB was wiped
  try {
    const root = await navigator.storage.getDirectory();
    const fileHandle = await root.getFileHandle('backup_ledger.json');
    const file = await fileHandle.getFile();
    const text = await file.text();
    return JSON.parse(text);
  } catch {
    return null; // No existing historical records found
  }
}
