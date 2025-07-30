import { useState, useCallback } from 'react'

/**
 * Custom hook for clipboard operations with better error handling
 * @returns {Object} - Object containing copiedId, copyToClipboard function, and error state
 */
export const useClipboard = () => {
  const [copiedId, setCopiedId] = useState(null)
  const [error, setError] = useState(null)

  /**
   * Copies text to clipboard and shows feedback
   * @param {string} text - Text to copy
   * @param {string|number} id - ID for tracking which item was copied
   * @returns {Promise<boolean>} - Success status
   */
  const copyToClipboard = useCallback(async (text, id) => {
    if (!text) {
      setError('No text to copy')
      return false
    }

    try {
      // Check if clipboard API is available
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        const success = document.execCommand('copy')
        document.body.removeChild(textArea)
        
        if (!success) {
          throw new Error('Copy command failed')
        }
      }

      setCopiedId(id)
      setError(null)
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedId(null), 2000)
      
      return true
    } catch (err) {
      console.error('Failed to copy:', err)
      setError(err.message)
      
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000)
      
      return false
    }
  }, [])

  return { 
    copiedId, 
    copyToClipboard, 
    error,
    isSupported: navigator.clipboard || document.execCommand
  }
}