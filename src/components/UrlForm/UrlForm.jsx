import { useState } from 'react'
import { isValidUrl, normalizeUrl, validateAndCheckUrl } from '../../utils/urlUtils'
import { useToast } from '../../hooks/useToast'
import './UrlForm.css'

const UrlForm = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const { showError, showSuccess, showWarning } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsValidating(true)

    try {
      if (!url.trim()) {
        const errorMsg = 'Please enter a URL'
        setError(errorMsg)
        showError(errorMsg)
        return
      }

      // Normalize the URL (add https:// if missing)
      const normalizedUrl = normalizeUrl(url)

      if (!isValidUrl(normalizedUrl)) {
        const errorMsg = 'Please enter a valid URL'
        setError(errorMsg)
        showError(errorMsg)
        return
      }

      // Show validation progress
      showWarning('Validating URL accessibility...')

      // Check if URL is accessible
      const validationResult = await validateAndCheckUrl(normalizedUrl)

      if (!validationResult.isValid) {
        const errorMsg = validationResult.error || 'Invalid URL format'
        setError(errorMsg)
        showError(errorMsg)
        return
      }

      if (!validationResult.isAccessible) {
        const errorMsg = validationResult.error || 'URL is not accessible'
        setError(errorMsg)
        showError(errorMsg)
        return
      }

      // URL is valid and accessible
      if (validationResult.warning) {
        showWarning(validationResult.warning)
      } else {
        showSuccess('URL validated successfully!')
      }
      
      onSubmit(normalizedUrl, description.trim())
      setUrl('')
      setDescription('')
      setError('')
    } catch (error) {
      const errorMsg = 'Failed to validate URL. Please try again.'
      setError(errorMsg)
      showError(errorMsg)
      console.error('URL validation error:', error)
    } finally {
      setIsValidating(false)
    }
  }

  const handleInputChange = (e) => {
    setUrl(e.target.value)
    if (error) setError('') // Clear error when user starts typing
  }

  return (
    <div className="url-form-section">
      <h2>Shorten a URL</h2>
      <form onSubmit={handleSubmit} className="url-form">
        <div className="form-fields">
          <div className="input-group">
            <input
              type="text"
              value={url}
              onChange={handleInputChange}
              placeholder="Enter your long URL here..."
              className={`url-input ${error ? 'url-input-error' : ''}`}
              disabled={isLoading || isValidating}
            />
            {isValidating && (
              <div className="validation-indicator">
                <div className="validation-spinner"></div>
                <span>Checking URL...</span>
              </div>
            )}
          </div>
          
          <div className="description-group">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)..."
              className="description-input"
              disabled={isLoading || isValidating}
              maxLength={100}
            />
            <small className="description-hint">
              {description.length}/100 characters
            </small>
          </div>

          <button
            type="submit"
            className="shorten-btn"
            disabled={isLoading || isValidating || !url.trim()}
          >
            {isValidating ? 'Validating URL...' : isLoading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </div>
        {error && <div className="form-error">{error}</div>}
      </form>
    </div>
  )
}

export default UrlForm