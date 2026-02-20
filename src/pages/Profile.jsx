import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import useAuthStore from '../stores/authStore'
import useLanguageStore from '../stores/languageStore'
import useOrderStore from '../stores/orderStore'
import { formatRWF } from '../utils/currency'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

const Profile = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)
  const language = useLanguageStore((state) => state.language)
  const { userOrders, fetchUserOrders, isLoading: ordersLoading } = useOrderStore()
  
  const [editing, setEditing] = useState(false)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  const { register, handleSubmit } = useForm({
    defaultValues: user || {}
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  useEffect(() => {
    if (user) {
      const userId = user.uid || user.id
      fetchUserOrders(userId)
    }
  }, [user, fetchUserOrders])

  if (!user) return null

  const onSubmit = async (data) => {
    setIsUpdatingProfile(true)
    try {
      const userId = user.uid || user.id
      
      if (userId) {
        const userRef = doc(db, 'users', userId)
        await setDoc(userRef, {
          name: data.name || '',
          phone: data.phone || '',
          email: data.email || '',
          updatedAt: new Date().toISOString()
        }, { merge: true }) 
      }

      useAuthStore.setState({ user: { ...user, ...data } })
      
      toast.success(
        language === 'en' ? 'Profile updated successfully!' : 'Ibiranga konti byahinduwe neza!',
        { id: 'profile-update' }
      )
      
      setEditing(false) 
    } catch (error) {
      toast.error(
        language === 'en' ? 'Failed to update profile' : 'Habaye ikibazo mu guhindura konti',
        { id: 'profile-error' }
      )
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    toast.success(language === 'en' ? 'Signed out successfully' : 'Wasohotse neza')
    navigate('/')
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-orange-100 text-orange-600 border-orange-200',
      processing: 'bg-blue-100 text-blue-600 border-blue-200',
      shipped: 'bg-purple-100 text-purple-600 border-purple-200',
      completed: 'bg-green-100 text-green-600 border-green-200',
      cancelled: 'bg-red-100 text-red-600 border-red-200'
    }
    return colors[status] || 'bg-slate-100 text-slate-600 border-slate-200'
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-6 md:pt-10 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* === HEADER === */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">
              {language === 'en' ? `Hello, ${user.name || 'Valued Customer'}!` : `Muraho, ${user.name || 'Mukiriya'}!`}
            </h1>
            <p className="text-slate-500 font-medium">
              {language === 'en' ? 'Manage your account and view orders.' : 'Cunga konti yawe urebe ibyo watumije.'}
            </p>
          </div>
          
          <div className="flex gap-3">
             {(user.role === 'admin' || user.email === 'admin@kigaliswim.com') && (
                <button 
                  onClick={() => navigate('/admin')}
                  className="px-6 py-3 bg-slate-900 text-white font-black rounded-xl shadow-lg hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>⚡</span> Admin Dash
                </button>
             )}
             <button 
               onClick={handleSignOut}
               className="px-6 py-3 bg-white border border-slate-200 text-rose-500 font-black rounded-xl hover:bg-rose-50 transition-all shadow-sm active:scale-95"
             >
               {language === 'en' ? 'Sign Out' : 'Sohoka'}
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* === LEFT COLUMN: PROFILE CARD === */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-fit sticky top-28">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto border-4 border-white shadow-md text-slate-400">
                {user.name?.charAt(0).toUpperCase() || '👤'}
              </div>
              
              {!editing ? (
                <div className="text-center space-y-5">
                  <div>
                     <h2 className="text-xl font-black text-slate-900">{user.name || 'Guest User'}</h2>
                     <p className="text-sm text-slate-500 font-medium">{user.email || 'No Email'}</p>
                     <p className="text-sm text-slate-500 font-medium">{user.phone || 'No Phone'}</p>
                  </div>
                  <div className="pt-2">
                     <button
                       onClick={() => setEditing(true)}
                       className="w-full py-3 border border-slate-200 rounded-xl text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all"
                     >
                       Edit Profile
                     </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                   <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Name</label>
                     <input {...register('name')} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all font-medium" />
                   </div>
                   <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                     <input {...register('email')} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm opacity-50 cursor-not-allowed font-medium" disabled />
                   </div>
                   <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                     <input {...register('phone')} className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all font-medium" />
                   </div>
                   <div className="flex gap-3 pt-4">
                     <button type="button" onClick={() => setEditing(false)} className="flex-1 py-3 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Cancel</button>
                     <button 
                        type="submit" 
                        disabled={isUpdatingProfile} 
                        className="flex-1 py-3 bg-sky-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-sky-200 hover:bg-sky-600 disabled:opacity-50 transition-all active:scale-95"
                     >
                       {isUpdatingProfile ? 'Saving...' : 'Save'}
                     </button>
                   </div>
                </form>
              )}
            </div>
          </div>

          {/* === RIGHT COLUMN: ORDER HISTORY === */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
               <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">📦</span>
               {language === 'en' ? 'Order History' : 'Ibyo Watumije'}
            </h2>

            {ordersLoading ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600 mx-auto mb-4"></div>
                <p className="text-slate-500 font-bold">Loading your orders...</p>
              </div>
            ) : userOrders.length === 0 ? (
              <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
                <div className="text-6xl mb-4 opacity-20">🛒</div>
                <h3 className="text-lg font-black text-slate-900 mb-2">No orders yet</h3>
                <button onClick={() => navigate('/products')} className="mt-4 px-8 py-3 bg-slate-900 text-white rounded-xl font-black shadow-lg hover:bg-slate-800 hover:-translate-y-0.5 transition-all active:scale-95">
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <div key={order.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-center gap-3">
                           <span className="font-black text-slate-900">Order #{order.id.toString().slice(-6).toUpperCase()}</span>
                           <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase border ${getStatusColor(order.status || 'pending')}`}>
                             {order.status || 'pending'}
                           </span>
                        </div>
                        <p className="text-xs text-slate-400 font-bold mt-1.5">{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <p className="text-xl font-black text-sky-600">{formatRWF(order.total)}</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                       {order.items && order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                             <div className="flex items-center gap-2">
                               <span className="w-6 h-6 bg-white rounded-md flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-200">{item.quantity}x</span>
                               <span className="text-slate-700 font-bold">
                                 {item.nameRw || item.name} {item.selectedSize ? <span className="text-slate-400 text-xs ml-1">({item.selectedSize})</span> : ''}
                               </span>
                             </div>
                             <span className="text-slate-500 font-black text-xs">{formatRWF(item.price * item.quantity)}</span>
                          </div>
                       ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile