import { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import useProductStore from '../stores/productStore'
import useCategoryStore from '../stores/categoryStore'
import useCartStore from '../stores/cartStore'
import useLanguageStore from '../stores/languageStore'
import { formatRWF } from '../utils/currency'
import LazyImage from '../components/LazyImage'

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlSearchQuery = searchParams.get('search') || ''
  const urlCategory = searchParams.get('category')

  const products = useProductStore((state) => state.products)
  const categories = useCategoryStore((state) => state.categories)
  const addItem = useCartStore((state) => state.addItem)
  const language = useLanguageStore((state) => state.language)

  const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'all')
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [sortBy, setSortBy] = useState('newest')
  const [showPriceFilter, setShowPriceFilter] = useState(false)
  
  const filterRef = useRef(null)

  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory)
    }
  }, [urlCategory])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowPriceFilter(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(urlSearchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(urlSearchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      return matchesSearch && matchesCategory && matchesPrice
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      return b.id - a.id
    })
  }, [products, urlSearchQuery, selectedCategory, priceRange, sortBy])

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId)
    setSearchParams(prev => {
      if (catId === 'all') {
        prev.delete('category')
      } else {
        prev.set('category', catId)
      }
      return prev
    })
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      
      {/* === 1. RESPONSIVE HORIZONTAL CATEGORY SCROLL === */}
      {/* -mx-4 px-4: Allows scroll to touch screen edges on mobile 
         scrollbar-none: Inline style ensures scrollbar is hidden
         snap-x: Makes scrolling feel snappy on touch
      */}
      <div 
        className="mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex gap-2 md:gap-3 min-w-max">
          <button
            onClick={() => handleCategoryClick('all')}
            className={`snap-center flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full border transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
            }`}
          >
            <span className="font-bold whitespace-nowrap text-sm md:text-base">
              {language === 'en' ? 'All' : 'Byose'}
            </span>
          </button>
          
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`snap-center flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full border transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              <span className="text-base md:text-lg">{cat.icon}</span>
              <span className="font-bold whitespace-nowrap text-sm md:text-base">
                {language === 'en' ? cat.name : cat.nameRw}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* === 2. TOOLBAR === */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        
        <div>
          {urlSearchQuery ? (
             <h1 className="text-lg md:text-xl font-bold text-slate-900">
               {language === 'en' ? 'Results for' : 'Ibisubizo'}: <span className="text-sky-600">"{urlSearchQuery}"</span>
             </h1>
          ) : (
             <p className="text-slate-500 font-medium text-sm md:text-base">
               {language === 'en' ? 'Showing' : 'Ibicuruzwa'} <span className="text-slate-900 font-bold">{filteredProducts.length}</span> {language === 'en' ? 'items' : ''}
             </p>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {/* Price Filter */}
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setShowPriceFilter(!showPriceFilter)}
              className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-lg border font-bold text-xs md:text-sm whitespace-nowrap transition-colors ${
                priceRange[1] < 1000000 
                  ? 'bg-sky-50 text-sky-700 border-sky-200' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>💰 {language === 'en' ? 'Price' : 'Igiciro'}</span>
            </button>

            {showPriceFilter && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 p-6 z-30 animate-fade-in-up">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-slate-900">{language === 'en' ? 'Max Price' : 'Igiciro Ntarengwa'}</span>
                  <span className="text-sky-600 font-bold">{formatRWF(priceRange[1])}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                />
                <button 
                  onClick={() => setPriceRange([0, 1000000])}
                  className="w-full mt-4 py-2 text-sm text-slate-400 hover:text-red-500 font-medium"
                >
                  {language === 'en' ? 'Reset' : 'Siba'}
                </button>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white pl-3 pr-8 py-2 md:pl-4 md:pr-10 md:py-2.5 rounded-lg border border-slate-200 font-bold text-slate-700 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer hover:bg-slate-50"
            >
              <option value="newest">{language === 'en' ? 'Sort: Newest' : 'Bishya'}</option>
              <option value="price-low">{language === 'en' ? 'Price: Low to High' : 'Igiciro: Gito'}</option>
              <option value="price-high">{language === 'en' ? 'Price: High to Low' : 'Igiciro: Hejuru'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* === 3. PRODUCT GRID === */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                <Link to={`/products/${product.slug}`}>
                  <LazyImage
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    fallback={<div className="w-full h-full flex items-center justify-center text-2xl md:text-4xl">🏊</div>}
                  />
                </Link>
                
                {product.originalPrice && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded shadow-sm">
                    SALE
                  </div>
                )}

                {/* Mobile Add Button (Always Visible on bottom right of image) */}
                <button
                  onClick={(e) => { e.preventDefault(); addItem(product); }}
                  className="lg:hidden absolute bottom-2 right-2 bg-white/90 text-slate-900 w-8 h-8 rounded-full shadow-md flex items-center justify-center active:scale-95 transition-transform"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                </button>

                {/* Desktop Add Button (Hover) */}
                <button
                  onClick={(e) => { e.preventDefault(); addItem(product); }}
                  className="hidden lg:flex absolute bottom-4 right-4 bg-white text-slate-900 w-10 h-10 rounded-full shadow-xl items-center justify-center translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-sky-500 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                </button>
              </div>

              <div className="p-3 md:p-4">
                <p className="text-[10px] md:text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider line-clamp-1">{product.brand}</p>
                <Link to={`/products/${product.slug}`}>
                  <h3 className="font-bold text-slate-900 text-sm md:text-base mb-2 line-clamp-1 hover:text-sky-600 transition-colors">
                    {language === 'en' ? product.name : product.nameRw}
                  </h3>
                </Link>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                    <span className="font-black text-sm md:text-lg text-slate-900">{formatRWF(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-[10px] md:text-xs text-slate-400 line-through">{formatRWF(product.originalPrice)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="text-4xl md:text-6xl mb-4 opacity-50">🔍</div>
          <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
            {language === 'en' ? 'No products found' : 'Nta bicuruzwa byabonetse'}
          </h3>
          <button 
            onClick={() => {
              setSearchParams({})
              setSelectedCategory('all')
              setPriceRange([0, 1000000])
            }}
            className="mt-4 bg-slate-900 text-white px-6 py-3 rounded-full font-bold hover:bg-slate-800 transition"
          >
            {language === 'en' ? 'Clear Filters' : 'Siba Byose'}
          </button>
        </div>
      )}
    </div>
  )
}

export default Products