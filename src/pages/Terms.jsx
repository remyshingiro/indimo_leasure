import useLanguageStore from '../stores/languageStore'

const Terms = () => {
  const language = useLanguageStore((state) => state.language)

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        
        {/* === HEADER === */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm">
            ⚖️
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
            {language === 'en' ? 'Terms & Conditions' : 'Amabwiriza n\'Ibisabwa'}
          </h1>
          <p className="text-slate-500">
            {language === 'en' 
              ? 'Please read these terms carefully before using our service.' 
              : 'Nyamuneka soma aya mabwiriza witonze mbere yo gukoresha serivisi zacu.'}
          </p>
        </div>

        {/* === DOCUMENT CONTAINER === */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12 overflow-hidden relative">
          
          {/* Last Updated Badge */}
          <div className="absolute top-0 right-0 p-6">
            <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider rounded-full">
              {language === 'en' ? 'Updated: Dec 2025' : 'Ivugururwa: Ukuboza 2025'}
            </span>
          </div>

          <div className="space-y-10 text-slate-600 leading-relaxed">
            
            {/* Section 1: Agreement */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-sky-500">01.</span>
                {language === 'en' ? 'Agreement to Terms' : 'Kwemera Amabwiriza'}
              </h2>
              <p>
                {language === 'en'
                  ? 'By accessing and using this website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website.'
                  : 'Mukoresha urubuga rwacu, mwemera kwemera aya mabwiriza. Niba mutemera igice icyo aricyo cyose cy\'aya mabwiriza, nyamuneka ntimukoreshe urubuga rwacu.'
                }
              </p>
            </section>

            {/* Section 2: Products */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-sky-500">02.</span>
                {language === 'en' ? 'Products & Pricing' : 'Ibicuruzwa n\'Ibiciro'}
              </h2>
              <p className="mb-4">
                {language === 'en' 
                  ? 'We strive to ensure product information and pricing is accurate. However, errors may occur.' 
                  : 'Tugerageza kugira ngo amakuru y\'ibicuruzwa n\'ibiciro bibe byo. Gusa, amakosa ashobora kubaho.'}
              </p>
              <ul className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                {[
                  { en: 'Prices are subject to change without notice', rw: 'Ibiciro bishobora guhinduka nta nteguza' },
                  { en: 'We reserve the right to limit quantities', rw: 'Dufite uburenganzira bwo kugena umubare ntarengwa w\'ibigurwa' },
                  { en: 'Colors may vary slightly from photos', rw: 'Amabara ashobora gutandukana gato n\'ayo ku mafoto' }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0"></span>
                    <span>{language === 'en' ? item.en : item.rw}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 3: Orders & Payments */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-sky-500">03.</span>
                {language === 'en' ? 'Orders & Payments' : 'Amabwiriza no Kwishyura'}
              </h2>
              <p className="mb-4">
                {language === 'en'
                  ? 'We reserve the right to refuse any order you place with us.'
                  : 'Dufite uburenganzira bwo kwanga itegeko iryo ariryo ryose waduhaye.'
                }
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'Payment Methods', desc: 'MTN MoMo, Airtel Money, Bank Transfer, Cash' },
                  { title: 'Order Confirmation', desc: 'Received via Email/SMS after checkout' },
                  { title: 'Cancellation', desc: 'Allowed before shipping is processed' },
                  { title: 'Currency', desc: 'All transactions are in Rwandan Francs (RWF)' },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4: Delivery */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-sky-500">04.</span>
                {language === 'en' ? 'Delivery Policy' : 'Uko Dutanga Ibicuruzwa'}
              </h2>
              <p>
                {language === 'en'
                  ? 'Delivery times are estimates and start from the date of shipping, rather than the date of order. We are not responsible for delays caused by destination customs clearance processes or other unforeseen factors.'
                  : 'Igihe cyo gutanga ibicuruzwa ni igereranyo kandi gitangira kubarwa uhereye igihe byoherejwe. Ntituryozwa gutinda guterwa n\'impamvu zituruka hanze y\'ubushobozi bwacu.'
                }
              </p>
            </section>

            {/* Section 5: Governing Law */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-sky-500">05.</span>
                {language === 'en' ? 'Governing Law' : 'Amategeko Agenga'}
              </h2>
              <p>
                {language === 'en'
                  ? 'These Terms shall be governed and construed in accordance with the laws of Rwanda, without regard to its conflict of law provisions.'
                  : 'Aya mabwiriza azagengwa kandi asobanurwe hakurikijwe amategeko y\'u Rwanda.'
                }
              </p>
            </section>

            {/* Contact Footer */}
            <section className="border-t border-slate-100 pt-8 mt-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                {language === 'en' ? 'Contact Us' : 'Twandikire'}
              </h2>
              <div className="bg-sky-50 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="font-medium text-slate-700">
                  {language === 'en'
                    ? 'Questions about the Terms?'
                    : 'Ufite ibibazo kuri aya mabwiriza?'}
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

export default Terms