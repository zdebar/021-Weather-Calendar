interface Data {
  [key: string]: unknown;
}

/**
 * Saves data to an IndexedDB object store.
 *  
 * @param dbName - The name of the IndexedDB database.
 * @param storeName - The name of the object store within the database.
 * @param data - The data to be saved, in the form of a key-value object.
 */
export default function saveToIndexedDB(dbName: string, storeName: string, data: Data): void {
  const request = indexedDB.open(dbName, 1);

  request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    const db = (event.target as IDBRequest).result;
    if (!db.objectStoreNames.contains(storeName)) {
      db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
    }
  };

  request.onerror = (event: Event) => {
    console.error("Error opening IndexedDB:", (event.target as IDBRequest).error);
  };

  request.onsuccess = (event: Event) => {
    const db = (event.target as IDBRequest).result;
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    // Erase the existing data by clearing the object store
    const clearRequest = store.clear();
    clearRequest.onsuccess = () => {
      console.log("Data erased successfully.");

      // After clearing the data, add the new data
      const addRequest = store.add(data);
      addRequest.onsuccess = () => {
        console.log("New data added successfully.");
      };

      addRequest.onerror = (event: Event) => {
        console.error("Error adding new data:", (event.target as IDBRequest).error);
      };
    };

    clearRequest.onerror = (event: Event) => {
      console.error("Error erasing data:", (event.target as IDBRequest).error);
    };

    transaction.oncomplete = () => {
      db.close();
    };
  };
}




