import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import useCartStore from '../stores/cartStore'
import useLanguageStore from '../stores/languageStore'
import useAuthStore from '../stores/authStore'
import { formatRWF, formatRWFSimple } from '../utils/currency'
import { DELIVERY_ZONES, getDeliveryFee } from '../utils/delivery'

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
      // Cash on Delivery - no payment needed
      handleOrderPlacement(data)
    } else if (paymentMethod === 'mtn' || paymentMethod === 'airtel') {
      // Show payment instructions
      setShowPaymentInstructions(true)
    } else {
      // Bank transfer - show account details
      setShowPaymentInstructions(true)
    }
  }

  const handleOrderPlacement = (customerData) => {
    // In production, this would send to backend
    const order = {
      id: Date.now(),
      customer: customerData,
      items,
      deliveryZone: selectedZone,
      paymentMethod,
      transactionId: paymentMethod !== 'cod' ? transactionId : null,
      total: finalTotal,
      status: 'pending',
      date: new Date().toISOString()
    }

    // Save to localStorage (in production, send to API)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    orders.push(order)
    localStorage.setItem('orders', JSON.stringify(orders))

    // Link order to user if logged in
    if (user) {
      addOrderToUser(order)
    }

    clearCart()
    setOrderPlaced(true)
  }

  const handlePaymentConfirmation = () => {
    if (!transactionId.trim()) {
      alert(language === 'en' 
        ? 'Please enter transaction ID' 
        : 'Andika numero y\'itegeko'
      )
      return
    }
    // Get form data and place order
    const form = document.querySelector('form')
    const formData = new FormData(form)
    const customerData = Object.fromEntries(formData)
    handleOrderPlacement(customerData)
  }

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold mb-4">
            {language === 'en' ? 'Order Placed Successfully!' : 'Itegeko Ryashyizweho Neza!'}
          </h2>
          <p className="text-gray-600 mb-8">
            {language === 'en'
              ? 'Thank you for your order! We will contact you soon to confirm delivery details.'
              : 'Murakoze ku tegeko! Tuzabagana vuba kugira ngo duhamagare amakuru y\'ubwoba.'
            }
          </p>
          <Link
            to="/products"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            {language === 'en' ? 'Continue Shopping' : 'Komeza Gucuruza'}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {language === 'en' ? 'Checkout' : 'Kwishyura'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">
                {language === 'en' ? 'Customer Information' : 'Amakuru y\'Umukiriya'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'en' ? 'Full Name' : 'Amazina Yose'} *
                  </label>
                  <input
                    {...register('fullName', { required: true })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.fullName && (
                    <p className="text-red-600 text-sm mt-1">
                      {language === 'en' ? 'Required' : 'Bikenewe'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'en' ? 'Phone Number' : 'Numero y\'Telefoni'} *
                  </label>
                  <input
                    {...register('phone', { required: true, pattern: /^\+250\d{9}$/ })}
                    placeholder="+250 XXX XXX XXX"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1">
                      {language === 'en' ? 'Valid phone number required' : 'Numero y\'telefoni ikwiye'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'en' ? 'Email' : 'Imeyili'} (Optional)
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === 'en' ? 'Address' : 'Aderesi'} *
                  </label>
                  <input
                    {...register('address', { required: true })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {errors.address && (
                    <p className="text-red-600 text-sm mt-1">
                      {language === 'en' ? 'Required' : 'Bikenewe'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Zone */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">
                {language === 'en' ? 'Delivery Zone' : 'Akarere k\'Ubwoba'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(DELIVERY_ZONES).map(([key, zone]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedZone(key)}
                    className={`p-4 border-2 rounded-lg text-center transition ${
                      selectedZone === key
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-primary-300'
                    }`}
                  >
                    <div className="font-semibold">
                      {language === 'en' ? zone.name : zone.nameRw}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {formatRWFSimple(zone.fee)} • {zone.eta}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">
                {language === 'en' ? 'Payment Method' : 'Uburyo bwo Kwishyura'}
              </h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mtn"
                    checked={paymentMethod === 'mtn'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">MTN Mobile Money</div>
                    <div className="text-sm text-gray-600">
                      {language === 'en' ? 'Dial *182# to pay' : 'Kanda *182# kwishyura'}
                    </div>
                  </div>
                </label>
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="airtel"
                    checked={paymentMethod === 'airtel'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">Airtel Money</div>
                    <div className="text-sm text-gray-600">
                      {language === 'en' ? 'Use Airtel Money to pay' : 'Koresha Airtel Money kwishyura'}
                    </div>
                  </div>
                </label>
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">
                      {language === 'en' ? 'Bank Transfer' : 'Kwishyura mu Banki'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'en' ? 'Transfer to our bank account' : 'Kwishyura mu konti yacu'}
                    </div>
                  </div>
                </label>
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">
                      {language === 'en' ? 'Cash on Delivery' : 'Kwishyura mu Mwanya'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'en' ? 'Pay when you receive your order' : 'Kwishyura mugihe wakiriye itegeko'}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {!showPaymentInstructions && (
              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 rounded-lg text-lg transition"
              >
                {language === 'en' ? 'Continue to Payment' : 'Komeza mu Kwishyura'}
              </button>
            )}
          </form>

          {/* Payment Instructions */}
          {showPaymentInstructions && paymentMethod !== 'cod' && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-xl font-bold mb-4">
                {language === 'en' ? 'Payment Instructions' : 'Amabwiriza yo Kwishyura'}
              </h2>
              
              {paymentMethod === 'mtn' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold mb-2">
                      {language === 'en' ? 'Step 1: Dial *182#' : 'Intambwe 1: Kanda *182#'}
                    </p>
                    <p className="text-sm text-gray-700">
                      {language === 'en'
                        ? 'On your phone, dial *182# and follow the prompts'
                        : 'Kuri telefoni yawe, kanda *182# ukurikire amabwiriza'
                      }
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold mb-2">
                      {language === 'en' ? 'Step 2: Enter Merchant Code' : 'Intambwe 2: Andika Kode y\'Ubucuruzi'}
                    </p>
                    <p className="text-sm text-gray-700">
                      {language === 'en' ? 'Merchant Code: 123456' : 'Kode y\'Ubucuruzi: 123456'}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      {language === 'en' ? `Amount: ${formatRWFSimple(finalTotal)}` : `Umubare: ${formatRWFSimple(finalTotal)}`}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold mb-2">
                      {language === 'en' ? 'Step 3: Enter Transaction ID' : 'Intambwe 3: Andika Numero y\'Itegeko'}
                    </p>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder={language === 'en' ? 'Transaction ID' : 'Numero y\'Itegeko'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'airtel' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold mb-2">
                      {language === 'en' ? 'Step 1: Use Airtel Money' : 'Intambwe 1: Koresha Airtel Money'}
                    </p>
                    <p className="text-sm text-gray-700">
                      {language === 'en'
                        ? 'Send money to: +250788123456'
                        : 'Ohereza amafaranga kuri: +250788123456'
                      }
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      {language === 'en' ? `Amount: ${formatRWFSimple(finalTotal)}` : `Umubare: ${formatRWFSimple(finalTotal)}`}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold mb-2">
                      {language === 'en' ? 'Step 2: Enter Transaction ID' : 'Intambwe 2: Andika Numero y\'Itegeko'}
                    </p>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder={language === 'en' ? 'Transaction ID' : 'Numero y\'Itegeko'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold mb-2">
                      {language === 'en' ? 'Bank Account Details' : 'Amakuru y\'Akonte y\'Banki'}
                    </p>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>
                        {language === 'en' ? 'Bank:' : 'Banki:'} Bank of Kigali
                      </p>
                      <p>
                        {language === 'en' ? 'Account Name:' : 'Amazina y\'Akonte:'} Kigali Swim Shop
                      </p>
                      <p>
                        {language === 'en' ? 'Account Number:' : 'Numero y\'Akonte:'} 1234567890
                      </p>
                      <p>
                        {language === 'en' ? `Amount: ${formatRWFSimple(finalTotal)}` : `Umubare: ${formatRWFSimple(finalTotal)}`}
                      </p>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold mb-2">
                      {language === 'en' ? 'Enter Transaction Reference' : 'Andika Inyandiko y\'Itegeko'}
                    </p>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder={language === 'en' ? 'Transaction Reference' : 'Inyandiko y\'Itegeko'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handlePaymentConfirmation}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition"
                >
                  {language === 'en' ? 'Confirm Payment' : 'Emeza Kwishyura'}
                </button>
                <button
                  onClick={() => setShowPaymentInstructions(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  {language === 'en' ? 'Back' : 'Subira Inyuma'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">
              {language === 'en' ? 'Order Summary' : 'Incamake y\'Itegeko'}
            </h2>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {language === 'en' ? item.name : item.nameRw} x{item.quantity}
                  </span>
                  <span>{formatRWF(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-gray-600">
                  <span>{language === 'en' ? 'Subtotal' : 'Incamake'}</span>
                  <span>{formatRWF(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{language === 'en' ? 'Delivery' : 'Ubwoba'}</span>
                  <span>
                    {deliveryFee === 0 
                      ? (language === 'en' ? 'Free' : 'Ubwoba')
                      : formatRWF(deliveryFee)
                    }
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>{language === 'en' ? 'Total' : 'Incamake'}</span>
                    <span className="text-primary-600">{formatRWF(finalTotal)}</span>
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



