import { Link } from 'react-router-dom'
import useLanguageStore from '../stores/languageStore'
import useCategoryStore from '../stores/categoryStore'
import useProductStore from '../stores/productStore'
import useAnalyticsStore from '../stores/analyticsStore'
import { formatRWF } from '../utils/currency'

const Home = () => {
  const language = useLanguageStore((state) => state.language)
  const categories = useCategoryStore((state) => state.categories)
  const products = useProductStore((state) => state.products)
  const trackProductClick = useAnalyticsStore((state) => state.trackProductClick)

  const featuredProducts = products.slice(0, 4)
  const testimonials = [
    {
      name: 'Jean Paul',
      nameRw: 'Jean Paul',
      text: 'Great quality products and fast delivery! Very satisfied with my purchase.',
      textRw: 'Ibicuruzwa by\'ubwoko bwiza kandi byongeyeho vuba! Nari nishimiye.',
      rating: 5
    },
    {
      name: 'Marie Claire',
      nameRw: 'Marie Claire',
      text: 'Best swimming equipment store in Kigali. Highly recommended!',
      textRw: 'Ubwoba bw\'amazi bwiza mu Kigali. Nk\'uko byagenze!',
      rating: 5
    },
    {
      name: 'David Nkurunziza',
      nameRw: 'David Nkurunziza',
      text: 'Excellent customer service and authentic products. Will shop again!',
      textRw: 'Serivisi nziza z\'abakiriya kandi ibicuruzwa by\'ukuri. Nzongera guhaha!',
      rating: 5
    }
  ]

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-sky-500 to-accent-500 text-white py-20">
        {/* Floating bubbles */}
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-white/15 blur-3xl animate-float-slow" />
          <div className="absolute right-0 bottom-0 h-52 w-52 rounded-full bg-sky-200/30 blur-3xl animate-pulse-soft" />
        </div>

        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
              {language === 'en' 
                ? 'Your Trusted Swimming Equipment Store in Kigali'
                : 'Ubwoba bw\'amazi bw\'ubwoba bw\'amazi mu Kigali'
              }
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-50/90">
              {language === 'en'
                ? 'Quality swimming gear for serious swimmers, families, and clubs'
                : 'Ibikoresho by\'amazi by\'ubwoko bwiza kuri abanyamazi, abantu, n\'amashyirahamwe'
              }
            </p>
            <Link
              to="/products"
              className="btn-accent text-base md:text-lg px-10 py-4 animate-fade-in-up-delayed"
            >
              {language === 'en' ? 'Shop Now' : 'Gura None'}
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {language === 'en' ? 'Shop by Category' : 'Gura ukoresheje ubwoko'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="card-soft p-6 text-center transition-transform duration-300 hover:-translate-y-1 hover:shadow-glow group"
              >
                {category.image ? (
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-primary-50 group-hover:bg-primary-100 transition-colors">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                    <div className="hidden w-full h-full items-center justify-center text-2xl">
                      {category.icon}
                    </div>
                  </div>
                ) : (
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-2xl mb-3 group-hover:bg-primary-100 transition-colors">
                    {category.icon}
                  </div>
                )}
                <h3 className="font-semibold text-gray-800 group-hover:text-primary-600">
                  {language === 'en' ? category.name : category.nameRw}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-b from-sky-50 to-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {language === 'en' ? 'Featured Products' : 'Ibicuruzwa by\'amashyirahamwe'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                onClick={() => trackProductClick(product.id)}
                className="card-soft overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-glow group"
              >
                <div className="relative aspect-square bg-gradient-to-br from-primary-100 via-sky-100 to-accent-100 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 flex items-center justify-center ${product.image ? 'hidden' : ''}`}>
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_#ffffff,_transparent_60%)]" />
                    <span className="relative text-6xl group-hover:scale-110 transition-transform duration-300">🏊</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {language === 'en' ? product.name : product.nameRw}
                  </h3>
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
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/products"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-lg transition"
            >
              {language === 'en' ? 'View All Products' : 'Reba Ibicuruzwa Byose'}
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl mb-2">🚚</div>
              <h3 className="font-semibold text-gray-800">
                {language === 'en' ? 'Fast Delivery' : 'Gutanga Vuba'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'en' ? '24-48 hours in Kigali' : 'Amasaha 24-48 mu Kigali'}
              </p>
            </div>
            <div>
              <div className="text-4xl mb-2">💳</div>
              <h3 className="font-semibold text-gray-800">
                {language === 'en' ? 'Secure Payment' : 'Kwishyura Bwite'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'en' ? 'Multiple payment options' : 'Amahitamo menshi yo kwishyura'}
              </p>
            </div>
            <div>
              <div className="text-4xl mb-2">↩️</div>
              <h3 className="font-semibold text-gray-800">
                {language === 'en' ? 'Easy Returns' : 'Gusubiza Byoroshye'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'en' ? '7-day return policy' : 'Politiki y\'amashyirahamwe 7'}
              </p>
            </div>
            <div>
              <div className="text-4xl mb-2">⭐</div>
              <h3 className="font-semibold text-gray-800">
                {language === 'en' ? 'Quality Guaranteed' : 'Ubwoba Bw\'ubwoba'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'en' ? 'Authentic products' : 'Ibicuruzwa by\'ukuri'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {language === 'en' ? 'What Our Customers Say' : 'Ibyo Abakiriya Bavuga'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  {language === 'en' ? testimonial.text : testimonial.textRw}
                </p>
                <p className="font-semibold text-gray-800">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home


