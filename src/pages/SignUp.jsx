import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import useAuthStore from '../stores/authStore'
import useLanguageStore from '../stores/languageStore'
import { sanitizeFormData, validateEmail, validatePhone } from '../utils/security'
import { errorHandler } from '../utils/errorHandler'

const SignUp = () => {
  const navigate = useNavigate()
  const signUp = useAuthStore((state) => state.signUp)
  const language = useLanguageStore((state) => state.language)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const password = watch('password')

  const onSubmit = async (data) => {
    setError('')
    setLoading(true)
    
    try {
      // Sanitize form data
      const sanitized = sanitizeFormData(data)
      
      // Additional validation
      if (!validateEmail(sanitized.email)) {
        setError(language === 'en' ? 'Invalid email address' : 'Imeri ntabwo ari yo')
        setLoading(false)
        return
      }
      
      if (!validatePhone(sanitized.phone)) {
        setError(language === 'en' ? 'Invalid phone number format' : 'Numero ya telefoni ntabwo ari yo')
        setLoading(false)
        return
      }
      
      if (sanitized.password.length < 6) {
        setError(language === 'en' ? 'Password must be at least 6 characters' : 'Ijambo ry\'ibanga rikwiye kuba rigufi cyane cyane 6')
        setLoading(false)
        return
      }
      
      await errorHandler.handleAsync(async () => {
        await signUp(sanitized)
        navigate('/profile')
      }, { context: 'signUp' })
    } catch (err) {
      const friendlyMessage = errorHandler.getUserFriendlyMessage(err)
      setError(err.message || friendlyMessage || (language === 'en' ? 'Failed to create account. Please try again.' : 'Ntibyashoboye kurema konti. Nyamuneka gerageza nanone.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="card-soft p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {language === 'en' ? 'Create Account' : 'Kurema Konti'}
        </h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              {language === 'en' ? 'Full Name' : 'Amazina Yuzuye'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('name', { required: language === 'en' ? 'Name is required' : 'Amazina akenewe' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder={language === 'en' ? 'John Doe' : 'John Doe'}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              {language === 'en' ? 'Email' : 'Imeri'} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register('email', {
                required: language === 'en' ? 'Email is required' : 'Imeri ikenewe',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: language === 'en' ? 'Invalid email address' : 'Imeri ntabwo ari yo'
                }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              {language === 'en' ? 'Phone Number' : 'Numero ya Telefoni'} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              {...register('phone', {
                required: language === 'en' ? 'Phone is required' : 'Telefoni ikenewe',
                pattern: {
                  value: /^[0-9+\-\s()]+$/,
                  message: language === 'en' ? 'Invalid phone number' : 'Numero ya telefoni ntabwo ari yo'
                }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="+250 788 123 456"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              {language === 'en' ? 'Password' : 'Ijambo ry\'ibanga'} <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register('password', {
                required: language === 'en' ? 'Password is required' : 'Ijambo ry\'ibanga rikenewe',
                minLength: {
                  value: 6,
                  message: language === 'en' ? 'Password must be at least 6 characters' : 'Ijambo ry\'ibanga rikwiye kuba rigufi cyane cyane 6'
                }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              {language === 'en' ? 'Confirm Password' : 'Emeza Ijambo ry\'ibanga'} <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register('confirmPassword', {
                required: language === 'en' ? 'Please confirm password' : 'Nyamuneka emeza ijambo ry\'ibanga',
                validate: value => value === password || (language === 'en' ? 'Passwords do not match' : 'Amajambo y\'ibanga ntacyo bihuye')
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading
              ? (language === 'en' ? 'Creating Account...' : 'Kurema Konti...')
              : (language === 'en' ? 'Create Account' : 'Kurema Konti')
            }
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          {language === 'en' ? 'Already have an account?' : 'Ufite konti?'}{' '}
          <Link to="/signin" className="text-primary-600 hover:underline font-semibold">
            {language === 'en' ? 'Sign In' : 'Injira'}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp

