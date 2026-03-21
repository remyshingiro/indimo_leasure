import { useMemo } from 'react' // 🚀 Added useMemo for performance
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import useLanguageStore from '../stores/languageStore'
import useCategoryStore from '../stores/categoryStore'
import useProductStore from '../stores/productStore'
import useAnalyticsStore from '../stores/analyticsStore'
import useCartStore from '../stores/cartStore'
import { formatRWF } from '../utils/currency'
import LazyImage from '../components/LazyImage'

const Home = () => {
  const language = useLanguageStore((state) => state.language)
  const categories = useCategoryStore((state) => state.categories)
  const products = useProductStore((state) => state.products)
  const trackProductClick = useAnalyticsStore((state) => state.trackProductClick)
  const addItem = useCartStore((state) => state.addItem)

  // 🚀 MAJOR ADJUSTMENT: Round-Robin Algorithm to mix 20 products evenly across categories
  const featuredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    // Step 1: Group products by category
    const groupedProducts = {};
    products.forEach(product => {
      const cat = product.category || 'other'; // Fallback just in case
      if (!groupedProducts[cat]) groupedProducts[cat] = [];
      groupedProducts[cat].push(product);
    });

    // Step 2: Pick 1 from each category in a loop until we reach 20
    const mixedList = [];
    const categoryKeys = Object.keys(groupedProducts);
    let itemsAvailable = true;

    while (mixedList.length < 20 && itemsAvailable) {
      itemsAvailable = false;
      for (const key of categoryKeys) {
        if (mixedList.length >= 20) break; // Stop exactly at 20
        
        if (groupedProducts[key].length > 0) {
          mixedList.push(groupedProducts[key].shift()); // Take the first item in this category's list
          itemsAvailable = true; // We found an item, keep the loop going
        }
      }
    }

    return mixedList;
  }, [products]);
  
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

  const handleAddWithToast = (e, product) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  return (
    <div className="space-y-0">
      
      {/* === 1. HERO SECTION === */}
      <section className="relative py-20 lg:min-h-[90vh] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-blue-900 to-slate-900 opacity-90" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-500/20 rounded-full blur-[150px] mix-blend-screen animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px] mix-blend-screen animate-float-slow" />
        </div>

        <div className="relative container mx-auto px-4 z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-0 items-center">
            <div className="max-w-2xl text-center lg:text-left space-y-8 relative z-20 order-2 lg:order-1">
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 backdrop-blur-md mb-4 animate-fade-in-up">
                <span className="flex h-2 w-2 rounded-full bg-sky-400 mr-2 animate-pulse"></span>
                <span className="text-xs md:text-sm font-medium text-sky-200 tracking-wide uppercase">
                  {language === 'en' ? 'Professional Gear' : 'Ibikoresho byabanyamwuga'}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] drop-shadow-2xl animate-fade-in-up delay-100">
                {language === 'en' ? (
                  <>Dominating the <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-white to-sky-300">Waters.</span></>
                ) : (
                  <>Yobora <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-white to-sky-300">Amazi.</span></>
                )}
              </h1>

              <p className="text-lg text-blue-100/80 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed animate-fade-in-up delay-200">
                {language === 'en'
                  ? 'Equip yourself with Rwanda\'s #1 performance swimming gear. Speed, comfort, and durability for every stroke.'
                  : 'Wihereze ibikoresho byo koga bya mbere mu Rwanda. Umuvuduko, ihumure, n\'igihe kirekire kuri buri stroke.'
                }
              </p>

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

            <div className="relative z-10 order-1 lg:order-2 lg:translate-x-12 animate-fade-in-up">
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/40 to-primary-500/40 blur-3xl -z-10 transform rotate-6 rounded-[3rem]"></div>
              <div className="relative h-[500px] lg:h-[700px] w-full rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(8,_112,_184,_0.3)] transform rotate-3 group hover:rotate-0 transition-all duration-700 ease-out">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent z-10 mix-blend-overlay pointer-events-none"></div>
                <LazyImage
                  src="https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=2070&auto=format&fit=crop" 
                  alt="Swimmer in action"
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === 2. CATEGORIES SECTION (ADJUSTMENT 1: REDUCED SIZE) === */}
      {/* Reduced py-10 to py-8, reduced h-64 to h-32/h-40, shrunk icons */}
      <section className="relative py-8 lg:py-12 bg-slate-50">
        <div className="absolute top-0 left-0 right-0 -mt-1 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[120px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-slate-900"></path>
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 lg:mb-8 text-gray-800">
            {language === 'en' ? 'Find Your Gear' : 'Hitamo Ibikoresho'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group relative bg-white rounded-2xl md:rounded-2xl p-3 md:p-4 shadow-sm hover:shadow-xl hover:shadow-sky-100/50 transition-all duration-300 hover:-translate-y-1 border border-slate-100 overflow-hidden flex flex-col items-center justify-center text-center h-28 md:h-40"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10 mb-2 md:mb-4 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  {category.image ? (
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full p-0.5 bg-gradient-to-br from-sky-300 to-primary-500">
                      <LazyImage src={category.image} alt={category.name} className="w-full h-full rounded-full object-cover border-2 border-white" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-2xl md:text-3xl shadow-inner">{category.icon}</div>
                  )}
                </div>
                <h3 className="relative z-10 font-bold text-slate-700 text-xs md:text-sm group-hover:text-primary-600 transition-colors">
                  {language === 'en' ? category.name : category.nameRw}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === 3. FEATURED PRODUCTS === */}
      <section className="py-10 lg:py-16 bg-slate-50 relative">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col sm:flex-row sm:items-end items-start justify-between mb-8 gap-4 w-full">
            <div className="text-left">
              <span className="text-sky-500 font-bold tracking-wider uppercase text-xs md:text-sm mb-1 block">
                {language === 'en' ? 'Curated Collection' : 'Ikusanyirizo Ryatoranijwe'}
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-slate-800">
                {language === 'en' ? 'Trending Equipment' : 'Ibigezweho'}
              </h2>
            </div>
            <Link to="/products" className="group flex items-center gap-2 text-slate-600 hover:text-sky-600 transition-colors font-medium text-sm md:text-base">
              <span>{language === 'en' ? 'View All' : 'Reba Byose'}</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {/* 🚀 Rendered up to 20 precisely mixed cards */}
            {featuredProducts.map((product) => {
              const price = Number(product.price) || 0;
              const originalPrice = Number(product.originalPrice) || 0;
              const hasDiscount = originalPrice > price && originalPrice > 0;
              const discountPercentage = hasDiscount 
                ? Math.round(((originalPrice - price) / originalPrice) * 100) 
                : 0;

              return (
                <div key={product.id} className="group flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:border-sky-200 transition-all duration-300">
                  <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden">
                    <Link 
                      to={`/products/${product.slug}`}
                      onClick={() => trackProductClick(product.id)}
                    >
                      <LazyImage
                        src={product.image}
                        alt={language === 'en' ? product.name : product.nameRw}
                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                        fallback={<div className="absolute inset-0 flex items-center justify-center bg-slate-50 text-slate-300"><span className="text-6xl">🏊</span></div>}
                      />
                    </Link>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    
                    {hasDiscount && (
                      <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] md:text-xs font-black px-2 py-1 md:px-3 md:py-1.5 rounded-full shadow-lg z-10 flex items-center gap-1 border border-red-400/30 animate-pulse-slow">
                        <span className="text-[10px] md:text-sm leading-none">🔥</span>
                        <span>-{discountPercentage}%</span>
                      </div>
                    )}

                    <button 
                      onClick={(e) => handleAddWithToast(e, product)}
                      className="lg:hidden absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white w-9 h-9 md:w-10 md:h-10 rounded-full shadow-xl flex items-center justify-center active:scale-95 transition-transform z-20 border border-sky-400/50"
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    </button>

                    <div className="hidden lg:block absolute bottom-4 left-4 right-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <button 
                        onClick={(e) => handleAddWithToast(e, product)}
                        className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold py-3 rounded-xl shadow-xl hover:from-sky-400 hover:to-blue-500 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        {language === 'en' ? 'Add to Cart' : 'Ongeraho'}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 md:p-4 flex flex-col flex-1 bg-white">
                    {product.brand && (
                       <p className="text-[10px] md:text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider line-clamp-1">
                         {product.brand}
                       </p>
                    )}
                    
                    <h3 className="font-bold text-slate-800 text-sm md:text-base leading-tight group-hover:text-sky-600 transition-colors line-clamp-2 mb-2 flex-1">
                      {language === 'en' ? product.name : product.nameRw}
                    </h3>
                    
                    <div className="flex flex-col gap-0.5 mt-auto">
                      <p className="font-black text-sky-600 text-sm md:text-lg">
                        {formatRWF(price)}
                      </p>
                      
                      <div className="min-h-[16px] md:min-h-[20px]">
                        {hasDiscount && (
                          <p className="text-[10px] md:text-xs text-slate-400 line-through font-medium">
                            {formatRWF(originalPrice)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* === 4. TRUST BADGES === */}
      <section className="py-8 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div><div className="text-2xl md:text-3xl mb-1.5">🚚</div><h3 className="font-semibold text-sm md:text-base text-gray-800">{language === 'en' ? 'Fast Delivery' : 'Gutanga Vuba'}</h3><p className="text-xs text-gray-500">{language === 'en' ? '24-48 hours' : 'Amasaha 24-48'}</p></div>
            <div><div className="text-2xl md:text-3xl mb-1.5">💳</div><h3 className="font-semibold text-sm md:text-base text-gray-800">{language === 'en' ? 'Secure Payment' : 'Kwishyura Bwite'}</h3><p className="text-xs text-gray-500">{language === 'en' ? 'Multiple options' : 'Amahitamo menshi'}</p></div>
            <div><div className="text-2xl md:text-3xl mb-1.5">↩️</div><h3 className="font-semibold text-sm md:text-base text-gray-800">{language === 'en' ? 'Easy Returns' : 'Gusubiza Byoroshye'}</h3><p className="text-xs text-gray-500">{language === 'en' ? '7-day policy' : 'Iminsi 7'}</p></div>
            <div><div className="text-2xl md:text-3xl mb-1.5">⭐</div><h3 className="font-semibold text-sm md:text-base text-gray-800">{language === 'en' ? 'Quality Guaranteed' : 'Ubwoba Bw\'ubwoba'}</h3><p className="text-xs text-gray-500">{language === 'en' ? 'Authentic' : 'Iby\'ukuri'}</p></div>
          </div>
        </div>
      </section>

      {/* === 5. TESTIMONIALS === */}
      <section className="py-16 bg-gray-50 border-t border-slate-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {language === 'en' ? 'What Our Customers Say' : 'Ibyo Abakiriya Bavuga'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{language === 'en' ? testimonial.text : testimonial.textRw}"
                </p>
                <p className="font-bold text-slate-900">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home