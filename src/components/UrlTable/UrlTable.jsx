import { useClipboard } from '../../hooks/useClipboard'
import { useToast } from '../../hooks/useToast'
import { useAuth } from '../../context/AuthContext'
import './UrlTable.css'

const UrlTable = ({
  urls,
  onDeleteUrl,
  onRowClick,
  copiedId: externalCopiedId,
  onCopyToClipboard: externalCopyToClipboard,
  onQrCodeClick
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
              <th>Created</th>
              {user && <th>Analytics</th>}
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
                    <div className="url-info">
                      <div className="url-text-scroll">
                        <span className="url-text" title={url.originalUrl}>
                          {url.originalUrl}
                        </span>
                      </div>
                      {url.description && (
                        <div className="url-description" title={url.description}>
                          {url.description}
                        </div>
                      )}
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
                <td className="created-cell" data-label="Created">
                  <div className="created-info">
                    <span className="created-date">
                      {url.createdAt ? new Date(url.createdAt).toLocaleDateString() : 'Unknown'}
                    </span>
                    <span className="created-time">
                      {url.createdAt ? new Date(url.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }) : ''}
                    </span>
                  </div>
                </td>
                {user && (
                  <td className="analytics-cell" data-label="Analytics">
                    <div className="analytics-summary">
                      <div className="clicks-count">
                        <span className="clicks-number">{url.totalClicks || 0}</span>
                        <span className="clicks-label">clicks</span>
                      </div>
                      {url.analyticsDto && (
                        <div className="analytics-details">
                          <small>Today: {url.analyticsDto.clicksToday || 0}</small>
                          <small>Week: {url.analyticsDto.clicksThisWeek || 0}</small>
                        </div>
                      )}
                    </div>
                  </td>
                )}
                <td className="qr-cell" data-label="QR Code">
                  <button
                    onClick={(e) => {
                      if (onRowClick) e.stopPropagation()
                      if (onQrCodeClick) {
                        onQrCodeClick(url)
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        if (onRowClick) e.stopPropagation()
                        if (onQrCodeClick) {
                          onQrCodeClick(url)
                        }
                      }
                    }}
                    className="qr-btn"
                    title="View QR Code"
                    aria-label="View QR Code"
                  >
                    📱 QR
                  </button>
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