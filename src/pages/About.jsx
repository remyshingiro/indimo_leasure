import { Link } from 'react-router-dom'
import useLanguageStore from '../stores/languageStore'

const About = () => {
  const language = useLanguageStore((state) => state.language)

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4">
      <div className="container mx-auto max-w-5xl">
        
        {/* === HEADER SECTION === */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-sky-100 text-sky-600 text-sm font-bold uppercase tracking-wider">
            {language === 'en' ? 'Our Story' : 'Inkuru Yacu'}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
            {language === 'en' ? 'Making Kigali' : 'Dutuma Kigali'} <br />
            <span className="text-sky-600">{language === 'en' ? 'Swim Better.' : 'Koga Neza.'}</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {language === 'en' 
              ? 'Founded in 2024, we are the first dedicated swimming equipment store in Rwanda. We believe everyone deserves high-quality gear to dominate the water.'
              : 'Yashinzwe muri 2024, ntitwe dushyizeho ububiko bwambere bwo koga mu Rwanda. Twemera ko buri wese akwiye ibikoresho byiza.'}
          </p>
        </div>

        {/* === VISUAL SPLIT SECTION === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Left: Image */}
          <div className="bg-slate-200 rounded-3xl overflow-hidden h-96 shadow-lg rotate-1 hover:rotate-0 transition-transform duration-500">
            <img 
              src="https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=2070&auto=format&fit=crop" 
              alt="Swimming" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Right: Dark Card Info */}
          <div className="bg-slate-900 rounded-3xl p-10 flex flex-col justify-center shadow-2xl -rotate-1 hover:rotate-0 transition-transform duration-500 text-white">
            <h3 className="text-2xl font-bold mb-6">
              {language === 'en' ? 'Why Choose Us?' : 'Kuki Wahitamo Twe?'}
            </h3>
            <ul className="space-y-4">
              {[
                { en: '100% Authentic Gear', rw: 'Ibikoresho by\'umwimerere' },
                { en: 'Fast Delivery in Kigali', rw: 'Gutanga vuba muri Kigali' },
                { en: 'Expert Advice', rw: 'Inama z\'inzobere' },
                { en: 'Secure Payments', rw: 'Kwishyura neza' },
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center font-bold text-sm flex-shrink-0">✓</div>
                  <span className="text-lg font-medium">{language === 'en' ? item.en : item.rw}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* === CONTACT & LOCATION === */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-2">
            {language === 'en' ? 'Visit Our Store' : 'Sura Ububiko Bwacu'}
          </h2>
          <p className="text-slate-500 mb-8">We are open and ready to help you.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
            {/* Card 1 */}
            <div className="p-6 bg-slate-50 rounded-2xl hover:bg-sky-50 transition-colors border border-slate-100">
              <span className="text-4xl mb-4 block">📍</span>
              <h3 className="font-bold text-slate-900 mb-1">Location</h3>
              <p className="text-slate-500 text-sm">Kigali Heights, 2nd Floor<br />Kimihurura, Kigali</p>
            </div>

            {/* Card 2 */}
            <div className="p-6 bg-slate-50 rounded-2xl hover:bg-sky-50 transition-colors border border-slate-100">
              <span className="text-4xl mb-4 block">📞</span>
              <h3 className="font-bold text-slate-900 mb-1">Contact</h3>
              <p className="text-slate-500 text-sm">+250 788 123 456<br />hello@kigaliswim.com</p>
            </div>

            {/* Card 3 */}
            <div className="p-6 bg-slate-50 rounded-2xl hover:bg-sky-50 transition-colors border border-slate-100">
              <span className="text-4xl mb-4 block">⏰</span>
              <h3 className="font-bold text-slate-900 mb-1">Hours</h3>
              <p className="text-slate-500 text-sm">Mon - Sat: 9:00 AM - 8:00 PM<br />Sun: Closed</p>
            </div>
          </div>

          <div className="mt-12">
            <Link 
              to="/products" 
              className="inline-block px-10 py-4 bg-slate-900 text-white rounded-full font-bold shadow-xl hover:bg-slate-800 hover:-translate-y-1 transition-all"
            >
              {language === 'en' ? 'Start Shopping' : 'Tangira Kugura'}
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default About