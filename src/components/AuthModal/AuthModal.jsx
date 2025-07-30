import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/useToast'
import SocialAuth from './SocialAuth'
import './AuthModal.css'

const AuthModal = ({ isOpen, onClose, mode, onModeChange }) => {
  const [formData, setFormData] = useState({ email: '', password: '', guestId: '' })
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (mode === 'guest') {
        if (!formData.guestId.trim()) {
          showError('Please enter your Guest ID')
          return
        }

        if (formData.guestId.startsWith('guest_')) {
          localStorage.setItem('urlShortener_guestId', formData.guestId)
          showSuccess('Guest session restored!')
          setTimeout(() => window.location.reload(), 1000)
        } else {
          showError('Invalid Guest ID format. Guest IDs start with "guest_"')
          return
        }
      } else {
        if (!formData.email || !formData.password) {
          showError('Please enter email and password')
          return
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        login(formData.email)
        showSuccess(mode === 'signup' ? 'Account created successfully!' : 'Signed in successfully!')
        navigate('/dashboard')
      }

      onClose()
      setFormData({ email: '', password: '', guestId: '' })
    } catch (error) {
      showError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const switchMode = (newMode) => {
    onModeChange(newMode)
    setFormData({ email: '', password: '', guestId: '' })
  }

  const handleSocialAuth = async (provider) => {
    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      const email = provider === 'google' ? 'user@gmail.com' : 'user@github.com'
      login(email)
      showSuccess(`Signed in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}!`)
      navigate('/dashboard')
      onClose()
    } catch (error) {
      showError(`Failed to sign in with ${provider}. Please try again.`)
    } finally {
      setIsLoading(false)
    }
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
                  placeholder="Enter your password"
                  required
                />
              </div>
            </>
          )}

          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? 'Please wait...' : (
              mode === 'signin' ? 'Sign In' :
                mode === 'signup' ? 'Create Account' :
                  'Access Guest Session'
            )}
          </button>
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

        <div className="demo-notice">
          <p>Demo: Any email and password will work!</p>
        </div>
      </div>
    </div>
  )
}

export default AuthModal