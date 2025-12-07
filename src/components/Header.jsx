import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import useCartStore from '../stores/cartStore'
import useLanguageStore from '../stores/languageStore'
import useAuthStore from '../stores/authStore'
import useCategoryStore from '../stores/categoryStore'
import useProductStore from '../stores/productStore'

const Header = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  
  const itemCount = useCartStore((state) => state.getItemCount())
  const language = useLanguageStore((state) => state.language)
  const setLanguage = useLanguageStore((state) => state.setLanguage)
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)
  const categories = useCategoryStore((state) => state.categories)
  const searchProducts = useProductStore((state) => state.searchProducts)
  
  const searchRef = useRef(null)
  const accountRef = useRef(null)
  const notificationsRef = useRef(null)
  const categoriesRef = useRef(null)

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'rw' : 'en')
  }

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchProducts(searchQuery).slice(0, 5)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, searchProducts])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false)
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setIsCategoriesOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  const handleSignOut = () => {
    signOut()
    setIsAccountOpen(false)
    navigate('/')
  }

  // Mock notifications (in production, this would come from a store/API)
  const notifications = [
    { id: 1, message: 'Your order #12345 has been shipped', time: '2 hours ago' },
    { id: 2, message: 'New products available in your favorite category', time: '1 day ago' }
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group flex-shrink-0"
            aria-label={language === 'en' ? 'Kigali Swim Shop Home' : 'Ahabanza Kigali Swim Shop'}
          >
            <span className="text-2xl animate-float-slow" aria-hidden="true">🏊</span>
            <span className="text-xl font-bold text-primary-600 tracking-tight group-hover:text-primary-700 transition-colors">
              {language === 'en' ? 'Kigali Swim Shop' : 'Ubwoba bw\'amazi Kigali'}
            </span>
          </Link>

            {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative" role="search">
              <label htmlFor="search-input" className="sr-only">
                {language === 'en' ? 'Search products' : 'Shakisha ibicuruzwa'}
              </label>
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setIsSearchOpen(true)
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder={language === 'en' ? 'Search products...' : 'Shakisha ibicuruzwa...'}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label={language === 'en' ? 'Search products' : 'Shakisha ibicuruzwa'}
                aria-autocomplete="list"
                aria-expanded={isSearchOpen && searchResults.length > 0}
                aria-controls="search-results"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              
              {/* Search Results Dropdown */}
              {isSearchOpen && searchResults.length > 0 && (
                <div 
                  id="search-results"
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
                  role="listbox"
                  aria-label={language === 'en' ? 'Search results' : 'Ibyabonetse'}
                >
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.slug}`}
                      onClick={() => {
                        setIsSearchOpen(false)
                        setSearchQuery('')
                      }}
                      className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      role="option"
                      aria-label={language === 'en' ? product.name : product.nameRw}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded mr-3"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded mr-3 flex items-center justify-center">
                          <span className="text-xl">🏊</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{language === 'en' ? product.name : product.nameRw}</p>
                        <p className="text-sm text-gray-600">{product.brand}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/"
              className="relative text-gray-700 hover:text-primary-600 transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-primary-500 after:transition-all hover:after:w-full"
            >
              {language === 'en' ? 'Home' : 'Ahabanza'}
            </Link>
            
            {/* Categories with Mega Menu */}
            <div className="relative" ref={categoriesRef}>
              <button
                onMouseEnter={() => setIsCategoriesOpen(true)}
                className="relative text-gray-700 hover:text-primary-600 transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-primary-500 after:transition-all hover:after:w-full"
              >
                {language === 'en' ? 'Categories' : 'Ubwoko'}
              </button>
              
              {isCategoriesOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl p-6 z-50"
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                >
                  <div className="grid grid-cols-2 gap-4">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/products?category=${category.id}`}
                        onClick={() => setIsCategoriesOpen(false)}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition"
                      >
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                        ) : null}
                        <div className={`flex items-center justify-center w-12 h-12 bg-primary-50 rounded ${category.image ? 'hidden' : ''}`}>
                          <span className="text-2xl">{category.icon}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{language === 'en' ? category.name : category.nameRw}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
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
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search - Mobile */}
            <button
              onClick={() => navigate('/products')}
              className="md:hidden p-2 text-gray-700 hover:text-primary-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 text-xs font-semibold border border-primary-100 rounded-full bg-white/80 shadow-sm hover:bg-primary-50 hover:border-primary-300 text-primary-700 transition-all"
            >
              {language === 'en' ? 'RW' : 'EN'}
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-gray-700 hover:text-primary-600 transition-transform hover:-translate-y-0.5 hidden md:block"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>

            {/* Notifications */}
            <div className="relative hidden md:block" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-gray-700 hover:text-primary-600 transition-transform hover:-translate-y-0.5"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">
                      {language === 'en' ? 'Notifications' : 'Amakuru'}
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div key={notif.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                          <p className="text-sm text-gray-800">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        {language === 'en' ? 'No notifications' : 'Nta makuru'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Account Dropdown */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="flex items-center space-x-2 p-2 text-gray-700 hover:text-primary-600 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              
              {isAccountOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  {user ? (
                    <>
                      <div className="p-4 border-b border-gray-200">
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsAccountOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        {language === 'en' ? 'My Profile' : 'Profil Yanjye'}
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsAccountOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        {language === 'en' ? 'Order History' : 'Amateka y\'Amabwiriza'}
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setIsAccountOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        {language === 'en' ? 'Wishlist' : 'Ibyifuzo'}
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                      >
                        {language === 'en' ? 'Sign Out' : 'Sohoka'}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/signin"
                        onClick={() => setIsAccountOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        {language === 'en' ? 'Sign In' : 'Injira'}
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setIsAccountOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        {language === 'en' ? 'Sign Up' : 'Kwiyandikisha'}
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-primary-600 transition-transform hover:-translate-y-0.5"
              aria-label={language === 'en' ? `Shopping cart with ${itemCount} items` : `Gafuni ifite ibintu ${itemCount}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 bg-accent-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center shadow-soft-glow animate-scale-in"
                  aria-label={`${itemCount} ${language === 'en' ? 'items in cart' : 'ibintu mu gafuni'}`}
                >
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
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="block py-2 pl-4 text-gray-600 hover:text-primary-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {language === 'en' ? category.name : category.nameRw}
              </Link>
            ))}
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
            {!user && (
              <>
                <Link
                  to="/signin"
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {language === 'en' ? 'Sign In' : 'Injira'}
                </Link>
                <Link
                  to="/signup"
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {language === 'en' ? 'Sign Up' : 'Kwiyandikisha'}
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header


