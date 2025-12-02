import { useState } from 'react'
import useLanguageStore from '../stores/languageStore'

const FAQ = () => {
  const language = useLanguageStore((state) => state.language)

  const faqs = [
    {
      question: language === 'en' ? 'What payment methods do you accept?' : 'Ni uburyo ki bwo kwishyura mukemera?',
      answer: language === 'en'
        ? 'We accept MTN Mobile Money, Airtel Money, Bank Transfer, and Cash on Delivery (COD).'
        : 'Tukemera MTN Mobile Money, Airtel Money, Kwishyura mu Banki, na Kwishyura mu Mwanya (COD).'
    },
    {
      question: language === 'en' ? 'How long does delivery take?' : 'Ubwoba bugana iki gihe?',
      answer: language === 'en'
        ? 'Delivery within Kigali takes 24-48 hours. For areas outside Kigali, delivery takes 48-72 hours.'
        : 'Ubwoba mu Kigali bugana amasaha 24-48. Kuri ahandi hatari mu Kigali, ubwoba bugana amasaha 48-72.'
    },
    {
      question: language === 'en' ? 'Is delivery free?' : 'Ubwoba ni ubwoba?',
      answer: language === 'en'
        ? 'Yes! Delivery is free for orders over 50,000 RWF within Kigali. Otherwise, delivery fees range from 2,000-5,000 RWF depending on your location.'
        : 'Yego! Ubwoba ni ubwoba kuri itegeko rirenze 50,000 RWF mu Kigali. Icyo cyose, ubwoba bugana 2,000-5,000 RWF bitewe n\'aho uri.'
    },
    {
      question: language === 'en' ? 'Can I return or exchange products?' : 'Nshobora gusubiza cyangwa guhindura ibicuruzwa?',
      answer: language === 'en'
        ? 'Yes, we offer a 7-day return policy. Products must be unused and in original packaging. Please contact us for return instructions.'
        : 'Yego, dufite politiki y\'amashyirahamwe 7. Ibicuruzwa bigomba kuba bitarakoreshwa kandi biri mu bubiko bw\'ibanze. Twandikire kugira ngo duhamagare amabwiriza yo gusubiza.'
    },
    {
      question: language === 'en' ? 'How do I track my order?' : 'Nshobora gusuzuma itegeko ryanjye?',
      answer: language === 'en'
        ? 'After placing your order, you will receive a confirmation email or SMS with your order number. You can contact us via WhatsApp or phone to check the status of your order.'
        : 'Nyuma yo gushyiraho itegeko, uzakira imeyili cyangwa SMS y\'emeza hamwe n\'umubare w\'itegeko. Urashobora kutwandikira kuri WhatsApp cyangwa telefoni kugira ngo usuzume imiterere y\'itegeko.'
    },
    {
      question: language === 'en' ? 'Do you ship outside Kigali?' : 'Mwohereza hanze y\'u Kigali?',
      answer: language === 'en'
        ? 'Yes, we ship throughout Rwanda. Delivery fees and times vary by location. Contact us for specific rates.'
        : 'Yego, tuhereza mu Rwanda hose. Ubwoba n\'amashyirahamwe byahinduka bitewe n\'aho uri. Twandikire kugira ngo duhamagare amafaranga y\'ubwoba.'
    }
  ]

  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center">
          {language === 'en' ? 'Frequently Asked Questions' : 'Ibibazo Byakunze Kubazwa'}
        </h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-gray-800">{faq.question}</span>
                <span className="text-gray-600">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 text-gray-700">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-primary-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            {language === 'en' ? 'Still have questions?' : 'Urakomeje kubaza?'}
          </h2>
          <p className="text-gray-700 mb-6">
            {language === 'en'
              ? 'Contact us via WhatsApp, phone, or email. We\'re here to help!'
              : 'Twandikire kuri WhatsApp, telefoni, cyangwa imeyili. Turi hano kugira ngo dufashwe!'
            }
          </p>
          <a
            href="https://wa.me/250788123456"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            {language === 'en' ? 'Chat on WhatsApp' : 'Vugana kuri WhatsApp'}
          </a>
        </div>
      </div>
    </div>
  )
}

export default FAQ


