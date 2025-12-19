import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, Suspense, lazy } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/Header'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import useAnalyticsStore from './stores/analyticsStore'
import useAuthStore from './stores/authStore'
import { getSessionId } from './utils/analytics'

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

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
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

// === NEW: Wrapper to handle Top Spacing dynamically ===
const MainLayout = ({ children }) => {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <main 
      className={`flex-grow ${isHome ? '' : 'pt-28 lg:pt-32'}`} 
      role="main"
    >
      {children}
    </main>
  )
}

function App() {
  const startSession = useAnalyticsStore((state) => state.startSession)
  const initAuth = useAuthStore((state) => state.init)
  const sessionId = getSessionId()

  useEffect(() => {
    initAuth()
    startSession(sessionId)
  }, [startSession, initAuth, sessionId])

  return (
    <ErrorBoundary>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50">
          <AnalyticsTracker />
          <Header />
          
          {/* Use the new MainLayout wrapper */}
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
                <Route path="/signin" element={<SignIn />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/wishlist" element={<div className="container mx-auto px-4 py-12 text-center"><h1 className="text-2xl font-bold">Wishlist Coming Soon</h1></div>} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </Suspense>
          </MainLayout>
          
          <Footer />
          <WhatsAppButton />
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App