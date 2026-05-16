import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import useProductStore from '../../stores/productStore'
import useCategoryStore from '../../stores/categoryStore'
import useOrderStore from '../../stores/orderStore'
import { formatRWF } from '../../utils/currency'
import LazyImage from '../../components/LazyImage'
import { uploadToCloudinary } from '../../utils/uploadService'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview')
  const [showProductModal, setShowProductModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false) 
  const [editingProduct, setEditingProduct] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [subscribers, setSubscribers] = useState([])
  
  const { products, fetchProducts, addProduct, updateProduct, deleteProduct, seedProducts } = useProductStore()
  const { categories, fetchCategories, addCategory, updateCategory, deleteCategory } = useCategoryStore()
  const { orders, fetchAllOrders, updateOrderStatus } = useOrderStore() 
  
  const [productForm, setProductForm] = useState({
    name: '', nameRw: '', slug: '', category: '', 
    price: '', originalPrice: '', description: '', descriptionRw: '', 
    brand: '', stock: '', image: '', sizes: '', colors: '' 
  })
  const [categoryForm, setCategoryForm] = useState({ name: '', nameRw: '', image: '', icon: '' })
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchAllOrders(); 
    
    const fetchSubs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'subscribers'))
        const subsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setSubscribers(subsData.sort((a, b) => new Date(b.subscribedAt) - new Date(a.subscribedAt)))
      } catch (err) {
        console.error("Error fetching subscribers:", err)
      }
    }
    fetchSubs();
  }, [fetchProducts, fetchCategories, fetchAllOrders])

  const handleAddProduct = () => {
    setEditingProduct(null)
    const defaultCat = categories.length > 0 ? categories[0].id : '';
    setProductForm({ name: '', nameRw: '', slug: '', category: defaultCat, price: '', originalPrice: '', description: '', descriptionRw: '', brand: '', stock: '', image: '', sizes: '', colors: '' })
    setImagePreview(null)
    setShowProductModal(true)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setProductForm({ 
        ...product,
        sizes: product.sizes ? product.sizes.join(', ') : '',
        colors: product.colors ? product.colors.join(', ') : ''
    })
    setImagePreview(product.image || null)
    setShowProductModal(true)
  }

  const handleDeleteProduct = async (productId) => {
    if(window.confirm('Are you sure?')) {
        try {
          await deleteProduct(productId);
          toast.success('Product deleted');
        } catch (e) {
          toast.error('Failed to delete');
        }
    }
  }

