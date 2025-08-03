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

  useEffect(() => {
    // Check if user is logged in via JWT token in HTTP cookie
    const checkAuthStatus = async () => {
      try {
        console.log('Checking auth status...')
        const response = await fetch('http://localhost:8080/api/auth/login/me', {
          method: 'GET',
          credentials: 'include',
        })

        console.log('Auth check response status:', response.status)
        console.log('Auth check response ok:', response.ok)

        // Only process response if it's successful
        if (response.ok) {
          const userData = await response.json()
          console.log('Auth check user data:', userData)

          if ((userData.id || userData.userId) && userData.email) {
            console.log('User authenticated, setting user data')
            setUser({
              id: userData.id || userData.userId,
              email: userData.email,
              name: userData.name
            })
            return // Exit early if user is authenticated
          } else {
            console.log('User data incomplete:', userData)
          }
        } else {
          console.log('Auth check failed with status:', response.status)
        }

        // User not authenticated or response not ok, check for guest session
        console.log('User not authenticated, checking for guest session')
        const savedGuestId = localStorage.getItem('urlShortener_guestId')
        if (savedGuestId) {
          console.log('Found saved guest ID:', savedGuestId)
          setGuestId(savedGuestId)
        }
      } catch (error) {
        console.error('Auth check error:', error)
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
      const response = await fetch('http://localhost:8080/api/auth/login/guest', {
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
      const response = await fetch('http://localhost:8080/api/logout', {
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