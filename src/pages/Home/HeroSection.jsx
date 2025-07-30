import './HeroSection.css'

const HeroSection = ({ user, onSignUp }) => {
  return (
    <header className="hero-section">
      <h1>🔗 URL Shortener</h1>
      <p>Transform your long URLs into short, shareable links</p>
      {!user && (
        <div className="auth-prompt">
          <p>Try it out below! Sign up to save and manage your URLs permanently.</p>
        </div>
      )}
    </header>
  )
}

export default HeroSection