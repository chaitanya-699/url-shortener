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

  // Generate unique guest ID
  const generateGuestId = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = 'guest_'
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  useEffect(() => {
    // Check if user is logged in via JWT token in HTTP cookie
    const checkAuthStatus = async () => {
      console.log("Called")
      try {
        const response = await fetch('http://localhost:8080/api/auth/login/me', {
          method: 'GET',
          credentials: 'include',
        })

        const userData = await response.json()
        console.log(userData.message)
        if (response.ok && userData.id && userData.email) {
          setUser({
            id: userData.id,
            email: userData.email,
            name: userData.name
          })
        } else {
          // User not authenticated, check for guest session
          const savedGuestId = localStorage.getItem('urlShortener_guestId')
          if (savedGuestId) {
            setGuestId(savedGuestId)
          }
        }
      } catch (error) {
        // Fallback to guest session if available
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
    try {
      const newGuestId = generateGuestId()
      setGuestId(newGuestId)
      localStorage.setItem('urlShortener_guestId', newGuestId)
      return newGuestId
    } catch (error) {
      console.error('Error creating guest session:', error)
      return null
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

      setUser(null)
      setGuestId(null)
      localStorage.removeItem('urlShortener_guestId')

      // Return server message for toast display
      return result.message || 'Logged out successfully'
    } catch (error) {
      console.error('Error during logout:', error)
      // Even if logout request fails, clear local state
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
    logout,
    createGuestSession,
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