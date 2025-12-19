import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import useCartStore from '../stores/cartStore'
import useLanguageStore from '../stores/languageStore'
import useAuthStore from '../stores/authStore'
import { formatRWF, formatRWFSimple } from '../utils/currency'
import { DELIVERY_ZONES, getDeliveryFee } from '../utils/delivery'
import LazyImage from '../components/LazyImage'
// 👇 NEW IMPORTS: Required to save to the real database
import { saveToDB, getFromDB, isIndexedDBAvailable } from '../utils/db'

const Checkout = () => {
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const getTotal = useCartStore((state) => state.getTotal)
  const language = useLanguageStore((state) => state.language)
  const user = useAuthStore((state) => state.user)
  const addOrderToUser = useAuthStore((state) => state.addOrderToUser)
  
  const [selectedZone, setSelectedZone] = useState('gasabo')
  const [paymentMethod, setPaymentMethod] = useState('mtn')
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false)
  const [transactionId, setTransactionId] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  const subtotal = getTotal()
  const deliveryFee = getDeliveryFee(selectedZone)
  const finalTotal = subtotal + deliveryFee

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  const onSubmit = (data) => {
    if (paymentMethod === 'cod') {
      handleOrderPlacement(data)
    } else {
      setShowPaymentInstructions(true)
      setTimeout(() => {
        document.getElementById('payment-instructions')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  // 👇 UPDATED FUNCTION: Now handles Database Saving
  const handleOrderPlacement = async (customerData) => {
    const order = {
      id: Date.now(),
      // Ensure we use the logged-in user's email/phone if available to link the order correctly
      customer: {
        ...customerData,
        email: user ? user.email : customerData.email,
        phone: user ? user.phone : customerData.phone,
      },
      items,
      deliveryZone: selectedZone,
      paymentMethod,
      transactionId: paymentMethod !== 'cod' ? transactionId : null,
      total: finalTotal,
      status: 'pending',
      date: new Date().toISOString()
    }

    try {
      // 1. Save to IndexedDB (The Real Database)
      if (isIndexedDBAvailable()) {
        const currentOrders = (await getFromDB('orders')) || []
        await saveToDB('orders', [...currentOrders, order])
      }

      // 2. Save to LocalStorage (Backup)
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      orders.push(order)
      localStorage.setItem('orders', JSON.stringify(orders))

      // 3. Link to User Profile
      if (user) {
        addOrderToUser(order)
      }

      // 4. Cleanup
      clearCart()
      setOrderPlaced(true)
      window.scrollTo(0, 0)

    } catch (error) {
      console.error("Order Save Error:", error)
      alert("There was an issue saving your order, but we have received it.")
      setOrderPlaced(true)
    }
  }

  const handlePaymentConfirmation = () => {
    if (!transactionId.trim()) {
      alert(language === 'en' ? 'Please enter transaction ID' : 'Andika numero y\'itegeko')
      return
    }
    const form = document.getElementById('checkout-form')
    // Re-construct form data since we are outside the onSubmit context
    if (form) {
       // Using React Hook Form's getValues would be cleaner, but standard DOM works here too
       // Since we didn't expose getValues, let's grab values from the DOM inputs
       const inputs = form.elements
       const customerData = {
          fullName: inputs.fullName.value,
          phone: inputs.phone.value,
          email: inputs.email.value,
          address: inputs.address.value
       }
       handleOrderPlacement(customerData)
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">
            {language === 'en' ? 'Order Confirmed!' : 'Itegeko Ryashyizweho!'}
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            {language === 'en'
              ? 'Thank you for shopping with us. We will contact you shortly to confirm your delivery.'
              : 'Murakoze ku tegeko! Tuzabagana vuba kugira ngo duhamagare amakuru y\'ubwoba.'
            }
          </p>
          <div className="space-y-3">
            <Link
              to="/profile"
              className="block w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition shadow-lg"
            >
              {language === 'en' ? 'View My Orders' : 'Reba Ibyo Watumije'}
            </Link>
            <Link
              to="/products"
              className="block w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-4 rounded-xl transition"
            >
              {language === 'en' ? 'Continue Shopping' : 'Komeza Gucuruza'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen py-32 lg:py-40 px-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="flex items-center justify-center mb-8 lg:mb-12">
           <div className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
             <Link to="/cart" className="hover:text-sky-600 transition">Cart</Link>
             <span className="text-slate-300">/</span>
             <span className="text-slate-900">Checkout</span>
             <span className="text-slate-300">/</span>
             <span>Finish</span>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* === LEFT COLUMN: FORMS (Span 7) === */}
          <div className="lg:col-span-7 space-y-8">
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              {/* 1. Contact Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 lg:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">1</span>
                  {language === 'en' ? 'Contact Information' : 'Amakuru y\'Umukiriya'}
                </h2>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {language === 'en' ? 'Full Name' : 'Amazina Yose'}
                    </label>
                    <input
                      {...register('fullName', { required: true })}
                      defaultValue={user?.name || ''}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                      placeholder="John Doe"
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">Required</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          {language === 'en' ? 'Phone Number' : 'Numero y\'Telefoni'}
                        </label>
                        <input
                          {...register('phone', { required: true })}
                          defaultValue={user?.phone || ''}
                          placeholder="+250 788 123 456"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">Required</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          {language === 'en' ? 'Email (Optional)' : 'Imeyili'}
                        </label>
                        <input
                          {...register('email')}
                          defaultValue={user?.email || ''}
                          type="email"
                          placeholder="john@example.com"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                        />
                      </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      {language === 'en' ? 'Delivery Address' : 'Aderesi'}
                    </label>
                    <input
                      {...register('address', { required: true })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                      placeholder="Street, House Number, Landmark"
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">Required</p>}
                  </div>
                </div>
              </div>

              {/* 2. Delivery Zone */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 lg:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">2</span>
                  {language === 'en' ? 'Select Zone' : 'Hitamo Akarere'}
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(DELIVERY_ZONES).map(([key, zone]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedZone(key)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                        selectedZone === key
                          ? 'border-sky-500 bg-sky-50 shadow-md transform -translate-y-1'
                          : 'border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className={`font-bold mb-1 ${selectedZone === key ? 'text-sky-700' : 'text-slate-700'}`}>
                        {language === 'en' ? zone.name : zone.nameRw}
                      </div>
                      <div className="text-xs text-slate-500">
                        {formatRWFSimple(zone.fee)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 lg:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">3</span>
                  {language === 'en' ? 'Payment Method' : 'Uburyo bwo Kwishyura'}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'mtn', name: 'MTN Mobile Money', icon: '📱', desc: 'Dial *182#' },
                    { id: 'airtel', name: 'Airtel Money', icon: '📱', desc: 'Dial *182#' },
                    { id: 'bank', name: 'Bank Transfer', icon: '🏦', desc: 'Direct Deposit' },
                    { id: 'cod', name: 'Cash on Delivery', icon: '💵', desc: 'Pay upon receipt' }
                  ].map((method) => (
                    <label 
                      key={method.id}
                      className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        paymentMethod === method.id 
                        ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-500' 
                        : 'border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                        paymentMethod === method.id ? 'bg-white' : 'bg-slate-100'
                      }`}>
                        {method.icon}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{method.name}</div>
                        <div className="text-xs text-slate-500">{method.desc}</div>
                      </div>
                      {paymentMethod === method.id && (
                        <div className="absolute top-4 right-4 text-sky-600">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              {!showPaymentInstructions && (
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 rounded-xl text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200"
                >
                  {language === 'en' ? 'Continue to Payment' : 'Komeza mu Kwishyura'}
                </button>
              )}
            </form>

            {/* 4. Payment Instructions */}
            {showPaymentInstructions && paymentMethod !== 'cod' && (
              <div id="payment-instructions" className="bg-slate-900 text-white rounded-2xl shadow-xl p-8 animate-fade-in-up">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    🔒 {language === 'en' ? 'Secure Payment' : 'Kwishyura Bwite'}
                  </h2>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs uppercase tracking-wider">Total to Pay</p>
                    <p className="text-2xl font-bold text-sky-400">{formatRWFSimple(finalTotal)}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* MTN Instructions */}
                  {paymentMethod === 'mtn' && (
                    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 space-y-4">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-sky-500 flex-shrink-0 flex items-center justify-center font-bold">1</div>
                        <div>
                          <p className="font-bold">Dial *182#</p>
                          <p className="text-slate-400 text-sm">On your phone</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-sky-500 flex-shrink-0 flex items-center justify-center font-bold">2</div>
                        <div>
                           <p className="font-bold">Enter Merchant Code: <span className="text-sky-400 font-mono text-lg">123456</span></p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-sky-500 flex-shrink-0 flex items-center justify-center font-bold">3</div>
                        <div>
                           <p className="font-bold">Enter Amount: <span className="text-white font-mono">{formatRWFSimple(finalTotal)}</span></p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Transaction ID Input */}
                  <div className="pt-4">
                    <label className="block text-sm font-bold text-slate-300 mb-2">
                       {language === 'en' ? 'Enter Transaction ID / Reference' : 'Andika Numero y\'Itegeko'}
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g., 8923412"
                      className="w-full px-4 py-4 bg-slate-800 border border-slate-600 rounded-xl focus:outline-none focus:border-sky-500 text-white placeholder-slate-500 font-mono text-lg tracking-widest"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handlePaymentConfirmation}
                      className="flex-1 bg-sky-500 hover:bg-sky-400 text-white font-bold py-4 rounded-xl shadow-lg transition"
                    >
                      {language === 'en' ? 'I Have Paid' : 'Narishyuze'}
                    </button>
                    <button
                      onClick={() => setShowPaymentInstructions(false)}
                      className="px-6 py-4 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-800 transition"
                    >
                      {language === 'en' ? 'Cancel' : 'Hagarika'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* === RIGHT COLUMN: STICKY RECEIPT (Span 5) === */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 lg:p-8 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
                {language === 'en' ? 'Order Summary' : 'Incamake'}
              </h2>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                       <LazyImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                       <p className="text-sm font-bold text-slate-900 line-clamp-2">{language === 'en' ? item.name : item.nameRw}</p>
                       <p className="text-xs text-slate-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                       {formatRWFSimple(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 py-4 border-t border-slate-100">
                <div className="flex justify-between text-slate-600 text-sm">
                  <span>Subtotal</span>
                  <span>{formatRWF(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-sm">
                  <span>Delivery ({selectedZone})</span>
                  <span>{formatRWF(deliveryFee)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-dashed border-slate-300">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tight">{formatRWF(finalTotal)}</span>
                </div>
              </div>
              
              <div className="mt-6 bg-slate-50 p-4 rounded-xl text-center">
                  <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
                    🔒 SSL Secured Checkout
                  </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Checkout