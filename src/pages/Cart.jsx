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
    <div className="bg-slate-50 min-h-screen py-8 lg:py-12">
      {/* 🛑 FIX: Added max-w-6xl to constrain the width on large monitors */}
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 tracking-tight">
          {language === 'en' ? 'Your Bag' : 'Gafuni Yawe'} 
          <span className="text-lg font-medium text-slate-400 ml-3">
            ({items.length} {items.length === 1 ? 'item' : 'items'})
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* === LEFT COLUMN: CART ITEMS === */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 🚚 UPGRADED: Free Shipping Progress Bar */}
            <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
               <div className="flex items-center gap-3 mb-3">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${progress === 100 ? 'bg-green-100 text-green-600' : 'bg-sky-100 text-sky-600'}`}>
                   🚚
                 </div>
                 <div className="flex-1">
                   <div className="flex justify-between text-sm font-bold">
                     <span className={progress === 100 ? 'text-green-600' : 'text-slate-700'}>
                       {progress === 100 
                         ? (language === 'en' ? 'Free Shipping Unlocked! 🎉' : 'Ubwoba bw\'ubuntu! 🎉')
                         : (language === 'en' ? `Spend ${formatRWF(freeShippingThreshold - total)} for Free Shipping` : `Koresha ${formatRWF(freeShippingThreshold - total)} kugirango ubone ubwoba bw'ubuntu`)
                       }
                     </span>
                     <span className="text-slate-400 font-medium hidden sm:block">{Math.round(progress)}%</span>
                   </div>
                 </div>
               </div>
               
               <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                 <div 
                    className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${progress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-sky-400 to-blue-500'}`} 
                    style={{ width: `${progress}%` }}
                 ></div>
               </div>
            </div>

            {/* Items List */}
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              {items.map((item) => (
                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="p-4 sm:p-6 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <div className="flex gap-4 sm:gap-6">
                    
                    {/* Image */}
                    <Link to={`/products/${item.slug}`} className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-50 rounded-xl md:rounded-2xl flex-shrink-0 overflow-hidden border border-slate-200">
                      <LazyImage
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        fallback={<div className="w-full h-full flex items-center justify-center text-2xl">🏊</div>}
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                           <Link to={`/products/${item.slug}`} className="font-bold text-slate-900 text-base md:text-lg hover:text-sky-600 transition line-clamp-2 mr-2 leading-tight">
                             {language === 'en' ? item.name : item.nameRw}
                           </Link>
                        </div>
                        {item.brand && <p className="text-slate-400 font-medium text-xs mt-1 uppercase tracking-wider">{item.brand}</p>}
                        
                        {/* Variants Chips */}
                        <div className="flex flex-wrap gap-2 text-[10px] md:text-xs font-bold text-slate-600 mt-2 md:mt-3">
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

                      {/* --- MOBILE VIEW --- */}
                      <div className="flex items-center justify-between mt-4 sm:hidden">
                        
                        <div className="flex items-center border border-slate-300 rounded-lg bg-white h-8 w-24 shadow-sm">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="flex-1 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors">-</button>
                          <span className="w-8 text-center font-bold text-slate-900 text-sm border-x border-slate-100 h-full flex items-center justify-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="flex-1 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors">+</button>
                        </div>

                        <div className="flex items-center gap-3">
                           <p className="font-black text-slate-900 text-sm whitespace-nowrap">
                              {formatRWF(item.price * item.quantity)}
                           </p>

                           <button
                             onClick={() => removeItem(item.id)}
                             className="text-slate-400 hover:text-red-500 p-1.5 bg-slate-50 rounded-md transition-colors"
                             aria-label="Remove item"
                           >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                           </button>
                        </div>
                      </div>

                      {/* --- DESKTOP VIEW --- */}
                      <div className="hidden sm:flex items-center justify-between mt-2">
                        {/* 🚀 UPGRADED: Modern Quantity Pill */}
                        <div className="flex items-center border border-slate-300 rounded-lg bg-white h-9 w-28 shadow-sm">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="flex-1 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-l-lg transition-colors">-</button>
                          <span className="w-10 text-center font-bold text-sm border-x border-slate-100 h-full flex items-center justify-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="flex-1 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-r-lg transition-colors">+</button>
                        </div>
                        
                        <div className="flex items-center gap-4">
                           <p className="font-black text-lg text-slate-900">{formatRWF(item.price * item.quantity)}</p>
                           <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-500 transition-colors p-2 bg-slate-50 hover:bg-red-50 rounded-lg">
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
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg border border-slate-100 p-6 md:p-8 sticky top-24">
              <h2 className="text-xl font-black mb-6 text-slate-900 border-b border-slate-100 pb-4">
                {language === 'en' ? 'Order Summary' : 'Incamake'}
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>{language === 'en' ? 'Subtotal' : 'Incamake'}</span>
                  <span className="font-bold text-slate-900">{formatRWF(total)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{language === 'en' ? 'Delivery' : 'Ubwoba'}</span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded text-sm">{language === 'en' ? 'Free' : 'Ubuntu'}</span>
                  ) : (
                    <span className="font-bold text-slate-900">{formatRWF(deliveryFee)}</span>
                  )}
                </div>
              </div>

              <div className="border-t border-dashed border-slate-200 pt-6 mb-8 bg-slate-50 -mx-6 px-6 pb-6 rounded-b-2xl md:rounded-b-3xl">
                <div className="flex justify-between items-end mb-1">
                  <span className="font-bold text-slate-900 uppercase tracking-wider text-sm">{language === 'en' ? 'Total' : 'Byose'}</span>
                  <span className="text-3xl font-black text-sky-600 tracking-tight">{formatRWF(finalTotal)}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium text-right mb-6">
                   {language === 'en' ? 'Including taxes' : 'Harimo imisoro'}
                </p>

                {/* 🚀 UPGRADED: Gradient Checkout Button */}
                <Link
                  to="/checkout"
                  className="block w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black py-4 rounded-xl text-center text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {language === 'en' ? 'Proceed to Checkout' : 'Kwishyura'}
                </Link>

                <div className="mt-4 flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                    <span>🔒</span>
                    <span>{language === 'en' ? 'Secure encrypted checkout' : 'Kwishyura Bwite'}</span>
                  </div>
                  
                  {/* Trust Signals (Payment Icons) */}
                  <div className="flex items-center gap-2 opacity-60">
                    <div className="w-8 h-5 bg-slate-300 rounded"></div>
                    <div className="w-8 h-5 bg-slate-300 rounded"></div>
                    <div className="w-8 h-5 bg-slate-300 rounded"></div>
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

export default Cart