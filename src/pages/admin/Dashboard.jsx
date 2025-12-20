import { useState, useEffect } from 'react'
import useProductStore from '../../stores/productStore'
import useCategoryStore from '../../stores/categoryStore'
import { formatRWF } from '../../utils/currency'
import LazyImage from '../../components/LazyImage'
import { uploadToCloudinary } from '../../utils/uploadService'

const AdminDashboard = () => {
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [showProductModal, setShowProductModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  
  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Loading States
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false) 
  
  // Edit States
  const [editingProduct, setEditingProduct] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  
  // Store Connections
  const { 
    products, 
    fetchProducts, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    seedProducts 
  } = useProductStore()

  // 🔥 UPGRADE: We need categories to populate the selector
  const { categories, setCategories } = useCategoryStore()
  
  // Forms
  const [productForm, setProductForm] = useState({
    name: '', nameRw: '', slug: '', category: '', price: '', originalPrice: '',
    description: '', descriptionRw: '', brand: '', stock: '', image: '', sizes: [], colors: []
  })
  const [categoryForm, setCategoryForm] = useState({ name: '', nameRw: '', image: '', icon: '' })
  
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    fetchProducts();
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    setOrders(storedOrders)
  }, [fetchProducts])

  // --- ORDER HELPERS ---
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    )
    setOrders(updatedOrders)
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
  }

  // --- PRODUCT ACTIONS ---
  const handleAddProduct = () => {
    setEditingProduct(null)
    // Default category to the first one available, or empty
    const defaultCat = categories.length > 0 ? categories[0].id : '';
    setProductForm({ 
        name: '', nameRw: '', slug: '', category: defaultCat, 
        price: '', originalPrice: '', description: '', descriptionRw: '', 
        brand: '', stock: '', image: '', sizes: [], colors: [] 
    })
    setImagePreview(null)
    setShowProductModal(true)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setProductForm({ ...product })
    setImagePreview(product.image || null)
    setShowProductModal(true)
  }

  const handleDeleteProduct = async (productId) => {
    await deleteProduct(productId);
  }

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.price) return alert('Name and Price required')
    if (!productForm.category) return alert('Please select a category')
    
    setIsSaving(true);
    try {
      const productData = {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        originalPrice: Number(productForm.originalPrice) || 0,
        inStock: Number(productForm.stock) > 0,
        slug: productForm.slug || productForm.name.toLowerCase().replace(/\s+/g, '-'),
        updatedAt: new Date().toISOString()
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct({
            ...productData,
            createdAt: new Date().toISOString()
        });
      }
      setShowProductModal(false);
    } catch (error) {
      alert("Error saving: " + error.message);
    } finally {
      setIsSaving(false);
    }
  }

  // --- CATEGORY ACTIONS ---
  const handleAddCategory = () => {
    setEditingCategory(null)
    setCategoryForm({ name: '', nameRw: '', image: '', icon: '' })
    setImagePreview(null)
    setShowCategoryModal(true)
  }

  const handleEditCategory = (cat) => {
    setEditingCategory(cat)
    setCategoryForm({ ...cat })
    setImagePreview(cat.image || null)
    setShowCategoryModal(true)
  }

  const handleDeleteCategory = (catId) => {
    if(window.confirm('Delete this category?')) {
        setCategories(categories.filter(c => c.id !== catId))
    }
  }

  const handleSaveCategory = () => {
    if (!categoryForm.name) return alert('Category Name required')
    const newCat = {
        ...categoryForm,
        id: editingCategory ? editingCategory.id : categoryForm.name.toLowerCase().replace(/\s+/g, '-')
    }
    if (editingCategory) {
        setCategories(categories.map(c => c.id === editingCategory.id ? newCat : c))
    } else {
        setCategories([...categories, newCat])
    }
    setShowCategoryModal(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* === MOBILE OVERLAY === */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* === 1. SIDEBAR NAVIGATION === */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50 pt-24 transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:block
      `}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-8 px-4">
            <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <span className="font-black text-xl text-slate-900">Admin</span>
            </div>
            {/* Close Button (Mobile Only) */}
            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-400">✕</button>
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
                onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false); // Close menu on click (mobile)
                }}
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
          
          <div className="mt-8 px-4">
            <button 
                onClick={seedProducts}
                className="w-full py-3 bg-green-50 text-green-700 font-bold rounded-xl text-sm hover:bg-green-100 border border-green-200 transition"
            >
                🚀 Upload Mock Data
            </button>
          </div>
        </div>
      </aside>

      {/* === 2. MAIN CONTENT === */}
      <main className="flex-1 ml-0 lg:ml-64 p-4 lg:p-8 pt-24 lg:pt-28 w-full">
        
        {/* Mobile Header with Hamburger */}
        <div className="lg:hidden flex items-center gap-4 mb-6">
            <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 bg-white rounded-lg border border-slate-200 text-2xl shadow-sm"
            >
                ☰
            </button>
            <h1 className="text-xl font-black text-slate-900 capitalize">{activeTab}</h1>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 capitalize">{activeTab}</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your store efficiently</p>
          </div>
          <div className="flex gap-2">
            {activeTab === 'products' && (
                <button onClick={handleAddProduct} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
                + Add Product
                </button>
            )}
            {activeTab === 'categories' && (
                <button onClick={handleAddCategory} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
                + Add Category
                </button>
            )}
          </div>
        </div>

        {/* Mobile Action Buttons */}
        <div className="lg:hidden mb-6">
            {activeTab === 'products' && (
                <button onClick={handleAddProduct} className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl font-bold text-sm shadow-lg">
                + Add Product
                </button>
            )}
            {activeTab === 'categories' && (
                <button onClick={handleAddCategory} className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl font-bold text-sm shadow-lg">
                + Add Category
                </button>
            )}
        </div>

        {/* --- TAB: OVERVIEW --- */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <p className="text-slate-500 text-xs font-bold uppercase">Revenue</p>
               <p className="text-2xl font-black text-green-600">{formatRWF(orders.reduce((sum, o) => sum + o.total, 0))}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <p className="text-slate-500 text-xs font-bold uppercase">Orders</p>
               <p className="text-2xl font-black text-blue-600">{orders.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <p className="text-slate-500 text-xs font-bold uppercase">Pending</p>
               <p className="text-2xl font-black text-orange-600">{orders.filter(o => o.status === 'pending').length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <p className="text-slate-500 text-xs font-bold uppercase">Products</p>
               <p className="text-2xl font-black text-purple-600">{products.length}</p>
            </div>
          </div>
        )}

        {/* --- TAB: ORDERS --- */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {orders.length === 0 ? <p className="p-8 text-center text-slate-500">No orders yet.</p> : (
              <div className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 lg:p-6 hover:bg-slate-50 transition">
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-slate-900">#{order.id}</h3>
                            <p className="text-sm text-slate-500">{order.customer?.fullName}</p>
                        </div>
                        <span className="font-black text-slate-900">{formatRWF(order.total)}</span>
                      </div>
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="w-full bg-white border border-slate-200 text-sm font-medium py-2 px-3 rounded-lg"
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB: PRODUCTS --- */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition group">
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  <LazyImage src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">{formatRWF(product.price)}</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditProduct(product)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-lg text-sm">Edit</button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="px-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg">🗑️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- TAB: CATEGORIES --- */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-2xl border border-slate-100 p-4 lg:p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl lg:text-3xl mb-3 overflow-hidden">
                  {cat.image ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" /> : cat.icon}
                </div>
                <h3 className="font-bold text-sm lg:text-base text-slate-900">{cat.name}</h3>
                <div className="mt-3 flex gap-2 w-full">
                   <button onClick={() => handleEditCategory(cat)} className="flex-1 bg-slate-100 text-slate-700 py-1 rounded text-xs font-bold">Edit</button>
                   <button onClick={() => handleDeleteCategory(cat.id)} className="px-2 bg-red-50 text-red-500 rounded text-xs">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* === PRODUCT MODAL === */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-end lg:items-center justify-center p-0 lg:p-4">
          <div className="bg-white rounded-t-3xl lg:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 lg:p-8 animate-slide-up lg:animate-none">
            <h2 className="text-2xl font-black text-slate-900 mb-6">{editingProduct ? 'Edit Product' : 'New Product'}</h2>
            <div className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Name</label>
                  <input value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200" />
               </div>

               {/* 🔥 NEW: VISUAL CATEGORY SELECTOR 🔥 */}
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {categories.length === 0 ? (
                        <p className="text-sm text-red-400">No categories found. Add a category first!</p>
                    ) : (
                        categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setProductForm({ ...productForm, category: cat.id })}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                                    productForm.category === cat.id 
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105' 
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                {cat.icon} {cat.name}
                            </button>
                        ))
                    )}
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-xs font-bold text-slate-500 uppercase">Price</label>
                   <input type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200" />
                 </div>
                 <div>
                   <label className="text-xs font-bold text-slate-500 uppercase">Stock</label>
                   <input type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200" />
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Product Image</label>
                 <div className="space-y-3">
                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${isUploading ? 'bg-slate-50 border-slate-300' : 'border-slate-300 hover:border-slate-900 hover:bg-slate-50'}`}>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploading}
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            setIsUploading(true);
                            try {
                              const url = await uploadToCloudinary(file);
                              setProductForm(prev => ({ ...prev, image: url }));
                              setImagePreview(url);
                            } catch (error) {
                              alert('Upload failed.');
                            } finally {
                              setIsUploading(false);
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center pointer-events-none">
                          {isUploading ? (
                            <span className="text-sm font-bold text-slate-500">Uploading...</span>
                          ) : (
                            <>
                              <span className="text-2xl mb-1">☁️</span>
                              <span className="text-sm font-bold text-slate-700">Tap to Upload</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <input
                      value={productForm.image}
                      onChange={e => { setProductForm({...productForm, image: e.target.value}); setImagePreview(e.target.value); }}
                      placeholder="Or paste URL..."
                      className="w-full p-3 text-sm bg-slate-50 rounded-xl border border-slate-200"
                    />
                 </div>
               </div>

               <div className="flex justify-end gap-3 pt-4">
                 <button onClick={() => setShowProductModal(false)} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
                 <button 
                   onClick={handleSaveProduct} 
                   disabled={isUploading || isSaving}
                   className="px-6 py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-lg disabled:opacity-50"
                 >
                   {isSaving ? 'Saving...' : 'Save'}
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* === CATEGORY MODAL === */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-end lg:items-center justify-center p-0 lg:p-4">
          <div className="bg-white rounded-t-3xl lg:rounded-3xl w-full max-w-lg shadow-2xl p-6 lg:p-8 animate-slide-up lg:animate-none">
            <h2 className="text-2xl font-black text-slate-900 mb-6">{editingCategory ? 'Edit Category' : 'New Category'}</h2>
            <div className="space-y-4">
               <div><label className="text-xs font-bold text-slate-500 uppercase">Name (EN)</label><input value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200" /></div>
               <div><label className="text-xs font-bold text-slate-500 uppercase">Name (RW)</label><input value={categoryForm.nameRw} onChange={e => setCategoryForm({...categoryForm, nameRw: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200" /></div>
               
               <div>
                 <label className="text-xs font-bold text-slate-500 uppercase">Category Image (Or Icon)</label>
                 <div className="flex gap-2 mt-2">
                   <div className="relative flex-1">
                      <input 
                        type="file" 
                        accept="image/*"
                        disabled={isUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={async (e) => {
                            const file = e.target.files[0];
                            if(!file) return;
                            setIsUploading(true);
                            try {
                                const url = await uploadToCloudinary(file);
                                setCategoryForm(prev => ({ ...prev, image: url, icon: '' }));
                                setImagePreview(url);
                            } finally {
                                setIsUploading(false);
                            }
                        }}
                      />
                      <div className="w-full p-3 bg-slate-100 rounded-xl text-center text-xs font-bold text-slate-600 border border-slate-200 hover:bg-slate-200 transition">
                        {isUploading ? 'Uploading...' : 'Upload Image'}
                      </div>
                   </div>
                   <input 
                     value={categoryForm.icon} 
                     onChange={e => setCategoryForm({...categoryForm, icon: e.target.value, image: ''})} 
                     className="w-20 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center" 
                     placeholder="Emoji" 
                   />
                 </div>
               </div>
               
               <div className="flex justify-end gap-3 pt-4">
                 <button onClick={() => setShowCategoryModal(false)} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100">Cancel</button>
                 <button onClick={handleSaveCategory} disabled={isUploading} className="px-6 py-3 rounded-xl font-bold bg-slate-900 text-white shadow-lg disabled:opacity-50">Save</button>
               </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminDashboard