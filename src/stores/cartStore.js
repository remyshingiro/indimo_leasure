import { create } from 'zustand'

// Load from localStorage on init
const loadCart = () => {
  try {
    const stored = localStorage.getItem('cart-storage')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Save to localStorage
const saveCart = (items) => {
  try {
    localStorage.setItem('cart-storage', JSON.stringify(items))
  } catch (e) {
    console.error('Failed to save cart:', e)
  }
}

const useCartStore = create((set, get) => ({
  items: loadCart(),
  
  addItem: (product, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find(item => item.id === product.id)
      const currentQty = existingItem ? existingItem.quantity : 0
      
      // 🛑 INVENTORY CHECK: Prevent adding more than available stock
      if (currentQty + quantity > (product.stock || 0)) {
        alert(`Sorry! We only have ${product.stock || 0} of these in stock.`)
        return state // Keep state exactly the same, abort addition
      }

      let newItems
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        newItems = [...state.items, { ...product, quantity }]
      }
      saveCart(newItems)
      return { items: newItems }
    })
  },
  
  removeItem: (productId) => {
    set((state) => {
      const newItems = state.items.filter(item => item.id !== productId)
      saveCart(newItems)
      return { items: newItems }
    })
  },
  
  updateQuantity: (productId, quantity) => {
    set((state) => {
      const itemToUpdate = state.items.find(item => item.id === productId)
      
      // 🛑 INVENTORY CHECK: Prevent increasing quantity past max stock in the cart view
      if (itemToUpdate && quantity > (itemToUpdate.stock || 0)) {
        alert(`Sorry! We only have ${itemToUpdate.stock || 0} of these in stock.`)
        return state // Abort update
      }

      const newItems = state.items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0)
      
      saveCart(newItems)
      return { items: newItems }
    })
  },
  
  clearCart: () => {
    saveCart([])
    set({ items: [] })
  },
  
  getTotal: () => {
    const state = get()
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  },
  
  getItemCount: () => {
    const state = get()
    return state.items.reduce((count, item) => count + item.quantity, 0)
  }
}))

export default useCartStore