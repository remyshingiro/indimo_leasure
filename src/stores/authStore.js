import { create } from 'zustand'
import { hashPassword, verifyPassword, sanitizeInput, validateEmail, validatePhone } from '../utils/security'
import { saveToDB, getFromDB, isIndexedDBAvailable, fallbackToLocalStorage, getFromLocalStorage } from '../utils/db'
import { rateLimiter } from '../utils/rateLimiter'
import { errorHandler } from '../utils/errorHandler'

// Load user from IndexedDB or localStorage fallback
const loadUser = async () => {
  try {
    if (isIndexedDBAvailable()) {
      const users = await getFromDB('users')
      const currentUser = getFromLocalStorage('currentUser')
      if (currentUser && users) {
        return users.find(u => u.id === currentUser.id) || null
      }
      return null
    }
    return getFromLocalStorage('currentUser')
  } catch (error) {
    errorHandler.logError(error, { context: 'loadUser' })
    return getFromLocalStorage('currentUser')
  }
}

// Load users from IndexedDB or localStorage fallback
const loadUsers = async () => {
  try {
    if (isIndexedDBAvailable()) {
      return await getFromDB('users')
    }
    return getFromLocalStorage('users') || []
  } catch (error) {
    errorHandler.logError(error, { context: 'loadUsers' })
    return getFromLocalStorage('users') || []
  }
}

// Save user to IndexedDB or localStorage fallback
const saveUser = async (user) => {
  try {
    if (user) {
      if (isIndexedDBAvailable()) {
        await saveToDB('users', user)
      }
      fallbackToLocalStorage('currentUser', user)
    } else {
      if (isIndexedDBAvailable()) {
        // Don't delete from users store, just clear current user
      }
      localStorage.removeItem('currentUser')
    }
  } catch (error) {
    errorHandler.logError(error, { context: 'saveUser' })
    if (user) {
      fallbackToLocalStorage('currentUser', user)
    } else {
      localStorage.removeItem('currentUser')
    }
  }
}

// Save users array to IndexedDB or localStorage fallback
const saveUsers = async (users) => {
  try {
    if (isIndexedDBAvailable()) {
      await saveToDB('users', users)
    }
    fallbackToLocalStorage('users', users)
  } catch (error) {
    errorHandler.logError(error, { context: 'saveUsers' })
    fallbackToLocalStorage('users', users)
  }
}

const useAuthStore = create((set, get) => ({
  user: null,
  users: [],
  initialized: false,
  
  // Initialize store (load from storage)
  init: async () => {
    if (get().initialized) return
    
    try {
      const [user, users] = await Promise.all([
        loadUser(),
        loadUsers()
      ])
      
      set({ user, users, initialized: true })
    } catch (error) {
      errorHandler.logError(error, { context: 'authStore.init' })
      set({ initialized: true })
    }
  },
  
  // Sign up
  signUp: async (userData) => {
    const state = get()
    
    // Sanitize and validate input
    const sanitized = {
      name: sanitizeInput(userData.name),
      email: sanitizeInput(userData.email).toLowerCase(),
      phone: sanitizeInput(userData.phone),
      password: userData.password
    }
    
    // Validate email
    if (!validateEmail(sanitized.email)) {
      throw new Error('Invalid email address')
    }
    
    // Validate phone
    if (!validatePhone(sanitized.phone)) {
      throw new Error('Invalid phone number format')
    }
    
    // Validate password strength
    if (!sanitized.password || sanitized.password.length < 6) {
      throw new Error('Password must be at least 6 characters long')
    }
    
    // Check if user already exists
    const existingUser = state.users.find(
      u => u.email === sanitized.email || u.phone === sanitized.phone
    )
    if (existingUser) {
      throw new Error('User with this email or phone already exists')
    }
    
    // Hash password
    const hashedPassword = hashPassword(sanitized.password)
    
    // Create new user
    const newUser = {
      id: Date.now(),
      name: sanitized.name,
      email: sanitized.email,
      phone: sanitized.phone,
      password: hashedPassword, // Store hashed password
      createdAt: new Date().toISOString(),
      orders: []
    }
    
    const updatedUsers = [...state.users, newUser]
    set({ users: updatedUsers, user: newUser })
    await saveUsers(updatedUsers)
    await saveUser(newUser)
    
    return newUser
  },
  
  // Sign in
  signIn: async (emailOrPhone, password) => {
    const state = get()
    
    // Sanitize input
    const sanitized = sanitizeInput(emailOrPhone).toLowerCase()
    
    // Check rate limit
    const rateLimit = rateLimiter.checkLimit(sanitized, 5, 15 * 60 * 1000)
    if (!rateLimit.allowed) {
      throw new Error(rateLimit.message || 'Too many login attempts. Please try again later.')
    }
    
    // Find user
    const user = state.users.find(u =>
      u.email === sanitized || u.phone === sanitized
    )
    
    if (!user) {
      throw new Error('Invalid email/phone or password')
    }
    
    // Verify password
    if (!verifyPassword(password, user.password)) {
      throw new Error('Invalid email/phone or password')
    }
    
    // Reset rate limit on successful login
    rateLimiter.reset(sanitized)
    
    set({ user })
    await saveUser(user)
    return user
  },
  
  // Sign out
  signOut: async () => {
    set({ user: null })
    await saveUser(null)
  },
  
  // Update user profile
  updateProfile: async (updates) => {
    const state = get()
    if (!state.user) return
    
    // Sanitize updates
    const sanitized = {}
    for (const [key, value] of Object.entries(updates)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeInput(value)
      } else {
        sanitized[key] = value
      }
    }
    
    // Validate email if being updated
    if (sanitized.email && !validateEmail(sanitized.email)) {
      throw new Error('Invalid email address')
    }
    
    // Validate phone if being updated
    if (sanitized.phone && !validatePhone(sanitized.phone)) {
      throw new Error('Invalid phone number format')
    }
    
    const updatedUser = { ...state.user, ...sanitized }
    const updatedUsers = state.users.map(u =>
      u.id === state.user.id ? updatedUser : u
    )
    
    set({ user: updatedUser, users: updatedUsers })
    await saveUser(updatedUser)
    await saveUsers(updatedUsers)
  },
  
  // Add order to user's order history
  addOrderToUser: async (order) => {
    const state = get()
    if (!state.user) return
    
    const updatedUser = {
      ...state.user,
      orders: [...(state.user.orders || []), order]
    }
    const updatedUsers = state.users.map(u =>
      u.id === state.user.id ? updatedUser : u
    )
    
    set({ user: updatedUser, users: updatedUsers })
    await saveUser(updatedUser)
    await saveUsers(updatedUsers)
  },
  
  // Get user orders
  getUserOrders: async () => {
    const state = get()
    if (!state.user) return []
    
    try {
      // Try to get from IndexedDB first
      if (isIndexedDBAvailable()) {
        const orders = await getFromDB('orders')
        return orders.filter(order =>
          order.customer?.email === state.user.email ||
          order.customer?.phone === state.user.phone
        )
      }
      
      // Fallback to localStorage
      const allOrders = getFromLocalStorage('orders') || []
      return allOrders.filter(order =>
        order.customer?.email === state.user.email ||
        order.customer?.phone === state.user.phone
      )
    } catch (error) {
      errorHandler.logError(error, { context: 'getUserOrders' })
      return state.user.orders || []
    }
  }
}))

export default useAuthStore

