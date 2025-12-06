import useLanguageStore from '../stores/languageStore'

const ReturnPolicy = () => {
  const language = useLanguageStore((state) => state.language)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {language === 'en' ? 'Return & Exchange Policy' : 'Politiki y\'Gusubiza n\'Guhindura'}
        </h1>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? '7-Day Return Policy' : 'Politiki y\'Amashyirahamwe 7'}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {language === 'en'
                ? 'We want you to be completely satisfied with your purchase. If you are not happy with your order, you can return it within 7 days of delivery for a full refund or exchange.'
                : 'Turashaka ko wishimiye cyane n\'igura ryose. Niba utishimiye n\'itegeko, urashobora gusubiza mu mashyirahamwe 7 y\'ubwoba kugira ngo wakire amafaranga yose cyangwa guhindura.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Return Conditions' : 'Amabwiriza yo Gusubiza'}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                {language === 'en'
                  ? 'Items must be unused and in original packaging'
                  : 'Ibicuruzwa bigomba kuba bitarakoreshwa kandi biri mu bubiko bw\'ibanze'
                }
              </li>
              <li>
                {language === 'en'
                  ? 'Items must be returned within 7 days of delivery'
                  : 'Ibicuruzwa bigomba gusubizwa mu mashyirahamwe 7 y\'ubwoba'
                }
              </li>
              <li>
                {language === 'en'
                  ? 'Original receipt or proof of purchase is required'
                  : 'Inyandiko y\'ibanze cyangwa ikimenyetso cy\'igura bikenewe'
                }
              </li>
              <li>
                {language === 'en'
                  ? 'Swimwear must be tried on over underwear (hygiene reasons)'
                  : 'Impuzu z\'amazi zigomba kugerwaho mu mpuzu z\'ibanze (kubera ubwoba)'
                }
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'How to Return' : 'Uburyo bwo Gusubiza'}
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>
                {language === 'en'
                  ? 'Contact us via WhatsApp (+250 788 123 456) or email (info@kigaliswimshop.com) to initiate a return'
                  : 'Twandikire kuri WhatsApp (+250 788 123 456) cyangwa imeyili (info@kigaliswimshop.com) kugira ngo dutangire gusubiza'
                }
              </li>
              <li>
                {language === 'en'
                  ? 'Provide your order number and reason for return'
                  : 'Tanga umubare w\'itegeko n\'impamvu yo gusubiza'
                }
              </li>
              <li>
                {language === 'en'
                  ? 'We will arrange for pickup or provide return instructions'
                  : 'Tuzategura gufata cyangwa kugenera amabwiriza yo gusubiza'
                }
              </li>
              <li>
                {language === 'en'
                  ? 'Once we receive and inspect the item, we will process your refund or exchange within 3-5 business days'
                  : 'Tumaze gukora kandi gusuzuma igicuruzwa, tuzakora gusubiza amafaranga cyangwa guhindura mu minsi 3-5 y\'ubucuruzi'
                }
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Refund Process' : 'Gusubiza Amafaranga'}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {language === 'en'
                ? 'Refunds will be processed using the same payment method you used for the original purchase. For cash on delivery orders, refunds will be made via Mobile Money or bank transfer.'
                : 'Gusubiza amafaranga kuzakorwa ukoresheje uburyo bwo kwishyura wakoresheje mu gura ry\'ibanze. Kuri itegeko ry\'ishyura mu mwanya, gusubiza amafaranga kuzakorwa ukoresheje Mobile Money cyangwa kwishyura mu banki.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Non-Returnable Items' : 'Ibicuruzwa Bitazasubizwa'}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                {language === 'en'
                  ? 'Items that have been used or damaged'
                  : 'Ibicuruzwa byakoreshejwe cyangwa byononekaye'
                }
              </li>
              <li>
                {language === 'en'
                  ? 'Items without original packaging or tags'
                  : 'Ibicuruzwa bitagira bubiko bw\'ibanze cyangwa tagi'
                }
              </li>
              <li>
                {language === 'en'
                  ? 'Items returned after 7 days'
                  : 'Ibicuruzwa byasubizwe nyuma y\'amashyirahamwe 7'
                }
              </li>
            </ul>
          </section>

          <section className="bg-primary-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Questions?' : 'Ibibazo?'}
            </h2>
            <p className="text-gray-700 mb-4">
              {language === 'en'
                ? 'If you have any questions about our return policy, please contact us:'
                : 'Niba ufite ibibazo byerekeye politiki yacu yo gusubiza, twandikire:'
              }
            </p>
            <div className="space-y-2 text-gray-700">
              <p>📱 WhatsApp: +250 788 123 456</p>
              <p>📧 Email: info@kigaliswimshop.com</p>
              <p>📞 Phone: +250 XXX XXX XXX</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ReturnPolicy



