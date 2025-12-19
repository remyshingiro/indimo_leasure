import useLanguageStore from '../stores/languageStore'

const PrivacyPolicy = () => {
  const language = useLanguageStore((state) => state.language)

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        
        {/* === HEADER === */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm">
            🛡️
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
            {language === 'en' ? 'Privacy Policy' : 'Politiki y\'Ubwigenge'}
          </h1>
          <p className="text-slate-500">
            {language === 'en' 
              ? 'Your privacy is important to us. Here is how we protect it.' 
              : 'Ubwigenge bwawe ni ingenzi kuri twe. Uku niko tuburinda.'}
          </p>
        </div>

        {/* === DOCUMENT CONTAINER === */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12 overflow-hidden relative">
          
          {/* Last Updated Badge */}
          <div className="absolute top-0 right-0 p-6">
            <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider rounded-full">
              {language === 'en' ? 'Last Updated: Dec 2025' : 'Ivugururwa: Ukuboza 2025'}
            </span>
          </div>

          <div className="space-y-10 text-slate-600 leading-relaxed">
            
            {/* Section 1: Introduction */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-sky-500">01.</span>
                {language === 'en' ? 'Introduction' : 'Intangiriro'}
              </h2>
              <p>
                {language === 'en'
                  ? 'Kigali Swim Shop ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our website.'
                  : 'Kigali Swim Shop ("twe", "wacu", cyangwa "twe") twiyemeje gukomeza ubwigenge bwawe. Iyi Politiki y\'Ubwigenge isobanura uko dukusanya, dukoresha, kandi dukomeza amakuru yawe mugihe ukoresha urubuga rwacu.'
                }
              </p>
            </section>

            {/* Section 2: Info Collection */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-sky-500">02.</span>
                {language === 'en' ? 'Information We Collect' : 'Amakuru Dukusanya'}
              </h2>
              <p className="mb-4">
                {language === 'en' ? 'We collect the following information:' : 'Dukusanya amakuru akurikira:'}
              </p>
              <ul className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                {[
                  { en: 'Personal information (name, email, phone, address) for orders', rw: 'Amakuru yihariye (amazina, imeyili, telefoni, aderesi) y\'ibyo watumije' },
                  { en: 'Payment information (processed securely through gateways)', rw: 'Amakuru yo kwishyura (anyura mu nzira zizewe)' },
                  { en: 'Browsing data (cookies) to improve experience', rw: 'Amakuru y\'uko ukoresha urubuga (cookies) kugira ngo tunoze serivisi' }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sky-500 flex-shrink-0"></span>
                    <span>{language === 'en' ? item.en : item.rw}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 3: Usage */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-sky-500">03.</span>
                {language === 'en' ? 'How We Use Your Information' : 'Uko Dukoresha Amakuru Yawe'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { en: 'To process and fulfill orders', rw: 'Gutunganya ibyo watumije' },
                  { en: 'To communicate order status', rw: 'Kukumenyesha aho ibyo watumije bigeze' },
                  { en: 'To improve our services', rw: 'Kunoza serivisi zacu' },
                  { en: 'To send promotions (optional)', rw: 'Koherereza ibiciro bigabanutse' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-sky-500">✓</span>
                    <span className="text-sm font-medium">{language === 'en' ? item.en : item.rw}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4: Security */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-sky-500">04.</span>
                {language === 'en' ? 'Data Security' : 'Umutekano w\'Amakuru'}
              </h2>
              <p>
                {language === 'en'
                  ? 'We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.'
                  : 'Dukoresha ingamba zikwiye z\'umutekano kugira ngo turinde amakuru yawe. Icyakora, nta buryo bwo koherereza amakuru kuri interineti bwizewe 100%.'
                }
              </p>
            </section>

            {/* Section 5: Contact */}
            <section className="border-t border-slate-100 pt-8 mt-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                {language === 'en' ? 'Contact Us' : 'Twandikire'}
              </h2>
              <div className="bg-sky-50 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="font-medium text-slate-700">
                  {language === 'en'
                    ? 'Questions about this policy?'
                    : 'Ufite ibibazo kuri iyi politiki?'}
                </p>
                <a href="mailto:info@kigaliswimshop.com" className="px-6 py-2 bg-white text-sky-600 font-bold rounded-lg shadow-sm hover:bg-sky-50 transition-colors">
                  info@kigaliswimshop.com
                </a>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy