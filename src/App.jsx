import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import About from './pages/About'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import ReturnPolicy from './pages/ReturnPolicy'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Profile from './pages/Profile'
import AdminDashboard from './pages/admin/Dashboard'
import useAnalyticsStore from './stores/analyticsStore'
import useAuthStore from './stores/authStore'
import { getSessionId } from './utils/analytics'

// Component to track page views
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

function App() {
  const startSession = useAnalyticsStore((state) => state.startSession)
  const sessionId = getSessionId()

  useEffect(() => {
    startSession(sessionId)
  }, [startSession, sessionId])

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <AnalyticsTracker />
        <Header />
        <main className="flex-grow">
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
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </Router>
  )
}

export default App
