import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import useCartStore from '../stores/cartStore'
import useLanguageStore from '../stores/languageStore'
import useProductStore from '../stores/productStore'
import useAnalyticsStore from '../stores/analyticsStore'
import { formatRWF } from '../utils/currency'
import LazyImage from '../components/LazyImage'

const ProductDetail = () => {
  const { slug } = useParams()
  const getProductBySlug = useProductStore((state) => state.getProductBySlug)
  const products = useProductStore((state) => state.products)
  const product = getProductBySlug(slug)
  const addItem = useCartStore((state) => state.addItem)
  const language = useLanguageStore((state) => state.language)
  const trackProductView = useAnalyticsStore((state) => state.trackProductView)

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0)
    if (product) {
      trackProductView(product.id)
    }
  }, [product, trackProductView, slug])
  
  // State
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '')
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [showSizeChart, setShowSizeChart] = useState(false)
  
  // Accordion State
  const [openSection, setOpenSection] = useState('description') // 'description', 'shipping', 'returns'

  // Image Gallery Logic
  const allImages = product ? [product.image, ...(product.images || [])].filter(Boolean) : []

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4 opacity-50">🔍</div>
        <h2 className="text-2xl font-bold mb-2 text-slate-900">
          {language === 'en' ? 'Product not found' : 'Igitangaza ntikibonetse'}
        </h2>
        <Link to="/products" className="mt-6 bg-slate-900 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-slate-800 transition">
          {language === 'en' ? 'Back to Shop' : 'Subira mu Bicuruzwa'}
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem({ ...product, selectedSize, selectedColor }, quantity)
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="bg-white min-h-screen pb-24 lg:pb-0">
      
      {/* 1. BREADCRUMBS */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-4 py-4">
          <nav className="text-xs md:text-sm font-medium text-slate-500 flex items-center gap-2">
            <Link to="/" className="hover:text-primary-600 transition">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary-600 transition">Products</Link>
            <span>/</span>
            <span className="text-slate-900 line-clamp-1 font-bold">{language === 'en' ? product.name : product.nameRw}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-0 lg:px-4 py-0 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-16">
          
          {/* === 2. LEFT COLUMN: GALLERY === */}
          {/* Mobile: Horizontal Swipe. Desktop: Grid */}
          <div className="space-y-4">
            
            {/* MOBILE GALLERY (Instagram Style) */}
            <div className="lg:hidden relative w-full bg-gray-100 aspect-square overflow-hidden group">
               <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide w-full h-full" 
                    onScroll={(e) => {
                       const scrollLeft = e.currentTarget.scrollLeft;
                       const width = e.currentTarget.offsetWidth;
                       setActiveImage(Math.round(scrollLeft / width));
                    }}>
                 {allImages.map((img, idx) => (
                   <div key={idx} className="w-full flex-shrink-0 snap-center h-full">
                     <LazyImage src={img} alt={product.name} className="w-full h-full object-cover" />
                   </div>
                 ))}
               </div>
               
               {/* Dots Indicator */}
               {allImages.length > 1 && (
                 <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                   {allImages.map((_, idx) => (
                     <div key={idx} className={`w-2 h-2 rounded-full transition-all ${activeImage === idx ? 'bg-white w-4' : 'bg-white/50'}`} />
                   ))}
                 </div>
               )}
               
               {product.originalPrice && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">SALE</div>
               )}
            </div>

            {/* DESKTOP GALLERY (Sticky Grid) */}
            <div className="hidden lg:grid grid-cols-1 gap-4">
              <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-slate-100 relative group cursor-zoom-in">
                 <LazyImage 
                    src={allImages[activeImage]} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                 />
                 {product.originalPrice && (
                    <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-xl">SALE</div>
                 )}
              </div>
              
              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto py-2">
                  {allImages.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-slate-900 ring-2 ring-slate-200' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    >
                      <LazyImage src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* === 3. RIGHT COLUMN: DETAILS (Sticky) === */}
          <div className="px-4 pt-6 lg:pt-0 lg:px-0">
            <div className="sticky top-28 space-y-8">
              
              {/* Header */}
              <div>
                <p className="text-sky-600 font-bold tracking-widest text-xs uppercase mb-2">
                  {product.brand || 'Kigali Swim Shop'}
                </p>
                <h1 className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight mb-4">
                  {language === 'en' ? product.name : product.nameRw}
                </h1>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-4xl font-bold text-slate-900">{formatRWF(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-slate-400 line-through decoration-slate-400/50">{formatRWF(product.originalPrice)}</span>
                    )}
                  </div>
                  {product.rating && (
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                      <span className="text-yellow-500">★</span>
                      <span className="text-slate-700 font-bold text-sm">{product.rating}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Selectors */}
              <div className="space-y-6">
                
                {/* Colors */}
                {product.colors?.length > 0 && (
                  <div>
                    <span className="text-sm font-bold text-slate-900 block mb-3">{language === 'en' ? 'Select Color' : 'Hitamo Ibara'}</span>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-6 py-3 rounded-xl border font-bold text-sm transition-all ${
                             selectedColor === color 
                             ? 'border-slate-900 bg-slate-900 text-white shadow-lg transform -translate-y-1' 
                             : 'border-slate-200 text-slate-600 hover:border-slate-400 bg-white'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {product.sizes?.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold text-slate-900">{language === 'en' ? 'Select Size' : 'Hitamo Ingano'}</span>
                      <button onClick={() => setShowSizeChart(true)} className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1">
                        <span>📏</span> {language === 'en' ? 'Size Guide' : 'Inyigisho'}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-14 h-14 rounded-xl border font-bold text-sm flex items-center justify-center transition-all ${
                             selectedSize === size 
                             ? 'border-slate-900 bg-slate-900 text-white shadow-lg transform -translate-y-1' 
                             : 'border-slate-200 text-slate-600 hover:border-slate-400 bg-white'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                   <span className="text-sm font-bold text-slate-900 block mb-3">{language === 'en' ? 'Quantity' : 'Ingano'}</span>
                   <div className="flex items-center gap-4">
                     <div className="flex items-center border border-slate-300 rounded-xl bg-white h-12">
                       <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 text-xl">-</button>
                       <span className="w-8 text-center font-bold text-slate-900">{quantity}</span>
                       <button onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))} className="w-12 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 text-xl">+</button>
                     </div>
                     <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                        {product.stock} {language === 'en' ? 'in stock' : 'biriho'}
                     </span>
                   </div>
                </div>
              </div>

              {/* Desktop Add to Cart */}
              <div className="hidden lg:block pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold py-5 rounded-2xl text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                  <span className="text-2xl">🛒</span>
                  {product.inStock 
                    ? (language === 'en' ? 'Add to Cart' : 'Ongeraho mu Gafuni')
                    : (language === 'en' ? 'Out of Stock' : 'Ntibyabonetse')
                  }
                </button>
                <div className="flex justify-center gap-6 mt-4 text-xs font-bold text-slate-400">
                   <span className="flex items-center gap-1">🚚 24h Delivery</span>
                   <span className="flex items-center gap-1">🛡️ Official Warranty</span>
                   <span className="flex items-center gap-1">💳 Secure Pay</span>
                </div>
              </div>

              {/* Accordions (Clean Details) */}
              <div className="border-t border-slate-100 pt-6 space-y-2">
                
                {/* Description Accordion */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setOpenSection(openSection === 'description' ? '' : 'description')}
                    className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="font-bold text-slate-900">{language === 'en' ? 'Description' : 'Ibisobanuro'}</span>
                    <span className={`transform transition-transform ${openSection === 'description' ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {openSection === 'description' && (
                    <div className="p-4 text-slate-600 text-sm leading-relaxed bg-white animate-fade-in">
                      {language === 'en' ? product.description : product.descriptionRw}
                    </div>
                  )}
                </div>

                {/* Shipping Accordion */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setOpenSection(openSection === 'shipping' ? '' : 'shipping')}
                    className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="font-bold text-slate-900">{language === 'en' ? 'Shipping & Returns' : 'Ubwoba no Gusubiza'}</span>
                    <span className={`transform transition-transform ${openSection === 'shipping' ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {openSection === 'shipping' && (
                    <div className="p-4 text-slate-600 text-sm leading-relaxed bg-white animate-fade-in">
                      <p className="mb-2"><strong>Kigali:</strong> Delivery within 24 hours (2,000 RWF).</p>
                      <p><strong>Upcountry:</strong> Delivery within 48 hours.</p>
                      <p className="mt-2 text-xs text-slate-400">Free returns within 7 days if product is unused.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* === 4. RELATED PRODUCTS === */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-100 px-4 lg:px-0">
             <h2 className="text-2xl font-bold mb-8 text-slate-900">
               {language === 'en' ? 'You Might Also Like' : 'Ushobora Gukunda'}
             </h2>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
               {relatedProducts.map(p => (
                 <Link key={p.id} to={`/products/${p.slug}`} className="group">
                   <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden mb-3">
                     <LazyImage src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   </div>
                   <h3 className="font-bold text-slate-900 line-clamp-1 group-hover:text-sky-600 transition">{language === 'en' ? p.name : p.nameRw}</h3>
                   <p className="text-slate-500 text-sm">{formatRWF(p.price)}</p>
                 </Link>
               ))}
             </div>
          </div>
        )}

      </div>

      {/* === 5. MOBILE FLOATING BUY BAR === */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 lg:hidden z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] safe-area-pb">
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Price</p>
            <p className="text-xl font-black text-slate-900">{formatRWF(product.price * quantity)}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex-1 bg-slate-900 text-white font-bold py-3 px-6 rounded-xl shadow-lg active:scale-95 transition-transform"
          >
            {language === 'en' ? 'Add to Cart' : 'Ongeraho'}
          </button>
        </div>
      </div>

      {/* Size Chart Modal (Same as before) */}
      {showSizeChart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative">
            <button 
              onClick={() => setShowSizeChart(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">
              {language === 'en' ? 'Size Guide' : 'Inyigisho y\'Ingano'}
            </h3>
            <div className="overflow-hidden border border-slate-200 rounded-xl">
               <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                     <tr>
                        <th className="px-4 py-3 text-left font-bold text-slate-900">Size</th>
                        <th className="px-4 py-3 text-left font-bold text-slate-900">Chest</th>
                        <th className="px-4 py-3 text-left font-bold text-slate-900">Waist</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                     <tr><td className="px-4 py-3 font-medium">S</td><td className="px-4 py-3">88-96cm</td><td className="px-4 py-3">73-81cm</td></tr>
                     <tr><td className="px-4 py-3 font-medium">M</td><td className="px-4 py-3">96-104cm</td><td className="px-4 py-3">81-89cm</td></tr>
                     <tr><td className="px-4 py-3 font-medium">L</td><td className="px-4 py-3">104-112cm</td><td className="px-4 py-3">89-97cm</td></tr>
                  </tbody>
               </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail