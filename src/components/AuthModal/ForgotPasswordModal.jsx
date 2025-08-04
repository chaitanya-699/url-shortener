import { useState, useEffect } from 'react'
import { useToast } from '../../hooks/useToast'
import { useAuth } from '../../context/AuthContext'
import './AuthModal.css'


const ForgotPasswordModal = ({ isOpen, onClose, onBackToSignIn, onSuccess }) => {
    const [step, setStep] = useState(1) // 1: email, 2: code, 3: new password
    const [formData, setFormData] = useState({
        email: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [serverMessage, setServerMessage] = useState('')
    const [countdown, setCountdown] = useState(0)
    const [displayMessage, setDisplayMessage] = useState('')
    const { showSuccess, showError } = useToast()
    const { login } = useAuth()

    // Parse time from server message and start countdown
    const parseTimeFromMessage = (message) => {
        const timeRegex = /(\d+)\s*minutes?\s*and\s*(\d+)\s*seconds?/i
        const minutesOnlyRegex = /(\d+)\s*minutes?/i
        const secondsOnlyRegex = /(\d+)\s*seconds?/i

        let totalSeconds = 0

        if (timeRegex.test(message)) {
            const match = message.match(timeRegex)
            const minutes = parseInt(match[1])
            const seconds = parseInt(match[2])
            totalSeconds = minutes * 60 + seconds
        } else if (minutesOnlyRegex.test(message)) {
            const match = message.match(minutesOnlyRegex)
            const minutes = parseInt(match[1])
            totalSeconds = minutes * 60
        } else if (secondsOnlyRegex.test(message)) {
            const match = message.match(secondsOnlyRegex)
            totalSeconds = parseInt(match[1])
        }

        return totalSeconds
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        if (mins > 0) {
            return `${mins} minute${mins !== 1 ? 's' : ''} and ${secs} second${secs !== 1 ? 's' : ''}`
        }
        return `${secs} second${secs !== 1 ? 's' : ''}`
    }

    // Countdown timer effect
    useEffect(() => {
        let timer
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        setDisplayMessage(serverMessage.replace(/Please try again after.*?\./i, 'You can now try again.'))
                        return 0
                    }
                    const newCount = prev - 1
                    const timeStr = formatTime(newCount)
                    setDisplayMessage(serverMessage.replace(/(\d+)\s*minutes?\s*and\s*(\d+)\s*seconds?|\d+\s*minutes?|\d+\s*seconds?/i, timeStr))
                    return newCount
                })
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [countdown, serverMessage])

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (step === 1) {
                await handleSendCode()
            } else if (step === 2) {
                await handleVerifyCode()
            } else if (step === 3) {
                await handleResetPassword()
            }
        } catch (error) {
            console.log('Form submission error:', error)
            showError('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSendCode = async () => {
        if (!formData.email) {
            console.log('Error: Please enter your email address')
            showError('Please enter your email address')
            return
        }

        const response = await fetch('https://masterwayne.duckdns.org/api/auth/login/forgotPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email: formData.email }),
        })

        const result = await response.json()
        if (!response.ok) {
            showError(result.message || 'Failed to send reset code')
            return
        }

        showSuccess(result.message || 'Reset code sent to your email!')
        const message = result.message || 'Check your email for the verification code. It may take a few minutes to arrive.'
        setServerMessage(message)

        // Parse countdown time from server message
        const countdownTime = parseTimeFromMessage(message)
        if (countdownTime > 0) {
            setCountdown(countdownTime)
            setDisplayMessage(message)
        } else {
            setDisplayMessage(message)
        }

        setStep(2)
    }

    const handleVerifyCode = async () => {
        if (!formData.code) {
            showError('Please enter the verification code')
            return
        }

        const response = await fetch('https://masterwayne.duckdns.org/api/auth/login/verifyCode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                email: formData.email,
                code: formData.code
            }),
        })

        const result = await response.json()

        if (response.ok) {
            showSuccess(result.message || 'Code verified! Please set your new password.')
            setStep(3)
        } else {
            showError(result.message || 'Invalid verification code. Please try again.')
        }
    }

    const handleResetPassword = async () => {
        if (!formData.newPassword || !formData.confirmPassword) {
            console.log('Error: Please enter and confirm your new password')
            showError('Please enter and confirm your new password')
            return
        }

        if (formData.newPassword.length < 8) {
            console.log('Error: Password must be at least 8 characters long')
            showError('Password must be at least 8 characters long')
            return
        }

        if (formData.newPassword !== formData.confirmPassword) {
            console.log('Error: Passwords do not match')
            showError('Passwords do not match')
            return
        }

        const response = await fetch('https://masterwayne.duckdns.org/api/auth/login/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                email: formData.email,
                password: formData.newPassword
            }),
        })

        const data = await response.json();

        if (!response.ok) {
            console.log('Failed to reset password:', data.message)
            showError(data.message || 'Failed to reset password')
            return
        }

        // Success: Login the user automatically with the new password
        login({
            id: data.id,
            name: data.name,
            email: data.email
        })

        showSuccess(data.message || 'Password reset successfully! You are now logged in.')
        handleClose()
        onSuccess() // This will close both ForgotPasswordModal and main AuthModal
    }

    const handleClose = () => {
        setStep(1)
        setFormData({
            email: '',
            code: '',
            newPassword: '',
            confirmPassword: ''
        })
        setServerMessage('')
        setCountdown(0)
        setDisplayMessage('')
        onClose()
    }

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1)
        } else {
            handleClose()
            onBackToSignIn()
        }
    }

    const getStepTitle = () => {
        switch (step) {
            case 1: return 'Reset Password'
            case 2: return 'Enter Verification Code'
            case 3: return 'Set New Password'
            default: return 'Reset Password'
        }
    }

    const getStepDescription = () => {
        switch (step) {
            case 1: return 'Enter your email address and we\'ll send you a verification code'
            case 2: return `We've sent a verification code to ${formData.email}`
            case 3: return 'Create a new password for your account'
            default: return ''
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content forgot-password-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title-section">
                        <h2>{getStepTitle()}</h2>
                        <p className="modal-description">{getStepDescription()}</p>
                    </div>
                    <button className="modal-close" onClick={handleClose}>
                        ✕
                    </button>
                </div>

                {/* Progress indicator */}
                <div className="progress-indicator">
                    <div className="progress-steps">
                        <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                            <span className="step-number">1</span>
                            <span className="step-label">Email</span>
                        </div>
                        <div className="progress-line"></div>
                        <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                            <span className="step-number">2</span>
                            <span className="step-label">Code</span>
                        </div>
                        <div className="progress-line"></div>
                        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                            <span className="step-number">3</span>
                            <span className="step-label">Password</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {step === 1 && (
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="Enter your email address"
                                required
                                autoFocus
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="form-group">
                            <label htmlFor="code">Verification Code</label>
                            <input
                                type="text"
                                id="code"
                                value={formData.code}
                                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                                placeholder="Enter 6-digit code"
                                maxLength="6"
                                required
                                autoFocus
                            />
                            <small className="form-hint">
                                {displayMessage || serverMessage}
                            </small>
                        </div>
                    )}

                    {step === 3 && (
                        <>
                            <div className="form-group">
                                <label htmlFor="newPassword">New Password</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    placeholder="At least 8 characters"
                                    minLength="8"
                                    required
                                    autoFocus
                                />
                                {formData.newPassword && formData.newPassword.length < 8 && (
                                    <small className="password-hint">Password must be at least 8 characters</small>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm New Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    placeholder="Confirm your new password"
                                    minLength="8"
                                    required
                                />
                                {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                                    <small className="password-hint">Passwords do not match</small>
                                )}
                            </div>
                        </>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="back-btn"
                            onClick={handleBack}
                            disabled={isLoading}
                        >
                            {step === 1 ? 'Back to Sign In' : 'Back'}
                        </button>

                        <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                            {isLoading ? 'Please wait...' : (
                                step === 1 ? 'Send Code' :
                                    step === 2 ? 'Verify Code' :
                                        'Reset Password'
                            )}
                        </button>
                    </div>
                </form>

                {step === 2 && (
                    <div className="resend-section">
                        <p>
                            Didn't receive the code?{' '}
                            <button
                                type="button"
                                className="resend-btn"
                                onClick={() => handleSendCode()}
                                disabled={isLoading}
                            >
                                Resend Code
                            </button>
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ForgotPasswordModal