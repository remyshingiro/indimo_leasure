import { create } from 'zustand'
import { toast } from 'react-hot-toast' // 🚀 ADDED: Import toast

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
      
      // 🛑 INVENTORY CHECK: Using Premium Toast instead of browser alert
      if (currentQty + quantity > (product.stock || 0)) {
        toast.error(`Only ${product.stock || 0} items available in stock.`, {
          id: 'stock-limit', // Prevents toast spamming
        })
        return state 
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

      // ✅ SUCCESS TOAST: Notifies user that the item was added
      toast.success(`${product.name} added to bag!`, {
        icon: '🛒',
        id: 'cart-success', 
      })

      saveCart(newItems)
      return { items: newItems }
    })
  },
  
  removeItem: (productId) => {
    set((state) => {
      const itemToRemove = state.items.find(item => item.id === productId)
      const newItems = state.items.filter(item => item.id !== productId)
      
      // 🗑️ REMOVED TOAST: Visual feedback for deleting an item
      if (itemToRemove) {
        toast(`${itemToRemove.name} removed`, {
          icon: '🗑️',
          id: 'cart-remove',
        })
      }

      saveCart(newItems)
      return { items: newItems }
    })
  },
  
  updateQuantity: (productId, quantity) => {
    set((state) => {
      const itemToUpdate = state.items.find(item => item.id === productId)
      
      // 🛑 INVENTORY CHECK: Using Premium Toast
      if (itemToUpdate && quantity > (itemToUpdate.stock || 0)) {
        toast.error(`Maximum stock reached (${itemToUpdate.stock}).`, {
          id: 'stock-limit',
        })
        return state 
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