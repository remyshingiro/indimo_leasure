import CryptoJS from 'crypto-js'

/**
 * Hash password using SHA-256
 * @param {string} password - Plain text password
 * @returns {string} Hashed password
 */
export const hashPassword = (password) => {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string')
  }
  return CryptoJS.SHA256(password).toString()
}

/**
 * Verify password against hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password to compare against
 * @returns {boolean} True if password matches hash
 */
export const verifyPassword = (password, hash) => {
  if (!password || !hash) return false
  return hashPassword(password) === hash
}

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - User input string
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return input
  }
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/&lt;/g, '')
    .replace(/&gt;/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
}

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid email
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Validate phone number format (international format)
 * @param {string} phone - Phone number
 * @returns {boolean} True if valid phone
 */
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false
  // Remove spaces and validate international format
  const cleaned = phone.replace(/\s/g, '')
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(cleaned)
}

/**
 * Sanitize and validate form data
 * @param {Object} data - Form data object
 * @returns {Object} Sanitized and validated data
 */
export const sanitizeFormData = (data) => {
  const sanitized = {}
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value)
    } else {
      sanitized[key] = value
    }
  }
  return sanitized
}

/**
 * Encrypt sensitive data (for future use with encryption key)
 * @param {any} data - Data to encrypt
 * @param {string} key - Encryption key
 * @returns {string} Encrypted data
 */
export const encryptData = (data, key) => {
  if (!key) {
    console.warn('No encryption key provided, data will not be encrypted')
    return JSON.stringify(data)
  }
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString()
}

/**
 * Decrypt sensitive data
 * @param {string} encryptedData - Encrypted data string
 * @param {string} key - Decryption key
 * @returns {any} Decrypted data
 */
export const decryptData = (encryptedData, key) => {
  if (!key) {
    console.warn('No decryption key provided')
    return null
  }
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  } catch (error) {
    console.error('Decryption failed:', error)
    return null
  }
}

