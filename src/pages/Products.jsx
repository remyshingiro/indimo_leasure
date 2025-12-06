import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { products, categories } from '../data/products'
import { searchProducts, getProductsByCategory } from '../data/products'
import useLanguageStore from '../stores/languageStore'
import { formatRWF } from '../utils/currency'

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const language = useLanguageStore((state) => state.language)
  
  const categoryFilter = searchParams.get('category') || ''
  const searchQuery = searchParams.get('search') || ''
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [selectedBrand, setSelectedBrand] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Get unique brands
  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(products.map(p => p.brand))]
    return uniqueBrands.sort()
  }, [])

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = categoryFilter 
      ? getProductsByCategory(categoryFilter)
      : products

    if (searchQuery) {
      filtered = searchProducts(searchQuery).filter(p => 
        !categoryFilter || p.category === categoryFilter
      )
    }

    if (selectedBrand) {
      filtered = filtered.filter(p => p.brand === selectedBrand)
    }

    filtered = filtered.filter(p => 
      p.price >= priceRange[0] && p.price <= priceRange[1]
    )

    return filtered
  }, [categoryFilter, searchQuery, selectedBrand, priceRange])

  const handleSearch = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const query = formData.get('search')
    if (query) {
      setSearchParams({ search: query, ...(categoryFilter && { category: categoryFilter }) })
    } else {
      setSearchParams(categoryFilter ? { category: categoryFilter } : {})
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-72 card-soft h-fit sticky top-24`}>
          <div className="flex items-center justify-between mb-4 md:hidden">
            <h2 className="text-xl font-bold">Filters</h2>
            <button onClick={() => setShowFilters(false)} className="text-gray-600">✕</button>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">
              {language === 'en' ? 'Category' : 'Ubwoko'}
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setSearchParams({})}
                className={`block w-full text-left px-3 py-2 rounded ${
                  !categoryFilter ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                }`}
              >
                {language === 'en' ? 'All Categories' : 'Ubwoko Bwose'}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSearchParams({ category: cat.id })}
                  className={`block w-full text-left px-3 py-2 rounded ${
                    categoryFilter === cat.id ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                  }`}
                >
                  {language === 'en' ? cat.name : cat.nameRw}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">
              {language === 'en' ? 'Price Range' : 'Umubare w\'amafaranga'}
            </h3>
            <input
              type="range"
              min="0"
              max="100000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{formatRWF(priceRange[0])}</span>
              <span>{formatRWF(priceRange[1])}</span>
            </div>
          </div>

          {/* Brand Filter */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">
              {language === 'en' ? 'Brand' : 'Ikirango'}
            </h3>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">{language === 'en' ? 'All Brands' : 'Ikirango Cyose'}</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setPriceRange([0, 100000])
              setSelectedBrand('')
              setSearchParams({})
            }}
            className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded transition"
          >
            {language === 'en' ? 'Clear Filters' : 'Siba Amashyirahamwe'}
          </button>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Search and Filter Toggle */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-in-up">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <input
                type="text"
                name="search"
                placeholder={language === 'en' ? 'Search products...' : 'Shakisha ibicuruzwa...'}
                defaultValue={searchQuery}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
              <button
                type="submit"
                className="btn-primary"
              >
                {language === 'en' ? 'Search' : 'Shakisha'}
              </button>
            </form>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden bg-white/90 border border-gray-200 hover:border-primary-300 hover:bg-primary-50 text-gray-800 px-4 py-2 rounded-xl shadow-sm transition"
            >
              {language === 'en' ? 'Filters' : 'Amashyirahamwe'}
            </button>
          </div>

          {/* Results Count */}
          <p className="text-gray-600 mb-6">
            {language === 'en' 
              ? `Showing ${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`
              : `Twerekana ibicuruzwa ${filteredProducts.length}`
            }
          </p>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="card-soft overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-glow group"
                >
                  <div className="relative aspect-square bg-gradient-to-br from-primary-100 via-sky-100 to-accent-100 flex items-center justify-center">
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_#ffffff,_transparent_60%)]" />
                    <span className="relative text-6xl group-hover:scale-110 transition-transform duration-300">🏊</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {language === 'en' ? product.name : product.nameRw}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-primary-600">
                          {formatRWF(product.price)}
                        </p>
                        {product.originalPrice && (
                          <p className="text-sm text-gray-500 line-through">
                            {formatRWF(product.originalPrice)}
                          </p>
                        )}
                      </div>
                      {product.rating && (
                        <div className="flex items-center">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {language === 'en' ? 'No products found' : 'Ntacyo cyabonetse'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products


