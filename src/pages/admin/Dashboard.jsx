import { useState, useEffect } from 'react'
import useProductStore from '../../stores/productStore'
import useCategoryStore from '../../stores/categoryStore'
import useAnalyticsStore from '../../stores/analyticsStore'
import { formatRWF } from '../../utils/currency'
import LazyImage from '../../components/LazyImage'

const AdminDashboard = () => {
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('overview') // 'overview', 'orders', 'products', 'categories'
  const [showProductModal, setShowProductModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  
  const products = useProductStore((state) => state.products)
  const setProducts = useProductStore((state) => state.setProducts)
  const categories = useCategoryStore((state) => state.categories)
  const setCategories = useCategoryStore((state) => state.setCategories)
  const analyticsSummary = useAnalyticsStore((state) => state.getSummary)()
  
  // Forms State
  const [productForm, setProductForm] = useState({
    name: '', nameRw: '', slug: '', category: 'caps', price: '', originalPrice: '',
    description: '', descriptionRw: '', brand: '', stock: '', image: '', sizes: [], colors: []
  })
  const [categoryForm, setCategoryForm] = useState({ name: '', nameRw: '', image: '', icon: '' })
  const [imagePreview, setImagePreview] = useState(null)
  const [categoryImagePreview, setCategoryImagePreview] = useState(null)

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    setOrders(storedOrders)
  }, [])

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    )
    setOrders(updatedOrders)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
  }

  // --- HANDLERS (Same logic as before, kept for functionality) ---
  const handleAddProduct = () => {
    setEditingProduct(null)
    setProductForm({ name: '', nameRw: '', slug: '', category: 'caps', price: '', originalPrice: '', description: '', descriptionRw: '', brand: '', stock: '', image: '', sizes: [], colors: [] })
    setImagePreview(null)
    setShowProductModal(true)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setProductForm({ ...product, price: product.price, stock: product.stock })
    setImagePreview(product.image || null)
    setShowProductModal(true)
  }

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Delete this product?')) {
      setProducts(products.filter(p => p.id !== productId))
    }
  }

  const handleSaveProduct = () => {
    if (!productForm.name || !productForm.price) return alert('Name and Price required')
    const newProd = {
        ...productForm, 
        id: editingProduct ? editingProduct.id : Date.now(),
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        inStock: Number(productForm.stock) > 0,
        slug: productForm.slug || productForm.name.toLowerCase().replace(/\s+/g, '-')
    }

    if (editingProduct) {
        setProducts(products.map(p => p.id === editingProduct.id ? newProd : p))
    } else {
        setProducts([...products, newProd])
    }
    setShowProductModal(false)
  }

  // --- UI COMPONENTS ---

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">{title}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  )

  const StatusBadge = ({ status }) => {
    const colors = {
      pending: 'bg-orange-100 text-orange-600',
      completed: 'bg-green-100 text-green-600',
      shipped: 'bg-blue-100 text-blue-600',
      cancelled: 'bg-red-100 text-red-600'
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* === SIDEBAR NAVIGATION === */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:block fixed h-full z-10">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-2xl">⚡</span>
            <span className="font-black text-xl text-slate-900">Admin</span>
          </div>
          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'Dashboard', icon: '📊' },
              { id: 'orders', label: 'Orders', icon: '📦' },
              { id: 'products', label: 'Products', icon: '🏷️' },
              { id: 'categories', label: 'Categories', icon: '📂' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === item.id 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* === MAIN CONTENT === */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-24 lg:pt-8">
        
        {/* Mobile Header (Title) */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 capitalize">{activeTab}</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your store efficiently</p>
          </div>
          {/* Action Buttons based on Tab */}
          {activeTab === 'products' && (
            <button onClick={handleAddProduct} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg flex items-center gap-2">
              <span>+</span> Add Product
            </button>
          )}
        </div>

        {/* === TAB: OVERVIEW === */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Revenue" value={formatRWF(orders.reduce((sum, o) => sum + o.total, 0))} icon="💰" color="bg-green-100 text-green-600" />
              <StatCard title="Total Orders" value={orders.length} icon="📦" color="bg-blue-100 text-blue-600" />
              <StatCard title="Pending" value={orders.filter(o => o.status === 'pending').length} icon="⏳" color="bg-orange-100 text-orange-600" />
              <StatCard title="Products" value={products.length} icon="🏷️" color="bg-purple-100 text-purple-600" />
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="font-bold text-lg mb-4 text-slate-900">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="text-xs uppercase text-slate-400 border-b border-slate-100">
                    <tr>
                      <th className="pb-3 pl-4">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.slice(0, 5).map(order => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-3 pl-4 font-mono">#{order.id.toString().slice(-6)}</td>
                        <td className="py-3 font-bold text-slate-900">{order.customer.fullName}</td>
                        <td className="py-3"><StatusBadge status={order.status} /></td>
                        <td className="py-3 font-bold">{formatRWF(order.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && <p className="text-center py-4 text-slate-400">No orders found.</p>}
              </div>
            </div>
          </div>
        )}

        {/* === TAB: ORDERS === */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-2 opacity-50">📦</div>
                <p className="text-slate-500">No orders yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <div key={order.id} className="p-6 hover:bg-slate-50 transition">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-slate-900 text-lg">Order #{order.id}</h3>
                          <StatusBadge status={order.status} />
                        </div>
                        <p className="text-sm text-slate-500">
                          {new Date(order.date).toLocaleDateString()} • {order.customer.fullName}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-xl font-black text-slate-900">{formatRWF(order.total)}</p>
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="bg-white border border-slate-200 text-sm font-medium py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                    {/* Order Items */}
                    <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm text-slate-700">
                          <span>{item.quantity}x <strong>{item.name}</strong></span>
                          <span>{formatRWF(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* === TAB: PRODUCTS === */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition group">
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  <LazyImage src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold">
                    {product.stock} in stock
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 mb-1">{product.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">{formatRWF(product.price)}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditProduct(product)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-lg text-sm transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="px-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* === MODALS (Simplifed for brevity - paste your form fields here or ask for the full Modal code if needed) === */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-8 animate-fade-in-up">
            <h2 className="text-2xl font-black text-slate-900 mb-6">{editingProduct ? 'Edit Product' : 'New Product'}</h2>
            
            <div className="space-y-4">
               {/* NAME */}
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                 <input 
                   value={productForm.name} 
                   onChange={e => setProductForm({...productForm, name: e.target.value})}
                   className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                   placeholder="Product Name"
                 />
               </div>
               
               {/* PRICE & STOCK GRID */}
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Price</label>
                   <input 
                     type="number"
                     value={productForm.price} 
                     onChange={e => setProductForm({...productForm, price: e.target.value})}
                     className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200"
                     placeholder="0"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Stock</label>
                   <input 
                     type="number"
                     value={productForm.stock} 
                     onChange={e => setProductForm({...productForm, stock: e.target.value})}
                     className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200"
                     placeholder="0"
                   />
                 </div>
               </div>

               {/* IMAGE URL */}
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1">Image URL</label>
                 <input 
                   value={productForm.image} 
                   onChange={e => { setProductForm({...productForm, image: e.target.value}); setImagePreview(e.target.value); }}
                   className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200"
                   placeholder="https://..."
                 />
                 {imagePreview && (
                   <img src={imagePreview} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded-xl border border-slate-200" />
                 )}
               </div>

               {/* BUTTONS */}
               <div className="flex justify-end gap-3 pt-4">
                 <button 
                   onClick={() => setShowProductModal(false)}
                   className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={handleSaveProduct}
                   className="px-6 py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-lg"
                 >
                   Save Product
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminDashboard