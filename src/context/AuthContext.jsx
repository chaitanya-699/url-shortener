import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    return {}
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [guestId, setGuestId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Set guest ID from server response
  const setGuestSession = (serverGuestId) => {
    try {
      setGuestId(serverGuestId)
      localStorage.setItem('urlShortener_guestId', serverGuestId)
      return serverGuestId
    } catch (error) {
      console.error('Error setting guest session:', error)
      return null
    }
  }

  // Test cookie functionality and sending
  const testCookies = async () => {
    console.log('🍪 Testing cookie functionality...')

    // Check all cookies
    console.log('📋 All cookies:', document.cookie)

    // Parse cookies
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      if (cookie.trim()) {
        const [name, value] = cookie.trim().split('=')
        acc[name] = value
      }
      return acc
    }, {})

    console.log('🔍 Parsed cookies:', cookies)

    // Look for common auth cookie names
    const authCookieNames = ['JSESSIONID', 'JWT', 'auth', 'token', 'session', 'AUTH_TOKEN', 'Authorization']
    const foundAuthCookies = []

    authCookieNames.forEach(name => {
      if (cookies[name]) {
        console.log(`✅ Found auth cookie: ${name} = ${cookies[name]}`)
        foundAuthCookies.push({ name, value: cookies[name] })
      } else {
        console.log(`❌ Missing auth cookie: ${name}`)
      }
    })

    // Test if cookies are actually sent in requests
    console.log('🧪 Testing if cookies are sent in requests...')

    try {
      const testResponse = await fetch('https://masterwayne.duckdns.org/api/auth/login/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      })

      console.log('📡 Test request made with credentials: include')
      console.log('📊 Response status:', testResponse.status)

      // Check if the server received cookies by looking at response
      const responseData = await testResponse.json().catch(() => null)
      if (responseData) {
        console.log('📄 Server response:', responseData)
      }

    } catch (error) {
      console.error('❌ Test request failed:', error)
    }

    // Check browser cookie settings
    console.log('🔧 Browser info:')
    console.log('  - User Agent:', navigator.userAgent)
    console.log('  - Cookie Enabled:', navigator.cookieEnabled)
    console.log('  - Current Protocol:', window.location.protocol)
    console.log('  - Current Host:', window.location.host)

    return {
      allCookies: document.cookie,
      parsedCookies: cookies,
      foundAuthCookies,
      cookieEnabled: navigator.cookieEnabled
    }
  }

  // Test CORS configuration
  const testCORS = async () => {
    console.log('🌐 Testing CORS configuration...')

    try {
      const response = await fetch('https://masterwayne.duckdns.org/api/auth/login/me', {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type',
        },
      })

      console.log('🔍 CORS preflight response:', response.status)
      console.log('📋 CORS headers:', Object.fromEntries(response.headers.entries()))

      const allowOrigin = response.headers.get('Access-Control-Allow-Origin')
      const allowMethods = response.headers.get('Access-Control-Allow-Methods')
      const allowHeaders = response.headers.get('Access-Control-Allow-Headers')
      const allowCredentials = response.headers.get('Access-Control-Allow-Credentials')

      console.log('🎯 Access-Control-Allow-Origin:', allowOrigin)
      console.log('📝 Access-Control-Allow-Methods:', allowMethods)
      console.log('📋 Access-Control-Allow-Headers:', allowHeaders)
      console.log('🔐 Access-Control-Allow-Credentials:', allowCredentials)

    } catch (error) {
      console.error('❌ CORS test failed:', error)
    }
  }

  // Debug function to test different endpoints
  const testEndpoints = async () => {
    const endpoints = [
      '/api/auth/login/me',
      '/api/auth/me',
      '/api/user/me',
      '/api/me',
      '/auth/me',
      '/me'
    ]

    console.log('🧪 Testing different endpoint variations...')

    for (const endpoint of endpoints) {
      try {
        const fullUrl = `https://masterwayne.duckdns.org${endpoint}`
        console.log(`🔍 Testing: ${fullUrl}`)

        const response = await fetch(fullUrl, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        })

        console.log(`📊 ${endpoint} - Status: ${response.status}`)

        if (response.ok) {
          console.log(`✅ ${endpoint} - SUCCESS!`)
          const data = await response.json()
          console.log(`📄 ${endpoint} - Data:`, data)
        }
      } catch (error) {
        console.log(`❌ ${endpoint} - Error:`, error.message)
      }
    }
  }

  useEffect(() => {
    // Check if user is logged in via JWT token in HTTP cookie
    const checkAuthStatus = async () => {
      try {
        console.log('🔍 Checking auth status...')
        console.log('🌐 Making request to: https://masterwayne.duckdns.org/api/auth/login/me')

        // Check cookies before making the request
        console.log('🍪 Current cookies before auth check:', document.cookie)
        console.log('🌍 Current origin:', window.location.origin)
        console.log('🎯 Target domain:', 'masterwayne.duckdns.org')
        console.log('🔒 Using HTTPS:', window.location.protocol === 'https:')

        // Add timeout to the fetch request
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

        const response = await fetch('https://masterwayne.duckdns.org/api/auth/login/me', {
          method: 'GET',
          credentials: 'include', // This should send cookies
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        console.log('📊 Auth check response status:', response.status)
        console.log('✅ Auth check response ok:', response.ok)
        console.log('🔗 Response URL:', response.url)
        console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()))

        // Try to read the response regardless of status (since backend returns JSON even on 404)
        let userData = null
        try {
          userData = await response.json()
          console.log('👤 Auth check user data:', userData)
        } catch (e) {
          console.log('❌ Could not parse response as JSON')
          // If we can't parse JSON, try to read as text
          try {
            const errorText = await response.text()
            console.log('📄 Response body as text:', errorText)
          } catch (textError) {
            console.log('❌ Could not read response body at all')
          }
        }

        // Check if we have valid user data (regardless of HTTP status)
        if (userData && (userData.id || userData.userId) && userData.email) {
          console.log('✅ User authenticated, setting user data')
          setUser({
            id: userData.id || userData.userId,
            email: userData.email,
            name: userData.name
          })
          return // Exit early if user is authenticated
        }

        // Handle the expected "try login" response (404 is normal when not logged in)
        if (userData && userData.message === 'try login') {
          console.log('ℹ️ User not logged in - received expected "try login" response')
        } else if (!response.ok) {
          console.log('❌ Auth check failed with status:', response.status)
          if (userData) {
            console.log('📄 Error response data:', userData)
          }
        } else {
          console.log('⚠️ Successful response but user data incomplete:', userData)
        }

        // User not authenticated or response not ok, check for guest session
        console.log('👤 User not authenticated, checking for guest session')
        const savedGuestId = localStorage.getItem('urlShortener_guestId')
        if (savedGuestId) {
          console.log('💾 Found saved guest ID:', savedGuestId)
          setGuestId(savedGuestId)
        }
      } catch (error) {
        console.error('🚨 Auth check network error:', error)
        console.error('🔍 Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        })

        // Check if it's a timeout error
        if (error.name === 'AbortError') {
          console.error('⏰ Auth check timed out after 10 seconds')
        }

        // Check if it's a CORS error
        if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
          console.error('🚫 CORS Error detected - server may not be configured for cross-origin requests')
        }

        // Check if it's a network error
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          console.error('🌐 Network Error - server may be unreachable')
        }

        // Silently handle network errors and fallback to guest session
        const savedGuestId = localStorage.getItem('urlShortener_guestId')
        if (savedGuestId) {
          setGuestId(savedGuestId)
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()

    // Add test functions to window for debugging
    if (typeof window !== 'undefined') {
      window.testAuthEndpoints = testEndpoints
      window.testCORS = testCORS
      window.testCookies = testCookies
      console.log('🛠️ Debug functions added:')
      console.log('  - window.testAuthEndpoints()')
      console.log('  - window.testCORS()')
      console.log('  - window.testCookies()')
    }
  }, [])

  const login = (userData) => {
    try {
      setUser(userData)
      setGuestId(null)
      // Remove guest session when user logs in
      localStorage.removeItem('urlShortener_guestId')
    } catch (error) {
      console.error('Error during login:', error)
    }
  }

  const createGuestSession = () => {
    // This will be called when we need to indicate a guest session should be created
    // The actual guest ID will come from the server response
    return 'create_new_guest'
  }

  const loginWithGuest = async (currentGuestId) => {
    try {
      const response = await fetch('https://masterwayne.duckdns.org/api/auth/login/guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ guestId: currentGuestId })
      })

      const result = await response.json()

      if (response.ok) {
        // Don't clear the guest session - just return success
        // The guest session should remain active to keep the URLs
        return {
          success: true,
          message: result.message || 'Successfully logged in with guest session!',
          guestId: currentGuestId
        }
      } else {
        return {
          success: false,
          message: result.message || 'Failed to login with guest session'
        }
      }
    } catch (error) {
      console.error('Error during guest login:', error)
      return {
        success: false,
        message: 'An error occurred during guest login'
      }
    }
  }

  const guestSignout = () => {
    try {
      // Clear guest URLs from localStorage
      if (guestId) {
        localStorage.removeItem(`urlShortener_guestUrls_${guestId}`)
      }

      // Clear guest session
      setGuestId(null)
      localStorage.removeItem('urlShortener_guestId')

      return 'Guest session cleared successfully'
    } catch (error) {
      console.error('Error during guest signout:', error)
      return 'Guest session cleared'
    }
  }

  const logout = async () => {
    try {
      // Call backend logout endpoint to clear HTTP cookie
      const response = await fetch('https://masterwayne.duckdns.org/api/logout', {
        method: 'GET',
        credentials: 'include',
      })

      const result = await response.json()

      // Clear guest URLs from localStorage if there was a guest session
      if (guestId) {
        localStorage.removeItem(`urlShortener_guestUrls_${guestId}`)
      }

      setUser(null)
      setGuestId(null)
      localStorage.removeItem('urlShortener_guestId')

      // Return server message for toast display
      return result.message || 'Logged out successfully'
    } catch (error) {
      console.error('Error during logout:', error)
      // Even if logout request fails, clear local state
      if (guestId) {
        localStorage.removeItem(`urlShortener_guestUrls_${guestId}`)
      }
      setUser(null)
      setGuestId(null)
      localStorage.removeItem('urlShortener_guestId')
      return 'Logged out successfully'
    }
  }

  const value = {
    user,
    guestId,
    login,
    loginWithGuest,
    logout,
    guestSignout,
    createGuestSession,
    setGuestSession,
    isLoading,
    isGuest: !user && !!guestId,
    isLoggedIn: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext