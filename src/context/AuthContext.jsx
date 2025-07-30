import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
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
    // Check if user is logged in on app start
    try {
      const savedUser = localStorage.getItem('urlShortener_user')
      const savedGuestId = localStorage.getItem('urlShortener_guestId')
      
      if (savedUser) {
        setUser(savedUser)
      } else if (savedGuestId) {
        setGuestId(savedGuestId)
      }
    } catch (error) {
      console.error('Error loading auth state from localStorage:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = (email) => {
    try {
      setUser(email)
      setGuestId(null)
      localStorage.setItem('urlShortener_user', email)
      localStorage.removeItem('urlShortener_guestId')
    } catch (error) {
      console.error('Error saving user to localStorage:', error)
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

  const logout = () => {
    try {
      setUser(null)
      setGuestId(null)
      localStorage.removeItem('urlShortener_user')
      localStorage.removeItem('urlShortener_guestId')
      // Optionally clear user's URLs on logout
      // localStorage.removeItem(`urls_${user}`)
    } catch (error) {
      console.error('Error during logout:', error)
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