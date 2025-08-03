import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/useToast'
import './Navigation.css'

const Navigation = ({ onAuthModalOpen, onMobileSidebarOpen }) => {
  const { user, guestId, logout, guestSignout, isGuest } = useAuth()
  const { showSuccess } = useToast()

  const handleLogout = async () => {
    const message = await logout()
    showSuccess(message)
  }

  const handleGuestSignout = () => {
    const message = guestSignout()
    showSuccess(message)
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="nav-logo">🔗</span>
          <span className="nav-title">URL Shortener</span>
        </div>
        <div className="nav-actions">
          {/* Desktop Navigation */}
          <div className="desktop-nav">
            {user ? (
              <div className="user-menu">
                <span className="user-greeting">Hello, {user.name || (user.email ? user.email.split('@')[0] : 'User')}!</span>
                <button onClick={handleLogout} className="logout-btn">
                  Sign Out
                </button>
              </div>
            ) : isGuest ? (
              <div className="guest-menu">
                <span className="user-greeting">Hello, {guestId}!</span>
                <button
                  onClick={() => onAuthModalOpen('signin')}
                  className="signin-btn"
                >
                  Sign In
                </button>
                <button
                  onClick={handleGuestSignout}
                  className="logout-btn guest-signout"
                >
                  Clear Session
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <button
                  onClick={() => onAuthModalOpen('signin')}
                  className="signin-btn"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="mobile-nav">
            <button
              className="mobile-menu-btn"
              onClick={onMobileSidebarOpen}
            >
              ☰
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation