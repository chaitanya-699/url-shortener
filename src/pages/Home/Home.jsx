import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { generateDummyAnalytics } from '../../utils/demoData'
import { maskIpAddress } from '../../utils/urlUtils'
import { useClipboard } from '../../hooks/useClipboard'
import { useToast } from '../../hooks/useToast'
import Navigation from '../../components/Navigation/Navigation'
import MobileSidebar from '../../components/MobileSidebar/MobileSidebar'
import UrlForm from '../../components/UrlForm/UrlForm'
import AuthModal from '../../components/AuthModal/AuthModal'
import UrlDetailsModal from '../../components/UrlDetailsModal/UrlDetailsModal'
import QrCodeModal from '../../components/QrCodeModal/QrCodeModal'
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
  const [showQrModal, setShowQrModal] = useState(false)
  const [selectedQrUrl, setSelectedQrUrl] = useState(null)

  const { user, guestId, createGuestSession, setGuestSession, isGuest } = useAuth()
  const { copiedId, copyToClipboard } = useClipboard()
  const { showSuccess, showError } = useToast()

  // Utility function to sort URLs by creation time (newest first)
  const sortUrlsByCreatedTime = (urls) => {
    return [...urls].sort((a, b) => {
      const dateA = new Date(a.createdAt)
      const dateB = new Date(b.createdAt)
      return dateB - dateA // Newest first (descending order)
    })
  }

  // LocalStorage functions for guest URLs
  const saveGuestUrlsToStorage = (urls) => {
    if (!user && guestId) {
      try {
        localStorage.setItem(`urlShortener_guestUrls_${guestId}`, JSON.stringify(urls))
      } catch (error) {
        console.error('Error saving guest URLs to localStorage:', error)
      }
    }
  }

  const loadGuestUrlsFromStorage = () => {
    if (!user && guestId) {
      try {
        const stored = localStorage.getItem(`urlShortener_guestUrls_${guestId}`)
        return stored ? JSON.parse(stored) : []
      } catch (error) {
        console.error('Error loading guest URLs from localStorage:', error)
        return []
      }
    }
    return []
  }

  const clearGuestUrlsFromStorage = () => {
    if (guestId) {
      try {
        localStorage.removeItem(`urlShortener_guestUrls_${guestId}`)
      } catch (error) {
        console.error('Error clearing guest URLs from localStorage:', error)
      }
    }
  }

  // LocalStorage functions for logged-in user URLs
  const saveUserUrlsToStorage = (urls) => {
    if (user) {
      try {
        localStorage.setItem(`urlShortener_userUrls_${user.id}`, JSON.stringify(urls))
      } catch (error) {
        console.error('Error saving user URLs to localStorage:', error)
      }
    }
  }

  const loadUserUrlsFromStorage = () => {
    if (user) {
      try {
        const stored = localStorage.getItem(`urlShortener_userUrls_${user.id}`)
        return stored ? JSON.parse(stored) : []
      } catch (error) {
        console.error('Error loading user URLs from localStorage:', error)
        return []
      }
    }
    return []
  }

  const clearUserUrlsFromStorage = () => {
    if (user) {
      try {
        localStorage.removeItem(`urlShortener_userUrls_${user.id}`)
      } catch (error) {
        console.error('Error clearing user URLs from localStorage:', error)
      }
    }
  }

  // Transform server data to frontend format
  const transformUrlData = (serverUrl) => {
    // Handle different response formats - server returns 'urlCode' not 'shortCode'
    const shortCode = serverUrl.urlCode || serverUrl.shortCode

    return {
      id: serverUrl.id,
      originalUrl: serverUrl.originalUrl,
      shortUrl: serverUrl.shortUrl || (shortCode ? `https://masterwayne.duckdns.org/${shortCode}` : 'https://masterwayne.duckdns.org/undefined'),
      shortCode: shortCode,
      description: serverUrl.description || '',
      clicks: serverUrl.clicks || 0,
      totalClicks: serverUrl.analyticsDto?.totalClicks || serverUrl.totalClicks || 0,
      analyticsDto: serverUrl.analyticsDto || null,
      qr: serverUrl.qr || null,
      createdAt: serverUrl.createdAt,
      userId: serverUrl.userId || serverUrl.guestId || user?.id,
      isGuest: !user,
      qrEnabled: !!user,
      // Include all analytics fields from server response
      countryClicks: serverUrl.countryClicks || [],
      browserTables: serverUrl.browserTables || [],
      deviceTables: serverUrl.deviceTables || [],
      ipTables: serverUrl.ipTables || [],
      recentClicks: serverUrl.recentClicks || [],
      clicksByDates: serverUrl.clicksByDates || [],
      topReferrers: serverUrl.topReferrers || [],
      operatingSystems: serverUrl.operatingSystems || [],
      active: serverUrl.active || true,
      blocked: serverUrl.blocked || false
    }
  }

  // Transform guest URL data from server (simpler structure)
  const transformGuestUrlData = (serverUrl) => {
    return {
      id: serverUrl.id,
      originalUrl: serverUrl.originalUrl,
      shortUrl: serverUrl.shortUrl || `https://masterwayne.duckdns.org/${serverUrl.shortCode}`,
      shortCode: serverUrl.shortCode,
      description: serverUrl.description || '',
      clicks: serverUrl.clicks || 0,
      totalClicks: serverUrl.clicks || 0,
      analyticsDto: null,
      qr: null,
      createdAt: serverUrl.createdAt,
      userId: null,
      isGuest: true,
      qrEnabled: false
    }
  }

  // Refresh function to fetch latest URLs from server
  const refreshUrls = async () => {
    if (user) {
      try {
        const response = await fetch('https://masterwayne.duckdns.org/api/logged/urlTableData/userAll', {
          method: 'GET',
          credentials: 'include'
        })

        const result = await response.json()
        if (response.ok && Array.isArray(result)) {
          const transformedUrls = result.map(transformUrlData)
          const sortedUrls = sortUrlsByCreatedTime(transformedUrls)
          setShortenedUrls(sortedUrls)
          saveUserUrlsToStorage(sortedUrls)
          showSuccess('URLs refreshed successfully!')
        }
      } catch (error) {
        console.error('Error refreshing user URLs:', error)
        showError('Failed to refresh URLs')
      }
    } else if (guestId) {
      try {
        const response = await fetch('https://masterwayne.duckdns.org/api/urlTableData/guestAll', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ guestId })
        })

        const result = await response.json()
        if (response.ok && result.urlEntries) {
          const transformedUrls = result.urlEntries.map(transformGuestUrlData)
          const sortedUrls = sortUrlsByCreatedTime(transformedUrls)
          setShortenedUrls(sortedUrls)
          saveGuestUrlsToStorage(sortedUrls)
          showSuccess('URLs refreshed successfully!')
        }
      } catch (error) {
        console.error('Error refreshing guest URLs:', error)
        showError('Failed to refresh URLs')
      }
    }
  }

  // Load URLs when user status changes
  useEffect(() => {
    const loadUrls = async () => {
      if (user) {
        // Load logged-in user URLs
        // First try to load from localStorage
        const storedUrls = loadUserUrlsFromStorage()
        if (storedUrls.length > 0) {
          const sortedStoredUrls = sortUrlsByCreatedTime(storedUrls)
          setShortenedUrls(sortedStoredUrls)
        }

        // Then try to sync with server
        try {
          const response = await fetch('https://masterwayne.duckdns.org/api/logged/urlTableData/userAll', {
            method: 'GET',
            credentials: 'include'
          })

          const result = await response.json()
          if (response.ok && Array.isArray(result)) {
            const transformedUrls = result.map(transformUrlData)
            const sortedUrls = sortUrlsByCreatedTime(transformedUrls)
            setShortenedUrls(sortedUrls)
            saveUserUrlsToStorage(sortedUrls)
          }
        } catch (error) {
          console.error('Error loading user URLs from server:', error)
          // If server fails, keep using localStorage data
        }
      } else if (guestId) {
        // Load guest URLs
        // First try to load from localStorage
        const storedUrls = loadGuestUrlsFromStorage()
        if (storedUrls.length > 0) {
          const sortedStoredUrls = sortUrlsByCreatedTime(storedUrls)
          setShortenedUrls(sortedStoredUrls)
        }

        // Then try to sync with server
        try {
          const response = await fetch('https://masterwayne.duckdns.org/api/urlTableData/guestAll', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ guestId })
          })

          const result = await response.json()
          if (response.ok && result.urlEntries) {
            const transformedUrls = result.urlEntries.map(transformGuestUrlData)
            const sortedUrls = sortUrlsByCreatedTime(transformedUrls)
            setShortenedUrls(sortedUrls)
            // Save server data to localStorage
            saveGuestUrlsToStorage(sortedUrls)
          }
        } catch (error) {
          console.error('Error loading guest URLs from server:', error)
          // If server fails, keep using localStorage data
        }
      }
    }

    loadUrls()
  }, [guestId, user])

  // Save URLs to localStorage whenever they change
  useEffect(() => {
    if (user && shortenedUrls.length > 0) {
      saveUserUrlsToStorage(shortenedUrls)
    } else if (!user && guestId && shortenedUrls.length > 0) {
      saveGuestUrlsToStorage(shortenedUrls)
    }
  }, [shortenedUrls, user, guestId])

  // Clear URLs when guest session is cleared
  useEffect(() => {
    if (!user && !guestId && shortenedUrls.length > 0) {
      // Guest session was cleared, clear the URLs
      setShortenedUrls([])
    }
  }, [guestId, user, shortenedUrls.length])

  // Update existing URLs when user signs in/out
  useEffect(() => {
    setShortenedUrls(prev => prev.map(url => ({
      ...url,
      qrEnabled: !!user,
      isGuest: !user
    })))
  }, [user])

  const handleShortenUrl = async (originalUrl, description = '') => {
    setIsLoading(true)

    try {
      let currentGuestId = guestId
      let apiEndpoint = ''
      let requestBody = {}

      if (user) {
        // User is logged in - use authenticated endpoint
        apiEndpoint = 'https://masterwayne.duckdns.org/api/logged/urlTableData/user'
        requestBody = {
          id: user.id,
          email: user.email,
          name: user.name,
          originalUrl: originalUrl,
          description: description || null
        }
      } else {
        // Guest user
        if (!guestId) {
          // First time guest - create new guest session
          currentGuestId = createGuestSession()
          apiEndpoint = 'https://masterwayne.duckdns.org/api/urlTableData/guest'
          requestBody = {
            originalUrl,
            description: description || null
          }
        } else {
          // Existing guest - use guest ID
          apiEndpoint = 'https://masterwayne.duckdns.org/api/urlTableData/guestId'
          requestBody = {
            guestId: currentGuestId,
            originalUrl,
            description: description || null
          }
        }
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      })

      const result = await response.json()

      if (!response.ok) {
        showError(result.message || 'Failed to shorten URL')
        return
      }

      // Store guest ID if it's a new guest
      if (result.guestId && !guestId) {
        setGuestSession(result.guestId)
      }

      // Transform and add the new URL to the list
      const newUrl = transformUrlData(result)
      const updatedUrls = [newUrl, ...shortenedUrls]
      const sortedUrls = sortUrlsByCreatedTime(updatedUrls)
      setShortenedUrls(sortedUrls)

      // Save to localStorage
      if (user) {
        saveUserUrlsToStorage(sortedUrls)
      } else if (guestId || result.guestId) {
        saveGuestUrlsToStorage(sortedUrls)
      }

      showSuccess(result.message || 'URL shortened successfully!')

    } catch (error) {
      console.error('Error shortening URL:', error)
      showError('An error occurred while shortening the URL')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRowClick = (url) => {
    // Use real analytics data from server
    const analytics = {
      // Basic analytics from analyticsDto
      totalClicks: url.analyticsDto?.totalClicks || url.totalClicks || 0,
      uniqueClicks: url.analyticsDto?.uniqueClicks || 0,
      clicksToday: url.analyticsDto?.clicksToday || 0,
      clicksThisWeek: url.analyticsDto?.clicksThisWeek || 0,
      clicksThisMonth: url.analyticsDto?.clicksThisMonth || 0,
      clicksLastMonth: url.analyticsDto?.clicksLastMonth || 0,
      averageClicksPerDay: url.analyticsDto?.averageClicksPerDay || 0,
      peakClickDay: url.analyticsDto?.peakClickDayDto || null,
      
      // Detailed analytics from server arrays
      topCountries: url.countryClicks && url.countryClicks.length > 0 ? 
        url.countryClicks.map(item => ({
          country: item.country || 'Unknown',
          clicks: item.clicks || 0,
          percentage: item.percentage || 0
        })) : [{ country: 'No data available', clicks: 0, percentage: 0 }],
        
      topBrowsers: url.browserTables && url.browserTables.length > 0 ? 
        url.browserTables.map(item => ({
          browser: item.browser || 'Unknown',
          clicks: item.clicks || 0,
          percentage: item.percentage || 0
        })) : [{ browser: 'No data available', clicks: 0, percentage: 0 }],
        
      deviceBreakdown: url.deviceTables && url.deviceTables.length > 0 ? 
        url.deviceTables.map(item => ({
          device: item.device || 'Unknown',
          clicks: item.clicks || 0,
          percentage: item.percentage || 0
        })) : [{ device: 'No data available', clicks: 0, percentage: 0 }],
        
      operatingSystems: url.operatingSystems && url.operatingSystems.length > 0 ? 
        url.operatingSystems.map(item => ({
          osName: item.osName || 'Unknown',
          os: item.osName || 'Unknown', // For backward compatibility
          clicks: item.clicks || 0,
          percentage: item.percentage || 0
        })) : [{ osName: 'No data available', os: 'No data available', clicks: 0, percentage: 0 }],
        
      topReferrers: url.topReferrers && url.topReferrers.length > 0 ? 
        url.topReferrers.map(item => ({
          referrer: item.referred || item.referrer || 'Direct',
          clicks: item.clicks || 0
        })) : [{ referrer: 'No data available', clicks: 0 }],
        
      ipTables: url.ipTables && url.ipTables.length > 0 ? 
        url.ipTables.map(item => ({
          ip: maskIpAddress(item.ip),
          clicks: item.clicks || 0
        })) : [{ ip: 'No data available', clicks: 0 }],
        
      recentClicks: url.recentClicks && url.recentClicks.length > 0 ? 
        url.recentClicks.map(item => ({
          createdAt: item.createdAt,
          timestamp: item.createdAt, // For backward compatibility
          country: item.country || 'Unknown',
          browser: item.browser || 'Unknown',
          device: item.device || 'Unknown',
          ip: maskIpAddress(item.ip),
          referred: item.referred || 'direct',
          userAgent: item.userAgent || ''
        })) : [{ timestamp: 'No recent clicks', country: '-', browser: '-', device: '-' }],
        
      clicksByDates: url.clicksByDates && url.clicksByDates.length > 0 ? 
        url.clicksByDates.map(item => ({
          date: item.createAt || item.createdAt, // Note: server sends 'createAt' (typo?)
          clicks: item.clicks || 0
        })) : []
    }

    setSelectedUrl({ ...url, analytics })
    setShowUrlDetails(true)
  }

  const deleteUrl = async (id) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) {
      return
    }

    try {
      // Find the URL to get the shortCode
      const urlToDelete = shortenedUrls.find(url => url.id === id)
      if (!urlToDelete) {
        showError('URL not found')
        return
      }

      let apiEndpoint = ''
      let requestBody = {}

      if (user) {
        // Logged-in user - use authenticated delete endpoint
        apiEndpoint = 'https://masterwayne.duckdns.org/api/logged/urlTableData/delete'
        requestBody = {
          userID: user.id,
          urlCode: urlToDelete.shortCode
        }
      } else {
        // Guest user
        if (!guestId) {
          showError('Unable to delete URL - no guest session')
          return
        }

        apiEndpoint = 'https://masterwayne.duckdns.org/api/urlTableData/guest/delete'
        requestBody = {
          guestId: guestId,
          id: id,
          urlCode: urlToDelete.shortCode
        }
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      })

      const result = await response.json()

      if (response.ok) {
        const updatedUrls = shortenedUrls.filter(url => url.id !== id)
        setShortenedUrls(updatedUrls)

        // Update localStorage
        if (user) {
          saveUserUrlsToStorage(updatedUrls)
        } else if (guestId) {
          saveGuestUrlsToStorage(updatedUrls)
        }

        showSuccess(result.message || 'URL deleted successfully!')
      } else {
        showError(result.message || 'Failed to delete URL')
      }
    } catch (error) {
      console.error('Error deleting URL:', error)
      showError('An error occurred while deleting the URL')
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

  const handleQrCodeClick = (url) => {
    setSelectedQrUrl(url)
    setShowQrModal(true)
  }

  const handleGuestLogin = async (guestIdForUrls) => {
    // Load URLs from the guest session after successful guest login
    try {
      const response = await fetch('https://masterwayne.duckdns.org/api/urlTableData/guestAll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ guestId: guestIdForUrls })
      })

      const result = await response.json()

      if (response.ok) {
        // Handle both array response and object with urlEntries
        let urlList = []

        if (Array.isArray(result)) {
          // Direct array of URLs
          urlList = result
        } else if (result.urlEntries && Array.isArray(result.urlEntries)) {
          // Object with urlEntries array
          urlList = result.urlEntries
        } else if (result.message) {
          // Server returned a message, possibly no URLs found
          setShortenedUrls([])
          return
        } else {
          showError('Unexpected response format from server')
          return
        }

        // Transform the URLs using the guest-specific transformer
        const transformedUrls = urlList.map(transformGuestUrlData)
        const sortedUrls = sortUrlsByCreatedTime(transformedUrls)
        setShortenedUrls(sortedUrls)

        // Save to localStorage for guest users
        if (guestIdForUrls) {
          try {
            localStorage.setItem(`urlShortener_guestUrls_${guestIdForUrls}`, JSON.stringify(sortedUrls))
          } catch (error) {
            console.error('Error saving guest URLs to localStorage:', error)
          }
        }

        // Don't show success message here since GuestAlert already shows it
        // showSuccess(`Loaded ${transformedUrls.length} URLs from guest session`)
      } else {
        showError(result.message || 'Failed to load URLs from guest session')
      }
    } catch (error) {
      console.error('Error loading URLs after guest login:', error)
      showError('An error occurred while loading URLs from guest session')
    }
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
            <div className="results-header">
              <h2>Your Shortened URLs</h2>
              <button
                onClick={refreshUrls}
                className="refresh-btn"
                title="Refresh URLs to get latest data"
              >
                🔄 Refresh
              </button>
            </div>

            {isGuest && (
              <GuestAlert
                guestId={guestId}
                onSignUp={handleSignUp}
                onGuestLogin={handleGuestLogin}
              />
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
              onQrCodeClick={handleQrCodeClick}
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
        onQrCodeClick={handleQrCodeClick}
      />

      <QrCodeModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        url={selectedQrUrl}
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