import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useCartStore from '../stores/cartStore'
import useLanguageStore from '../stores/languageStore'
import useAuthStore from '../stores/authStore'
import useCategoryStore from '../stores/categoryStore'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // === STORES (Optimized Selectors) ===
  const cartItems = useCartStore((state) => state.items)
  const { language, setLanguage } = useLanguageStore()
  // FIX: Using specific selectors and 'signOut' to match your store
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)
  const categories = useCategoryStore((state) => state.categories)

  const navigate = useNavigate()
  const location = useLocation()
  
  // Refs for click-outside detection
  const notifRef = useRef(null)
  const userRef = useRef(null)

  // 1. SCROLL EFFECT
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 2. CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setShowUserMenu(false)
  }, [location])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setIsMobileMenuOpen(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
    setIsMobileMenuOpen(false)
    navigate('/')
  }

  // Determine if transparent background should be used
  const isHome = location.pathname === '/'

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || !isHome 
            ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            
            {/* === LOGO === */}
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-3xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">🏊</span>
              <div className={`font-black text-xl tracking-tighter leading-none ${isScrolled || !isHome ? 'text-slate-900' : 'text-white'}`}>
                KIGALI<br />
                <span className={isScrolled || !isHome ? 'text-sky-600' : 'text-sky-300'}>SWIM</span>
              </div>
            </Link>

            {/* === DESKTOP NAVIGATION === */}
            <div className="hidden lg:flex items-center gap-8">
              
              {/* Categories Dropdown */}
              <div className="relative group">
                <button className={`font-bold text-sm uppercase tracking-wide py-2 flex items-center gap-1 ${
                  isScrolled || !isHome ? 'text-slate-600 hover:text-sky-600' : 'text-white/90 hover:text-white'
                }`}>
                  {language === 'en' ? 'Categories' : 'Ibyiciro'} 
                  <span className="text-xs">▼</span>
                </button>
                
                <div className="absolute top-full left-0 w-64 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden p-2">
                    {categories.slice(0, 5).map((cat) => (
                      <Link 
                        key={cat.id} 
                        to={`/products?category=${cat.id}`}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors group/item"
                      >
                        <span className="text-xl bg-slate-100 w-8 h-8 flex items-center justify-center rounded-full group-hover/item:bg-sky-100 transition-colors">
                          {cat.icon}
                        </span>
                        <span className="font-semibold text-slate-700 group-hover/item:text-sky-600">
                          {language === 'en' ? cat.name : cat.nameRw}
                        </span>
                      </Link>
                    ))}
                    <div className="border-t border-slate-100 mt-2 pt-2">
                      <Link to="/products" className="block px-4 py-2 text-center text-xs font-bold text-sky-600 hover:underline">
                        {language === 'en' ? 'View All Products' : 'Reba Byose'}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <Link to="/products" className={`font-bold text-sm uppercase tracking-wide ${
                isScrolled || !isHome ? 'text-slate-600 hover:text-sky-600' : 'text-white/90 hover:text-white'
              }`}>
                {language === 'en' ? 'Shop' : 'Gura'}
              </Link>
            </div>

            {/* === SEARCH BAR (Desktop) === */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <form onSubmit={handleSearch} className="w-full relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'en' ? "Search for gear..." : "Shakisha..."}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-full border focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all ${
                    isScrolled || !isHome 
                      ? 'bg-slate-100 border-transparent focus:bg-white' 
                      : 'bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white focus:text-slate-900 focus:placeholder-slate-400'
                  }`}
                />
                <button type="submit" className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  isScrolled || !isHome ? 'text-slate-400' : 'text-white/70 group-focus-within:text-slate-400'
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
              </form>
            </div>

            {/* === ICONS AREA === */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Language Switcher */}
              <button 
                onClick={() => setLanguage(language === 'en' ? 'rw' : 'en')}
                className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-xs transition-colors ${
                  isScrolled || !isHome 
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {language === 'en' ? 'RW' : 'EN'}
              </button>

              {/* Notification Icon (Demo) */}
              <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-2 rounded-full transition-colors relative ${
                    isScrolled || !isHome 
                      ? 'text-slate-600 hover:bg-slate-100' 
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  {/* <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span> */}
                </button>

                {showNotifications && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fade-in-up">
                    <div className="p-3 border-b border-slate-50 bg-slate-50/50">
                      <span className="font-bold text-slate-800 text-sm">Notifications</span>
                    </div>
                    <div className="p-4 text-center text-slate-400 text-sm">
                      No new notifications
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Icon */}
              <Link 
                to="/cart" 
                className={`p-2 rounded-full transition-colors relative ${
                  isScrolled || !isHome 
                    ? 'text-slate-600 hover:bg-slate-100' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-sky-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* === USER AUTH SECTION === */}
              {user ? (
                <div className="relative" ref={userRef}>
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-400 to-slate-900 p-0.5 shadow-md hover:scale-105 transition-transform"
                  >
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                       {/* Safe check for user.name */}
                       <span className="text-sm font-bold text-slate-900">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                       </span>
                    </div>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fade-in-up">
                      <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                        <p className="font-bold text-slate-900 truncate">{user.name || 'User'}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link to="/profile" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg hover:text-sky-600 font-medium">
                          {language === 'en' ? 'My Profile' : 'Profayili Yanjye'}
                        </Link>
                        {user.role === 'admin' && (
                          <Link to="/admin" className="block px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg font-bold">
                            ⚡ Admin Dashboard
                          </Link>
                        )}
                        <button 
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg font-medium"
                        >
                          {language === 'en' ? 'Logout' : 'Sohoka'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  to="/login"
                  className={`hidden sm:block px-6 py-2.5 rounded-full font-bold text-sm transition-transform hover:scale-105 shadow-lg ${
                    isScrolled || !isHome 
                      ? 'bg-slate-900 text-white hover:bg-slate-800' 
                      : 'bg-white text-slate-900 hover:bg-sky-50'
                  }`}
                >
                  {language === 'en' ? 'Login' : 'Injira'}
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button 
                className={`lg:hidden p-2 ${isScrolled || !isHome ? 'text-slate-900' : 'text-white'}`}
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* === MOBILE MENU SLIDEOUT === */}
      <div className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className={`absolute top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="p-5 flex items-center justify-between border-b border-slate-100">
              <span className="font-black text-xl text-slate-900 tracking-tight">MENU</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-red-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-8">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
                <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </form>

              {/* Mobile Categories */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categories</p>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <Link 
                      key={cat.id} 
                      to={`/products?category=${cat.id}`}
                      className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 hover:bg-sky-50 transition border border-slate-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="text-2xl mb-2">{cat.icon}</span>
                      <span className="text-xs font-bold text-slate-700 text-center">{language === 'en' ? cat.name : cat.nameRw}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Links */}
              <div className="space-y-1">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-slate-50 font-bold text-slate-700">Home</Link>
                <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-slate-50 font-bold text-slate-700">All Products</Link>
                {user && (
                   <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-slate-50 font-bold text-slate-700">My Profile</Link>
                )}
              </div>
            </div>

            {/* Mobile Footer (Auth) */}
            <div className="p-5 border-t border-slate-100 bg-slate-50">
              {!user ? (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full bg-slate-900 text-white font-bold text-center py-4 rounded-xl shadow-lg">
                  Login / Register
                </Link>
              ) : (
                <button onClick={handleSignOut} className="block w-full bg-white text-red-500 font-bold text-center py-4 rounded-xl border border-slate-200 hover:bg-red-50">
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header