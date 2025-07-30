import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { generateShortCode, generateRandomClicks } from '../../utils/urlUtils'
import { generateDummyAnalytics } from '../../utils/demoData'
import { useClipboard } from '../../hooks/useClipboard'
import Navigation from '../../components/Navigation/Navigation'
import MobileSidebar from '../../components/MobileSidebar/MobileSidebar'
import UrlForm from '../../components/UrlForm/UrlForm'
import AuthModal from '../../components/AuthModal/AuthModal'
import UrlDetailsModal from '../../components/UrlDetailsModal/UrlDetailsModal'
import GuestAlert from '../../components/GuestAlert/GuestAlert'
import UrlTable from '../../components/UrlTable/UrlTable'
import HeroSection from './HeroSection'
import './Home.css'

const Home = () => {
  const [shortenedUrls, setShortenedUrls] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('signin')
  const [selectedUrl, setSelectedUrl] = useState(null)
  const [showUrlDetails, setShowUrlDetails] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  const { user, guestId, createGuestSession, isGuest } = useAuth()
  const { copiedId, copyToClipboard } = useClipboard()
  const navigate = useNavigate()

  const handleShortenUrl = async (originalUrl) => {
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
        qrEnabled: !!user
      }

      setShortenedUrls(prev => [newUrl, ...prev])
      setIsLoading(false)
    }, 1000)
  }

  const handleRowClick = (url) => {
    const analytics = generateDummyAnalytics()
    setSelectedUrl({ ...url, analytics })
    setShowUrlDetails(true)
  }

  const deleteUrl = (id) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      setShortenedUrls(prev => prev.filter(url => url.id !== id))
    }
  }

  const handleAuthModalOpen = (mode) => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const handleSignUp = () => {
    setAuthMode('signup')
    setShowAuthModal(true)
  }

  return (
    <div className="home-page">
      <Navigation 
        onAuthModalOpen={handleAuthModalOpen}
        onMobileSidebarOpen={() => setShowMobileSidebar(true)}
      />

      <MobileSidebar
        isOpen={showMobileSidebar}
        onClose={() => setShowMobileSidebar(false)}
        onAuthModalOpen={handleAuthModalOpen}
      />

      <div className="home-content">
        <HeroSection user={user} onSignUp={handleSignUp} />

        <UrlForm onSubmit={handleShortenUrl} isLoading={isLoading} />

        {shortenedUrls.length > 0 && (
          <div className="results-section">
            <h2>Your Shortened URLs</h2>
            
            {isGuest && (
              <GuestAlert guestId={guestId} onSignUp={handleSignUp} />
            )}
            
            {!user && !guestId && (
              <div className="save-notice">
                <p>⚠️ These URLs are temporary and will be lost when you refresh the page.
                  <button onClick={handleSignUp} className="inline-signup-btn">
                    Sign up
                  </button> to save them permanently!
                </p>
              </div>
            )}

            <UrlTable
              urls={shortenedUrls}
              onRowClick={handleRowClick}
              onDeleteUrl={deleteUrl}
              copiedId={copiedId}
              onCopyToClipboard={copyToClipboard}
            />
          </div>
        )}

        {shortenedUrls.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔗</div>
            <h3>Ready to shorten your first URL?</h3>
            <p>Enter any long URL above and see the magic happen!</p>
          </div>
        )}
      </div>

      <UrlDetailsModal
        isOpen={showUrlDetails}
        onClose={() => setShowUrlDetails(false)}
        url={selectedUrl}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  )
}

export default Home