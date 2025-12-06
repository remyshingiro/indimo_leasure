import { useState } from 'react'
import { useForm } from 'react-hook-form'
import useLanguageStore from '../stores/languageStore'

const Contact = () => {
  const language = useLanguageStore((state) => state.language)
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const onSubmit = (data) => {
    // In production, send to backend
    console.log('Contact form submitted:', data)
    setSubmitted(true)
    reset()
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {language === 'en' ? 'Contact Us' : 'Twandikire'}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">
              {language === 'en' ? 'Send us a Message' : 'Ohereza Ubutumwa'}
            </h2>
            
            {submitted && (
              <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg mb-6">
                {language === 'en'
                  ? 'Thank you! We will get back to you soon.'
                  : 'Murakoze! Tuzabagana vuba.'
                }
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'en' ? 'Name' : 'Amazina'} *
                </label>
                <input
                  {...register('name', { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">
                    {language === 'en' ? 'Required' : 'Bikenewe'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'en' ? 'Email' : 'Imeyili'} *
                </label>
                <input
                  {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {language === 'en' ? 'Valid email required' : 'Imeyili ikwiye'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'en' ? 'Phone' : 'Telefoni'}
                </label>
                <input
                  {...register('phone')}
                  placeholder="+250 XXX XXX XXX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'en' ? 'Message' : 'Ubutumwa'} *
                </label>
                <textarea
                  {...register('message', { required: true })}
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.message && (
                  <p className="text-red-600 text-sm mt-1">
                    {language === 'en' ? 'Required' : 'Bikenewe'}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition"
              >
                {language === 'en' ? 'Send Message' : 'Ohereza Ubutumwa'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">
                {language === 'en' ? 'Get in Touch' : 'Twandikire'}
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">📍</span>
                    <h3 className="font-semibold">
                      {language === 'en' ? 'Address' : 'Aderesi'}
                    </h3>
                  </div>
                  <p className="text-gray-600 ml-10">
                    Kigali, Rwanda
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">📞</span>
                    <h3 className="font-semibold">
                      {language === 'en' ? 'Phone' : 'Telefoni'}
                    </h3>
                  </div>
                  <p className="text-gray-600 ml-10">
                    +250 XXX XXX XXX
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">📧</span>
                    <h3 className="font-semibold">
                      {language === 'en' ? 'Email' : 'Imeyili'}
                    </h3>
                  </div>
                  <p className="text-gray-600 ml-10">
                    info@kigaliswimshop.com
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">💬</span>
                    <h3 className="font-semibold">WhatsApp</h3>
                  </div>
                  <a
                    href="https://wa.me/250788123456"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 ml-10"
                  >
                    +250 788 123 456
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-4">
                {language === 'en' ? 'Business Hours' : 'Amasaha y\'Ubucuruzi'}
              </h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>{language === 'en' ? 'Monday - Friday:' : 'Kuwa Mbere - Kuwa Gatanu:'}</strong> 9:00 AM - 6:00 PM
                </p>
                <p>
                  <strong>{language === 'en' ? 'Saturday:' : 'Kuwa Gatandatu:'}</strong> 9:00 AM - 4:00 PM
                </p>
                <p>
                  <strong>{language === 'en' ? 'Sunday:' : 'Ku cyumweru:'}</strong> Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact



