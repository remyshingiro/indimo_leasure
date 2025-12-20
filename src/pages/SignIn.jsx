import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import useAuthStore from '../stores/authStore'
import useLanguageStore from '../stores/languageStore'

const SignIn = () => {
  const navigate = useNavigate()
  const signIn = useAuthStore((state) => state.signIn)
  const language = useLanguageStore((state) => state.language)
  
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    setAuthError('')
    
    try {
      // 1. Log in the user (Admin OR Customer)
      await signIn(data.emailOrPhone, data.password)
      
      // 2. Check who they are
      // We access the store directly to get the freshest user data
      const currentUser = useAuthStore.getState().user

      // 3. Smart Redirect 🧠
      if (currentUser?.email === 'admin@kigaliswim.com') {
        // It's the Boss -> Go to Dashboard
        navigate('/admin')
      } else {
        // It's a Customer -> Go to their Profile (or Home)
        navigate('/profile')
      }

    } catch (error) {
      console.error(error)
      setAuthError(
        language === 'en' ? 'Invalid email or password' : 'Imeli cyangwa ijambo ry\'ibanga sibyo'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 pt-32 pb-12">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Visual */}
        <div className="hidden md:block w-1/2 bg-slate-900 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-600/20 to-slate-900/90 z-10" />
          <LazyImage 
            src="https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=80&w=2070&auto=format&fit=crop" 
            alt="Swimmer" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="relative z-20 h-full flex flex-col justify-end p-12 text-white">
            <h2 className="text-4xl font-black mb-4">
              {language === 'en' ? 'Welcome Back' : 'Murakaza Neza'}
            </h2>
            <p className="text-lg text-slate-300">
              {language === 'en' 
                ? 'Access your orders and wishlist.' 
                : 'Reba ibyo watumije n\'ibyo wakunze.'}
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center md:text-left mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-2">
              {language === 'en' ? 'Sign In' : 'Injira'}
            </h1>
            <p className="text-slate-500">
              {language === 'en' ? 'New here?' : 'Uri mushya?'} 
              <Link to="/signup" className="text-sky-600 font-bold ml-1 hover:underline">
                {language === 'en' ? 'Create an account' : 'Fungura konti'}
              </Link>
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
              <span>⚠️</span> {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {language === 'en' ? 'Email Address' : 'Imeli'}
              </label>
              <input
                {...register('emailOrPhone', { required: true })}
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                placeholder="name@example.com"
              />
              {errors.emailOrPhone && <span className="text-xs text-red-500 mt-1">Required</span>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-700">
                  {language === 'en' ? 'Password' : 'Ijambo ry\'ibanga'}
                </label>
                <Link to="/forgot-password" className="text-xs text-sky-600 font-bold hover:underline">
                  {language === 'en' ? 'Forgot?' : 'Waryibagiwe?'}
                </Link>
              </div>
              <input
                {...register('password', { required: true })}
                type="password"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                placeholder="••••••••"
              />
              {errors.password && <span className="text-xs text-red-500 mt-1">Required</span>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 hover:-translate-y-1 transition-all disabled:opacity-50 flex justify-center items-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                language === 'en' ? 'Sign In' : 'Injira'
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

export default SignIn