/**
 * URL utility functions
 */

/**
 * Validates if a string is a valid URL
 * @param {string} string - The string to validate
 * @returns {boolean} - True if valid URL, false otherwise
 */
export const isValidUrl = (string) => {
  if (!string || typeof string !== 'string') {
    return false
  }

  // Trim whitespace
  string = string.trim()

  // Check if it's empty after trimming
  if (!string) {
    return false
  }

  try {
    const url = new URL(string)
    // Only allow http and https protocols
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Normalizes a URL by adding protocol if missing
 * @param {string} url - The URL to normalize
 * @returns {string} - Normalized URL
 */
export const normalizeUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return ''
  }

  url = url.trim()
  
  if (!url) {
    return ''
  }

  // Add https:// if no protocol is specified
  if (!url.match(/^https?:\/\//)) {
    url = 'https://' + url
  }

  return url
}

/**
 * Generates a random short code for URLs
 * @param {number} length - Length of the short code (default: 6)
 * @returns {string} - Random short code
 */
export const generateShortCode = (length = 6) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Generates random click count for demo purposes
 * @param {number} max - Maximum click count (default: 1000)
 * @returns {number} - Random click count
 */
export const generateRandomClicks = (max = 1000) => {
  return Math.floor(Math.random() * max)
}

/**
 * Formats a date string to a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}