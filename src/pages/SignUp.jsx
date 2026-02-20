import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import useAuthStore from '../stores/authStore'
import useLanguageStore from '../stores/languageStore'
import LazyImage from '../components/LazyImage'

const SignUp = () => {
  const navigate = useNavigate()
  const signUp = useAuthStore((state) => state.signUp)
  const language = useLanguageStore((state) => state.language)
  
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const password = watch('password')

  const onSubmit = async (data) => {
    setIsLoading(true)
    setAuthError('')

    const newUserPayload = {
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      password: data.password
    }
    
    try {
      const createdUser = await signUp(newUserPayload)
      
      toast.success(
        language === 'en' ? 'Account created! Welcome.' : 'Konti yafunguwe! Murakaza neza.',
        { id: 'signup-success' }
      )

      if (createdUser.email === 'admin@kigaliswim.com' || createdUser.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }

    } catch (error) {
      const msg = error.message || (language === 'en' ? 'Failed to create account' : 'Gufungura konti byanze')
      setAuthError(msg)
      toast.error(msg, { id: 'signup-error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 pt-32 pb-12">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse border border-slate-100">
        
        <div className="hidden md:block w-1/2 bg-slate-900 relative">
          <div className="absolute inset-0 bg-gradient-to-bl from-sky-600/20 to-slate-900/90 z-10" />
          <LazyImage 
            src="https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=2070&auto=format&fit=crop" 
            alt="Pool" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="relative z-20 h-full flex flex-col justify-end p-12 text-white text-right">
            <h2 className="text-4xl font-black mb-4 tracking-tight">
              {language === 'en' ? 'Join the Squad' : 'Iyandikishe'}
            </h2>
            <p className="text-lg text-slate-300 font-medium">
              {language === 'en' 
                ? 'Get exclusive deals, track your orders, and swim faster.' 
                : 'Bona ibiciro byiza, kurikirana ibyo watumije.'}
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center md:text-left mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
              {language === 'en' ? 'Create Account' : 'Fungura Konti'}
            </h1>
            <p className="text-slate-500 font-medium">
              {language === 'en' ? 'Already a member?' : 'Ufite konti?'} 
              <Link to="/login" className="text-sky-600 font-bold ml-1 hover:text-sky-700 transition-colors">
                {language === 'en' ? 'Log In' : 'Injira'}
              </Link>
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm font-bold flex items-center gap-2 animate-shake">
              <span>⚠️</span> {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                {language === 'en' ? 'Full Name' : 'Amazina'}
              </label>
              <input
                {...register('fullName', { required: true })}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
                placeholder="John Doe"
              />
              {errors.fullName && <span className="text-[10px] font-bold text-rose-500 mt-1 ml-1 uppercase">Required</span>}
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                {language === 'en' ? 'Email' : 'Imeli'}
              </label>
              <input
                {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
                placeholder="you@example.com"
              />
              {errors.email && <span className="text-[10px] font-bold text-rose-500 mt-1 ml-1 uppercase">Valid email required</span>}
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                {language === 'en' ? 'Phone Number' : 'Telefoni'}
              </label>
              <input
                {...register('phone', { required: true })}
                type="tel"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
                placeholder="+250..."
              />
              {errors.phone && <span className="text-[10px] font-bold text-rose-500 mt-1 ml-1 uppercase">Phone required</span>}
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                {language === 'en' ? 'Password' : "Ijambo ry'ibanga"}
              </label>
              <input
                {...register('password', { required: true, minLength: 6 })}
                type="password"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
                placeholder="••••••••"
              />
              {errors.password && <span className="text-[10px] font-bold text-rose-500 mt-1 ml-1 uppercase">Min 6 chars</span>}
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                {language === 'en' ? 'Confirm Password' : 'Emeza'}
              </label>
              <input
                {...register('confirmPassword', { 
                  validate: value => value === password || "Passwords do not match"
                })}
                type="password"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
                placeholder="••••••••"
              />
              {errors.confirmPassword && <span className="text-[10px] font-bold text-rose-500 mt-1 ml-1 uppercase">Mismatch</span>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white font-black py-4 rounded-xl shadow-xl hover:bg-slate-800 hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 mt-4 flex justify-center items-center gap-2"
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

export default SignUp