import { Link } from 'react-router-dom'
import { categories, products } from '../data/products'
import useLanguageStore from '../stores/languageStore'
import { formatRWF } from '../utils/currency'

const Home = () => {
  const language = useLanguageStore((state) => state.language)

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
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {language === 'en' 
                ? 'Your Trusted Swimming Equipment Store in Kigali'
                : 'Ubwoba bw\'amazi bw\'ubwoba bw\'amazi mu Kigali'
              }
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              {language === 'en'
                ? 'Quality swimming gear for serious swimmers, families, and clubs'
                : 'Ibikoresho by\'amazi by\'ubwoko bwiza kuri abanyamazi, abantu, n\'amashyirahamwe'
              }
            </p>
            <Link
              to="/products"
              className="inline-block bg-accent-500 hover:bg-accent-600 text-white font-semibold px-8 py-4 rounded-lg text-lg transition"
            >
              {language === 'en' ? 'Shop Now' : 'Gura None'}
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {language === 'en' ? 'Shop by Category' : 'Gura ukoresheje ubwoko'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="bg-gray-50 hover:bg-primary-50 p-6 rounded-lg text-center transition group"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-800 group-hover:text-primary-600">
                  {language === 'en' ? category.name : category.nameRw}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {language === 'en' ? 'Featured Products' : 'Ibicuruzwa by\'amashyirahamwe'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
              >
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  <span className="text-6xl">🏊</span>
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


