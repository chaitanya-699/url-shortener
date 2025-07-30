import { useState } from 'react'
import { isValidUrl, normalizeUrl } from '../../utils/urlUtils'
import { useToast } from '../../hooks/useToast'
import './UrlForm.css'

const UrlForm = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const { showError } = useToast()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

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

    onSubmit(normalizedUrl)
    setUrl('')
    setError('')
  }

  const handleInputChange = (e) => {
    setUrl(e.target.value)
    if (error) setError('') // Clear error when user starts typing
  }

  return (
    <div className="url-form-section">
      <h2>Shorten a URL</h2>
      <form onSubmit={handleSubmit} className="url-form">
        <div className="input-group">
          <input
            type="text"
            value={url}
            onChange={handleInputChange}
            placeholder="Enter your long URL here..."
            className={`url-input ${error ? 'url-input-error' : ''}`}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="shorten-btn"
            disabled={isLoading || !url.trim()}
          >
            {isLoading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </div>
        {error && <div className="form-error">{error}</div>}
      </form>
    </div>
  )
}

export default UrlForm