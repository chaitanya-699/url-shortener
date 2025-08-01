import { useClipboard } from '../../hooks/useClipboard'
import { useToast } from '../../hooks/useToast'
import { useAuth } from '../../context/AuthContext'
import './UrlTable.css'

const UrlTable = ({
  urls,
  onDeleteUrl,
  onRowClick,
  copiedId: externalCopiedId,
  onCopyToClipboard: externalCopyToClipboard
}) => {
  const internalClipboard = useClipboard()
  const { showSuccess, showError, showInfo } = useToast()
  const { user } = useAuth()

  // Use external clipboard functions if provided, otherwise use internal ones
  const copiedId = externalCopiedId !== undefined ? externalCopiedId : internalClipboard.copiedId
  const copyToClipboard = externalCopyToClipboard || (async (text, id) => {
    const success = await internalClipboard.copyToClipboard(text, id)
    if (success) {
      showSuccess('Copied to clipboard!')
    } else {
      showError('Failed to copy to clipboard')
    }
  })

  if (urls.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔗</div>
        <h3>No URLs shortened yet</h3>
        <p>Create your first short URL using the form above!</p>
      </div>
    )
  }

  return (
    <div className="url-table-container">
      <div className="table-wrapper">
        <table className="url-table">
          <thead>
            <tr>
              <th>Original URL</th>
              <th>Shortened URL</th>
              <th>QR Code</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url) => (
              <tr
                key={url.id}
                className={`url-row ${user && onRowClick ? 'clickable-row' : ''}`}
                onClick={user && onRowClick ? () => onRowClick(url) : undefined}
                style={user && onRowClick ? { cursor: 'pointer' } : {}}
              >
                <td className="original-url-cell" data-label="Original URL">
                  <div className="url-cell-content">
                    <div className="url-text-scroll">
                      <span className="url-text" title={url.originalUrl}>
                        {url.originalUrl}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        if (onRowClick) e.stopPropagation()
                        copyToClipboard(url.originalUrl, `orig-${url.id}`)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          if (onRowClick) e.stopPropagation()
                          copyToClipboard(url.originalUrl, `orig-${url.id}`)
                        }
                      }}
                      className="copy-btn"
                      title="Copy original URL"
                      aria-label="Copy original URL"
                    >
                      {copiedId === `orig-${url.id}` ? '✓' : '📋'}
                    </button>
                  </div>
                </td>
                <td className="short-url-cell" data-label="Short URL">
                  <div className="url-cell-content">
                    <div className="url-text-scroll">
                      <span className="short-url-text" title={url.shortUrl}>
                        {url.shortUrl}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        if (onRowClick) e.stopPropagation()
                        copyToClipboard(url.shortUrl, url.id)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          if (onRowClick) e.stopPropagation()
                          copyToClipboard(url.shortUrl, url.id)
                        }
                      }}
                      className="copy-btn"
                      title="Copy short URL"
                      aria-label="Copy short URL"
                    >
                      {copiedId === url.id ? '✓' : '📋'}
                    </button>
                  </div>
                </td>
                <td className="qr-cell" data-label="QR Code">
                  {url.qrEnabled ? (
                    <button
                      onClick={(e) => {
                        if (onRowClick) e.stopPropagation()
                        showInfo('QR Code feature would be implemented here')
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          if (onRowClick) e.stopPropagation()
                          showInfo('QR Code feature would be implemented here')
                        }
                      }}
                      className="qr-btn"
                      title="Generate QR Code"
                      aria-label="Generate QR Code"
                    >
                      📱 QR
                    </button>
                  ) : (
                    <span className="qr-disabled" title="Login required for QR codes">
                      ❌ Login
                    </span>
                  )}
                </td>
                <td className="delete-cell" data-label="Actions">
                  <button
                    onClick={(e) => {
                      if (onRowClick) e.stopPropagation()
                      onDeleteUrl(url.id)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        if (onRowClick) e.stopPropagation()
                        onDeleteUrl(url.id)
                      }
                    }}
                    className="delete-btn"
                    title="Delete URL"
                    aria-label="Delete URL"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UrlTable