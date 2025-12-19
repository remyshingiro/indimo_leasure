import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import useAuthStore from '../stores/authStore'
import useLanguageStore from '../stores/languageStore'

const SignIn = () => {
  const navigate = useNavigate()
  // 1. Get the signIn function from your store
  const signIn = useAuthStore((state) => state.signIn)
  const language = useLanguageStore((state) => state.language)
  
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    setAuthError('')
    
    try {
      // 2. Call the store with exactly what it expects (emailOrPhone, password)
      const user = await signIn(data.emailOrPhone, data.password)
      
      // 3. Smart Redirect
      if (user.email === 'admin@kigaliswim.com' || user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (error) {
      // 4. Handle store errors (like "Invalid credentials")
      setAuthError(error.message || (language === 'en' ? 'Invalid credentials' : 'Amakuru atariyo'))
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
            <h2 className="text-4xl font-black mb-4">{language === 'en' ? 'Welcome Back' : 'Murakaza Neza'}</h2>
            <p className="text-lg text-slate-300">
              {language === 'en' ? 'Ready to dive back in? Access your orders and saved items.' : 'Witeguye kongera koga? Reba ibyo watumije.'}
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
                {language === 'en' ? 'Email or Phone' : 'Imeli cyangwa Telefoni'}
              </label>
              <input
                {...register('emailOrPhone', { required: true })}
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                placeholder="email@example.com"
              />
              {errors.emailOrPhone && <span className="text-xs text-red-500 mt-1">Required</span>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-700">
                  {language === 'en' ? 'Password' : 'Ijambo ry\'ibanga'}
                </label>
                <a href="#" className="text-xs text-sky-600 font-bold hover:underline">Forgot?</a>
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

// Simple Helper for Image (In case you don't import the component)
const LazyImage = ({ src, alt, className }) => <img src={src} alt={alt} className={className} />

export default SignIn