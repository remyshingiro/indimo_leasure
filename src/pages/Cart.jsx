import { Link } from 'react-router-dom'
import useCartStore from '../stores/cartStore'
import useLanguageStore from '../stores/languageStore'
import { formatRWF } from '../utils/currency'
import LazyImage from '../components/LazyImage'

const Cart = () => {
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const getTotal = useCartStore((state) => state.getTotal)
  const language = useLanguageStore((state) => state.language)

  const total = getTotal()
  const freeShippingThreshold = 50000
  const deliveryFee = total >= freeShippingThreshold ? 0 : 2000
  const finalTotal = total + deliveryFee
  
  const progress = Math.min((total / freeShippingThreshold) * 100, 100)

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <span className="text-4xl opacity-50">🛒</span>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-slate-800">
          {language === 'en' ? 'Your cart is empty' : 'Gafuni yawe nta cyo irimo'}
        </h2>
        <p className="text-slate-500 mb-8">
          {language === 'en' ? 'Looks like you haven\'t added any gear yet.' : 'Nta bikoresho urashyiramo.'}
        </p>
        <Link
          to="/products"
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3 rounded-full transition shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
        >
          {language === 'en' ? 'Start Shopping' : 'Tangira Gucuruza'}
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 tracking-tight">
          {language === 'en' ? 'Your Bag' : 'Gafuni Yawe'} 
          <span className="text-lg font-medium text-slate-400 ml-3">
            ({items.length} {items.length === 1 ? 'item' : 'items'})
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* === LEFT COLUMN: CART ITEMS === */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Free Shipping Progress Bar */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <div className="flex justify-between text-sm font-bold mb-2">
                 <span className={progress === 100 ? 'text-green-600' : 'text-slate-600'}>
                   {progress === 100 
                     ? (language === 'en' ? 'Free Shipping Unlocked! 🎉' : 'Ubwoba bw\'ubuntu! 🎉')
                     : (language === 'en' ? `Spend ${formatRWF(freeShippingThreshold - total)} for Free Shipping` : `Koresha ${formatRWF(freeShippingThreshold - total)} kugirango ubone ubwoba bw'ubuntu`)
                   }
                 </span>
                 <span className="text-slate-400">{Math.round(progress)}%</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                 <div 
                    className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${progress === 100 ? 'bg-green-500' : 'bg-sky-500'}`} 
                    style={{ width: `${progress}%` }}
                 ></div>
               </div>
            </div>

            {/* Items List */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              {items.map((item) => (
                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="p-4 sm:p-6 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <div className="flex gap-4 sm:gap-6">
                    
                    {/* Image */}
                    <Link to={`/products/${item.slug}`} className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-2xl flex-shrink-0 overflow-hidden border border-slate-200">
                      <LazyImage
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        fallback={<div className="w-full h-full flex items-center justify-center text-2xl">🏊</div>}
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                           <Link to={`/products/${item.slug}`} className="font-bold text-slate-900 text-lg hover:text-sky-600 transition line-clamp-2 mr-2">
                             {language === 'en' ? item.name : item.nameRw}
                           </Link>
                        </div>
                        <p className="text-slate-500 text-sm mb-2">{item.brand}</p>
                        
                        {/* Variants Chips */}
                        <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-600 mb-3">
                          {item.selectedSize && (
                            <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
                              {language === 'en' ? 'Size' : 'Ingano'}: {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
                              {language === 'en' ? 'Color' : 'Ibara'}: {item.selectedColor}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* --- MOBILE VIEW (Simplified: No Adding Buttons) --- */}
                      <div className="flex items-center justify-between mt-4 sm:hidden">
                        
                        {/* Static Quantity Badge (Saves Space) */}
                        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                           Qty: {item.quantity}
                        </div>

                        {/* Price & Remove Button */}
                        <div className="flex items-center gap-3">
                           {/* Price */}
                           <p className="font-bold text-slate-900 text-sm whitespace-nowrap">
                              {formatRWF(item.price * item.quantity)}
                           </p>

                           {/* Remove Button */}
                           <button
                             onClick={() => removeItem(item.id)}
                             className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-100 transition"
                             aria-label="Remove item"
                           >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                           </button>
                        </div>
                      </div>

                      {/* --- DESKTOP VIEW (Full Controls) --- */}
                      <div className="hidden sm:flex items-center justify-between mt-2">
                        <div className="flex items-center border border-slate-300 rounded-lg bg-white h-8">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-full flex items-center justify-center text-slate-500 hover:text-slate-900">-</button>
                          <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-full flex items-center justify-center text-slate-500 hover:text-slate-900">+</button>
                        </div>
                        
                        <div className="flex items-center gap-3">
                           <p className="font-bold text-slate-900">{formatRWF(item.price * item.quantity)}</p>
                           <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-500 transition p-1.5 bg-slate-50 rounded-md">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                           </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* === RIGHT COLUMN: ORDER SUMMARY === */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-slate-900">
                {language === 'en' ? 'Order Summary' : 'Incamake'}
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>{language === 'en' ? 'Subtotal' : 'Incamake'}</span>
                  <span className="font-medium text-slate-900">{formatRWF(total)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{language === 'en' ? 'Delivery' : 'Ubwoba'}</span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-bold">{language === 'en' ? 'Free' : 'Ubuntu'}</span>
                  ) : (
                    <span className="font-medium text-slate-900">{formatRWF(deliveryFee)}</span>
                  )}
                </div>
              </div>

              <div className="border-t border-dashed border-slate-200 pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-slate-900">{language === 'en' ? 'Total' : 'Byose'}</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tight">{formatRWF(finalTotal)}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 text-right">
                   {language === 'en' ? 'Including taxes' : 'Harimo imisoro'}
                </p>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl text-center text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200"
              >
                {language === 'en' ? 'Checkout' : 'Kwishyura'}
              </Link>

              <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-sm">
                <span>🔒</span>
                <span>{language === 'en' ? 'Secure Checkout' : 'Kwishyura Bwite'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Cart