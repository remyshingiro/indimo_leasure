import { Link } from 'react-router-dom'
import useLanguageStore from '../stores/languageStore'

const Footer = () => {
  const language = useLanguageStore((state) => state.language)

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const translations = {
    en: {
      cta: "Ready to dive in?",
      subCta: "Join our community for swimming tips and exclusive offers.",
      placeholder: "Enter your email",
      subscribe: "Subscribe",
      quickLinks: 'Quick Links',
      customerService: 'Customer Service',
      paymentMethods: 'Payment Methods',
      followUs: 'Follow Us',
      rights: 'All rights reserved',
      address: 'Kigali, Rwanda',
      phone: '+250 XXX XXX XXX',
      email: 'info@kigaliswimshop.com'
    },
    rw: {
      cta: "Witeguye Koga?",
      subCta: "Injira mu muryango wacu kugirango ubone inama n'ibiciro byiza.",
      placeholder: "Andika imeri yawe",
      subscribe: "Iyandikishe",
      quickLinks: 'Amahuza',
      customerService: 'Serivisi z\'abakiriya',
      paymentMethods: 'Uburyo bwo kwishura',
      followUs: 'Dukurikire',
      rights: 'Uburenganzira bwose burabagirwa',
      address: 'Kigali, u Rwanda',
      phone: '+250 XXX XXX XXX',
      email: 'info@kigaliswimshop.com'
    }
  }

  const t = translations[language]

  return (
    // FIX ADDED HERE: mt-24 lg:mt-32 pushes the footer down to create space for the wave
    <footer className="relative bg-slate-900 text-white mt-auto mt-24 lg:mt-32">
      
      {/* === 1. TOP WAVE TRANSITION === */}
      {/* Shortened wave with safe negative margins to prevent overlapping text */}
      <div className="absolute top-0 left-0 right-0 -mt-8 md:-mt-16 w-full overflow-hidden leading-[0] transform rotate-180 z-10 pointer-events-none">
        <svg className="relative block w-[calc(100%+1.3px)] h-[35px] md:h-[70px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-slate-900"></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-20 pt-12 pb-12">
        
        {/* === 2. MASSIVE CALL TO ACTION === */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 border-b border-slate-800 pb-16 mb-16">
          <div className="text-center lg:text-left space-y-4">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-sky-400 drop-shadow-lg">
              {t.cta}
            </h2>
            <p className="text-slate-400 text-lg max-w-md mx-auto lg:mx-0">
              {t.subCta}
            </p>
          </div>

          {/* Glass Newsletter Input */}
          <div className="w-full max-w-md">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-primary-600 rounded-full blur opacity-20 group-hover:opacity-60 transition duration-1000"></div>
              <form className="relative flex items-center bg-slate-800/80 backdrop-blur-sm rounded-full p-2 border border-slate-700 focus-within:border-sky-500 transition-colors">
                <input 
                  type="email" 
                  placeholder={t.placeholder}
                  className="flex-1 bg-transparent px-6 py-3 text-white placeholder-slate-500 focus:outline-none w-full"
                />
                <button className="bg-primary-600 hover:bg-primary-500 text-white font-bold px-6 py-3 rounded-full transition-colors shadow-lg">
                  {t.subscribe}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* === 3. MAIN GRID === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <span className="text-4xl">🏊</span>
              <h3 className="text-2xl font-bold tracking-tight text-white">
                {language === 'en' ? 'Kigali Swim Shop' : 'Ubwoba Kigali'}
              </h3>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {language === 'en' 
                ? 'Your trusted swimming equipment store in Kigali, Rwanda. Professional gear for every swimmer.'
                : 'Ubwoba bw\'amazi bw\'ubwoba bw\'amazi mu Kigali, u Rwanda. Ibikoresho by\'abanyamwuga.'
              }
            </p>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sky-400">📍</div>
                <span>{t.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sky-400">📞</div>
                <span>{t.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sky-400">✉️</div>
                <span>{t.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">{t.quickLinks}</h4>
            <ul className="space-y-4">
              {['Home', 'Products', 'About Us', 'Contact'].map((item, i) => {
                const paths = ['/', '/products', '/about', '/contact'];
                const rwLabels = ['Ahabanza', 'Ibicuruzwa', 'Ibyerekeye', 'Twandikire'];
                return (
                  <li key={i}>
                    <Link 
                      to={paths[i]} 
                      onClick={handleLinkClick} 
                      className="text-slate-400 hover:text-sky-400 hover:translate-x-1 transition-all inline-block"
                    >
                      {language === 'en' ? item : rwLabels[i]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">{t.customerService}</h4>
            <ul className="space-y-4">
              {[
                { path: '/faq', en: 'FAQs', rw: 'Ibibazo' },
                { path: '/policies/returns', en: 'Returns & Exchanges', rw: 'Gusubiza' },
                { path: '/policies/privacy', en: 'Privacy Policy', rw: 'Politiki y\'Ubwigenge' },
                { path: '/policies/terms', en: 'Terms & Conditions', rw: 'Amabwiriza' },
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    to={link.path} 
                    onClick={handleLinkClick} 
                    className="text-slate-400 hover:text-sky-400 hover:translate-x-1 transition-all inline-block"
                  >
                    {language === 'en' ? link.en : link.rw}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">{t.paymentMethods}</h4>
            <div className="flex flex-wrap gap-3">
              <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 text-slate-300">
                <span>📱</span>
                <span className="text-sm font-medium">MTN Momo</span>
              </div>
              <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 text-slate-300">
                <span>📱</span>
                <span className="text-sm font-medium">Airtel Money</span>
              </div>
              <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 text-slate-300">
                <span>🏦</span>
                <span className="text-sm font-medium">Bank</span>
              </div>
              <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 text-slate-300">
                <span>💵</span>
                <span className="text-sm font-medium">Cash</span>
              </div>
            </div>
            
            {/* Socials */}
            <h4 className="font-bold text-lg mt-8 mb-4 text-white">{t.followUs}</h4>
            <div className="flex gap-4">
               {['instagram', 'twitter', 'facebook'].map(social => (
                 <a key={social} href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white transition-all transform hover:-translate-y-1">
                    {/* Simple generic social icon */}
                    <span className="capitalize">{social[0]}</span>
                 </a>
               ))}
            </div>
          </div>
        </div>

        {/* === 4. COPYRIGHT === */}
        <div className="border-t border-slate-800 mt-16 pt-8 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Kigali Swim Shop. {t.rights}. 
            <span className="hidden md:inline ml-2">Built with ❤️ in Kigali.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer