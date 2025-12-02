import { Link } from 'react-router-dom'
import { useState } from 'react'
import useCartStore from '../stores/cartStore'
import useLanguageStore from '../stores/languageStore'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const itemCount = useCartStore((state) => state.getItemCount())
  const language = useLanguageStore((state) => state.language)
  const setLanguage = useLanguageStore((state) => state.setLanguage)

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'rw' : 'en')
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🏊</span>
            <span className="text-xl font-bold text-primary-600">
              {language === 'en' ? 'Kigali Swim Shop' : 'Ubwoba bw\'amazi Kigali'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition">
              {language === 'en' ? 'Home' : 'Ahabanza'}
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-primary-600 transition">
              {language === 'en' ? 'Products' : 'Ibicuruzwa'}
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary-600 transition">
              {language === 'en' ? 'About' : 'Ibyerekeye'}
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary-600 transition">
              {language === 'en' ? 'Contact' : 'Twandikire'}
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition"
            >
              {language === 'en' ? 'RW' : 'EN'}
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-primary-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <Link
              to="/"
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'Home' : 'Ahabanza'}
            </Link>
            <Link
              to="/products"
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'Products' : 'Ibicuruzwa'}
            </Link>
            <Link
              to="/about"
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'About' : 'Ibyerekeye'}
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              {language === 'en' ? 'Contact' : 'Twandikire'}
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header


