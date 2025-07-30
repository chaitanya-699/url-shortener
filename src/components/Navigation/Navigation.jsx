import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navigation.css'

const Navigation = ({ onAuthModalOpen, onMobileSidebarOpen }) => {
  const { user, logout, isGuest } = useAuth()

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
                <span className="user-greeting">Hello, {user.split('@')[0]}!</span>
                <Link to="/dashboard" className="dashboard-link">
                  Dashboard
                </Link>
                <button onClick={logout} className="logout-btn">
                  Sign Out
                </button>
              </div>
            ) : isGuest ? (
              <div className="guest-menu">
                <div className="guest-indicator">
                  <span className="guest-icon">🎭</span>
                  <span className="guest-text">Guest Mode</span>
                </div>
                <button
                  onClick={() => onAuthModalOpen('signin')}
                  className="signin-btn"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onAuthModalOpen('signup')}
                  className="signup-btn"
                >
                  Sign Up
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
                <button
                  onClick={() => onAuthModalOpen('signup')}
                  className="signup-btn"
                >
                  Sign Up
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