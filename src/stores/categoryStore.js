import { create } from 'zustand'
import { categories as defaultCategories } from '../data/products'

// Load from localStorage on init
const loadCategories = () => {
  try {
    const stored = localStorage.getItem('adminCategories')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
    // Initialize with default categories if localStorage is empty
    const categoriesWithImages = defaultCategories.map(cat => ({
      ...cat,
      image: cat.image || '' // Add image field if not present
    }))
    localStorage.setItem('adminCategories', JSON.stringify(categoriesWithImages))
    return categoriesWithImages
  } catch (e) {
    console.error('Error loading categories:', e)
    return defaultCategories.map(cat => ({ ...cat, image: cat.image || '' }))
  }
}

// Save to localStorage
const saveCategories = (categories) => {
  try {
    localStorage.setItem('adminCategories', JSON.stringify(categories))
  } catch (e) {
    console.error('Failed to save categories:', e)
  }
}

const useCategoryStore = create((set, get) => ({
  categories: loadCategories(),
  
  // Update categories (called from admin dashboard)
  setCategories: (newCategories) => {
    set({ categories: newCategories })
    saveCategories(newCategories)
  },
  
  // Update category
  updateCategory: (categoryId, updatedCategory) => {
    const state = get()
    const newCategories = state.categories.map(cat =>
      cat.id === categoryId ? updatedCategory : cat
    )
    set({ categories: newCategories })
    saveCategories(newCategories)
  },
  
  // Get category by id
  getCategoryById: (id) => {
    const state = get()
    return state.categories.find(cat => cat.id === id)
  }
}))

export default useCategoryStore

