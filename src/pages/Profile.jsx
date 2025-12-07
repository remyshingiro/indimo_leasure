import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import useAuthStore from '../stores/authStore'
import useLanguageStore from '../stores/languageStore'
import { formatRWF } from '../utils/currency'

const Profile = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)
  const updateProfile = useAuthStore((state) => state.updateProfile)
  const getUserOrders = useAuthStore((state) => state.getUserOrders)
  const language = useLanguageStore((state) => state.language)
  
  const [editing, setEditing] = useState(false)
  const [orders, setOrders] = useState([])
  
  useEffect(() => {
    const loadOrders = async () => {
      const userOrders = await getUserOrders()
      setOrders(userOrders)
    }
    loadOrders()
  }, [getUserOrders])

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: user || {}
  })

  if (!user) {
    navigate('/signin')
    return null
  }

  const onSubmit = (data) => {
    updateProfile(data)
    setEditing(false)
    alert(language === 'en' ? 'Profile updated successfully!' : 'Profil yavuguruye neza!')
  }

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          {language === 'en' ? 'My Profile' : 'Profil Yanjye'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="card-soft p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl text-primary-600">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-600">{user.phone}</p>
              </div>

              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded-lg transition mb-2"
                >
                  {language === 'en' ? 'Edit Profile' : 'Guhindura Profil'}
                </button>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      {...register('name', { required: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      {...register('email', { required: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      {...register('phone', { required: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 rounded-lg transition"
                    >
                      {language === 'en' ? 'Save' : 'Bika'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition"
                    >
                      {language === 'en' ? 'Cancel' : 'Kureka'}
                    </button>
                  </div>
                </form>
              )}

              <button
                onClick={handleSignOut}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition mt-4"
              >
                {language === 'en' ? 'Sign Out' : 'Sohoka'}
              </button>
            </div>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            <div className="card-soft p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {language === 'en' ? 'Order History' : 'Amateka y\'Amabwiriza'}
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">
                    {language === 'en' ? 'No orders yet' : 'Nta mabwiriza yabonetse'}
                  </p>
                  <button
                    onClick={() => navigate('/products')}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-2 rounded-lg transition"
                  >
                    {language === 'en' ? 'Start Shopping' : 'Tangira Gucuruza'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {language === 'en' ? 'Order' : 'Itegeko'} #{order.id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary-600">
                            {formatRWF(order.total)}
                          </p>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>
                          {order.items.length} {language === 'en' ? 'item(s)' : 'ibintu'}
                        </p>
                        <p>
                          {language === 'en' ? 'Payment' : 'Kwishyura'}: {order.paymentMethod.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

