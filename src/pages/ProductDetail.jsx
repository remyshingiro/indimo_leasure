import { useState, useEffect, useMemo } from 'react' // 🚀 Added useMemo
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

  // State
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [showSizeChart, setShowSizeChart] = useState(false)
  const [openSection, setOpenSection] = useState('description')

  // 🚀 FIX 1: Reset all states and scroll to top when clicking a new product
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (product) {
      trackProductView(product.id)
      // Force reset states so old product data doesn't bleed into the new one
      setActiveImage(0)
      setQuantity(1)
      setSelectedSize(product.sizes?.[0] || '')
      setSelectedColor(product.colors?.[0] || '')
      setOpenSection('description')
    }
  }, [slug, product?.id, trackProductView]) // Re-run when the URL slug changes

  // Image Gallery Logic
  const allImages = product ? [product.image, ...(product.images || [])].filter(Boolean) : []

  // 🚀 FIX 2: Mix Categories for "You Might Also Like"
  const relatedProducts = useMemo(() => {
    if (!product || !products) return [];
    
    // Get all products EXCEPT the one we are currently looking at
    const otherProducts = products.filter(p => p.id !== product.id);
    
    // Shuffle them randomly to mix categories
    const shuffled = otherProducts.sort(() => 0.5 - Math.random());
    
    // Return exactly 4
    return shuffled.slice(0, 4);
  }, [products, product?.id]);


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

  // 🚀 MATH FOR DISCOUNT BADGES & 0 BUG FIX
  const price = Number(product.price) || 0;
  const originalPrice = Number(product.originalPrice) || 0;
  const hasDiscount = originalPrice > price && originalPrice > 0;
  const discountPercentage = hasDiscount 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  const handleAddToCart = () => {
    addItem({ ...product, selectedSize, selectedColor }, quantity)
  }

  // 🚀 FIX 3: SEO Boosting Default Descriptions
  const defaultDescriptionEn = `Upgrade your swimming experience with our premium ${product.name}. Sourced for durability, comfort, and top-tier performance, this is essential gear for both professional athletes and leisure swimmers in Rwanda. Order today from Kigali Swim Shop and enjoy 24-hour fast delivery anywhere in Kigali, complete with secure Mobile Money (MoMo) payments. Dive in with the best!`;
  
  const defaultDescriptionRw = `Gura ${product.nameRw || product.name} nziza cyane muri Kigali Swim Shop. Ibikoresho byizewe byo koga mu Rwanda, bikozwe kubw'ihumure n'igihe kirekire. Kwishyura na MoMo, na delivery yihuse mu masaha 24 i Kigali.`;

  // Check if admin provided a description. If empty, use defaults.
  const displayDescriptionEn = product.description && product.description.trim() !== '' 
    ? product.description 
    : defaultDescriptionEn;
    
  const displayDescriptionRw = product.descriptionRw && product.descriptionRw.trim() !== '' 
    ? product.descriptionRw 
    : defaultDescriptionRw;

  return (
    // 🚀 FIX 1 (Part B): The key={product.id} forces React to destroy and rebuild the component, stopping image glitches!
    <div key={product.id} className="bg-white min-h-screen pb-24 lg:pb-0 animate-fade-in">
      
      {/* 1. BREADCRUMBS */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <nav className="text-xs md:text-sm font-medium text-slate-500 flex items-center gap-2">
            <Link to="/" className="hover:text-sky-600 transition">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-sky-600 transition">Products</Link>
            <span>/</span>
            <span className="text-slate-900 line-clamp-1 font-bold">{language === 'en' ? product.name : product.nameRw}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-0 lg:px-4 py-0 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 xl:gap-16">
          
          {/* === 2. LEFT COLUMN: GALLERY === */}
          <div className="space-y-4">
            
            {/* MOBILE GALLERY */}
            <div className="lg:hidden relative w-full bg-slate-50 aspect-square overflow-hidden group">
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
               
               {allImages.length > 1 && (
                 <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                   {allImages.map((_, idx) => (
                     <div key={idx} className={`w-2 h-2 rounded-full transition-all ${activeImage === idx ? 'bg-white w-4' : 'bg-white/50 border border-black/10'}`} />
                   ))}
                 </div>
               )}
               
               {hasDiscount && (
                 <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 border border-red-400/30">
                   <span>🔥</span>
                   <span>-{discountPercentage}%</span>
                 </div>
               )}
            </div>

            {/* DESKTOP GALLERY */}
            <div className="hidden lg:grid grid-cols-1 gap-4">
              <div className="aspect-square bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 relative group cursor-zoom-in shadow-sm">
                 <LazyImage 
                    src={allImages[activeImage]} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                 />
                 {hasDiscount && (
                   <div className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-black px-4 py-2 rounded-full shadow-xl flex items-center gap-1 border border-red-400/30">
                     <span>🔥</span>
                     <span>-{discountPercentage}%</span>
                   </div>
                 )}
              </div>
              
              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto py-2 scrollbar-hide">
                  {allImages.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-sky-500 ring-2 ring-sky-100 shadow-md' : 'border-transparent opacity-70 hover:opacity-100 hover:shadow-sm'}`}
                    >
                      <LazyImage src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* === 3. RIGHT COLUMN: DETAILS === */}
          <div className="px-4 pt-6 pb-12 lg:pt-0 lg:px-0">
            <div className="sticky top-28 space-y-6 lg:space-y-8">
              
              {/* Header */}
              <div>
                <p className="text-sky-600 font-bold tracking-widest text-xs uppercase mb-2">
                  {product.brand || 'Kigali Swim Shop'}
                </p>
                <h1 className="text-2xl lg:text-4xl xl:text-5xl font-black text-slate-900 leading-tight mb-4">
                  {language === 'en' ? product.name : product.nameRw}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                  <div className="flex items-baseline gap-2 md:gap-3">
                    <span className="text-3xl lg:text-4xl font-black text-slate-900">{formatRWF(price)}</span>
                    {hasDiscount && (
                      <span className="text-lg text-slate-400 line-through decoration-slate-400/50 font-medium">
                        {formatRWF(originalPrice)}
                      </span>
                    )}
                  </div>
                  
                  {hasDiscount && (
                    <div className="hidden sm:flex bg-gradient-to-r from-red-50 text-red-600 border border-red-100 text-xs font-black px-2 py-1 rounded-md items-center gap-1">
                      -{discountPercentage}% OFF
                    </div>
                  )}

                  {product.rating && (
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100 ml-auto">
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
                          className={`px-6 py-2.5 rounded-xl border font-bold text-sm transition-all shadow-sm ${
                             selectedColor === color 
                             ? 'border-sky-500 bg-sky-50 text-sky-700 ring-2 ring-sky-100' 
                             : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 bg-white'
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
                          className={`w-12 h-12 md:w-14 md:h-14 rounded-xl border font-bold text-sm flex items-center justify-center transition-all shadow-sm ${
                             selectedSize === size 
                             ? 'border-sky-500 bg-sky-50 text-sky-700 ring-2 ring-sky-100' 
                             : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 bg-white'
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
                     <div className="flex items-center border border-slate-300 rounded-xl bg-white h-12 w-32 shadow-sm">
                       <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-l-xl text-xl transition-colors">-</button>
                       <span className="w-10 text-center font-bold text-slate-900 border-x border-slate-100 h-full flex items-center justify-center">{quantity}</span>
                       <button onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))} className="flex-1 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-r-xl text-xl transition-colors">+</button>
                     </div>
                     <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-md border border-green-200">
                        {product.stock} {language === 'en' ? 'in stock' : 'biriho'}
                     </span>
                   </div>
                </div>
              </div>

              {/* Desktop Add to Cart */}
              <div className="hidden lg:block pt-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:from-slate-300 disabled:to-slate-400 text-white font-black py-5 rounded-2xl text-lg shadow-[0_10px_20px_rgba(2,_132,_199,_0.3)] hover:shadow-[0_15px_30px_rgba(2,_132,_199,_0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 border border-sky-400/20"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  {product.inStock 
                    ? (language === 'en' ? 'Add to Cart' : 'Ongeraho mu Gafuni')
                    : (language === 'en' ? 'Out of Stock' : 'Ntibyabonetse')
                  }
                </button>
                <div className="flex justify-center gap-6 mt-6 text-xs font-bold text-slate-500">
                   <span className="flex items-center gap-1.5">🚚 24h Delivery</span>
                   <span className="flex items-center gap-1.5">🛡️ Official Warranty</span>
                   <span className="flex items-center gap-1.5">💳 Secure Pay</span>
                </div>
              </div>

              {/* Accordions (Clean Details) */}
              <div className="border-t border-slate-100 pt-8 space-y-3">
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:border-slate-300 transition-colors">
                  <button 
                    onClick={() => setOpenSection(openSection === 'description' ? '' : 'description')}
                    className="w-full flex justify-between items-center p-4 lg:p-5"
                  >
                    <span className="font-bold text-slate-900">{language === 'en' ? 'Description' : 'Ibisobanuro'}</span>
                    <span className={`transform transition-transform text-slate-400 ${openSection === 'description' ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {openSection === 'description' && (
                    <div className="p-4 lg:p-5 text-slate-600 text-sm leading-relaxed border-t border-slate-50 bg-slate-50/50 animate-fade-in">
                      {/* 🚀 Render the new dynamic descriptions */}
                      {language === 'en' ? displayDescriptionEn : displayDescriptionRw}
                    </div>
                  )}
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:border-slate-300 transition-colors">
                  <button 
                    onClick={() => setOpenSection(openSection === 'shipping' ? '' : 'shipping')}
                    className="w-full flex justify-between items-center p-4 lg:p-5"
                  >
                    <span className="font-bold text-slate-900">{language === 'en' ? 'Shipping & Returns' : 'Ubwoba no Gusubiza'}</span>
                    <span className={`transform transition-transform text-slate-400 ${openSection === 'shipping' ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {openSection === 'shipping' && (
                    <div className="p-4 lg:p-5 text-slate-600 text-sm leading-relaxed border-t border-slate-50 bg-slate-50/50 animate-fade-in">
                      <p className="mb-2"><strong>Kigali:</strong> Delivery within 24 hours (2,000 RWF).</p>
                      <p><strong>Upcountry:</strong> Delivery within 48 hours.</p>
                      <p className="mt-3 p-3 bg-blue-50 text-blue-800 rounded-lg text-xs font-medium border border-blue-100">
                        Free returns within 7 days if product is unused and in original packaging.
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* === 4. RELATED PRODUCTS === */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 lg:mt-24 pt-12 border-t border-slate-100 px-4 lg:px-0">
             <h2 className="text-2xl font-black mb-8 text-slate-900">
               {language === 'en' ? 'You Might Also Like' : 'Ushobora Gukunda'}
             </h2>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
               {relatedProducts.map(p => {
                 const relPrice = Number(p.price) || 0;
                 const relOrig = Number(p.originalPrice) || 0;
                 return (
                   <Link key={p.id} to={`/products/${p.slug}`} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                     <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden">
                       <LazyImage src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       {relOrig > relPrice && relOrig > 0 && (
                         <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                           SALE
                         </div>
                       )}
                     </div>
                     <div className="p-3 md:p-4">
                       <h3 className="font-bold text-slate-800 text-sm md:text-base line-clamp-1 mb-1 group-hover:text-sky-600 transition">{language === 'en' ? p.name : p.nameRw}</h3>
                       <p className="font-black text-sky-600 text-sm">{formatRWF(relPrice)}</p>
                     </div>
                   </Link>
                 )
               })}
             </div>
          </div>
        )}

      </div>

      {/* === 5. MOBILE FLOATING BUY BAR === */}
      <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 lg:hidden z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pb-safe">
        <div className="flex items-center gap-4 max-w-lg mx-auto">
          <div className="flex-1 pl-2">
            <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Total</p>
            <p className="text-lg sm:text-xl font-black text-slate-900 leading-none">{formatRWF(price * quantity)}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex-[1.5] bg-gradient-to-r from-sky-500 to-blue-600 disabled:from-slate-300 disabled:to-slate-400 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 text-sm sm:text-base border border-sky-400/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            {language === 'en' ? 'Add to Cart' : 'Ongeraho'}
          </button>
        </div>
      </div>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative border border-slate-100">
            <button 
              onClick={() => setShowSizeChart(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition"
            >
              ✕
            </button>
            <h3 className="text-2xl font-black mb-6 text-slate-900 flex items-center gap-2">
              <span>📏</span> {language === 'en' ? 'Size Guide' : 'Inyigisho y\'Ingano'}
            </h3>
            <div className="overflow-hidden border border-slate-200 rounded-xl shadow-sm">
               <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                     <tr>
                        <th className="px-4 py-3 text-left font-bold text-slate-900">Size</th>
                        <th className="px-4 py-3 text-left font-bold text-slate-900">Chest</th>
                        <th className="px-4 py-3 text-left font-bold text-slate-900">Waist</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                     <tr className="hover:bg-slate-50 transition"><td className="px-4 py-3 font-bold text-slate-900">S</td><td className="px-4 py-3 text-slate-600">88-96cm</td><td className="px-4 py-3 text-slate-600">73-81cm</td></tr>
                     <tr className="hover:bg-slate-50 transition"><td className="px-4 py-3 font-bold text-slate-900">M</td><td className="px-4 py-3 text-slate-600">96-104cm</td><td className="px-4 py-3 text-slate-600">81-89cm</td></tr>
                     <tr className="hover:bg-slate-50 transition"><td className="px-4 py-3 font-bold text-slate-900">L</td><td className="px-4 py-3 text-slate-600">104-112cm</td><td className="px-4 py-3 text-slate-600">89-97cm</td></tr>
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