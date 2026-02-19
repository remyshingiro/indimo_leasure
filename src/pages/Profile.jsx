import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import useAuthStore from '../stores/authStore'
import useLanguageStore from '../stores/languageStore'
import useOrderStore from '../stores/orderStore'
import { formatRWF } from '../utils/currency'

// Firebase Database Imports for Saving Profile
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

const Profile = () => {
  const navigate = useNavigate()
  
  // Auth & Language
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)
  const language = useLanguageStore((state) => state.language)
  
  // Orders
  const { userOrders, fetchUserOrders, isLoading: ordersLoading } = useOrderStore()
  
  const [editing, setEditing] = useState(false)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  const { register, handleSubmit } = useForm({
    defaultValues: user || {}
  })

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  // Fetch Live Cloud Orders on Mount
  useEffect(() => {
    if (user) {
      const userId = user.uid || user.id
      fetchUserOrders(userId)
    }
  }, [user, fetchUserOrders])

  if (!user) return null

  // ☁️ UPDATED: Save Profile Changes to Firebase
  const onSubmit = async (data) => {
    setIsUpdatingProfile(true)
    try {
      const userId = user.uid || user.id
      
      if (userId) {
        // 1. Save directly to Firebase Firestore
        const userRef = doc(db, 'users', userId)
        await setDoc(userRef, {
          name: data.name || '',
          phone: data.phone || '',
          email: data.email || '',
          updatedAt: new Date().toISOString()
        }, { merge: true }) 
      }

      // 2. Update local UI using Zustand's built-in setState (No need for updateProfile function!)
      useAuthStore.setState({ user: { ...user, ...data } })
      
      // 3. Close form
      setEditing(false) 
    } catch (error) {
      console.error("Failed to save profile to cloud:", error)
      alert(language === 'en' ? 'Failed to update profile' : 'Habaye ikibazo')
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-orange-100 text-orange-600',
      processing: 'bg-blue-100 text-blue-600',
      shipped: 'bg-purple-100 text-purple-600',
      completed: 'bg-green-100 text-green-600',
      cancelled: 'bg-red-100 text-red-600'
    }
    return colors[status] || 'bg-slate-100 text-slate-600'
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* === HEADER === */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
              {language === 'en' ? `Hello, ${user.name || 'Valued Customer'}!` : `Muraho, ${user.name || 'Mukiriya'}!`}
            </h1>
            <p className="text-slate-500">
              {language === 'en' ? 'Manage your account and view orders.' : 'Cunga konti yawe urebe ibyo watumije.'}
            </p>
          </div>
          
          <div className="flex gap-3">
             {user.role === 'admin' && (
                <button 
                  onClick={() => navigate('/admin')}
                  className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-transform active:scale-95"
                >
                  ⚡ Admin Dash
                </button>
             )}
             <button 
               onClick={handleSignOut}
               className="px-6 py-3 bg-white border border-slate-200 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-colors shadow-sm"
             >
               {language === 'en' ? 'Sign Out' : 'Sohoka'}
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* === LEFT COLUMN: PROFILE CARD === */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-fit sticky top-28">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto">
                {user.name?.charAt(0).toUpperCase() || '👤'}
              </div>
              
              {!editing ? (
                <div className="text-center space-y-4">
                  <div>
                     <h2 className="text-xl font-bold text-slate-900">{user.name || 'Guest User'}</h2>
                     <p className="text-sm text-slate-500">{user.email || 'No Email'}</p>
                     <p className="text-sm text-slate-500">{user.phone || 'No Phone'}</p>
                  </div>
                  <div className="pt-4">
                     <button
                       onClick={() => setEditing(true)}
                       className="w-full py-2 border border-slate-200 rounded-lg text-slate-600 font-bold text-sm hover:bg-slate-50 transition"
                     >
                       Edit Profile
                     </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                   <div><label className="text-xs font-bold text-slate-400 uppercase">Name</label><input {...register('name')} className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-sm" /></div>
                   <div><label className="text-xs font-bold text-slate-400 uppercase">Email</label><input {...register('email')} className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-sm" disabled /></div>
                   <div><label className="text-xs font-bold text-slate-400 uppercase">Phone</label><input {...register('phone')} className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 text-sm" /></div>
                   <div className="flex gap-2 pt-2">
                     <button type="button" onClick={() => setEditing(false)} className="flex-1 py-2 text-sm font-bold text-slate-500">Cancel</button>
                     <button type="submit" disabled={isUpdatingProfile} className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold shadow-md">
                       {isUpdatingProfile ? 'Saving...' : 'Save'}
                     </button>
                   </div>
                </form>
              )}
            </div>
          </div>

          {/* === RIGHT COLUMN: LIVE CLOUD ORDERS === */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                 <span>📦</span> {language === 'en' ? 'Order History' : 'Ibyo Watumije'}
              </h2>
            </div>

            {ordersLoading ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4"></div>
                <p className="text-slate-500 font-bold">Loading your orders...</p>
              </div>
            ) : userOrders.length === 0 ? (
              <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
                <div className="text-6xl mb-4 opacity-30">🛒</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No orders yet</h3>
                <button onClick={() => navigate('/products')} className="mt-4 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition">
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <div key={order.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                           <span className="font-bold text-slate-900">Order #{order.id.toString().slice(-6).toUpperCase()}</span>
                           <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(order.status || 'pending')}`}>
                             {order.status || 'pending'}
                           </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <p className="text-lg font-black text-slate-900">{formatRWF(order.total)}</p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                       {order.items && order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                             <span className="text-slate-700 font-medium">
                               {item.quantity}x {item.nameRw || item.name} {item.selectedSize ? `(${item.selectedSize})` : ''}
                             </span>
                             <span className="text-slate-500">{formatRWF(item.price * item.quantity)}</span>
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