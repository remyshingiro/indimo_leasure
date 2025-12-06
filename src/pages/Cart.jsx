import { Link } from 'react-router-dom'
import useCartStore from '../stores/cartStore'
import useLanguageStore from '../stores/languageStore'
import { formatRWF } from '../utils/currency'

const Cart = () => {
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)
  const getTotal = useCartStore((state) => state.getTotal)
  const language = useLanguageStore((state) => state.language)

  const total = getTotal()
  const deliveryFee = total > 50000 ? 0 : 2000
  const finalTotal = total + deliveryFee

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-4xl mb-4 shadow-soft-glow animate-float-slow">
            🛒
          </div>
          <h2 className="text-2xl font-bold mb-4">
            {language === 'en' ? 'Your cart is empty' : 'Gafuni yawe nta cyo irimo'}
          </h2>
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
        {language === 'en' ? 'Shopping Cart' : 'Gafuni'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-4xl">🏊</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {language === 'en' ? item.name : item.nameRw}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
                    {item.selectedSize && (
                      <p className="text-sm text-gray-600">
                        {language === 'en' ? 'Size' : 'Ingano'}: {item.selectedSize}
                      </p>
                    )}
                    {item.selectedColor && (
                      <p className="text-sm text-gray-600">
                        {language === 'en' ? 'Color' : 'Ibara'}: {item.selectedColor}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-600">
                          {formatRWF(item.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-sm text-red-600 hover:text-red-700 mt-1"
                        >
                          {language === 'en' ? 'Remove' : 'Kuraho'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={clearCart}
              className="mt-4 text-red-600 hover:text-red-700 text-sm"
            >
              {language === 'en' ? 'Clear Cart' : 'Siba Gafuni'}
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">
              {language === 'en' ? 'Order Summary' : 'Incamake y\'Itegeko'}
            </h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>{language === 'en' ? 'Subtotal' : 'Incamake'}</span>
                <span>{formatRWF(total)}</span>
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
              {total < 50000 && (
                <p className="text-sm text-gray-500">
                  {language === 'en' 
                    ? 'Add 50,000 RWF for free delivery'
                    : 'Ongeraho 50,000 RWF kugira ngo ubwoba bw\'amashyirahamwe'
                  }
                </p>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>{language === 'en' ? 'Total' : 'Incamake'}</span>
                  <span className="text-primary-600">{formatRWF(finalTotal)}</span>
                </div>
              </div>
            </div>
            <Link
              to="/checkout"
              className="block w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 rounded-lg text-center transition"
            >
              {language === 'en' ? 'Proceed to Checkout' : 'Komeza mu Kwishyura'}
            </Link>
            <Link
              to="/products"
              className="block w-full text-center mt-4 text-primary-600 hover:text-primary-700"
            >
              {language === 'en' ? 'Continue Shopping' : 'Komeza Gucuruza'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart


