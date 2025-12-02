import { Link } from 'react-router-dom'
import useLanguageStore from '../stores/languageStore'

const Footer = () => {
  const language = useLanguageStore((state) => state.language)

  const translations = {
    en: {
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
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {language === 'en' ? 'Kigali Swim Shop' : 'Ubwoba bw\'amazi Kigali'}
            </h3>
            <p className="text-gray-400 mb-4">
              {language === 'en' 
                ? 'Your trusted swimming equipment store in Kigali, Rwanda'
                : 'Ubwoba bw\'amazi bw\'ubwoba bw\'amazi mu Kigali, u Rwanda'
              }
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <p>{t.address}</p>
              <p>{t.phone}</p>
              <p>{t.email}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t.quickLinks}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="hover:text-white transition">
                  {language === 'en' ? 'Home' : 'Ahabanza'}
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition">
                  {language === 'en' ? 'Products' : 'Ibicuruzwa'}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  {language === 'en' ? 'About Us' : 'Ibyerekeye'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  {language === 'en' ? 'Contact' : 'Twandikire'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">{t.customerService}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/faq" className="hover:text-white transition">
                  {language === 'en' ? 'FAQs' : 'Ibibazo'}
                </Link>
              </li>
              <li>
                <Link to="/policies/returns" className="hover:text-white transition">
                  {language === 'en' ? 'Returns & Exchanges' : 'Gusubiza'}
                </Link>
              </li>
              <li>
                <Link to="/policies/privacy" className="hover:text-white transition">
                  {language === 'en' ? 'Privacy Policy' : 'Politiki y\'Ubwigenge'}
                </Link>
              </li>
              <li>
                <Link to="/policies/terms" className="hover:text-white transition">
                  {language === 'en' ? 'Terms & Conditions' : 'Amabwiriza'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="font-semibold mb-4">{t.paymentMethods}</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <span>📱</span>
                <span>MTN Mobile Money</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📱</span>
                <span>Airtel Money</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🏦</span>
                <span>{language === 'en' ? 'Bank Transfer' : 'Kwishyura mu banki'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>💵</span>
                <span>{language === 'en' ? 'Cash on Delivery' : 'Kwishyura mu mwanya'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Kigali Swim Shop. {t.rights}.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer


