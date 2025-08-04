import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import ToastContainer from './components/Toast/ToastContainer'
import Home from './pages/Home/Home'
import OAuthSuccess from './pages/Home/OauthSuccess'
import './App.css'
import './components/ErrorBoundary.css'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path= "/oauth-success" element = {<OAuthSuccess/>}/>
    </Routes>
  )
}

function AppContent() {
  const { isLoading } = useAuth()
  const [loadingMessage, setLoadingMessage] = useState('Initializing...')
  const [loadingSubtitle, setLoadingSubtitle] = useState('Starting up')

  useEffect(() => {
    if (!isLoading) return

    const messages = [
      { main: 'Initializing...', sub: 'Starting up' },
      { main: 'Checking authentication...', sub: 'Verifying your session' },
      { main: 'Loading user data...', sub: 'Getting your information' },
      { main: 'Preparing interface...', sub: 'Almost ready' }
    ]

    let messageIndex = 0
    setLoadingMessage(messages[0].main)
    setLoadingSubtitle(messages[0].sub)

    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length
      setLoadingMessage(messages[messageIndex].main)
      setLoadingSubtitle(messages[messageIndex].sub)
    }, 2000)

    return () => clearInterval(interval)
  }, [isLoading])

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-overlay">
          <div className="loading-overlay-content">
            <div className="auth-loading-icon">🔐</div>
            <div className="loading-overlay-spinner"></div>
            <div className="loading-overlay-text">
              {loadingMessage}
            </div>
            <div className="auth-loading-subtitle">
              {loadingSubtitle}
            </div>
            <div className="page-loading-dots">
              <div className="page-loading-dot"></div>
              <div className="page-loading-dot"></div>
              <div className="page-loading-dot"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="app fade-in">
        <AppRoutes />
        <ToastContainer />
      </div>
    </Router>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
