import { useState } from 'react'
import useLanguageStore from '../stores/languageStore'

const FAQ = () => {
  const language = useLanguageStore((state) => state.language)
  const [openIndex, setOpenIndex] = useState(0) // First one open by default

  const faqs = [
    {
      icon: '💳',
      question: language === 'en' ? 'What payment methods do you accept?' : 'Ni uburyo ki bwo kwishyura mukemera?',
      answer: language === 'en'
        ? 'We accept MTN Mobile Money (*182#), Airtel Money, Bank Transfer, and Cash on Delivery (COD) for Kigali orders.'
        : 'Tukemera MTN Mobile Money (*182#), Airtel Money, Kwishyura mu Banki, na Kwishyura mu Mwanya (COD) ku batuye Kigali.'
    },
    {
      icon: '🚚',
      question: language === 'en' ? 'How long does delivery take?' : 'Delivery itwara igihe kingana iki?',
      answer: language === 'en'
        ? 'Delivery within Kigali takes 24-48 hours. For upcountry (outside Kigali), delivery typically takes 2-3 days via courier.'
        : 'Delivery mu Kigali itwara amasaha 24-48. Mu ntara, bitwara iminsi 2-3 ukoresheje abatumwa.'
    },
    {
      icon: '💰',
      question: language === 'en' ? 'Is delivery free?' : 'Delivery ni ubuntu?',
      answer: language === 'en'
        ? 'Yes! Delivery is free for orders over 50,000 RWF. For smaller orders, delivery is 2,000 RWF (Kigali) or 5,000 RWF (Upcountry).'
        : 'Yego! Delivery ni ubuntu iyo waguze ibirenze 50,000 RWF. Iyo utagejeje, yishyurwa 2,000 RWF (Kigali) cyangwa 5,000 RWF (Mu Ntara).'
    },
    {
      icon: '🔄',
      question: language === 'en' ? 'Can I return products?' : 'Nshobora gusubiza ibicuruzwa?',
      answer: language === 'en'
        ? 'Yes, we offer a 7-day return policy for unused items in original packaging. Swimwear must have the hygiene liner intact.'
        : 'Yego, dufite politiki yo gusubiza mu minsi 7 ku bintu bitakoreshejwe. Imyenda yo koga igomba kuba itambo.'
    },
    {
      icon: '📍',
      question: language === 'en' ? 'Where is your shop located?' : 'Dukorera he?',
      answer: language === 'en'
        ? 'Our main warehouse is in Kimihurura, Kigali Heights. You can visit us Mon-Sat, 9 AM - 8 PM.'
        : 'Ububiko bwacu bukuru buri Kimihurura, Kigali Heights. Wadusura Kuwa Mbere-Gatandatu, 9 AM - 8 PM.'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        
        {/* === HEADER === */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-sky-100 text-sky-600 text-sm font-bold uppercase tracking-wider">
            {language === 'en' ? 'Help Center' : 'Ubufasha'}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900">
            {language === 'en' ? 'Frequently Asked' : 'Ibibazo Byakunze'} <br />
            <span className="text-sky-600">{language === 'en' ? 'Questions' : 'Kubazwa'}</span>
          </h1>
        </div>

        {/* === FAQ GRID === */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                openIndex === index 
                  ? 'border-sky-200 shadow-lg ring-1 ring-sky-100' 
                  : 'border-slate-100 shadow-sm hover:border-slate-200'
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl bg-slate-50 w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-sky-50 transition-colors">
                    {faq.icon}
                  </span>
                  <span className={`font-bold text-lg ${openIndex === index ? 'text-sky-700' : 'text-slate-800'}`}>
                    {faq.question}
                  </span>
                </div>
                <span className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                  openIndex === index ? 'bg-sky-100 text-sky-600 rotate-180' : 'bg-slate-100 text-slate-400'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 pl-20 text-slate-500 leading-relaxed border-t border-slate-50 pt-4">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* === CONTACT CARD === */}
        <div className="mt-16 bg-slate-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Still have questions?' : 'Uracyafite ibibazo?'}
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              {language === 'en'
                ? "Can't find the answer you're looking for? Chat with our team directly."
                : "Ntiwabona igisubizo ushaka? Vugana n'ikipe yacu."
              }
            </p>
            <a
              href="https://wa.me/250788123456"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-xl transition shadow-lg hover:-translate-y-1"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              {language === 'en' ? 'Chat on WhatsApp' : 'Vugana kuri WhatsApp'}
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}

export default FAQ