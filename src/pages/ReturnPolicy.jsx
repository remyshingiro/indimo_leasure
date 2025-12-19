import useLanguageStore from '../stores/languageStore'

const ReturnPolicy = () => {
  const language = useLanguageStore((state) => state.language)

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        
        {/* === HEADER === */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm">
            🔄
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
            {language === 'en' ? 'Return & Exchange' : 'Gusubiza no Guhindura'}
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'We want you to love your gear. If it doesn\'t fit, we\'ll fix it.' 
              : 'Turashaka ko ukunda ibikoresho byawe. Niba bidakwiye, tuzabikemura.'}
          </p>
        </div>

        <div className="space-y-8">
          
          {/* === HERO POLICY CARD === */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 bg-sky-100 text-sky-700 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                {language === 'en' ? 'The Guarantee' : 'Ingwate'}
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {language === 'en' ? '7-Day Return Policy' : 'Iminsi 7 yo Gusubiza'}
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {language === 'en'
                  ? 'If you are not completely satisfied with your purchase, you can return it within 7 days of delivery for a full refund or exchange. No questions asked, as long as the item is new.'
                  : 'Niba utishimiye ibyo waguze, urashobora kubisubiza mu minsi 7 kugira ngo usubizwe amafaranga cyangwa uhindurirwe.'
                }
              </p>
            </div>
            <div className="w-full md:w-auto bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center min-w-[200px]">
              <span className="text-4xl font-black text-slate-900 block mb-1">7</span>
              <span className="text-sm font-bold text-slate-500 uppercase">
                {language === 'en' ? 'Days Window' : 'Iminsi'}
              </span>
            </div>
          </div>

          {/* === CONDITIONS GRID === */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Accepted Conditions */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="text-green-500">✓</span>
                {language === 'en' ? 'Accepted for Return' : 'Ibyemewe'}
              </h3>
              <ul className="space-y-4">
                {[
                  { en: 'Unused & original packaging', rw: 'Bitarakoreshwa & bipfunyitse' },
                  { en: 'Tags still attached', rw: 'Tagi zikiriho' },
                  { en: 'Within 7 days of delivery', rw: 'Mu minsi 7 uhereye igihe wagejarijwe' },
                  { en: 'Receipt / Proof of purchase', rw: 'Inyemezabwishyu' }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                    <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 text-xs">✓</div>
                    {language === 'en' ? item.en : item.rw}
                  </li>
                ))}
              </ul>
            </div>

            {/* Non-Returnable */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="text-red-500">✕</span>
                {language === 'en' ? 'Non-Returnable' : 'Ibitasubizwa'}
              </h3>
              <ul className="space-y-4">
                {[
                  { en: 'Used or damaged items', rw: 'Ibyakoreshejwe cyangwa byangiritse' },
                  { en: 'Missing packaging/tags', rw: 'Ibitagira amapaki/tagi' },
                  { en: 'Swimwear worn without hygiene liner', rw: 'Imyenda yo koga yambaye nabi' },
                  { en: 'Returns after 7 days', rw: 'Nyuma y\'iminsi 7' }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                    <div className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0 text-xs">✕</div>
                    {language === 'en' ? item.en : item.rw}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
           

          {/* === PROCESS STEPS === */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-8 text-center">
              {language === 'en' ? 'How to Return' : 'Uko Wasubiza'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { icon: '📱', title: '1. Contact', desc: 'WhatsApp or Email us' },
                { icon: '📦', title: '2. Prepare', desc: 'Pack item with tags' },
                { icon: '🚚', title: '3. Pickup', desc: 'We collect the item' },
                { icon: '💰', title: '4. Refund', desc: 'Money back in 3 days' },
              ].map((step, i) => (
                <div key={i} className="text-center p-4 rounded-2xl bg-slate-50">
                  <div className="text-3xl mb-3">{step.icon}</div>
                  <div className="font-bold text-slate-900 mb-1">{step.title}</div>
                  <div className="text-xs text-slate-500">{step.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* === CONTACT FOOTER === */}
          <div className="bg-sky-500 rounded-3xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Start a Return' : 'Tangira Gusubiza'}
            </h2>
            <p className="mb-8 text-sky-100">
              {language === 'en' 
                ? 'Ready to send something back? Let us help you.' 
                : 'Witeguye gusubiza ikintu? Reka tugufashe.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://wa.me/250788123456" 
                className="bg-white text-sky-600 px-6 py-3 rounded-xl font-bold hover:bg-sky-50 transition shadow-lg"
              >
                WhatsApp Us
              </a>
              <a 
                href="mailto:returns@kigaliswim.com" 
                className="bg-sky-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-sky-700 transition border border-sky-400"
              >
                Email Support
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ReturnPolicy