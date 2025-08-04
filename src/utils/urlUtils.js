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

/**
 * Checks if a URL is accessible and working
 * @param {string} url - The URL to check
 * @returns {Promise<{isAccessible: boolean, error?: string, status?: number}>} - Result of accessibility check
 */
export const checkUrlAccessibility = async (url) => {
  try {
    const urlObj = new URL(url)
    
    // Enhanced domain validation
    if (!urlObj.hostname || urlObj.hostname.length < 3) {
      return {
        isAccessible: false,
        error: 'Invalid domain name'
      }
    }

    // Check for localhost and private network addresses
    if (urlObj.hostname === 'localhost' || 
        urlObj.hostname.startsWith('127.') || 
        urlObj.hostname.startsWith('192.168.') || 
        urlObj.hostname.startsWith('10.') ||
        urlObj.hostname.startsWith('172.') ||
        urlObj.hostname.includes('..')) {
      return {
        isAccessible: false,
        error: 'Local or private network URLs are not allowed'
      }
    }

    // Check for valid domain format
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (!domainRegex.test(urlObj.hostname)) {
      return {
        isAccessible: false,
        error: 'Invalid domain format'
      }
    }

    // Check for suspicious or blocked domains
    const suspiciousDomains = ['bit.ly', 'tinyurl.com', 'short.link', 'ow.ly']
    if (suspiciousDomains.some(domain => urlObj.hostname.includes(domain))) {
      return {
        isAccessible: false,
        error: 'URL shortening services are not allowed'
      }
    }

    // Check for file extensions that might not be web pages
    const path = urlObj.pathname.toLowerCase()
    const dangerousExtensions = ['.exe', '.zip', '.rar', '.dmg', '.pkg', '.deb', '.msi']
    if (dangerousExtensions.some(ext => path.endsWith(ext))) {
      return {
        isAccessible: false,
        error: 'Direct file downloads are not allowed'
      }
    }

    // Try to make a request to check accessibility
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout

      // Try HEAD request first (lighter)
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal,
        cache: 'no-cache',
        redirect: 'follow'
      })

      clearTimeout(timeoutId)
      return {
        isAccessible: true,
        status: 'reachable'
      }
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        return {
          isAccessible: false,
          error: 'URL request timed out. The website may be slow or unreachable.'
        }
      }

      // If HEAD fails, try a GET request with no-cors
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        await fetch(url, {
          method: 'GET',
          mode: 'no-cors',
          signal: controller.signal,
          cache: 'no-cache',
          redirect: 'follow'
        })

        clearTimeout(timeoutId)
        return {
          isAccessible: true,
          status: 'reachable'
        }
      } catch (getError) {
        if (getError.name === 'AbortError') {
          return {
            isAccessible: false,
            error: 'URL request timed out. The website may be slow or unreachable.'
          }
        }

        // Check if it's a network error vs CORS error
        if (getError.message.includes('Failed to fetch') || 
            getError.message.includes('NetworkError') ||
            getError.message.includes('ERR_NETWORK')) {
          return {
            isAccessible: false,
            error: 'Unable to reach the website. Please check if the URL is correct.'
          }
        }

        // For CORS errors, we assume the site exists but blocks cross-origin requests
        // This is actually a good sign that the site is working
        return {
          isAccessible: true,
          status: 'cors-blocked'
        }
      }
    }
  } catch (error) {
    return {
      isAccessible: false,
      error: `Invalid URL: ${error.message}`
    }
  }
}

/**
 * Performs a basic DNS-like check by trying to load a favicon
 * @param {string} hostname - The hostname to check
 * @returns {Promise<boolean>} - True if hostname seems to exist
 */
const checkDomainExists = async (hostname) => {
  return new Promise((resolve) => {
    const img = new Image()
    const timeout = setTimeout(() => {
      resolve(false)
    }, 5000)

    img.onload = () => {
      clearTimeout(timeout)
      resolve(true)
    }

    img.onerror = () => {
      clearTimeout(timeout)
      // Even if favicon fails, the domain might exist
      // Try a different approach
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = `https://${hostname}`
      
      const cleanup = () => {
        if (link.parentNode) {
          link.parentNode.removeChild(link)
        }
      }

      link.onload = () => {
        cleanup()
        resolve(true)
      }

      link.onerror = () => {
        cleanup()
        resolve(false)
      }

      document.head.appendChild(link)
      
      // Fallback timeout
      setTimeout(() => {
        cleanup()
        resolve(false)
      }, 3000)
    }

    // Try to load favicon
    img.src = `https://${hostname}/favicon.ico`
  })
}

/**
 * Validates URL format and checks accessibility
 * @param {string} url - The URL to validate and check
 * @returns {Promise<{isValid: boolean, isAccessible: boolean, error?: string, warning?: string}>} - Validation result
 */
export const validateAndCheckUrl = async (url) => {
  // First check format
  if (!isValidUrl(url)) {
    return {
      isValid: false,
      isAccessible: false,
      error: 'Invalid URL format. Please enter a valid web address.'
    }
  }

  try {
    const urlObj = new URL(url)
    
    // Check accessibility
    const accessibilityResult = await checkUrlAccessibility(url)
    
    if (!accessibilityResult.isAccessible) {
      // If direct check fails, try domain existence check
      const domainExists = await checkDomainExists(urlObj.hostname)
      
      if (domainExists) {
        return {
          isValid: true,
          isAccessible: true,
          warning: 'URL appears to be valid, but accessibility could not be fully verified. Proceeding anyway.'
        }
      }
      
      return {
        isValid: true,
        isAccessible: false,
        error: accessibilityResult.error || 'The website appears to be unreachable or does not exist.'
      }
    }

    return {
      isValid: true,
      isAccessible: true,
      status: accessibilityResult.status
    }
  } catch (error) {
    return {
      isValid: false,
      isAccessible: false,
      error: `URL validation failed: ${error.message}`
    }
  }
}