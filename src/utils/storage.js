/**
 * Safe localStorage operations with error handling
 */

/**
 * Safely get an item from localStorage
 * @param {string} key - The key to retrieve
 * @param {any} defaultValue - Default value if key doesn't exist or error occurs
 * @returns {any} - The stored value or default value
 */
export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading from localStorage (key: ${key}):`, error)
    return defaultValue
  }
}

/**
 * Safely set an item in localStorage
 * @param {string} key - The key to set
 * @param {any} value - The value to store
 * @returns {boolean} - Success status
 */
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Error writing to localStorage (key: ${key}):`, error)
    return false
  }
}

/**
 * Safely remove an item from localStorage
 * @param {string} key - The key to remove
 * @returns {boolean} - Success status
 */
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing from localStorage (key: ${key}):`, error)
    return false
  }
}

/**
 * Check if localStorage is available
 * @returns {boolean} - Availability status
 */
export const isStorageAvailable = () => {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}