import { useState, useEffect, useMemo, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { generateShortCode, generateRandomClicks } from '../../utils/urlUtils'
import { generateDummyAnalytics } from '../../utils/demoData'
import { useClipboard } from '../../hooks/useClipboard'
import { useToast } from '../../hooks/useToast'
import UrlTable from '../../components/UrlTable/UrlTable'
import UrlForm from '../../components/UrlForm/UrlForm'
import GuestAlert from '../../components/GuestAlert/GuestAlert'
import UrlDetailsModal from '../../components/UrlDetailsModal/UrlDetailsModal'
import './Dashboard.css'

const Dashboard = () => {
  const [urls, setUrls] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUrl, setSelectedUrl] = useState(null)
  const [showUrlDetails, setShowUrlDetails] = useState(false)
  const { user, guestId, logout, createGuestSession, isGuest } = useAuth()
  const { copiedId, copyToClipboard } = useClipboard()
  const { showSuccess, showError } = useToast()

  // Memoize user ID to prevent unnecessary re-renders
  const userId = useMemo(() => user || guestId, [user, guestId])

  // Load URLs from localStorage on component mount
  useEffect(() => {
    if (userId) {
      const savedUrls = localStorage.getItem(`urls_${userId}`)
      if (savedUrls) {
        try {
          const parsedUrls = JSON.parse(savedUrls)
          setUrls(parsedUrls)
        } catch (error) {
          console.error('Error loading saved URLs:', error)
          showError('Failed to load saved URLs')
          setUrls([])
        }
      }
    }
  }, [userId, showError])

  // Save URLs to localStorage whenever urls change
  useEffect(() => {
    if (userId && urls.length > 0) {
      try {
        localStorage.setItem(`urls_${userId}`, JSON.stringify(urls))
      } catch (error) {
        console.error('Error saving URLs:', error)
        showError('Failed to save URLs')
      }
    }
  }, [urls, userId, showError])

  const handleSubmit = async (originalUrl) => {
    setIsLoading(true)

    // Create guest session if not logged in and no guest ID exists
    let currentGuestId = guestId
    if (!user && !guestId) {
      currentGuestId = createGuestSession()
    }

    // Simulate API delay
    setTimeout(() => {
      const shortCode = generateShortCode()
      const shortUrl = `https://short.ly/${shortCode}`

      const newUrl = {
        id: Date.now(),
        originalUrl: originalUrl,
        shortUrl: shortUrl,
        shortCode: shortCode,
        clicks: generateRandomClicks(),
        createdAt: new Date().toISOString(),
        userId: user || currentGuestId,
        isGuest: !user,
        qrEnabled: !!user // QR only works for logged-in users
      }

      setUrls(prev => [newUrl, ...prev])
      setIsLoading(false)
    }, 1000)
  }

  const handleDeleteUrl = useCallback((id) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      setUrls(prev => prev.filter(url => url.id !== id))
      showSuccess('URL deleted successfully')
    }
  }, [showSuccess])

  const handleSignUp = () => {
    window.location.href = '/login'
  }

  const handleRowClick = useCallback((url) => {
    const analytics = generateDummyAnalytics()
    setSelectedUrl({ ...url, analytics })
    setShowUrlDetails(true)
  }, [])

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">🔗</div>
            <div className="header-text">
              <h1>URL Shortener</h1>
              {user ? (
                <p>Welcome back, {user}!</p>
              ) : (
                <div className="guest-header">
                  <p>🎭 Guest Session</p>
                  <p className="guest-id">ID: {guestId}</p>
                </div>
              )}
            </div>
          </div>
          <button onClick={logout} className="logout-btn">
            Sign Out
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Guest Alert Popup */}
        {isGuest && (
          <GuestAlert guestId={guestId} onSignUp={handleSignUp} />
        )}

        {/* URL Shortening Form */}
        <UrlForm onSubmit={handleSubmit} isLoading={isLoading} />

        {/* URLs Table */}
        <div className="urls-section">
          {urls.length > 0 && (
            <div className="analytics-hint">
              <span className="analytics-hint-icon">💡</span>
              <span>Click on any URL row to view detailed analytics and statistics</span>
            </div>
          )}
          <UrlTable 
            urls={urls} 
            onDeleteUrl={handleDeleteUrl}
            onRowClick={handleRowClick}
            copiedId={copiedId}
            onCopyToClipboard={copyToClipboard}
          />
        </div>
      </div>

      {/* URL Details Modal */}
      <UrlDetailsModal
        isOpen={showUrlDetails}
        onClose={() => setShowUrlDetails(false)}
        url={selectedUrl}
      />
    </div>
  )
}

export default Dashboard