import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import useCartStore from '../stores/cartStore'
import useLanguageStore from '../stores/languageStore'
import useProductStore from '../stores/productStore'
import useAnalyticsStore from '../stores/analyticsStore'
import { formatRWF } from '../utils/currency'
import LazyImage from '../components/LazyImage' // Using your custom component for better performance

const ProductDetail = () => {
  const { slug } = useParams()
  const getProductBySlug = useProductStore((state) => state.getProductBySlug)
  const products = useProductStore((state) => state.products)
  const product = getProductBySlug(slug)
  const addItem = useCartStore((state) => state.addItem)
  const language = useLanguageStore((state) => state.language)
  const trackProductView = useAnalyticsStore((state) => state.trackProductView)

  // Track view on load
  useEffect(() => {
    if (product) {
      trackProductView(product.id)
    }
  }, [product, trackProductView])
  
  // State
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '')
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [showSizeChart, setShowSizeChart] = useState(false)

  // Create an array of all images (Main + Thumbnails) for the gallery
  const allImages = product ? [product.image, ...(product.images || [])].filter(Boolean) : []

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-4xl">
          🔍
        </div>
        <h2 className="text-3xl font-bold mb-2 text-slate-800">
          {language === 'en' ? 'Product not found' : 'Igitangaza ntikibonetse'}
        </h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          {language === 'en' 
            ? "We couldn't find the gear you're looking for. It might have been moved or sold out." 
            : "Ntibishoboka kubona ibikoresho ushaka. Birashobora kuba byimuwe cyangwa byagurishijwe."}
        </p>
        <Link 
          to="/products" 
          className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition shadow-lg hover:shadow-xl"
        >
          {language === 'en' ? 'Back to Shop' : 'Subira mu Bicuruzwa'}
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem({ ...product, selectedSize, selectedColor }, quantity)
    // Optional: You could replace this alert with a toast notification later
    // alert(language === 'en' ? 'Added to cart!' : 'Byongeyeho mu gafuni!')
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="bg-white min-h-screen pb-24 lg:pb-0">
      
      {/* 1. BREADCRUMBS & HEADER */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm font-medium text-slate-500 flex items-center gap-2">
            <Link to="/" className="hover:text-primary-600 transition">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary-600 transition">Products</Link>
            <span>/</span>
            <span className="text-slate-900 line-clamp-1">{language === 'en' ? product.name : product.nameRw}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* === 2. LEFT COLUMN: IMMERSIVE VISUALS === */}
          {/* On Desktop: Use col-span-7. On Mobile: Standard flow */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Image Showcase */}
            <div className="aspect-[4/3] lg:aspect-square w-full bg-gray-100 rounded-3xl overflow-hidden shadow-sm relative group">
              <LazyImage
                src={allImages[activeImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
                fallback={
                  <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                    <span className="text-9xl animate-float-slow">🏊</span>
                  </div>
                }
              />
              
              {/* Badge */}
              {product.originalPrice && (
                <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  SALE
                </div>
              )}
            </div>

            {/* Thumbnails Grid (Only if multiple images) */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      activeImage === index 
                        ? 'border-primary-600 ring-2 ring-primary-100 scale-95' 
                        : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <LazyImage 
                      src={img} 
                      alt={`View ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Description (Desktop Placement - Better for reading flow) */}
            <div className="hidden lg:block mt-12 prose prose-lg text-slate-600 max-w-none">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {language === 'en' ? 'Description' : 'Ibisobanuro'}
              </h3>
              <p className="leading-relaxed">
                {language === 'en' ? product.description : product.descriptionRw}
              </p>
            </div>
          </div>

          {/* === 3. RIGHT COLUMN: STICKY CONTROL PANEL === */}
          {/* Use col-span-5 and sticky positioning */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-24 space-y-8 p-6 lg:p-8 bg-white rounded-3xl lg:shadow-xl lg:shadow-slate-200/50 lg:border lg:border-slate-100">
              
              {/* Header Info */}
              <div className="space-y-2">
                <p className="text-primary-600 font-bold tracking-wider text-sm uppercase">
                  {product.brand || 'Kigali Swim Shop'}
                </p>
                <h1 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                  {language === 'en' ? product.name : product.nameRw}
                </h1>
                
                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < Math.floor(product.rating) ? '★' : '☆'}</span>
                      ))}
                    </div>
                    <span className="text-slate-400 text-sm font-medium">
                      ({product.reviews} {language === 'en' ? 'verified reviews' : 'ibitekerezo'})
                    </span>
                  </div>
                )}
              </div>

              {/* Price Block */}
              <div className="flex items-end gap-3 pb-6 border-b border-slate-100">
                <p className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                  {formatRWF(product.price)}
                </p>
                {product.originalPrice && (
                  <div className="mb-2">
                    <p className="text-lg text-slate-400 line-through font-medium">
                      {formatRWF(product.originalPrice)}
                    </p>
                  </div>
                )}
              </div>

              {/* Selectors */}
              <div className="space-y-6">
                
                {/* Color Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <label className="text-sm font-bold text-slate-900 block mb-3">
                      {language === 'en' ? 'Select Color' : 'Hitamo Ibara'}
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 border ${
                            selectedColor === color
                              ? 'bg-slate-900 text-white border-slate-900 shadow-md transform -translate-y-0.5'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-bold text-slate-900">
                        {language === 'en' ? 'Select Size' : 'Hitamo Ingano'}
                      </label>
                      <button 
                        onClick={() => setShowSizeChart(true)}
                        className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
                      >
                        <span className="text-lg">📏</span>
                        {language === 'en' ? 'Size Guide' : 'Inyigisho'}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-14 h-14 flex items-center justify-center rounded-lg font-bold text-sm transition-all duration-200 border ${
                            selectedSize === size
                              ? 'bg-slate-900 text-white border-slate-900 shadow-md transform -translate-y-0.5'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-slate-900 text-xl font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-slate-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                      className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-slate-900 text-xl font-bold"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    {product.stock} {language === 'en' ? 'in stock' : 'biriho'}
                  </div>
                </div>
              </div>

              {/* Desktop Actions */}
              <div className="hidden lg:flex flex-col gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-5 rounded-xl text-lg shadow-lg hover:shadow-primary-500/30 transition-all duration-200 transform active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  {product.inStock 
                    ? (language === 'en' ? 'Add to Cart' : 'Ongeraho mu Gafuni')
                    : (language === 'en' ? 'Out of Stock' : 'Ntibyabonetse')
                  }
                </button>
                
                {/* Trust Signals */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-500 pt-2">
                   <div className="flex flex-col items-center gap-1">
                      <span className="text-xl">🚚</span>
                      <span>Fast Delivery</span>
                   </div>
                   <div className="flex flex-col items-center gap-1">
                      <span className="text-xl">🔒</span>
                      <span>Secure Pay</span>
                   </div>
                   <div className="flex flex-col items-center gap-1">
                      <span className="text-xl">↩️</span>
                      <span>Easy Return</span>
                   </div>
                </div>
              </div>

              {/* Description (Mobile Only) */}
              <div className="lg:hidden pt-6 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2">Description</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                   {language === 'en' ? product.description : product.descriptionRw}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* === 4. MOBILE FLOATING ACTION BAR (Fixed Bottom) === */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 lg:hidden z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div className="flex gap-3">
          <div className="flex-1">
            <p className="text-xs text-slate-500 uppercase font-bold">Total</p>
            <p className="text-xl font-black text-slate-900">{formatRWF(product.price * quantity)}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-lg shadow-lg active:scale-95 transition-transform"
          >
            {language === 'en' ? 'Add to Cart' : 'Ongeraho'}
          </button>
        </div>
      </div>

      {/* === 5. RELATED PRODUCTS === */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-slate-900">
              {language === 'en' ? 'You Might Also Like' : 'Ushobora Gukunda'}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.slug}`}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group"
                >
                  <div className="aspect-[4/5] bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
                    <LazyImage src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">{language === 'en' ? p.name : p.nameRw}</h3>
                  <p className="text-primary-600 font-bold">{formatRWF(p.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl relative">
            <button 
              onClick={() => setShowSizeChart(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">
              {language === 'en' ? 'Size Guide' : 'Inyigisho y\'Ingano'}
            </h3>
            <div className="space-y-4">
               {/* Example Table */}
               <div className="overflow-hidden border border-slate-200 rounded-lg">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                     <thead className="bg-slate-50">
                        <tr>
                           <th className="px-4 py-3 text-left font-bold text-slate-900">Size</th>
                           <th className="px-4 py-3 text-left font-bold text-slate-900">Chest (cm)</th>
                           <th className="px-4 py-3 text-left font-bold text-slate-900">Waist (cm)</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-200">
                        <tr><td className="px-4 py-3 font-medium">S</td><td className="px-4 py-3">88-96</td><td className="px-4 py-3">73-81</td></tr>
                        <tr><td className="px-4 py-3 font-medium">M</td><td className="px-4 py-3">96-104</td><td className="px-4 py-3">81-89</td></tr>
                        <tr><td className="px-4 py-3 font-medium">L</td><td className="px-4 py-3">104-112</td><td className="px-4 py-3">89-97</td></tr>
                     </tbody>
                  </table>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail