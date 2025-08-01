import { useState } from 'react'
import './GuestAlert.css'

const GuestAlert = ({ guestId, onSignUp }) => {
  const [isClear, setIsClear] = useState(true);
  const handleClick = () => {
    setIsClear(!isClear);
  }
  return (
    <div className="guest-alert" style={isClear ? {} : { display: 'none' }}>
      <button className='clear-guest-alert' onClick={handleClick} >  x</button>
      <div className="guest-alert-content">
        <div className="guest-alert-icon">🎭</div>
        <div className="guest-alert-text">
          <h4>Guest Session Active</h4>
          <p><strong>Your Guest ID:</strong> <code>{guestId}</code></p>
          <p>You can use this ID to access your URLs, but QR codes, info, API services  and more are only available for registered users.</p>
        </div>
        <button onClick={onSignUp} className="guest-alert-btn">
          Sign Up
        </button>
      </div>
    </div>
  )
}

export default GuestAlert