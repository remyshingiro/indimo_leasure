import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductBySlug, products } from '../data/products'
import useCartStore from '../stores/cartStore'
import useLanguageStore from '../stores/languageStore'
import { formatRWF } from '../utils/currency'

const ProductDetail = () => {
  const { slug } = useParams()
  const product = getProductBySlug(slug)
  const addItem = useCartStore((state) => state.addItem)
  const language = useLanguageStore((state) => state.language)
  
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '')
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [showSizeChart, setShowSizeChart] = useState(false)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">
          {language === 'en' ? 'Product not found' : 'Igitangaza ntikibonetse'}
        </h2>
        <Link to="/products" className="text-primary-600 hover:underline">
          {language === 'en' ? 'Back to Products' : 'Subira mu Bicuruzwa'}
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem({ ...product, selectedSize, selectedColor }, quantity)
    alert(language === 'en' ? 'Added to cart!' : 'Byongeyeho mu gafuni!')
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="animate-fade-in-up">
          <div className="aspect-square rounded-3xl mb-4 bg-gradient-to-br from-primary-100 via-sky-100 to-accent-100 flex items-center justify-center shadow-soft-glow">
            <span className="text-9xl animate-float-slow">🏊</span>
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`aspect-square bg-gray-100 rounded-2xl border-2 transition-all ${
                    activeImage === index ? 'border-primary-600' : 'border-transparent'
                  }`}
                >
                  <span className="text-2xl">🏊</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4 animate-fade-in-up-delayed">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 tracking-tight">
            {language === 'en' ? product.name : product.nameRw}
          </h1>
          <p className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold mb-2">
            {product.brand}
          </p>
          
          {product.rating && (
            <div className="flex items-center mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                    ⭐
                  </span>
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                {product.rating} ({product.reviews} {language === 'en' ? 'reviews' : 'ubwoba'})
              </span>
            </div>
          )}

          <div className="mb-6">
            <p className="text-4xl font-bold text-primary-600 mb-2">
              {formatRWF(product.price)}
            </p>
            {product.originalPrice && (
              <p className="text-xl text-gray-500 line-through">
                {formatRWF(product.originalPrice)}
              </p>
            )}
          </div>

          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">
              {language === 'en' ? product.description : product.descriptionRw}
            </p>
          </div>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 1 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold">
                  {language === 'en' ? 'Size' : 'Ingano'}
                </label>
                <button
                  onClick={() => setShowSizeChart(true)}
                  className="text-sm text-primary-600 hover:underline"
                >
                  {language === 'en' ? 'Size Guide' : 'Inyigisho y\'Ingano'}
                </button>
              </div>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border-2 rounded ${
                      selectedSize === size
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-primary-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 1 && (
            <div className="mb-6">
              <label className="font-semibold block mb-2">
                {language === 'en' ? 'Color' : 'Ibara'}
              </label>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border-2 rounded ${
                      selectedColor === color
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-primary-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="font-semibold block mb-2">
              {language === 'en' ? 'Quantity' : 'Umubare'}
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
              >
                -
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
              >
                +
              </button>
              <span className="text-gray-600">
                {product.stock} {language === 'en' ? 'in stock' : 'biriho'}
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg text-lg transition mb-4"
          >
            {product.inStock 
              ? (language === 'en' ? 'Add to Cart' : 'Ongeraho mu Gafuni')
              : (language === 'en' ? 'Out of Stock' : 'Ntibyabonetse')
            }
          </button>

          {/* Delivery Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">
              {language === 'en' ? 'Delivery Information' : 'Amakuru y\'Ubwoba'}
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>🚚 {language === 'en' ? '24-48 hours delivery in Kigali' : 'Amasaha 24-48 mu Kigali'}</li>
              <li>💰 {language === 'en' ? 'Free delivery over 50,000 RWF' : 'Ubwoba bw\'amashyirahamwe kuri 50,000 RWF'}</li>
              <li>↩️ {language === 'en' ? '7-day return policy' : 'Politiki y\'amashyirahamwe 7'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">
            {language === 'en' ? 'Related Products' : 'Ibicuruzwa Bifitanye'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
              >
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  <span className="text-6xl">🏊</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {language === 'en' ? p.name : p.nameRw}
                  </h3>
                  <p className="text-2xl font-bold text-primary-600">
                    {formatRWF(p.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">
                {language === 'en' ? 'Size Guide' : 'Inyigisho y\'Ingano'}
              </h3>
              <button
                onClick={() => setShowSizeChart(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            <div className="text-gray-600">
              {language === 'en' 
                ? 'Size guide information will be displayed here.'
                : 'Amakuru y\'inyigisho y\'ingano azerekana hano.'
              }
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail


