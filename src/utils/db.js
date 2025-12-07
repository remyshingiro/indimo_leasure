import { openDB } from 'idb'

const DB_NAME = 'kigali-swim-shop'
const DB_VERSION = 1

/**
 * Initialize IndexedDB database
 * @returns {Promise<IDBPDatabase>} Database instance
 */
const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Users store
      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'id' })
        userStore.createIndex('email', 'email', { unique: true })
        userStore.createIndex('phone', 'phone', { unique: false })
      }
      
      // Orders store
      if (!db.objectStoreNames.contains('orders')) {
        const orderStore = db.createObjectStore('orders', { keyPath: 'id' })
        orderStore.createIndex('userId', 'customer.email', { unique: false })
        orderStore.createIndex('date', 'date', { unique: false })
        orderStore.createIndex('status', 'status', { unique: false })
      }
      
      // Products store
      if (!db.objectStoreNames.contains('products')) {
        db.createObjectStore('products', { keyPath: 'id' })
      }
      
      // Categories store
      if (!db.objectStoreNames.contains('categories')) {
        db.createObjectStore('categories', { keyPath: 'id' })
      }
      
      // Analytics store
      if (!db.objectStoreNames.contains('analytics')) {
        db.createObjectStore('analytics', { keyPath: 'id', autoIncrement: true })
      }
      
      // Cart store
      if (!db.objectStoreNames.contains('cart')) {
        db.createObjectStore('cart', { keyPath: 'id' })
      }
    }
  })
}

/**
 * Save data to IndexedDB
 * @param {string} storeName - Store name
 * @param {any} data - Data to save
 * @returns {Promise<void>}
 */
export const saveToDB = async (storeName, data) => {
  try {
    const db = await initDB()
    const tx = db.transaction(storeName, 'readwrite')
    const store = tx.objectStore(storeName)
    
    // Handle array of items or single item
    if (Array.isArray(data)) {
      await Promise.all(data.map(item => store.put(item)))
    } else {
      await store.put(data)
    }
    
    await tx.done
  } catch (error) {
    console.error(`Error saving to ${storeName}:`, error)
    throw error
  }
}

/**
 * Get data from IndexedDB
 * @param {string} storeName - Store name
 * @param {any} key - Key to retrieve (optional, gets all if not provided)
 * @returns {Promise<any>} Retrieved data
 */
export const getFromDB = async (storeName, key = null) => {
  try {
    const db = await initDB()
    const tx = db.transaction(storeName, 'readonly')
    const store = tx.objectStore(storeName)
    
    if (key !== null) {
      return await store.get(key)
    } else {
      // Get all items
      return await store.getAll()
    }
  } catch (error) {
    console.error(`Error getting from ${storeName}:`, error)
    return key !== null ? null : []
  }
}

/**
 * Delete data from IndexedDB
 * @param {string} storeName - Store name
 * @param {any} key - Key to delete
 * @returns {Promise<void>}
 */
export const deleteFromDB = async (storeName, key) => {
  try {
    const db = await initDB()
    const tx = db.transaction(storeName, 'readwrite')
    const store = tx.objectStore(storeName)
    await store.delete(key)
    await tx.done
  } catch (error) {
    console.error(`Error deleting from ${storeName}:`, error)
    throw error
  }
}

/**
 * Clear all data from a store
 * @param {string} storeName - Store name
 * @returns {Promise<void>}
 */
export const clearStore = async (storeName) => {
  try {
    const db = await initDB()
    const tx = db.transaction(storeName, 'readwrite')
    const store = tx.objectStore(storeName)
    await store.clear()
    await tx.done
  } catch (error) {
    console.error(`Error clearing ${storeName}:`, error)
    throw error
  }
}

/**
 * Check if IndexedDB is available
 * @returns {boolean} True if IndexedDB is supported
 */
export const isIndexedDBAvailable = () => {
  return typeof indexedDB !== 'undefined'
}

/**
 * Fallback to localStorage if IndexedDB fails
 * @param {string} key - localStorage key
 * @param {any} data - Data to save
 */
export const fallbackToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('localStorage fallback failed:', error)
    // If localStorage is also full, try to clear old data
    if (error.name === 'QuotaExceededError') {
      console.warn('Storage quota exceeded, consider clearing old data')
    }
  }
}

/**
 * Get from localStorage fallback
 * @param {string} key - localStorage key
 * @returns {any} Retrieved data
 */
export const getFromLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return null
  }
}

