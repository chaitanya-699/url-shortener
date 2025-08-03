import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/useToast'
import './GuestAlert.css'

const GuestAlert = ({ guestId, onSignUp, onGuestLogin }) => {
  const [isClear, setIsClear] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { loginWithGuest } = useAuth()
  const { showSuccess, showError } = useToast()

  const handleClick = () => {
    setIsClear(!isClear)
  }

  const handleGuestLogin = async () => {
    setIsLoading(true)
    try {
      const result = await loginWithGuest(guestId)
      if (result.success) {
        // Show a custom success message instead of server message
        showSuccess('Guest session loaded successfully!')
        if (onGuestLogin) {
          await onGuestLogin(result.guestId)
        }
        // Hide the alert after successful guest login
        setIsClear(false)
      } else {
        showError(result.message)
      }
    } catch (error) {
      console.error('Guest login error:', error)
      showError('Failed to login with guest session')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="guest-alert" style={isClear ? {} : { display: 'none' }}>
      <button className='clear-guest-alert' onClick={handleClick}>×</button>
      <div className="guest-alert-content">
        <div className="guest-alert-icon">🎭</div>
        <div className="guest-alert-text">
          <h4>Guest Session Active</h4>
          <p><strong>Your Guest ID:</strong> <code>{guestId}</code></p>
          <p>You can use this ID to access your URLs, but QR codes, info, API services and more are only available for registered users.</p>
        </div>
        <div className="guest-alert-actions">
          <button 
            onClick={handleGuestLogin} 
            className="guest-alert-btn guest-login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login with Guest ID'}
          </button>
          <button onClick={onSignUp} className="guest-alert-btn">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}

export default GuestAlert