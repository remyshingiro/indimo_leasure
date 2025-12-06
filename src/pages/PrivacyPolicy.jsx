import useLanguageStore from '../stores/languageStore'

const PrivacyPolicy = () => {
  const language = useLanguageStore((state) => state.language)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {language === 'en' ? 'Privacy Policy' : 'Politiki y\'Ubwigenge'}
        </h1>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6 text-gray-700">
          <p className="text-sm text-gray-600 mb-6">
            {language === 'en'
              ? 'Last updated: [Date]'
              : 'Byasohotse bwa nyuma: [Itariki]'
            }
          </p>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Introduction' : 'Intangiriro'}
            </h2>
            <p className="leading-relaxed">
              {language === 'en'
                ? 'Kigali Swim Shop ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our website.'
                : 'Kigali Swim Shop ("twe", "wacu", cyangwa "twe") twiyemeje gukomeza ubwigenge bwawe. Iyi Politiki y\'Ubwigenge isobanura uko dukusanya, dukoresha, kandi dukomeza amakuru yawe y\'ubwoba mugihe ukoresha urubuga rwacu.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Information We Collect' : 'Amakuru Dukusanya'}
            </h2>
            <p className="leading-relaxed mb-4">
              {language === 'en' ? 'We collect the following information:' : 'Dukusanya amakuru akurikira:'}
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                {language === 'en'
                  ? 'Personal information (name, email, phone number, address) when you place an order'
                  : 'Amakuru y\'ubwoba (amazina, imeyili, numero y\'telefoni, aderesi) mugihe ushyiraho itegeko'
                }
              </li>
              <li>
                {language === 'en'
                  ? 'Payment information (processed securely through payment gateways)'
                  : 'Amakuru yo kwishyura (yakorwa neza ukoresheje inzira z\'ubwoba)'
                }
              </li>
              <li>
                {language === 'en'
                  ? 'Browsing data (cookies, device information) to improve your experience'
                  : 'Amakuru y\'ubwoba (cookies, amakuru y\'ubwoba) kugira ngo dukomeze ubwoba bwawe'
                }
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'How We Use Your Information' : 'Uko Dukoresha Amakuru Yawe'}
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                {language === 'en'
                  ? 'To process and fulfill your orders'
                  : 'Kugira ngo dukore kandi duhamagare itegeko ryawe'
                }
              </li>
              <li>
                {language === 'en'
                  ? 'To communicate with you about your orders'
                  : 'Kugira ngo duvugane nawe byerekeye itegeko ryawe'
                }
              </li>
              <li>
                {language === 'en'
                  ? 'To improve our website and services'
                  : 'Kugira ngo dukomeze urubuga rwacu n\'inshuti zacu'
                }
              </li>
              <li>
                {language === 'en'
                  ? 'To send promotional offers (with your consent)'
                  : 'Kugira ngo twohereze amashyirahamwe y\'ubwoba (n\'ubwoba bwawe)'
                }
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Data Security' : 'Ubwoba bw\'Amakuru'}
            </h2>
            <p className="leading-relaxed">
              {language === 'en'
                ? 'We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.'
                : 'Dukoresha amashyirahamwe y\'ubwoba y\'ubwoba kugira ngo dukomeze amakuru yawe y\'ubwoba. Icyo cyose, nta nzira y\'ubwoba kuri interineti ni 100% y\'ubwoba.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Contact Us' : 'Twandikire'}
            </h2>
            <p className="leading-relaxed">
              {language === 'en'
                ? 'If you have questions about this Privacy Policy, please contact us at info@kigaliswimshop.com'
                : 'Niba ufite ibibazo byerekeye iyi Politiki y\'Ubwigenge, twandikire kuri info@kigaliswimshop.com'
              }
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy



