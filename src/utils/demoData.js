/**
 * Demo data generators for analytics and testing
 */

/**
 * Generates dummy analytics data for demo purposes
 * @returns {Object} - Analytics data object
 */
export const generateDummyAnalytics = () => {
  const countries = ['United States', 'United Kingdom', 'Germany', 'France', 'Canada', 'Australia', 'Japan', 'India']
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera']
  const devices = ['Desktop', 'Mobile', 'Tablet']

  return {
    totalClicks: Math.floor(Math.random() * 1000) + 100,
    uniqueClicks: Math.floor(Math.random() * 500) + 50,
    clicksToday: Math.floor(Math.random() * 50) + 5,
    clicksThisWeek: Math.floor(Math.random() * 200) + 20,
    topCountries: countries.slice(0, 3).map(country => ({
      country,
      clicks: Math.floor(Math.random() * 100) + 10
    })),
    topBrowsers: browsers.slice(0, 3).map(browser => ({
      browser,
      clicks: Math.floor(Math.random() * 80) + 5
    })),
    deviceBreakdown: devices.map(device => ({
      device,
      percentage: Math.floor(Math.random() * 40) + 20
    })),
    recentClicks: Array.from({ length: 5 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 3600000).toLocaleString(),
      country: countries[Math.floor(Math.random() * countries.length)],
      browser: browsers[Math.floor(Math.random() * browsers.length)]
    }))
  }
}