import { formatDate } from '../../utils/urlUtils'
import './UrlDetailsModal.css'

const UrlDetailsModal = ({ isOpen, onClose, url }) => {
  if (!isOpen || !url) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="url-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📊 URL Analytics</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="url-details-content">
          {/* Basic Info */}
          <div className="url-info-section">
            <h3>📋 Basic Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Original URL:</label>
                <textarea
                  className="url-textarea"
                  value={url.originalUrl}
                  readOnly
                  rows="2"
                />
              </div>
              <div className="info-item">
                <label>Short URL:</label>
                <textarea
                  className="url-textarea short"
                  value={url.shortUrl}
                  readOnly
                  rows="1"
                />
              </div>
              <div className="info-item">
                <label>Created:</label>
                <span>{formatDate(url.createdAt)}</span>
              </div>
              <div className="info-item">
                <label>Status:</label>
                <span className={url.isGuest ? 'guest-status' : 'user-status'}>
                  {url.isGuest ? '👤 Guest URL' : '✅ Registered URL'}
                </span>
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="analytics-section">
            <h3>📈 Click Analytics</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{url.analytics.totalClicks}</div>
                <div className="stat-label">Total Clicks</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{url.analytics.uniqueClicks}</div>
                <div className="stat-label">Unique Clicks</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{url.analytics.clicksToday}</div>
                <div className="stat-label">Today</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{url.analytics.clicksThisWeek}</div>
                <div className="stat-label">This Week</div>
              </div>
            </div>
          </div>

          {/* Geographic Data */}
          <div className="geo-section">
            <h3>🌍 Top Countries</h3>
            <div className="country-list">
              {url.analytics.topCountries.map((item, index) => (
                <div key={index} className="country-item">
                  <span className="country-name">{item.country}</span>
                  <span className="country-clicks">{item.clicks} clicks</span>
                </div>
              ))}
            </div>
          </div>

          {/* Browser Data */}
          <div className="browser-section">
            <h3>🌐 Top Browsers</h3>
            <div className="browser-list">
              {url.analytics.topBrowsers.map((item, index) => (
                <div key={index} className="browser-item">
                  <span className="browser-name">{item.browser}</span>
                  <span className="browser-clicks">{item.clicks} clicks</span>
                </div>
              ))}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="device-section">
            <h3>📱 Device Types</h3>
            <div className="device-list">
              {url.analytics.deviceBreakdown.map((item, index) => (
                <div key={index} className="device-item">
                  <span className="device-name" data-device={item.device}>{item.device}</span>
                  <span className="device-percentage">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Clicks */}
          <div className="recent-section">
            <h3>🕒 Recent Clicks</h3>
            <div className="recent-list">
              {url.analytics.recentClicks.map((click, index) => (
                <div key={index} className="recent-item">
                  <span className="recent-time">{click.timestamp}</span>
                  <span className="recent-location">{click.country}</span>
                  <span className="recent-browser">{click.browser}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UrlDetailsModal