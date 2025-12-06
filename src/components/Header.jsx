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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl animate-float-slow">🏊</span>
            <span className="text-xl font-bold text-primary-600 tracking-tight group-hover:text-primary-700 transition-colors">
              {language === 'en' ? 'Kigali Swim Shop' : 'Ubwoba bw\'amazi Kigali'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/"
              className="relative text-gray-700 hover:text-primary-600 transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-primary-500 after:transition-all hover:after:w-full"
            >
              {language === 'en' ? 'Home' : 'Ahabanza'}
            </Link>
            <Link
              to="/products"
              className="relative text-gray-700 hover:text-primary-600 transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-primary-500 after:transition-all hover:after:w-full"
            >
              {language === 'en' ? 'Products' : 'Ibicuruzwa'}
            </Link>
            <Link
              to="/about"
              className="relative text-gray-700 hover:text-primary-600 transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-primary-500 after:transition-all hover:after:w-full"
            >
              {language === 'en' ? 'About' : 'Ibyerekeye'}
            </Link>
            <Link
              to="/contact"
              className="relative text-gray-700 hover:text-primary-600 transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-primary-500 after:transition-all hover:after:w-full"
            >
              {language === 'en' ? 'Contact' : 'Twandikire'}
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 text-xs font-semibold border border-primary-100 rounded-full bg-white/80 shadow-sm hover:bg-primary-50 hover:border-primary-300 text-primary-700 transition-all"
            >
              {language === 'en' ? 'RW' : 'EN'}
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-primary-600 transition-transform hover:-translate-y-0.5"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center shadow-soft-glow animate-scale-in">
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


