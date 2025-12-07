/**
 * Rate limiter to prevent brute force attacks
 */
class RateLimiter {
  constructor() {
    this.attempts = new Map()
    this.lockouts = new Map()
  }

  /**
   * Check if action is allowed based on rate limit
   * @param {string} key - Unique identifier (email, phone, IP, etc.)
   * @param {number} maxAttempts - Maximum attempts allowed
   * @param {number} windowMs - Time window in milliseconds
   * @returns {Object} { allowed: boolean, waitTime?: number }
   */
  checkLimit(key, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    const now = Date.now()
    
    // Check if user is locked out
    const lockout = this.lockouts.get(key)
    if (lockout && now < lockout.expiresAt) {
      const waitTime = Math.ceil((lockout.expiresAt - now) / 1000 / 60)
      return {
        allowed: false,
        waitTime,
        message: `Too many attempts. Please try again in ${waitTime} minute(s).`
      }
    }
    
    // Clear expired lockout
    if (lockout && now >= lockout.expiresAt) {
      this.lockouts.delete(key)
    }
    
    // Get user attempts
    const userAttempts = this.attempts.get(key) || []
    
    // Remove old attempts outside the window
    const recentAttempts = userAttempts.filter(time => now - time < windowMs)
    
    // Check if limit exceeded
    if (recentAttempts.length >= maxAttempts) {
      // Lock out for 15 minutes
      this.lockouts.set(key, {
        expiresAt: now + (15 * 60 * 1000)
      })
      
      return {
        allowed: false,
        waitTime: 15,
        message: 'Too many attempts. Account locked for 15 minutes.'
      }
    }
    
    // Record this attempt
    recentAttempts.push(now)
    this.attempts.set(key, recentAttempts)
    
    return { allowed: true }
  }

  /**
   * Reset attempts for a key (on successful login)
   * @param {string} key - Unique identifier
   */
  reset(key) {
    this.attempts.delete(key)
    this.lockouts.delete(key)
  }

  /**
   * Clear all attempts (for testing or cleanup)
   */
  clear() {
    this.attempts.clear()
    this.lockouts.clear()
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter()

