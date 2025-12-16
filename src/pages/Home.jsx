import { Link } from 'react-router-dom'
import useLanguageStore from '../stores/languageStore'
import useCategoryStore from '../stores/categoryStore'
import useProductStore from '../stores/productStore'
import useAnalyticsStore from '../stores/analyticsStore'
import { formatRWF } from '../utils/currency'
import LazyImage from '../components/LazyImage'

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
     {/* Cinematic Hero Section with Image */}
      {/* Changed min-h to handle the image height better on mobile */}
      <section className="relative py-20 lg:min-h-[90vh] flex items-center overflow-hidden bg-slate-900">
        
        {/* --- Background Mesh (Kept from previous version) --- */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-blue-900 to-slate-900 opacity-90" />
          {/* We moved the blobs slightly to frame the new layout */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-500/20 rounded-full blur-[150px] mix-blend-screen animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px] mix-blend-screen animate-float-slow" />
        </div>

        {/* Content Container - Now a Grid */}
        <div className="relative container mx-auto px-4 z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-0 items-center">
            
            {/* === LEFT COLUMN: TEXT === */}
            {/* Changed text-center to text-left for desktop */}
            <div className="max-w-2xl text-center lg:text-left space-y-8 relative z-20 Order-2 lg:order-1">
              
              {/* Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 backdrop-blur-md mb-4 animate-fade-in-up">
                <span className="flex h-2 w-2 rounded-full bg-sky-400 mr-2 animate-pulse"></span>
                <span className="text-xs md:text-sm font-medium text-sky-200 tracking-wide uppercase">
                  {language === 'en' ? 'Professional Gear' : 'Ibikoresho byabanyamwuga'}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] drop-shadow-2xl animate-fade-in-up delay-100">
                {language === 'en' ? (
                  <>
                    Dominating the <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-white to-sky-300">
                      Waters.
                    </span>
                  </>
                ) : (
                  <>
                    Yobora <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-white to-sky-300">
                      Amazi.
                    </span>
                  </>
                )}
              </h1>

              {/* Subtext */}
              <p className="text-lg text-blue-100/80 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed animate-fade-in-up delay-200">
                {language === 'en'
                  ? 'Equip yourself with Rwanda\'s #1 performance swimming gear. Speed, comfort, and durability for every stroke.'
                  : 'Wihereze ibikoresho byo koga bya mbere mu Rwanda. Umuvuduko, ihumure, n\'igihe kirekire kuri buri stroke.'
                }
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4 animate-fade-in-up delay-300">
                <Link
                  to="/products"
                  className="group relative px-8 py-4 bg-white text-blue-900 font-bold text-lg rounded-full overflow-hidden transition-transform hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                >
                  <span className="relative z-10">{language === 'en' ? 'Shop The Collection' : 'Gura Ibikoresho'}</span>
                  <div className="absolute inset-0 bg-sky-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </Link>
              </div>
            </div>

            {/* === RIGHT COLUMN: THE BIG IMAGE === */}
            {/* Order-1 on mobile (shows first), Order-2 on desktop */}
            <div className="relative z-10 order-1 lg:order-2 lg:translate-x-12 animate-fade-in-up">
              {/* The glowing blob behind the image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/40 to-primary-500/40 blur-3xl -z-10 transform rotate-6 rounded-[3rem]"></div>
              
              {/* The Image itself */}
              {/* Note the 'rotate-3' that becomes 'rotate-0' on hover for a subtle interaction */}
              <div className="relative h-[500px] lg:h-[700px] w-full rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(8,_112,_184,_0.3)] transform rotate-3 group hover:rotate-0 transition-all duration-700 ease-out">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent z-10 mix-blend-overlay pointer-events-none"></div>
                <LazyImage
                  // REPLACE THIS URL WITH YOUR OWN IMAGE
                  src="https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=2070&auto=format&fit=crop" 
                  alt="Swimmer in action wearing professional gear"
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Section with Wave Transition */}
      <section className="relative py-20 bg-slate-50">
        
        {/* THE WAVE: Connects Dark Hero to Light Section */}
        <div className="absolute top-0 left-0 right-0 -mt-1 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[120px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            {/* The fill color must match your Hero background (slate-900) */}
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-slate-900"></path>
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-12">
          
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
              {language === 'en' ? 'Find Your Gear' : 'Hitamo Ibikoresho'}
            </h2>
            <div className="w-24 h-1 bg-sky-500 mx-auto rounded-full"></div>
            <p className="text-slate-500 max-w-2xl mx-auto">
              {language === 'en' ? 'Everything you need for your next swim.' : 'Ibyo ukeneye byose koga.'}
            </p>
          </div>

          {/* The "Floating" Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                // Delay animation based on index for a "waterfall" loading effect
                className="group relative bg-white rounded-3xl p-6 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-sky-200/50 transition-all duration-300 hover:-translate-y-2 border border-slate-100 overflow-hidden flex flex-col items-center justify-center text-center h-48 md:h-64"
              >
                {/* Decorative Background Blob (Hidden by default, appears on hover) */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Icon / Image Container */}
                <div className="relative z-10 mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  {category.image ? (
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 bg-gradient-to-br from-sky-300 to-primary-500">
                      <LazyImage
                        src={category.image}
                        alt={language === 'en' ? category.name : category.nameRw}
                        className="w-full h-full rounded-full object-cover border-4 border-white"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-4xl md:text-5xl shadow-inner">
                      {category.icon}
                    </div>
                  )}
                </div>

                {/* Category Name */}
                <h3 className="relative z-10 font-bold text-slate-700 text-lg group-hover:text-primary-600 transition-colors">
                  {language === 'en' ? category.name : category.nameRw}
                </h3>
                
                {/* "View" Pill (Slides up on hover) */}
                <span className="absolute bottom-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-xs font-bold text-sky-500 uppercase tracking-widest">
                  {language === 'en' ? 'View' : 'Reba'}
                </span>
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
                  <LazyImage
                    src={product.image}
                    alt={language === 'en' ? product.name : product.nameRw}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    fallback={
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_#ffffff,_transparent_60%)]" />
                        <span className="relative text-6xl group-hover:scale-110 transition-transform duration-300" aria-hidden="true">🏊</span>
                      </div>
                    }
                  />
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


