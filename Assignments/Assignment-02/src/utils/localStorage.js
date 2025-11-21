/**
 * @fileoverview LocalStorage utility module providing simplified JSON-based storage operations.
 * This module wraps the browser's localStorage API with automatic JSON serialization and deserialization,
 * making it easy to store and retrieve complex objects and arrays.
 */

/**
 * Retrieves and parses a JSON item from localStorage.
 * Automatically deserializes the stored JSON string into a JavaScript object or array.
 * Returns null if the key doesn't exist or if parsing fails.
 * 
 * @function getLocalStorageItem
 * @param {string} key - The localStorage key to retrieve
 * @returns {*|null} The parsed JSON value, or null if the key doesn't exist
 */
const getLocalStorageItem = (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}

/**
 * Stores a value in localStorage as a JSON string.
 * Automatically serializes the provided value to JSON before storing.
 * Works with objects, arrays, strings, numbers, and other JSON-compatible types.
 * 
 * @function setLocalStorageItem
 * @param {string} key - The localStorage key to set
 * @param {*} value - The value to store (will be JSON.stringify'd)
 */
const setLocalStorageItem = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Exported localStorage utility functions.
 * @exports getLocalStorageItem - Retrieves and parses a JSON value from localStorage
 * @exports setLocalStorageItem - Stores a value in localStorage as JSON
 */
export { getLocalStorageItem, setLocalStorageItem };