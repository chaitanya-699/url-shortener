import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/useToast'
import './MobileSidebar.css'

const MobileSidebar = ({ isOpen, onClose, onAuthModalOpen }) => {
  const { user, logout, guestSignout, isGuest } = useAuth()
  const { showSuccess } = useToast()

  const handleLogout = async () => {
    const message = await logout()
    showSuccess(message)
    onClose()
  }

  const handleGuestSignout = () => {
    const message = guestSignout()
    showSuccess(message)
    onClose()
  }

  return (
    <div className={`mobile-sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className="mobile-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-sidebar-header">
          <h3>🔗 URL Shortener</h3>
          <button className="mobile-sidebar-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="mobile-sidebar-content">
          {user ? (
            <div className="mobile-user-section">
              <div className="mobile-user-info">
                <span className="mobile-user-greeting">Hello, {user.name || (user.email ? user.email.split('@')[0] : 'User')}!</span>
              </div>
              <Link
                to="/dashboard"
                className="mobile-nav-link"
                onClick={onClose}
              >
                📊 Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="mobile-nav-btn logout"
              >
                🚪 Sign Out
              </button>
            </div>
          ) : isGuest ? (
            <div className="mobile-guest-section">
              <div className="mobile-guest-info">
                <span className="mobile-guest-indicator">
                  <span className="mobile-guest-icon">🎭</span>
                  <span>Guest Mode</span>
                </span>
              </div>
              <button
                onClick={() => {
                  onAuthModalOpen('signin')
                  onClose()
                }}
                className="mobile-nav-btn signin"
              >
                🔑 Sign In
              </button>
              <button
                onClick={() => {
                  onAuthModalOpen('signup')
                  onClose()
                }}
                className="mobile-nav-btn signup"
              >
                ✨ Sign Up
              </button>
              <button
                onClick={() => {
                  onAuthModalOpen('guest')
                  onClose()
                }}
                className="mobile-nav-btn guest"
              >
                🎭 Guest Login
              </button>
              <button
                onClick={handleGuestSignout}
                className="mobile-nav-btn guest-signout"
              >
                🗑️ Clear Session
              </button>
            </div>
          ) : (
            <div className="mobile-auth-section">
              <button
                onClick={() => {
                  onAuthModalOpen('signin')
                  onClose()
                }}
                className="mobile-nav-btn signin"
              >
                🔑 Sign In
              </button>
              <button
                onClick={() => {
                  onAuthModalOpen('signup')
                  onClose()
                }}
                className="mobile-nav-btn signup"
              >
                ✨ Sign Up
              </button>
              <button
                onClick={() => {
                  onAuthModalOpen('guest')
                  onClose()
                }}
                className="mobile-nav-btn guest"
              >
                🎭 Guest Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MobileSidebar