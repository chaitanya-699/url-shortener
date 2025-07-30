import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/useToast'
import SocialAuth from '../../components/AuthModal/SocialAuth'
import './Login.css'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState('signin') // 'signin' or 'signup'

  const navigate = useNavigate()
  const { login } = useAuth()
  const { showSuccess, showError } = useToast()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    // Simulate API call delay
    setTimeout(() => {
      try {
        // Simulate successful login/signup
        login(formData.email)
        showSuccess(mode === 'signin' ? 'Signed in successfully!' : 'Account created successfully!')
        navigate('/dashboard')
      } catch (error) {
        showError('An error occurred. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }, 1000)
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setError('')
    setFormData({ email: '', password: '' })
  }

  const handleSocialAuth = (provider) => {
    setIsLoading(true)
    setError('')

    // Simulate social authentication
    setTimeout(() => {
      try {
        const email = provider === 'google'
          ? 'user@gmail.com'
          : 'user@github.com'

        login(email)
        showSuccess(`Signed in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}!`)
        navigate('/dashboard')
      } catch (error) {
        showError(`Failed to sign in with ${provider}. Please try again.`)
      } finally {
        setIsLoading(false)
      }
    }, 1500)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">🔗</div>
          <h1>URL Shortener</h1>
          <p>{mode === 'signin' ? 'Sign in to manage your shortened URLs' : 'Create an account to get started'}</p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`tab-btn ${mode === 'signin' ? 'active' : ''}`}
            onClick={() => switchMode('signin')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`tab-btn ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => switchMode('signup')}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading
              ? (mode === 'signin' ? 'Signing in...' : 'Creating account...')
              : (mode === 'signin' ? 'Sign In' : 'Create Account')
            }
          </button>
        </form>

        <SocialAuth onSocialAuth={handleSocialAuth} />

        <div className="login-footer">
          <Link to="/" className="back-home">← Back to Home</Link>
          <p>Demo: Any email and password will work!</p>
        </div>
      </div>
    </div>
  )
}

export default Login