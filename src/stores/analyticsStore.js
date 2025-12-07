import { create } from 'zustand'

// Load from localStorage on init
const loadAnalytics = () => {
  try {
    const stored = localStorage.getItem('analytics-data')
    if (stored) {
      return JSON.parse(stored)
    }
    return {
      pageViews: [],
      sessions: [],
      productViews: {},
      productClicks: {}
    }
  } catch {
    return {
      pageViews: [],
      sessions: [],
      productViews: {},
      productClicks: {}
    }
  }
}

// Save to localStorage
const saveAnalytics = (data) => {
  try {
    localStorage.setItem('analytics-data', JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save analytics:', e)
  }
}

const useAnalyticsStore = create((set, get) => ({
  analytics: loadAnalytics(),
  
  // Track page view
  trackPageView: (page, userId = null) => {
    const state = get()
    const pageView = {
      page,
      timestamp: Date.now(),
      userId
    }
    const updatedAnalytics = {
      ...state.analytics,
      pageViews: [...state.analytics.pageViews, pageView]
    }
    set({ analytics: updatedAnalytics })
    saveAnalytics(updatedAnalytics)
  },
  
  // Track product view
  trackProductView: (productId) => {
    const state = get()
    const updatedViews = {
      ...state.analytics.productViews,
      [productId]: (state.analytics.productViews[productId] || 0) + 1
    }
    const updatedAnalytics = {
      ...state.analytics,
      productViews: updatedViews
    }
    set({ analytics: updatedAnalytics })
    saveAnalytics(updatedAnalytics)
  },
  
  // Track product click
  trackProductClick: (productId) => {
    const state = get()
    const updatedClicks = {
      ...state.analytics.productClicks,
      [productId]: (state.analytics.productClicks[productId] || 0) + 1
    }
    const updatedAnalytics = {
      ...state.analytics,
      productClicks: updatedClicks
    }
    set({ analytics: updatedAnalytics })
    saveAnalytics(updatedAnalytics)
  },
  
  // Start session
  startSession: (sessionId) => {
    const state = get()
    const session = {
      sessionId,
      startTime: Date.now(),
      pages: []
    }
    const updatedSessions = [...state.analytics.sessions, session]
    const updatedAnalytics = {
      ...state.analytics,
      sessions: updatedSessions
    }
    set({ analytics: updatedAnalytics })
    saveAnalytics(updatedAnalytics)
  },
  
  // End session
  endSession: (sessionId) => {
    const state = get()
    const updatedSessions = state.analytics.sessions.map(s =>
      s.sessionId === sessionId
        ? { ...s, endTime: Date.now() }
        : s
    )
    const updatedAnalytics = {
      ...state.analytics,
      sessions: updatedSessions
    }
    set({ analytics: updatedAnalytics })
    saveAnalytics(updatedAnalytics)
  },
  
  // Add page to session
  addPageToSession: (sessionId, page) => {
    const state = get()
    const updatedSessions = state.analytics.sessions.map(s =>
      s.sessionId === sessionId
        ? { ...s, pages: [...(s.pages || []), page] }
        : s
    )
    const updatedAnalytics = {
      ...state.analytics,
      sessions: updatedSessions
    }
    set({ analytics: updatedAnalytics })
    saveAnalytics(updatedAnalytics)
  },
  
  // Get analytics summary
  getSummary: () => {
    const state = get()
    const now = Date.now()
    const oneDay = 24 * 60 * 60 * 1000
    const oneWeek = 7 * oneDay
    
    const pageViews = state.analytics.pageViews || []
    const todayViews = pageViews.filter(pv => now - pv.timestamp < oneDay).length
    const weekViews = pageViews.filter(pv => now - pv.timestamp < oneWeek).length
    const totalViews = pageViews.length
    
    const sessions = state.analytics.sessions || []
    const activeSessions = sessions.filter(s => !s.endTime || (now - s.endTime < oneDay)).length
    
    // Most viewed pages
    const pageCounts = {}
    pageViews.forEach(pv => {
      pageCounts[pv.page] = (pageCounts[pv.page] || 0) + 1
    })
    const mostViewedPages = Object.entries(pageCounts)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
    
    // Popular products
    const productViews = state.analytics.productViews || {}
    const productClicks = state.analytics.productClicks || {}
    const popularProducts = Object.keys({ ...productViews, ...productClicks })
      .map(productId => ({
        productId: parseInt(productId),
        views: productViews[productId] || 0,
        clicks: productClicks[productId] || 0,
        total: (productViews[productId] || 0) + (productClicks[productId] || 0)
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)
    
    return {
      todayViews,
      weekViews,
      totalViews,
      activeSessions,
      mostViewedPages,
      popularProducts
    }
  }
}))

export default useAnalyticsStore

