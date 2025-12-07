/**
 * Global error handler for unhandled errors
 */

class ErrorHandler {
  constructor() {
    this.errors = []
    this.maxErrors = 50 // Keep last 50 errors
  }

  /**
   * Log error
   * @param {Error} error - Error object
   * @param {Object} context - Additional context
   */
  logError(error, context = {}) {
    const errorLog = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    this.errors.push(errorLog)
    
    // Keep only last N errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift()
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorLog)
    }

    // In production, send to error tracking service
    // if (process.env.NODE_ENV === 'production') {
    //   this.sendToErrorService(errorLog)
    // }
  }

  /**
   * Handle async errors
   * @param {Function} fn - Async function
   * @param {Object} context - Error context
   * @returns {Promise} Wrapped function
   */
  async handleAsync(fn, context = {}) {
    try {
      return await fn()
    } catch (error) {
      this.logError(error, context)
      throw error
    }
  }

  /**
   * Get all logged errors
   * @returns {Array} Array of error logs
   */
  getErrors() {
    return [...this.errors]
  }

  /**
   * Clear all errors
   */
  clearErrors() {
    this.errors = []
  }

  /**
   * Show user-friendly error message
   * @param {Error} error - Error object
   * @returns {string} User-friendly message
   */
  getUserFriendlyMessage(error) {
    const errorMessages = {
      'NetworkError': 'Network connection failed. Please check your internet connection.',
      'QuotaExceededError': 'Storage limit reached. Please clear some data.',
      'TypeError': 'An unexpected error occurred. Please try again.',
      'ReferenceError': 'An error occurred. Please refresh the page.',
    }

    // Check error type
    for (const [errorType, message] of Object.entries(errorMessages)) {
      if (error.name === errorType || error.message.includes(errorType)) {
        return message
      }
    }

    // Default message
    return 'An unexpected error occurred. Please try again or contact support.'
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler()

// Set up global error handlers
if (typeof window !== 'undefined') {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorHandler.logError(
      new Error(event.reason?.message || 'Unhandled promise rejection'),
      { type: 'unhandledrejection', reason: event.reason }
    )
  })

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    errorHandler.logError(
      event.error || new Error(event.message),
      { type: 'uncaught', filename: event.filename, lineno: event.lineno }
    )
  })
}

export default errorHandler

