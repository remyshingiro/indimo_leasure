import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import useAuthStore from '../stores/authStore'
import useLanguageStore from '../stores/languageStore'

const SignIn = () => {
  const navigate = useNavigate()
  const signIn = useAuthStore((state) => state.signIn)
  const language = useLanguageStore((state) => state.language)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setError('')
    setLoading(true)
    
    try {
      await signIn(data.emailOrPhone, data.password)
      navigate('/profile')
    } catch (err) {
      setError(err.message || 'Invalid email/phone or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="card-soft p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {language === 'en' ? 'Sign In' : 'Injira'}
        </h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              {language === 'en' ? 'Email or Phone' : 'Imeri cyangwa Telefoni'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('emailOrPhone', {
                required: language === 'en' ? 'Email or phone is required' : 'Imeri cyangwa telefoni ikenewe'
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="example@email.com or +250 788 123 456"
            />
            {errors.emailOrPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.emailOrPhone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              {language === 'en' ? 'Password' : 'Ijambo ry\'ibanga'} <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register('password', {
                required: language === 'en' ? 'Password is required' : 'Ijambo ry\'ibanga rikenewe'
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading
              ? (language === 'en' ? 'Signing In...' : 'Injira...')
              : (language === 'en' ? 'Sign In' : 'Injira')
            }
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          {language === 'en' ? "Don't have an account?" : 'Ntugira konti?'}{' '}
          <Link to="/signup" className="text-primary-600 hover:underline font-semibold">
            {language === 'en' ? 'Sign Up' : 'Kwiyandikisha'}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignIn

