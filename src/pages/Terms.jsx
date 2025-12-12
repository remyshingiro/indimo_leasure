import useLanguageStore from '../stores/languageStore'

const Terms = () => {
  const language = useLanguageStore((state) => state.language)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {language === 'en' ? 'Terms & Conditions' : 'Amabwiriza'}
        </h1>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Agreement to Terms' : 'Kwemera Amabwiriza'}
            </h2>
            <p className="leading-relaxed">
              {language === 'en'
                ? 'By accessing and using this website, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our website.'
                : 'Mukoresha urubuga rwacu, mwemera kwemera amabwiriza. Niba mutemera, nyamuneka ntimukoreshe urubuga rwacu.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Products and Pricing' : 'Ibicuruzwa n\'Amafaranga'}
            </h2>
            <p className="leading-relaxed mb-4">
              {language === 'en'
                ? 'We strive to ensure product information and pricing is accurate. However, we reserve the right to correct any errors and update information at any time.'
                : 'Tugerageza kugira ngo amakuru y\'ibicuruzwa n\'amafaranga abe neza. Icyo cyose, dufite uburenganzira bwo gukosora amakosa n\'amakuru yose igihe cyose.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Orders and Payment' : 'Itegeko n\'Kwishyura'}
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                {language === 'en'
                  ? 'All orders are subject to product availability'
                  : 'Itegeko ryose rikubiyemo ubwoba bw\'ibicuruzwa'
                }
              </li>
              <li>
                {language === 'en'
                  ? 'Payment must be completed before order processing'
                  : 'Kwishyura kugomba gukorwa mbere y\'itegeko'
                }
              </li>
              <li>
                {language === 'en'
                  ? 'We accept MTN MoMo, Airtel Money, Bank Transfer, and Cash on Delivery'
                  : 'Tukemera MTN MoMo, Airtel Money, Kwishyura mu Banki, na Kwishyura mu Mwanya'
                }
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Delivery' : 'Ubwoba'}
            </h2>
            <p className="leading-relaxed">
              {language === 'en'
                ? 'Delivery times are estimates and may vary. We are not responsible for delays caused by factors beyond our control.'
                : 'Amashyirahamwe y\'ubwoba ni amashyirahamwe kandi arashobora guhinduka. Ntitwabaho gukomeza amashyirahamwe y\'ubwoba byatewe n\'ibintu bitari byacu.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Returns and Refunds' : 'Gusubiza n\'Gusubiza Amafaranga'}
            </h2>
            <p className="leading-relaxed">
              {language === 'en'
                ? 'Please refer to our Return Policy for detailed information about returns and refunds.'
                : 'Nyamuneka reba Politiki yacu yo Gusubiza kugira ngo ubashe amakuru yuzuye byerekeye gusubiza n\'gusubiza amafaranga.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Contact Information' : 'Amakuru y\'Ubwoba'}
            </h2>
            <p className="leading-relaxed">
              {language === 'en'
                ? 'For questions about these Terms, contact us at info@kigaliswimshop.com'
                : 'Kugira ngo ubashe ibibazo byerekeye amabwiriza, twandikire kuri info@kigaliswimshop.com'
              }
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Terms
//adsah



