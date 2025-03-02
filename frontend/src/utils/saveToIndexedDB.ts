import logger from "./logger";

interface Data {
  [key: string]: unknown;
}

export default function saveToIndexedDB(dbName: string, storeName: string, data: Data): void {
  const request = indexedDB.open(dbName, 1);

  request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    const db = (event.target as IDBRequest).result;
    if (!db.objectStoreNames.contains(storeName)) {
      db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
    }
  };

  request.onerror = (event: Event) => {
    logger.error("Error opening IndexedDB:", (event.target as IDBRequest).error);
  };

  request.onsuccess = (event: Event) => {
    const db = (event.target as IDBRequest).result;
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    const addRequest = store.add(data);

    addRequest.onsuccess = () => {
      logger.info("Data saved successfully.");
    };

    addRequest.onerror = (event: Event) => {
      logger.error("Error saving data:", (event.target as IDBRequest).error);
    };

    transaction.oncomplete = () => {
      db.close();
    };
  };
}
