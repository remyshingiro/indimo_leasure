import { create } from 'zustand'
import { products as defaultProducts } from '../data/products'

// Load from localStorage on init
const loadProducts = () => {
  try {
    const stored = localStorage.getItem('adminProducts')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
    // Initialize with default products if localStorage is empty
    localStorage.setItem('adminProducts', JSON.stringify(defaultProducts))
    return defaultProducts
  } catch (e) {
    console.error('Error loading products:', e)
    return defaultProducts
  }
}

// Save to localStorage
const saveProducts = (products) => {
  try {
    localStorage.setItem('adminProducts', JSON.stringify(products))
  } catch (e) {
    console.error('Failed to save products:', e)
  }
}

const useProductStore = create((set, get) => ({
  products: loadProducts(),
  
  // Update products (called from admin dashboard)
  setProducts: (newProducts) => {
    set({ products: newProducts })
    saveProducts(newProducts)
  },
  
  // Add product
  addProduct: (product) => {
    const state = get()
    const newProducts = [...state.products, product]
    set({ products: newProducts })
    saveProducts(newProducts)
  },
  
  // Update product
  updateProduct: (productId, updatedProduct) => {
    const state = get()
    const newProducts = state.products.map(p =>
      p.id === productId ? updatedProduct : p
    )
    set({ products: newProducts })
    saveProducts(newProducts)
  },
  
  // Delete product
  deleteProduct: (productId) => {
    const state = get()
    const newProducts = state.products.filter(p => p.id !== productId)
    set({ products: newProducts })
    saveProducts(newProducts)
  },
  
  // Get product by slug
  getProductBySlug: (slug) => {
    const state = get()
    return state.products.find(p => p.slug === slug)
  },
  
  // Get products by category
  getProductsByCategory: (category) => {
    const state = get()
    if (!category) return state.products
    return state.products.filter(p => p.category === category)
  },
  
  // Search products
  searchProducts: (query) => {
    const state = get()
    const lowerQuery = query.toLowerCase()
    return state.products.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      (p.nameRw && p.nameRw.toLowerCase().includes(lowerQuery)) ||
      (p.description && p.description.toLowerCase().includes(lowerQuery)) ||
      (p.brand && p.brand.toLowerCase().includes(lowerQuery))
    )
  }
}))

export default useProductStore

