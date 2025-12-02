import { create } from 'zustand'

// Load from localStorage on init
const loadLanguage = () => {
  try {
    return localStorage.getItem('language-storage') || 'en'
  } catch {
    return 'en'
  }
}

const useLanguageStore = create((set) => ({
  language: loadLanguage(),
  setLanguage: (lang) => {
    try {
      localStorage.setItem('language-storage', lang)
    } catch (e) {
      console.error('Failed to save language:', e)
    }
    set({ language: lang })
  },
  t: (key, translations) => {
    const state = useLanguageStore.getState()
    return translations[state.language]?.[key] || translations.en?.[key] || key
  }
}))

export default useLanguageStore

