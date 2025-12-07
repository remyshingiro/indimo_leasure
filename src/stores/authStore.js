import { create } from 'zustand'

// Load from localStorage on init
const loadUser = () => {
  try {
    const stored = localStorage.getItem('currentUser')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

// Load users from localStorage
const loadUsers = () => {
  try {
    const stored = localStorage.getItem('users')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Save user to localStorage
const saveUser = (user) => {
  try {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('currentUser')
    }
  } catch (e) {
    console.error('Failed to save user:', e)
  }
}

// Save users array to localStorage
const saveUsers = (users) => {
  try {
    localStorage.setItem('users', JSON.stringify(users))
  } catch (e) {
    console.error('Failed to save users:', e)
  }
}

const useAuthStore = create((set, get) => ({
  user: loadUser(),
  users: loadUsers(),
  
  // Sign up
  signUp: (userData) => {
    const state = get()
    const { name, email, phone, password } = userData
    
    // Check if user already exists
    const existingUser = state.users.find(u => u.email === email || u.phone === phone)
    if (existingUser) {
      throw new Error('User with this email or phone already exists')
    }
    
    // Create new user
    const newUser = {
      id: Date.now(),
      name,
      email,
      phone,
      password, // In production, this should be hashed
      createdAt: new Date().toISOString(),
      orders: []
    }
    
    const updatedUsers = [...state.users, newUser]
    set({ users: updatedUsers, user: newUser })
    saveUsers(updatedUsers)
    saveUser(newUser)
    
    return newUser
  },
  
  // Sign in
  signIn: (emailOrPhone, password) => {
    const state = get()
    const user = state.users.find(u =>
      (u.email === emailOrPhone || u.phone === emailOrPhone) &&
      u.password === password
    )
    
    if (!user) {
      throw new Error('Invalid email/phone or password')
    }
    
    set({ user })
    saveUser(user)
    return user
  },
  
  // Sign out
  signOut: () => {
    set({ user: null })
    saveUser(null)
  },
  
  // Update user profile
  updateProfile: (updates) => {
    const state = get()
    if (!state.user) return
    
    const updatedUser = { ...state.user, ...updates }
    const updatedUsers = state.users.map(u =>
      u.id === state.user.id ? updatedUser : u
    )
    
    set({ user: updatedUser, users: updatedUsers })
    saveUser(updatedUser)
    saveUsers(updatedUsers)
  },
  
  // Add order to user's order history
  addOrderToUser: (order) => {
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
    saveUser(updatedUser)
    saveUsers(updatedUsers)
  },
  
  // Get user orders
  getUserOrders: () => {
    const state = get()
    if (!state.user) return []
    
    // Also check localStorage orders and match by user email/phone
    try {
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      return allOrders.filter(order =>
        order.customer?.email === state.user.email ||
        order.customer?.phone === state.user.phone
      )
    } catch {
      return state.user.orders || []
    }
  }
}))

export default useAuthStore

