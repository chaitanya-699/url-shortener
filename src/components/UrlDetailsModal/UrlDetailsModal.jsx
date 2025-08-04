import { formatDate } from '../../utils/urlUtils'
import './UrlDetailsModal.css'

const UrlDetailsModal = ({ isOpen, onClose, url, onQrCodeClick }) => {
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

          {/* Quick Summary */}
          {url.analytics.totalClicks > 0 && (
            <div className="summary-section">
              <h3>📊 Quick Summary</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Most Popular Country:</span>
                  <span className="summary-value">
                    {url.analytics.topCountries[0]?.country || 'Unknown'} 
                    ({url.analytics.topCountries[0]?.clicks || 0} clicks)
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Top Browser:</span>
                  <span className="summary-value">
                    {url.analytics.topBrowsers[0]?.browser || 'Unknown'}
                    ({url.analytics.topBrowsers[0]?.clicks || 0} clicks)
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Most Used Device:</span>
                  <span className="summary-value">
                    {url.analytics.deviceBreakdown[0]?.device || 'Unknown'}
                    ({url.analytics.deviceBreakdown[0]?.percentage || 0}%)
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Peak Day:</span>
                  <span className="summary-value">
                    {url.analytics.peakClickDay?.date || 'N/A'}
                    ({url.analytics.peakClickDay?.clicks || 0} clicks)
                  </span>
                </div>
              </div>
            </div>
          )}

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
              <div className="stat-card">
                <div className="stat-number">{url.analytics.clicksThisMonth}</div>
                <div className="stat-label">This Month</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{url.analytics.clicksLastMonth}</div>
                <div className="stat-label">Last Month</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{url.analytics.averageClicksPerDay?.toFixed(1) || 0}</div>
                <div className="stat-label">Avg/Day</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{url.analytics.peakClickDay?.date || 'N/A'}</div>
                <div className="stat-label">Peak Day</div>
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

          {/* Operating Systems */}
          <div className="os-section">
            <h3>💻 Operating Systems</h3>
            <div className="os-list">
              {url.analytics.operatingSystems.map((item, index) => (
                <div key={index} className="os-item">
                  <span className="os-name">{item.osName || item.os || item.name || 'Unknown'}</span>
                  <span className="os-clicks">{item.clicks || item.count || 0} clicks</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Referrers */}
          <div className="referrer-section">
            <h3>🔗 Top Referrers</h3>
            <div className="referrer-list">
              {url.analytics.topReferrers.map((item, index) => (
                <div key={index} className="referrer-item">
                  <span className="referrer-name">{item.referrer || item.source || 'Direct'}</span>
                  <span className="referrer-clicks">{item.clicks || item.count || 0} clicks</span>
                </div>
              ))}
            </div>
          </div>

          {/* IP Analytics */}
          <div className="ip-section">
            <h3>🌐 IP Analytics</h3>
            <div className="ip-list">
              {url.analytics.ipTables.map((item, index) => (
                <div key={index} className="ip-item">
                  <span className="ip-address">{item.ip || 'Unknown IP'}</span>
                  <span className="ip-clicks">{item.clicks || item.count || 0} clicks</span>
                </div>
              ))}
            </div>
          </div>

          {/* URL Status & QR Code */}
          <div className="status-section">
            <h3>⚙️ URL Status</h3>
            <div className="status-grid">
              <div className="status-item">
                <label>Active:</label>
                <span className={url.active ? 'status-active' : 'status-inactive'}>
                  {url.active ? '✅ Active' : '❌ Inactive'}
                </span>
              </div>
              <div className="status-item">
                <label>Blocked:</label>
                <span className={url.blocked ? 'status-blocked' : 'status-unblocked'}>
                  {url.blocked ? '🚫 Blocked' : '✅ Not Blocked'}
                </span>
              </div>
              {url.description && (
                <div className="status-item">
                  <label>Description:</label>
                  <span className="url-description">{url.description}</span>
                </div>
              )}
              <div className="status-item">
                <label>QR Code:</label>
                <button 
                  onClick={() => onQrCodeClick && onQrCodeClick(url)}
                  className="qr-link"
                  type="button"
                >
                  📱 View QR Code
                </button>
              </div>
            </div>
          </div>

          {/* Recent Clicks */}
          <div className="recent-section">
            <h3>🕒 Recent Clicks</h3>
            <div className="recent-list">
              {url.analytics.recentClicks.map((click, index) => (
                <div key={index} className="recent-item">
                  <span className="recent-time">
                    {click.createdAt ? new Date(click.createdAt).toLocaleString() : click.timestamp || 'Unknown time'}
                  </span>
                  <span className="recent-location">{click.country || 'Unknown'}</span>
                  <span className="recent-browser">
                    {click.browser || 'Unknown'} {click.device ? `(${click.device})` : ''}
                  </span>
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