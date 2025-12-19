import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import useAuthStore from '../stores/authStore'
import useLanguageStore from '../stores/languageStore'

const SignUp = () => {
  const navigate = useNavigate()
  // 1. Get signUp function
  const signUp = useAuthStore((state) => state.signUp)
  const language = useLanguageStore((state) => state.language)
  
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const password = watch('password')

  const onSubmit = async (data) => {
    setIsLoading(true)
    setAuthError('')

    // 2. Prepare data exactly how your store wants it
    const newUserPayload = {
      name: data.fullName,
      email: data.email,
      phone: data.phone, // Store requires this!
      password: data.password
    }
    
    try {
      // 3. Attempt registration
      const createdUser = await signUp(newUserPayload)
      
      // 4. Redirect based on if it's the Admin email
      if (createdUser.email === 'admin@kigaliswim.com') {
        navigate('/admin')
      } else {
        navigate('/')
      }

    } catch (error) {
      // 5. Handle store validation errors (e.g. "Phone required")
      setAuthError(error.message || 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 pt-32 pb-12">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse">
        
        {/* Right Side: Visual */}
        <div className="hidden md:block w-1/2 bg-slate-900 relative">
          <div className="absolute inset-0 bg-gradient-to-bl from-sky-600/20 to-slate-900/90 z-10" />
          <LazyImage 
            src="https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=2070&auto=format&fit=crop" 
            alt="Pool" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="relative z-20 h-full flex flex-col justify-end p-12 text-white text-right">
            <h2 className="text-4xl font-black mb-4">{language === 'en' ? 'Join the Squad' : 'Iyandikishe'}</h2>
            <p className="text-lg text-slate-300">
              {language === 'en' ? 'Get exclusive deals, track your orders, and swim faster.' : 'Bona ibiciro byiza, kurikirana ibyo watumije.'}
            </p>
          </div>
        </div>

        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center md:text-left mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-2">
              {language === 'en' ? 'Create Account' : 'Fungura Konti'}
            </h1>
            <p className="text-slate-500">
              {language === 'en' ? 'Already a member?' : 'Ufite konti?'} 
              <Link to="/login" className="text-sky-600 font-bold ml-1 hover:underline">
                {language === 'en' ? 'Log In' : 'Injira'}
              </Link>
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
              <span>⚠️</span> {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                {language === 'en' ? 'Full Name' : 'Amazina'}
              </label>
              <input
                {...register('fullName', { required: true })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500 transition-all"
                placeholder="John Doe"
              />
              {errors.fullName && <span className="text-xs text-red-500">Required</span>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                {language === 'en' ? 'Email' : 'Imeli'}
              </label>
              <input
                {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500 transition-all"
                placeholder="you@example.com"
              />
              {errors.email && <span className="text-xs text-red-500">Valid email required</span>}
            </div>

            {/* Phone (REQUIRED BY STORE) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                {language === 'en' ? 'Phone Number' : 'Telefoni'}
              </label>
              <input
                {...register('phone', { required: true })}
                type="tel"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500 transition-all"
                placeholder="+250..."
              />
              {errors.phone && <span className="text-xs text-red-500">Phone required</span>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                {language === 'en' ? 'Password' : 'Ijambo ry\'ibanga'}
              </label>
              <input
                {...register('password', { required: true, minLength: 6 })}
                type="password"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500 transition-all"
                placeholder="••••••••"
              />
              {errors.password && <span className="text-xs text-red-500">Min 6 chars</span>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                {language === 'en' ? 'Confirm Password' : 'Emeza'}
              </label>
              <input
                {...register('confirmPassword', { 
                  validate: value => value === password || "Passwords do not match"
                })}
                type="password"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500 transition-all"
                placeholder="••••••••"
              />
              {errors.confirmPassword && <span className="text-xs text-red-500">Mismatch</span>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 hover:-translate-y-1 transition-all disabled:opacity-50 mt-4 flex justify-center items-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                language === 'en' ? 'Get Started' : 'Tangira'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// Simple Helper for Image
const LazyImage = ({ src, alt, className }) => <img src={src} alt={alt} className={className} />

export default SignUp