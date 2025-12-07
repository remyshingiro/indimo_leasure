// Analytics utility functions
// These are convenience wrappers around the analytics store

let sessionId = null

// Initialize session on page load
export const initSession = () => {
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    // Session will be started when analytics store is imported
  }
  return sessionId
}

// Get current session ID
export const getSessionId = () => {
  if (!sessionId) {
    initSession()
  }
  return sessionId
}

