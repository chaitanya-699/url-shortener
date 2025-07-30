import { useCallback } from 'react'

export const useToast = () => {
  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    if (window.showToast) {
      return window.showToast(message, type, duration)
    } else {
      // Fallback to alert if toast system isn't available
      alert(message)
    }
  }, [])

  const showSuccess = useCallback((message, duration) => {
    return showToast(message, 'success', duration)
  }, [showToast])

  const showError = useCallback((message, duration) => {
    return showToast(message, 'error', duration)
  }, [showToast])

  const showWarning = useCallback((message, duration) => {
    return showToast(message, 'warning', duration)
  }, [showToast])

  const showInfo = useCallback((message, duration) => {
    return showToast(message, 'info', duration)
  }, [showToast])

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}

export default useToast