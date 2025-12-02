import useLanguageStore from '../stores/languageStore'

const About = () => {
  const language = useLanguageStore((state) => state.language)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {language === 'en' ? 'About Us' : 'Ibyerekeye'}
        </h1>

        <div className="prose max-w-none space-y-6">
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Our Story' : 'Inkuru Yacu'}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {language === 'en'
                ? 'Kigali Swim Shop was founded with a mission to provide high-quality swimming equipment to the growing swimming community in Kigali, Rwanda. We understand the importance of having the right gear for serious swimmers, families, and swimming clubs.'
                : 'Kigali Swim Shop yashinzwe n\'intego yo gutanga ibikoresho by\'amazi by\'ubwoko bwiza kuri abanyamazi, abantu, n\'amashyirahamwe y\'amazi mu Kigali, u Rwanda. Tuzi ko by\'ingenzi kugira ibikoresho bikwiye kuri abanyamazi, abantu, n\'amashyirahamwe.'
              }
            </p>
          </section>

          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Our Mission' : 'Intego Yacu'}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {language === 'en'
                ? 'To be the most trusted and reliable source of swimming equipment in Kigali, offering authentic products, excellent customer service, and fast delivery to support the swimming community.'
                : 'Kuba inkomoko y\'ubwoba bw\'amazi bw\'ubwoba bw\'amazi mu Kigali, dukoresha ibicuruzwa by\'ukuri, serivisi nziza z\'abakiriya, n\'ubwoba bwihuse kugira ngo dufashwe abanyamazi.'
              }
            </p>
          </section>

          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Why Choose Us' : 'Kuki Twihitiramo'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-4xl mb-2">⭐</div>
                <h3 className="font-semibold mb-2">
                  {language === 'en' ? 'Quality Products' : 'Ibicuruzwa by\'Ubwoba'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === 'en'
                    ? 'We only stock authentic, high-quality swimming equipment from trusted brands.'
                    : 'Tugira ibicuruzwa by\'ukuri, by\'ubwoko bwiza by\'amazi bituruka mu birango by\'ubwoba.'
                  }
                </p>
              </div>
              <div>
                <div className="text-4xl mb-2">🚚</div>
                <h3 className="font-semibold mb-2">
                  {language === 'en' ? 'Fast Delivery' : 'Ubwoba Bwihuse'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === 'en'
                    ? 'Quick 24-48 hour delivery within Kigali. Free delivery on orders over 50,000 RWF.'
                    : 'Ubwoba bwihuse bwa amasaha 24-48 mu Kigali. Ubwoba bw\'amashyirahamwe kuri itegeko rirenze 50,000 RWF.'
                  }
                </p>
              </div>
              <div>
                <div className="text-4xl mb-2">💳</div>
                <h3 className="font-semibold mb-2">
                  {language === 'en' ? 'Multiple Payment Options' : 'Amahitamo Menshi yo Kwishyura'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === 'en'
                    ? 'Pay with MTN MoMo, Airtel Money, Bank Transfer, or Cash on Delivery.'
                    : 'Kwishyura ukoresheje MTN MoMo, Airtel Money, Kwishyura mu Banki, cyangwa Kwishyura mu Mwanya.'
                  }
                </p>
              </div>
              <div>
                <div className="text-4xl mb-2">↩️</div>
                <h3 className="font-semibold mb-2">
                  {language === 'en' ? 'Easy Returns' : 'Gusubiza Byoroshye'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === 'en'
                    ? '7-day return policy. We want you to be completely satisfied with your purchase.'
                    : 'Politiki y\'amashyirahamwe 7. Turashaka ko wishimiye cyane n\'igura ryose.'
                  }
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Contact Information' : 'Amakuru y\'Ubwoba'}
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>{language === 'en' ? 'Location:' : 'Aho:'}</strong> Kigali, Rwanda
              </p>
              <p>
                <strong>{language === 'en' ? 'Phone:' : 'Telefoni:'}</strong> +250 XXX XXX XXX
              </p>
              <p>
                <strong>{language === 'en' ? 'Email:' : 'Imeyili:'}</strong> info@kigaliswimshop.com
              </p>
              <p>
                <strong>{language === 'en' ? 'WhatsApp:' : 'WhatsApp:'}</strong> +250 788 123 456
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default About


