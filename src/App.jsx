import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, Suspense, lazy } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/Header'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import useAnalyticsStore from './stores/analyticsStore'
import useAuthStore from './stores/authStore'
import useProductStore from './stores/productStore' 
// 🚀 ADDED: We need the category store to fetch categories globally!
import useCategoryStore from './stores/categoryStore' 
import { getSessionId } from './utils/analytics'
import ProtectedRoute from './components/ProtectedRoute'

// Lazy load pages
const Home = lazy(() => import('./pages/Home'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const FAQ = lazy(() => import('./pages/FAQ'))
const ReturnPolicy = lazy(() => import('./pages/ReturnPolicy'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const Terms = lazy(() => import('./pages/Terms'))
const SignUp = lazy(() => import('./pages/SignUp'))
const SignIn = lazy(() => import('./pages/SignIn'))
const Profile = lazy(() => import('./pages/Profile'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))

// 🚀 ADDED: ScrollToTop Component
// This forces the window to snap to the top every time the route changes
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
      <p className="text-slate-600 font-bold">Loading...</p>
    </div>
  </div>
)

// Analytics Component
const AnalyticsTracker = () => {
  const location = useLocation()
  const trackPageView = useAnalyticsStore((state) => state.trackPageView)
  const addPageToSession = useAnalyticsStore((state) => state.addPageToSession)
  const user = useAuthStore((state) => state.user)
  const sessionId = getSessionId()

  useEffect(() => {
    const page = location.pathname
    trackPageView(page, user?.id || null)
    addPageToSession(sessionId, page)
  }, [location.pathname, trackPageView, addPageToSession, user, sessionId])

  return null
}

// Reduced Top Spacing
const MainLayout = ({ children }) => {
  const location = useLocation()
  // If we are on the home page, no top padding (so the hero image can touch the top)
  // If we are on any other page, use a smaller padding just to clear the navbar height
  const isHome = location.pathname === '/'

  return (
    <main 
      className={`flex-grow ${isHome ? '' : 'pt-16 lg:pt-20'}`} 
      role="main"
    >
      {children}
    </main>
  )
}

function App() {
  const startSession = useAnalyticsStore((state) => state.startSession)
  const sessionId = getSessionId()
  
  const fetchProducts = useProductStore((state) => state.fetchProducts)
  // 🚀 ADDED: Bring in the fetchCategories function
  const fetchCategories = useCategoryStore((state) => state.fetchCategories)
  const initializeAuth = useAuthStore((state) => state.initializeAuth)

  useEffect(() => {
    // Start session tracking
    startSession(sessionId)

    // 🚀 ADDED: Load BOTH products and categories from Firebase instantly
    fetchProducts()
    fetchCategories() 

    // Start listening for Login Status
    const unsubscribe = initializeAuth()
    
    // Cleanup listener when app closes
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [startSession, sessionId, fetchProducts, fetchCategories, initializeAuth])

  return (
    <Router>
      {/* The ScrollToTop component sits right inside the Router! */}
      <ScrollToTop />
      
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen bg-slate-50">
          <AnalyticsTracker />
          <Header />
          
          <MainLayout>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/policies/returns" element={<ReturnPolicy />} />
                <Route path="/policies/privacy" element={<PrivacyPolicy />} />
                <Route path="/policies/terms" element={<Terms />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/wishlist" element={<div className="container mx-auto px-4 py-12 text-center"><h1 className="text-2xl font-bold">Wishlist Coming Soon</h1></div>} />
                
                {/* 🔒 Admin Door is Locked! */}
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
              </Routes>
            </Suspense>
          </MainLayout>
          
          <Footer />
          <WhatsAppButton />
        </div>
      </ErrorBoundary>
    </Router>
  )
}

export default App 