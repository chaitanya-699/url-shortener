import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/useToast'
import SocialAuth from './SocialAuth'
import ForgotPasswordModal from './ForgotPasswordModal'
import './AuthModal.css'

const AuthModal = ({ isOpen, onClose, mode, onModeChange }) => {
  const [formData, setFormData] = useState({ email: '', password: '', guestId: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const { login } = useAuth()
  const { showSuccess, showError } = useToast()

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let success = false

      if (mode === 'guest') {
        success = await handleGuestLogin(formData.guestId)
      } else if (mode === 'signin') {
        success = await handleSignIn(formData.email, formData.password)
      } else if (mode === 'signup') {
        success = await handleSignUp(formData.email, formData.password)
      }

      // Only close modal and clear form if operation was successful
      if (success) {
        onClose()
        setFormData({ email: '', password: '', guestId: '' })
      }
    } catch (error) {
      console.log('Form submission error:', error)
      showError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (email, password) => {
    if (!email || !password) {
      console.log('Error: Please enter email and password')
      showError('Please enter email and password')
      return false
    }

    console.log('🍪 Cookies before login:', document.cookie)
    
    const response = await fetch('https://masterwayne.duckdns.org/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })

    console.log('📡 Login response status:', response.status)
    console.log('📋 Login response headers:', Object.fromEntries(response.headers.entries()))
    console.log('🍪 Cookies after login response:', document.cookie)

    const userData = await response.json()

    if (response.ok && (userData.id || userData.userId) && userData.email) {
      // Success: Backend returns {userId, message, email, name} or {id, message, email, name}
      console.log('✅ Login successful, checking cookies again:', document.cookie)
      
      login({
        id: userData.id || userData.userId,
        email: userData.email,
        name: userData.name
      })
      showSuccess(userData.message || 'Signed in successfully!')
      return true
    } else {
      // Error: Backend returns {message: "email not found"} or similar
      showError(userData.message || 'Login failed')
      return false
    }
  }

  const handleSignUp = async (email, password) => {
    if (!email || !password) {
      console.log('Error: Please enter email and password')
      showError('Please enter email and password')
      return false
    }

    if (password.length < 8) {
      console.log('Error: Password must be at least 8 characters long')
      showError('Password must be at least 8 characters long')
      return false
    }

    console.log('🍪 Cookies before registration:', document.cookie)
    
    const response = await fetch('https://masterwayne.duckdns.org/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })

    console.log('📡 Registration response status:', response.status)
    console.log('📋 Registration response headers:', Object.fromEntries(response.headers.entries()))
    console.log('🍪 Cookies after registration response:', document.cookie)

    const userData = await response.json()

    if (response.ok && (userData.id || userData.userId) && userData.email) {
      // Success: Backend returns {userId, message, email, name} or {id, message, email, name}
      console.log('✅ Registration successful, checking cookies again:', document.cookie)
      
      login({
        id: userData.id || userData.userId,
        email: userData.email,
        name: userData.name
      })
      showSuccess(userData.message || 'Account created successfully!')
      return true
    } else {
      // Error: Backend returns {message: "email already exists"} or similar
      console.log('Registration failed:', userData.message)
      showError(userData.message || 'Registration failed')
      return false
    }
  }

  const handleGuestLogin = async (guestId) => {
    if (!guestId.trim()) {
      console.log('Error: Please enter your Guest ID')
      showError('Please enter your Guest ID')
      return false
    }

    if (!guestId.startsWith('guest_')) {
      console.log('Error: Invalid Guest ID format')
      showError('Invalid Guest ID format. Guest IDs start with "guest_"')
      return false
    }

    const response = await fetch('https://masterwayne.duckdns.org/api/auth/login/guest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ guestId }),
    })

    if (!response.ok) {
      console.log('Guest login failed:', response.status)
      showError('Guest session not found')
      return false
    }

    const data = await response.json()

    // Store guest session
    localStorage.setItem('urlShortener_guestId', guestId)
    localStorage.setItem('guestData', JSON.stringify(data))

    showSuccess(data.message || 'Guest session restored!')
    setTimeout(() => window.location.reload(), 1000)
    return true
  }

  const switchMode = (newMode) => {
    onModeChange(newMode)
    setFormData({ email: '', password: '', guestId: '' })
  }

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true)
  }

  const handleForgotPasswordClose = () => {
    setShowForgotPassword(false)
  }

  const handleBackToSignIn = () => {
    setShowForgotPassword(false)
    onModeChange('signin')
  }

  const handleForgotPasswordSuccess = () => {
    setShowForgotPassword(false)
    onClose() // Close the main AuthModal as well
  }

  const handleSocialAuth = async (provider) => {
    setIsLoading(true)

    try {
      if (provider === 'google') {
        await handleGoogleAuth()
      } else if (provider === 'github') {
        await handleGithubAuth()
      }

      onClose()
    } catch (error) {
      console.log(`Social auth error with ${provider}:`, error)
      showError(`Failed to sign in with ${provider}. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    // TODO: Implement Google OAuth
    // Option 1: Redirect to backend OAuth endpoint
    window.location.href = 'https://masterwayne.duckdns.org/oauth2/authorization/google'

    // Option 2: Use Google OAuth popup (if using client-side)
    // const response = await googleOAuthPopup()
    // const data = await response.json()
    // localStorage.setItem('token', data.token)
    // login(data.user)
    // showSuccess('Signed in with Google!')
    // navigate('/dashboard')
  }

  const handleGithubAuth = async () => {
    // TODO: Implement GitHub OAuth
    // Option 1: Redirect to backend OAuth endpoint
    window.location.href = 'https://masterwayne.duckdns.org/oauth2/authorization/github'

    // Option 2: Use GitHub OAuth popup (if using client-side)
    // const response = await githubOAuthPopup()
    // const data = await response.json()
    // localStorage.setItem('token', data.token)
    // login(data.user)
    // showSuccess('Signed in with GitHub!')
    // navigate('/dashboard')
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {mode === 'signin' ? 'Sign In' :
              mode === 'signup' ? 'Sign Up' :
                'Guest Login'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'guest' ? (
            <>
              <div className="guest-info-text">
                <p>🎭 Enter your existing Guest ID to access your URLs</p>
                <p className="guest-hint">Guest IDs start with "guest_" followed by 8 characters</p>
              </div>

              <div className="form-group">
                <label htmlFor="guestId">Guest ID</label>
                <input
                  type="text"
                  id="guestId"
                  value={formData.guestId}
                  onChange={(e) => setFormData(prev => ({ ...prev, guestId: e.target.value }))}
                  placeholder="guest_xxxxxxxx"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder={mode === 'signup' ? 'At least 8 characters' : 'Enter your password'}
                  minLength={mode === 'signup' ? 8 : undefined}
                  required
                />
                {mode === 'signup' && formData.password && formData.password.length < 8 && (
                  <small className="password-hint">Password must be at least 8 characters</small>
                )}
              </div>

            </>
          )}

          {mode === 'signin' ? (
            <div className="signin-actions">
              <button
                type="button"
                className="forgot-password-btn"
                onClick={handleForgotPasswordClick}
              >
                Forgot password?
              </button>
              <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                {isLoading ? 'Please wait...' : 'Sign In'}
              </button>
            </div>
          ) : (
            <button type="submit" className="auth-submit-btn" disabled={isLoading}>
              {isLoading ? 'Please wait...' : (
                mode === 'signup' ? 'Create Account' : 'Access Guest Session'
              )}
            </button>
          )}
        </form>

        {mode !== 'guest' && (
          <>
            <SocialAuth onSocialAuth={handleSocialAuth} />

            <div className="auth-switch">
              <p>
                {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  className="switch-mode-btn"
                  onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
                >
                  {mode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
              <p>
                Or{' '}
                <button
                  type="button"
                  className="switch-mode-btn"
                  onClick={() => switchMode('guest')}
                >
                  continue as guest
                </button>
              </p>
            </div>
          </>
        )}

        {mode === 'guest' && (
          <div className="auth-switch">
            <p>
              Want to create an account?{' '}
              <button
                type="button"
                className="switch-mode-btn"
                onClick={() => switchMode('signup')}
              >
                Sign up
              </button>
            </p>
          </div>
        )}

        <ForgotPasswordModal
          isOpen={showForgotPassword}
          onClose={handleForgotPasswordClose}
          onBackToSignIn={handleBackToSignIn}
          onSuccess={handleForgotPasswordSuccess}
        />
      </div>
    </div>
  )
}

export default AuthModal