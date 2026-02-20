import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import useAuthStore from '../stores/authStore'
import useLanguageStore from '../stores/languageStore'
import LazyImage from '../components/LazyImage'

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
      await signIn(data.emailOrPhone, data.password)
      
      const currentUser = useAuthStore.getState().user

      toast.success(
        language === 'en' 
          ? `Welcome back, ${currentUser?.name || 'User'}!` 
          : `Murakaza neza, ${currentUser?.name || 'User'}!`,
        { id: 'auth-success' }
      )

      if (currentUser?.email === 'admin@kigaliswim.com' || currentUser?.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/profile')
      }

    } catch (error) {
      const errorMessage = language === 'en' 
        ? 'Invalid email or password' 
        : "Imeli cyangwa ijambo ry'ibanga sibyo"
      
      setAuthError(errorMessage)
      toast.error(errorMessage, { id: 'auth-error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 pt-32 pb-12">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
        
        <div className="hidden md:block w-1/2 bg-slate-900 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-600/20 to-slate-900/90 z-10" />
          <LazyImage 
            src="https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=80&w=2070&auto=format&fit=crop" 
            alt="Swimmer" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="relative z-20 h-full flex flex-col justify-end p-12 text-white">
            <h2 className="text-4xl font-black mb-4 tracking-tight">
              {language === 'en' ? 'Welcome Back' : 'Murakaza Neza'}
            </h2>
            <p className="text-lg text-slate-300 font-medium">
              {language === 'en' 
                ? 'Access your orders and wishlist.' 
                : 'Reba ibyo watumije n\'ibyo wakunze.'}
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center md:text-left mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
              {language === 'en' ? 'Sign In' : 'Injira'}
            </h1>
            <p className="text-slate-500 font-medium">
              {language === 'en' ? 'New here?' : 'Uri mushya?'} 
              <Link to="/signup" className="text-sky-600 font-bold ml-1 hover:text-sky-700 transition-colors">
                {language === 'en' ? 'Create an account' : 'Fungura konti'}
              </Link>
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm font-bold flex items-center gap-2 animate-shake">
              <span>⚠️</span> {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
                {language === 'en' ? 'Email or Phone' : 'Imeli cyangwa Terefoni'}
              </label>
              <input
                {...register('emailOrPhone', { required: true })}
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
                placeholder="name@example.com"
              />
              {errors.emailOrPhone && <span className="text-[10px] font-bold text-rose-500 mt-1 ml-1 uppercase">Required</span>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">
                  {language === 'en' ? 'Password' : "Ijambo ry'ibanga"}
                </label>
                <Link to="/forgot-password" university className="text-xs text-sky-600 font-bold hover:text-sky-700 transition-colors">
                  {language === 'en' ? 'Forgot?' : 'Waryibagiwe?'}
                </Link>
              </div>
              <input
                {...register('password', { required: true })}
                type="password"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
                placeholder="••••••••"
              />
              {errors.password && <span className="text-[10px] font-bold text-rose-500 mt-1 ml-1 uppercase">Required</span>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white font-black py-4 rounded-xl shadow-xl hover:bg-slate-800 hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
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

export default SignIn