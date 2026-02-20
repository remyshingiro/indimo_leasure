import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import useCartStore from '../stores/cartStore'
import useLanguageStore from '../stores/languageStore'
import useAuthStore from '../stores/authStore'
import useOrderStore from '../stores/orderStore'
import useProductStore from '../stores/productStore'
import { formatRWF, formatRWFSimple } from '../utils/currency'
import { DELIVERY_ZONES, getDeliveryFee } from '../utils/delivery'
import { sendOrderToWhatsApp } from '../utils/whatsapp'
import { CALL_PHONE } from '../utils/constants' // 🚀 Centralized Contact Import
import LazyImage from '../components/LazyImage'

const Checkout = () => {
  const navigate = useNavigate()
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const getTotal = useCartStore((state) => state.getTotal)
  
  const language = useLanguageStore((state) => state.language)
  const user = useAuthStore((state) => state.user)
  
  const createOrder = useOrderStore((state) => state.createOrder)
  const updateStock = useProductStore((state) => state.updateStock)
  
  const [selectedZone, setSelectedZone] = useState('gasabo')
  const [paymentMethod, setPaymentMethod] = useState('mtn')
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false)
  const [transactionId, setTransactionId] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastOrder, setLastOrder] = useState(null) 

  const { register, handleSubmit, formState: { errors } } = useForm()

  const subtotal = getTotal()
  const deliveryFee = getDeliveryFee(selectedZone)
  const finalTotal = subtotal + deliveryFee

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      navigate('/cart')
    }
  }, [items.length, orderPlaced, navigate])

  if (items.length === 0 && !orderPlaced) {
    return null
  }

  const onSubmit = (data) => {
    if (paymentMethod === 'cod') {
      handleOrderPlacement(data)
    } else {
      setShowPaymentInstructions(true)
      toast(
        language === 'en' ? 'Almost there! Please follow payment steps.' : 'Hasigaye gato! Kurikiza amabwiriza yo kwishyura.',
        { icon: '💳' }
      )
      setTimeout(() => {
        document.getElementById('payment-instructions')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  const handleOrderPlacement = async (customerData) => {
    setIsSubmitting(true)
    
    const safeName = customerData?.fullName || user?.name || 'Guest Customer'
    const safePhone = customerData?.phone || user?.phone || 'No Phone Provided'
    const safeEmail = customerData?.email || user?.email || 'No Email'
    const safeAddress = customerData?.address || 'No Address Provided'

    const orderPayload = {
      userId: user ? (user.uid || user.id || 'guest') : 'guest',
      customer: {
        fullName: safeName,
        address: safeAddress,
        email: safeEmail,
        phone: safePhone, 
      },
      items: items.map(item => ({
        productId: item.id || 'unknown',
        name: item.name || 'Unknown Product',
        nameRw: item.nameRw || '',
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        image: item.image || '',
        selectedSize: item.selectedSize || ''
      })),
      deliveryZone: selectedZone || 'gasabo',
      deliveryFee: Number(deliveryFee) || 0,
      subtotal: Number(subtotal) || 0,
      total: Number(finalTotal) || 0,
      paymentMethod: paymentMethod || 'cod',
      transactionId: paymentMethod !== 'cod' ? (transactionId || 'none') : 'none',
      createdAt: new Date().toISOString()
    }

    try {
      await createOrder(orderPayload)
      await updateStock(items)
      
      setLastOrder(orderPayload)
      clearCart()
      setOrderPlaced(true)
      window.scrollTo(0, 0)

      toast.success(
        language === 'en' ? 'Order Secured!' : 'Itegeko ryohererejwe!',
        { id: 'checkout-success' }
      )

      setTimeout(() => {
        sendOrderToWhatsApp(orderPayload)
      }, 2000)

    } catch (error) {
      console.error("Order Save Error:", error)
      toast.error(
        language === 'en' ? "Failed to save order." : "Habaye ikibazo.",
        { id: 'checkout-error' }
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaymentConfirmation = () => {
    if (!transactionId.trim()) {
      toast.error(language === 'en' ? 'Please enter transaction ID' : "Andika numero y'itegeko")
      return
    }
    const form = document.getElementById('checkout-form')
    
    if (form) {
       const inputs = form.elements
       const customerData = {
         fullName: inputs.fullName?.value || '',
         phone: inputs.phone?.value || '',
         email: inputs.email?.value || '',
         address: inputs.address?.value || ''
       }
       handleOrderPlacement(customerData)
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center px-4 text-slate-900">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-8 text-center border border-slate-100">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner animate-bounce-short">
            ✓
          </div>
          <h2 className="text-3xl font-black mb-2 tracking-tight">
            {language === 'en' ? 'Order Received!' : 'Itegeko Ryakiriwe!'}
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed font-medium">
            {language === 'en'
              ? "We've saved your order. You can speed up delivery by calling us or using WhatsApp below."
              : "Twageze ku itegeko ryawe. Hamagara cyangwa utwandikire kuri WhatsApp hano munsi dusoze vuba."
            }
          </p>

          <div className="bg-slate-50 rounded-2xl p-5 mb-8 border border-dashed border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Receipt Reference</p>
            <p className="text-lg font-mono font-bold text-slate-700">#KS-{Math.floor(1000 + Math.random() * 9000)}</p>
          </div>

          <div className="space-y-3">
            {/* 🚀 New: Direct Phone Call Logic */}
            <a
              href={`tel:${CALL_PHONE}`}
              className="block w-full bg-sky-600 hover:bg-sky-700 text-white font-black py-4 rounded-xl transition shadow-lg shadow-sky-100 flex items-center justify-center gap-2 active:scale-95"
            >
              <span className="text-xl">📞</span> 
              {language === 'en' ? 'Call to Confirm' : 'Hamagara ubu'}
            </a>

            {/* WhatsApp Fallback */}
            <button
              onClick={() => sendOrderToWhatsApp(lastOrder)}
              className="block w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-black py-4 rounded-xl transition shadow-lg shadow-green-100 flex items-center justify-center gap-2 active:scale-95"
            >
              <span className="text-xl">💬</span> 
              {language === 'en' ? 'Chat on WhatsApp' : 'Tuvugishe kuri WhatsApp'}
            </button>

            <div className="pt-4 flex flex-col gap-2">
                <Link
                to="/profile"
                className="text-slate-900 font-black text-sm underline decoration-slate-200 underline-offset-4 hover:decoration-sky-500 transition-all"
                >
                {language === 'en' ? 'View My Orders' : 'Reba Ibyo Watumije'}
                </Link>
                <Link
                to="/"
                className="text-slate-400 font-bold text-xs hover:text-sky-600 transition-colors"
                >
                {language === 'en' ? 'Back to Home' : 'Subira Ahabanza'}
                </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-4 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-center mb-6 lg:mb-8">
           <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white px-6 py-2.5 rounded-full shadow-sm border border-slate-100">
             <Link to="/cart" className="hover:text-sky-600 transition">Cart</Link>
             <span className="text-slate-200">/</span>
             <span className="text-slate-900">Checkout</span>
             <span className="text-slate-200">/</span>
             <span className="text-slate-200">Finish</span>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 lg:p-8">
                <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs shadow-md shadow-sky-200">1</span>
                  {language === 'en' ? 'Contact Information' : "Amakuru y'Umukiriya"}
                </h2>
                
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                      {language === 'en' ? 'Full Name' : 'Amazina Yose'}
                    </label>
                    <input
                      {...register('fullName', { required: true })}
                      defaultValue={user?.name || ''}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-medium"
                      placeholder="e.g. John Doe"
                    />
                    {errors.fullName && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase tracking-wider">Required</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                          {language === 'en' ? 'Phone Number' : "Numero y'Telefoni"}
                        </label>
                        <input
                          {...register('phone', { required: true })}
                          defaultValue={user?.phone || ''}
                          placeholder="+250 788 123 456"
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-medium"
                        />
                        {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase tracking-wider">Required</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                          {language === 'en' ? 'Email (Optional)' : 'Imeyili'}
                        </label>
                        <input
                          {...register('email')}
                          defaultValue={user?.email || ''}
                          type="email"
                          placeholder="john@example.com"
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-medium"
                        />
                      </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                      {language === 'en' ? 'Delivery Address' : 'Aderesi'}
                    </label>
                    <input
                      {...register('address', { required: true })}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-medium"
                      placeholder="Street, House Number, Landmark"
                    />
                    {errors.address && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase tracking-wider">Required</p>}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 lg:p-8">
                <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs shadow-md shadow-sky-200">2</span>
                  {language === 'en' ? 'Select Zone' : 'Hitamo Akarere'}
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(DELIVERY_ZONES).map(([key, zone]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedZone(key)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                        selectedZone === key
                          ? 'border-sky-500 bg-sky-50/50 shadow-md transform -translate-y-1'
                          : 'border-slate-50 hover:border-slate-200 bg-slate-50/30'
                      }`}
                    >
                      <div className={`font-black text-sm mb-1 ${selectedZone === key ? 'text-sky-600' : 'text-slate-700'}`}>
                        {language === 'en' ? zone.name : zone.nameRw}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        {formatRWFSimple(zone.fee)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 lg:p-8">
                <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs shadow-md shadow-sky-200">3</span>
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
                      className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                        paymentMethod === method.id 
                        ? 'border-sky-500 bg-sky-50/50 ring-4 ring-sky-500/10' 
                        : 'border-slate-50 hover:border-slate-200 bg-slate-50/30'
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
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-inner ${
                        paymentMethod === method.id ? 'bg-white text-sky-500' : 'bg-white text-slate-300 border border-slate-100'
                      }`}>
                        {method.icon}
                      </div>
                      <div>
                        <div className="font-black text-slate-900 text-sm">{method.name}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{method.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {!showPaymentInstructions && (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black py-5 rounded-2xl text-lg shadow-xl shadow-sky-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 border border-sky-400/20 active:scale-95"
                >
                  {isSubmitting 
                    ? (language === 'en' ? 'Processing...' : 'Biri Gukorwa...') 
                    : (language === 'en' ? 'Continue to Payment' : 'Komeza mu Kwishyura')
                  }
                </button>
              )}
            </form>

            {showPaymentInstructions && paymentMethod !== 'cod' && (
              <div id="payment-instructions" className="bg-slate-900 text-white rounded-[2rem] shadow-2xl p-8 animate-fade-in-up border border-slate-800">
                <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-6">
                  <h2 className="text-xl font-black flex items-center gap-2">
                    <span className="text-sky-400">🔒</span> {language === 'en' ? 'Secure Payment' : 'Kwishyura Bwite'}
                  </h2>
                  <div className="text-right">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Total to Pay</p>
                    <p className="text-3xl font-black text-sky-400">{formatRWFSimple(finalTotal)}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {(paymentMethod === 'mtn' || paymentMethod === 'airtel') && (
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-800 space-y-5">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-sky-500 text-slate-900 flex-shrink-0 flex items-center justify-center font-black text-sm">1</div>
                        <div>
                          <p className="font-bold text-slate-100">Dial *182#</p>
                          <p className="text-slate-500 text-xs mt-1">Open the dialer on your phone</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-sky-500 text-slate-900 flex-shrink-0 flex items-center justify-center font-black text-sm">2</div>
                        <div>
                           <p className="font-bold text-slate-100">Enter Merchant Code: <span className="text-sky-400 font-mono text-xl ml-2">123456</span></p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-sky-500 text-slate-900 flex-shrink-0 flex items-center justify-center font-black text-sm">3</div>
                        <div>
                           <p className="font-bold text-slate-100">Enter Amount: <span className="text-white font-mono ml-2">{formatRWFSimple(finalTotal)}</span></p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">
                       {language === 'en' ? 'Enter Transaction ID / Reference' : "Andika Numero y'Itegeko"}
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g. 8923412"
                      className="w-full px-5 py-5 bg-slate-800/50 border border-slate-700 rounded-2xl focus:outline-none focus:border-sky-500 text-white placeholder-slate-600 font-mono text-xl tracking-[0.2em] shadow-inner transition-all"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                      onClick={handlePaymentConfirmation}
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-300 hover:to-sky-500 text-slate-900 font-black py-5 rounded-2xl shadow-xl shadow-sky-500/10 transition-all disabled:opacity-50 text-lg active:scale-95"
                    >
                      {isSubmitting 
                        ? (language === 'en' ? 'Processing...' : 'Biri Gukorwa...') 
                        : (language === 'en' ? 'I Have Paid' : 'Narishyuze')
                      }
                    </button>
                    <button
                      onClick={() => setShowPaymentInstructions(false)}
                      disabled={isSubmitting}
                      className="px-8 py-5 border border-slate-700 text-slate-400 font-bold rounded-2xl hover:bg-slate-800 hover:text-white transition-all disabled:opacity-50"
                    >
                      {language === 'en' ? 'Cancel' : 'Hagarika'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 lg:p-8 sticky top-28">
              <h2 className="text-xl font-black text-slate-900 mb-6 pb-4 border-b border-slate-100 flex justify-between items-center">
                {language === 'en' ? 'Order Summary' : 'Incamake'}
                <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full uppercase tracking-wider">{items.length} Items</span>
              </h2>

              <div className="space-y-5 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 group">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100 group-hover:border-sky-200 transition-colors">
                       <LazyImage src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-sm font-black text-slate-800 line-clamp-1 group-hover:text-sky-600 transition-colors uppercase tracking-tight">{language === 'en' ? item.name : item.nameRw}</p>
                       <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-tighter">Qty: {item.quantity} {item.selectedSize && `• Size: ${item.selectedSize}`}</p>
                    </div>
                    <div className="text-sm font-black text-slate-900 whitespace-nowrap">
                       {formatRWFSimple(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 py-6 border-t border-slate-100">
                <div className="flex justify-between text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-slate-900 text-sm">{formatRWF(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <span>Delivery ({selectedZone})</span>
                  <span className="text-slate-900 text-sm">{formatRWF(deliveryFee)}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-dashed border-slate-200 bg-slate-50 -mx-6 lg:-mx-8 px-6 lg:px-8 pb-4 rounded-b-[2rem]">
                <div className="flex justify-between items-end">
                  <span className="font-black text-slate-900 uppercase tracking-[0.2em] text-[10px] mb-2">Total Amount</span>
                  <span className="text-4xl font-black text-sky-600 tracking-tighter">{formatRWF(finalTotal)}</span>
                </div>
                
                <div className="mt-8 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-100">
                    <span className="text-sky-500 text-sm">🔒</span> SSL Secured
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout