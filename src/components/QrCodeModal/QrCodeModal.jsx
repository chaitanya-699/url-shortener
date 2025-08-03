import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { useToast } from '../../hooks/useToast'
import './QrCodeModal.css'

const QrCodeModal = ({ isOpen, onClose, url }) => {
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef(null)
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    if (isOpen && url?.shortUrl) {
      generateQRCode()
    }
  }, [isOpen, url])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const generateQRCode = async () => {
    if (!url?.shortUrl) return

    setIsGenerating(true)
    try {
      const qrOptions = {
        width: 300,
        margin: 2,
        color: {
          dark: '#1a2332',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      }

      const dataUrl = await QRCode.toDataURL(url.shortUrl, qrOptions)
      setQrDataUrl(dataUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
      showError('Failed to generate QR code')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadQRCode = () => {
    if (!qrDataUrl) {
      showError('QR code not available for download')
      return
    }

    try {
      const link = document.createElement('a')
      const fileName = url.shortCode 
        ? `qr-code-${url.shortCode}.png`
        : `qr-code-${Date.now()}.png`
      
      link.download = fileName
      link.href = qrDataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      showSuccess('QR code downloaded successfully!')
    } catch (error) {
      console.error('Error downloading QR code:', error)
      showError('Failed to download QR code')
    }
  }

  const copyQRCodeToClipboard = async () => {
    if (!qrDataUrl) return

    try {
      // Convert data URL to blob
      const response = await fetch(qrDataUrl)
      const blob = await response.blob()
      
      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      showSuccess('QR code copied to clipboard!')
    } catch (error) {
      console.error('Error copying QR code:', error)
      showError('Failed to copy QR code to clipboard')
    }
  }

  const shareQRCode = async () => {
    if (!navigator.share) {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(url.shortUrl)
        showSuccess('Short URL copied to clipboard!')
      } catch (error) {
        showError('Sharing not supported on this device')
      }
      return
    }

    try {
      await navigator.share({
        title: 'Shortened URL',
        text: `Check out this shortened URL: ${url.shortUrl}`,
        url: url.shortUrl
      })
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error)
        showError('Failed to share')
      }
    }
  }

  const copyShortUrl = async () => {
    try {
      await navigator.clipboard.writeText(url.shortUrl)
      showSuccess('Short URL copied to clipboard!')
    } catch (error) {
      showError('Failed to copy URL')
    }
  }

  if (!isOpen || !url) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📱 QR Code</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="qr-modal-content">
          {/* URL Info */}
          <div className="url-info">
            <div className="url-item">
              <label>Short URL:</label>
              <div className="url-display">
                <span className="short-url">{url.shortUrl}</span>
                <button 
                  onClick={copyShortUrl}
                  className="copy-url-btn"
                  title="Copy URL"
                  aria-label="Copy short URL"
                >
                  📋
                </button>
              </div>
            </div>
            {url.originalUrl && (
              <div className="url-item">
                <label>Original URL:</label>
                <div className="original-url" title={url.originalUrl}>
                  {url.originalUrl}
                </div>
              </div>
            )}
          </div>

          {/* QR Code Display */}
          <div className="qr-display">
            {isGenerating ? (
              <div className="qr-loading">
                <div className="loading-spinner"></div>
                <p>Generating QR code...</p>
              </div>
            ) : qrDataUrl ? (
              <div className="qr-image-container">
                <img 
                  src={qrDataUrl} 
                  alt="QR Code" 
                  className="qr-image"
                />
                <p className="qr-instruction">
                  Scan this QR code to access the shortened URL
                </p>
              </div>
            ) : (
              <div className="qr-error">
                <p>Failed to generate QR code</p>
                <button onClick={generateQRCode} className="retry-btn">
                  🔄 Retry
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {qrDataUrl && (
            <div className="qr-actions">
              <button 
                onClick={downloadQRCode}
                className="action-btn download-btn"
                title="Download QR code as PNG"
              >
                📥 Download
              </button>
              
              <button 
                onClick={copyQRCodeToClipboard}
                className="action-btn copy-btn"
                title="Copy QR code to clipboard"
              >
                📋 Copy Image
              </button>
              
              <button 
                onClick={shareQRCode}
                className="action-btn share-btn"
                title="Share URL"
              >
                📤 Share URL
              </button>
            </div>
          )}

          {/* Additional Info */}
          <div className="qr-info">
            <div className="info-item">
              <span className="info-label">📊 Total Clicks:</span>
              <span className="info-value">{url.totalClicks || 0}</span>
            </div>
            {url.createdAt && (
              <div className="info-item">
                <span className="info-label">📅 Created:</span>
                <span className="info-value">
                  {new Date(url.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QrCodeModal