const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.price) return toast.error('Name and Price required')
    if (!productForm.category) return toast.error('Please select a category')
    
    setIsSaving(true);
    try {
      const sizeArray = productForm.sizes ? productForm.sizes.split(',').map(s => s.trim()).filter(s => s !== '') : [];
      const colorArray = productForm.colors ? productForm.colors.split(',').map(c => c.trim()).filter(c => c !== '') : [];

      const productData = {
        name: productForm.name,
        nameRw: productForm.nameRw,
        slug: productForm.slug || productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: productForm.category,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice) || 0,
        description: productForm.description,
        descriptionRw: productForm.descriptionRw,
        brand: productForm.brand,
        stock: Number(productForm.stock),
        inStock: Number(productForm.stock) > 0,
        image: productForm.image,
        sizes: sizeArray,
        colors: colorArray,
        updatedAt: new Date().toISOString()
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast.success('Product updated!');
      } else {
        await addProduct({ ...productData, createdAt: new Date().toISOString() });
        toast.success('New product added!');
      }
      
      setShowProductModal(false);

      // 👇 ========================================== 👇
      // 🚀 CLOUDFLARE SITEMAP TRIGGER
      // ==========================================
      const webhookUrl = import.meta.env.VITE_DEPLOY_WEBHOOK_URL;
      if (webhookUrl) {
        fetch(webhookUrl, { method: 'POST' })
          .then(() => console.log('Cloudflare rebuild triggered. Sitemap is updating!'))
          .catch((err) => console.error('Failed to trigger rebuild:', err));
      }
      // 👆 ========================================== 👆

    } catch (error) {
      toast.error("Error: " + error.message);
    } finally {
      setIsSaving(false);
    }
  }

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

  const handleDeleteCategory = async (catId) => {
    if(window.confirm('Delete category?')) {
      try {
        await deleteCategory(catId);
        toast.success('Category removed');
      } catch (e) {
        toast.error('Failed to remove category');
      }
    }
  }

  const handleSaveCategory = async () => {
    if (!categoryForm.name) return toast.error('Category Name required')
    setIsSaving(true);
    try {
        const catId = editingCategory ? editingCategory.id : categoryForm.name.toLowerCase().replace(/\s+/g, '-');
        const categoryData = { ...categoryForm, id: catId };
        
        if (editingCategory) {
            await updateCategory(editingCategory.id, categoryData);
            toast.success('Category updated');
        } else {
            await addCategory(categoryData);
            toast.success('Category created');
        }
        setShowCategoryModal(false)
    } catch (error) {
        toast.error("Failed to save category");
    } finally {
        setIsSaving(false);
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order set to ${newStatus}`, { icon: '📦' });
    } catch (e) {
      toast.error('Failed to update status');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-[40] pt-20 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:block`}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-8 px-4">
            <div className="flex items-center gap-2"><span className="text-2xl">⚡</span><span className="font-black text-xl text-slate-900 tracking-tighter">Admin</span></div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-400">✕</button>
          </div>
          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'Dashboard', icon: '📊' }, 
              { id: 'orders', label: 'Orders', icon: '📦' }, 
              { id: 'products', label: 'Products', icon: '🏷️' }, 
              { id: 'categories', label: 'Categories', icon: '📂' },
              { id: 'subscribers', label: 'Subscribers', icon: '📬' }
            ].map((item) => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
                <span>{item.icon}</span>{item.label}
              </button>
            ))}
          </nav>
          {/* BOTTOM SIDEBAR ACTIONS */}
          <div className="mt-8 px-4 flex flex-col gap-3">
            
            {/* 🚀 NEW: Quick Create Blog Post Button */}
            <button 
              onClick={() => {
                navigate('/admin/create-post');
                setIsMobileMenuOpen(false); // Closes menu on mobile
              }} 
              className="w-full py-3 bg-sky-600 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-sky-700 shadow-lg shadow-sky-200 transition flex items-center justify-center gap-2"
            >
              <span className="text-sm">✍️</span> Write Article
            </button>

            {/* YOUR EXISTING SEED DATA BUTTON */}
            <button 
              onClick={async () => {
                await seedProducts();
                toast.success('Mock data uploaded');
              }} 
              className="w-full py-3 bg-green-50 text-green-700 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-green-100 border border-green-200 transition"
            >
              🚀 Seed Data
            </button>
          </div>
        </div>
      </aside>

      <div className="ml-0 lg:ml-64 p-4 lg:p-8 pt-24 lg:pt-8">
        <div className="lg:hidden flex items-center gap-4 mb-6">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 bg-white rounded-lg border border-slate-200 text-2xl shadow-sm text-slate-600">☰</button>
            <h1 className="text-xl font-black text-slate-900 capitalize tracking-tight">{activeTab}</h1>
        </div>
        <div className="hidden lg:flex justify-between items-end mb-8">
          <div><h1 className="text-3xl font-black text-slate-900 capitalize tracking-tight">{activeTab}</h1><p className="text-slate-500 text-sm font-medium">Store management systems active.</p></div>
          <div className="flex gap-2">
            {activeTab === 'products' && <button onClick={handleAddProduct} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all">+ Add Product</button>}
            {activeTab === 'categories' && <button onClick={handleAddCategory} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all">+ Add Category</button>}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"><p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Revenue</p><p className="text-2xl font-black text-green-600">{formatRWF(orders.reduce((sum, o) => sum + (o.total || 0), 0))}</p></div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"><p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Orders</p><p className="text-2xl font-black text-sky-600">{orders.length}</p></div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"><p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Pending Action</p><p className="text-2xl font-black text-orange-500">{orders.filter(o => o.status === 'pending').length}</p></div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"><p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Inventory</p><p className="text-2xl font-black text-purple-600">{products.length}</p></div>
          </div>
        )}

        {activeTab === 'subscribers' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 lg:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <h2 className="font-black text-slate-900 text-sm uppercase tracking-widest">Mailing List ({subscribers.length})</h2>
              <button 
                onClick={() => {
                  const emails = subscribers.map(s => s.email).join(', ');
                  navigator.clipboard.writeText(emails);
                  toast.success('Emails copied to clipboard!', { icon: '📋' });
                }}
                className="bg-sky-500 text-white hover:bg-sky-600 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-sky-100 transition"
              >
                Copy All
              </button>
            </div>
            {subscribers.length === 0 ? <p className="p-12 text-center text-slate-400 font-medium">No subscribers found in database.</p> : (
              <div className="divide-y divide-slate-50">
                {subscribers.map((sub) => (
                  <div key={sub.id} className="p-4 lg:p-6 hover:bg-slate-50 transition flex justify-between items-center">
                    <div>
                      <p className="font-black text-slate-900 text-sm">{sub.email}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Joined {new Date(sub.subscribedAt).toLocaleDateString()}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-100">
                      {sub.status || 'Active'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            {orders.length === 0 ? <p className="p-12 text-center text-slate-400 font-medium">No order logs available.</p> : (
              <div className="divide-y divide-slate-50">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 lg:p-6 hover:bg-slate-50 transition">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-black text-slate-900 tracking-tight">Order #{order.id.slice(-6).toUpperCase()}</h3>
                            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">{order.customer?.fullName} • {order.customer?.phone}</p>
                            <p className="text-[10px] text-slate-400 font-medium mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className="font-black text-sky-600 text-lg">{formatRWF(order.total)}</span>
                      </div>
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`w-full bg-white border border-slate-200 text-xs font-black uppercase tracking-widest py-3 px-4 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-sky-500/10 ${
                            order.status === 'completed' ? 'text-green-600' : 
                            order.status === 'cancelled' ? 'text-rose-500' : 
                            'text-orange-500'
                        }`}
                      >
                        <option value="pending">🟡 Pending</option>
                        <option value="shipped">🚚 Shipped</option>
                        <option value="completed">✅ Completed</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col">
                <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
                  <LazyImage src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  {product.originalPrice > product.price && (
                    <div className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg">SALE</div>
                  )}
                </div>
                <div className="p-3 md:p-5 flex flex-col flex-1">
                  <h3 className="font-black text-slate-900 mb-1 text-sm md:text-base line-clamp-2 leading-tight flex-1 uppercase tracking-tight">{product.name}</h3>
                  <div className="flex flex-col mb-4">
                    <p className="text-sky-600 font-black text-sm md:text-lg">{formatRWF(product.price)}</p>
                    {product.originalPrice > 0 && <p className="text-[10px] text-slate-400 line-through font-bold tracking-tighter">{formatRWF(product.originalPrice)}</p>}
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button onClick={() => handleEditProduct(product)} className="flex-1 bg-slate-900 text-white font-black py-2.5 rounded-xl text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all">Edit</button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="px-4 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-xl transition-colors">🗑️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl mb-4 overflow-hidden border border-slate-100 group-hover:scale-110 transition-transform">
                  {cat.image ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" /> : cat.icon}
                </div>
                <h3 className="font-black text-sm text-slate-900 uppercase tracking-widest mb-4">{cat.name}</h3>
                <div className="flex gap-2 w-full">
                   <button onClick={() => handleEditCategory(cat)} className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Edit</button>
                   <button onClick={() => handleDeleteCategory(cat.id)} className="px-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-all">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showProductModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-end lg:items-center justify-center p-0 lg:p-4">
          <div className="bg-white rounded-t-[2.5rem] lg:rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 lg:p-10 border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter">{editingProduct ? 'Edit Product' : 'New Gear Addition'}</h2>
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Name (EN)</label><input value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 font-medium focus:ring-4 focus:ring-sky-500/10 outline-none" /></div>
                 <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Name (RW)</label><input value={productForm.nameRw} onChange={e => setProductForm({...productForm, nameRw: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 font-medium focus:ring-4 focus:ring-sky-500/10 outline-none" /></div>
               </div>

               <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3 block">Category Assignment</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button key={cat.id} onClick={() => setProductForm({ ...productForm, category: cat.id })} className={`px-5 py-2.5 rounded-full text-xs font-black tracking-widest uppercase transition-all border ${productForm.category === cat.id ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}>
                            {cat.icon} {cat.name}
                        </button>
                    ))}
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Sale Price</label><input type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 font-black text-sky-600 focus:ring-4 focus:ring-sky-500/10 outline-none" /></div>
                 <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Retail Price</label><input type="number" value={productForm.originalPrice} onChange={e => setProductForm({...productForm, originalPrice: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 font-medium text-slate-400 focus:ring-4 focus:ring-sky-500/10 outline-none" /></div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Brand</label><input value={productForm.brand} onChange={e => setProductForm({...productForm, brand: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 font-medium focus:ring-4 focus:ring-sky-500/10 outline-none" /></div>
                 <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Stock Units</label><input type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 font-bold focus:ring-4 focus:ring-sky-500/10 outline-none" /></div>
               </div>

               <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Description (EN)</label><textarea value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 h-24 font-medium outline-none" /></div>

               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3 block">Media Assets</label>
                 <div className="flex items-center gap-6">
                    <div className={`flex-1 border-2 border-dashed rounded-2xl p-8 text-center transition-all ${isUploading ? 'bg-slate-50 border-slate-300' : 'border-slate-200 hover:border-slate-900 hover:bg-slate-50'}`}>
                      <div className="relative">
                        <input type="file" accept="image/*" disabled={isUploading} 
                          onChange={async (e) => { 
                            const file = e.target.files[0]; 
                            if (!file) return; 
                            setIsUploading(true); 
                            try { 
                              const url = await uploadToCloudinary(file); 
                              setProductForm(prev => ({ ...prev, image: url })); 
                              setImagePreview(url); 
                              toast.success('Image ready');
                            } catch (error) { 
                              toast.error('Upload failed'); 
                            } finally { 
                              setIsUploading(false); 
                            } 
                          }} 
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        />
                        <div className="flex flex-col items-center justify-center pointer-events-none">
                          {isUploading ? <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" /> : <><span className="text-3xl mb-2">☁️</span><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload Gear Image</span></>}
                        </div>
                      </div>
                    </div>
                    {imagePreview && <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-100 shadow-xl"><img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /></div>}
                 </div>
               </div>

               <div className="flex gap-4 pt-6">
                 <button onClick={() => setShowProductModal(false)} className="flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">Abort</button>
                 <button onClick={handleSaveProduct} disabled={isUploading || isSaving} className="flex-[2] py-4 rounded-2xl font-black uppercase tracking-[0.2em] bg-slate-900 text-white shadow-2xl hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95">{isSaving ? 'Synchronizing...' : 'Save Changes'}</button>
               </div>
            </div>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-end lg:items-center justify-center p-0 lg:p-4">
          <div className="bg-white rounded-t-[2.5rem] lg:rounded-[2.5rem] w-full max-w-lg shadow-2xl p-6 lg:p-10 border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter">{editingCategory ? 'Modify Category' : 'New Department'}</h2>
            <div className="space-y-5">
               <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Name (EN)</label><input value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 font-bold outline-none" /></div>
               <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Name (RW)</label><input value={categoryForm.nameRw} onChange={e => setCategoryForm({...categoryForm, nameRw: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 font-bold outline-none" /></div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Category Identity</label>
                 <div className="flex gap-4 items-center">
                    <div className="relative flex-1">
                      <input type="file" accept="image/*" disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        onChange={async (e) => { 
                          const file = e.target.files[0]; 
                          if(!file) return; 
                          setIsUploading(true); 
                          try { 
                            const url = await uploadToCloudinary(file); 
                            setCategoryForm(prev => ({ ...prev, image: url, icon: '' })); 
                            setImagePreview(url); 
                            toast.success('Media Linked');
                          } finally { setIsUploading(false); } 
                        }} 
                      />
                      <div className="w-full p-4 bg-slate-100 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-200 hover:bg-slate-200 transition-all">{isUploading ? 'Linking...' : 'Media Upload'}</div>
                    </div>
                    <span className="text-slate-300 font-bold">OR</span>
                    <input value={categoryForm.icon} onChange={e => setCategoryForm({...categoryForm, icon: e.target.value, image: ''})} className="w-20 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xl outline-none" placeholder="🔥" />
                 </div>
               </div>
               <div className="flex gap-4 pt-6">
                 <button onClick={() => setShowCategoryModal(false)} className="flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">Discard</button>
                 <button onClick={handleSaveCategory} disabled={isUploading || isSaving} className="flex-[2] py-4 rounded-2xl font-black uppercase tracking-[0.2em] bg-slate-900 text-white shadow-2xl hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95">{isSaving ? 'Updating...' : 'Commit'}</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard