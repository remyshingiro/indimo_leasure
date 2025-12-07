import { useState, useEffect } from 'react'
import useProductStore from '../../stores/productStore'
import useCategoryStore from '../../stores/categoryStore'
import useAnalyticsStore from '../../stores/analyticsStore'
import { formatRWF } from '../../utils/currency'

const AdminDashboard = () => {
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('orders')
  const [showProductModal, setShowProductModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  
  const products = useProductStore((state) => state.products)
  const setProducts = useProductStore((state) => state.setProducts)
  const categories = useCategoryStore((state) => state.categories)
  const setCategories = useCategoryStore((state) => state.setCategories)
  const analyticsSummary = useAnalyticsStore((state) => state.getSummary)()
  
  const [productForm, setProductForm] = useState({
    name: '',
    nameRw: '',
    slug: '',
    category: 'caps',
    price: '',
    originalPrice: '',
    description: '',
    descriptionRw: '',
    brand: '',
    stock: '',
    image: '',
    sizes: [],
    colors: []
  })
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    nameRw: '',
    image: '',
    icon: ''
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [categoryImagePreview, setCategoryImagePreview] = useState(null)

  useEffect(() => {
    // Load orders from localStorage
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

  const handleAddProduct = () => {
    setEditingProduct(null)
    setProductForm({
      name: '',
      nameRw: '',
      slug: '',
      category: 'caps',
      price: '',
      originalPrice: '',
      description: '',
      descriptionRw: '',
      brand: '',
      stock: '',
      image: '',
      sizes: [],
      colors: []
    })
    setImagePreview(null)
    setShowProductModal(true)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      nameRw: product.nameRw || '',
      slug: product.slug,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      description: product.description || '',
      descriptionRw: product.descriptionRw || '',
      brand: product.brand || '',
      stock: product.stock,
      image: product.image || '',
      sizes: product.sizes || [],
      colors: product.colors || []
    })
    setImagePreview(product.image || null)
    setShowProductModal(true)
  }

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      const updatedProducts = products.filter(p => p.id !== productId)
      setProducts(updatedProducts)
      alert('Product deleted successfully!')
    }
  }

  const handleSaveProduct = () => {
    // Validation
    if (!productForm.name || !productForm.price || !productForm.stock) {
      alert('Please fill in all required fields: Name, Price, and Stock')
      return
    }

    if (editingProduct) {
      // Update existing product
      const updatedProduct = {
        ...editingProduct,
        ...productForm,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice || productForm.price),
        stock: Number(productForm.stock),
        inStock: Number(productForm.stock) > 0
      }
      const updatedProducts = products.map(p =>
        p.id === editingProduct.id ? updatedProduct : p
      )
      setProducts(updatedProducts)
      alert('Product updated successfully!')
    } else {
      // Add new product
      const newProduct = {
        id: Date.now(),
        ...productForm,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice || productForm.price),
        stock: Number(productForm.stock),
        inStock: Number(productForm.stock) > 0,
        rating: 0,
        reviews: 0,
        slug: productForm.slug || productForm.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        images: productForm.image ? [productForm.image] : []
      }
      setProducts([...products, newProduct])
      alert('Product added successfully!')
    }
    setImagePreview(null)
    setShowProductModal(false)
  }

  const handleAddCategory = () => {
    setEditingCategory(null)
    setCategoryForm({
      name: '',
      nameRw: '',
      image: '',
      icon: ''
    })
    setCategoryImagePreview(null)
    setShowCategoryModal(true)
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      nameRw: category.nameRw || '',
      image: category.image || '',
      icon: category.icon || ''
    })
    setCategoryImagePreview(category.image || null)
    setShowCategoryModal(true)
  }

  const handleSaveCategory = () => {
    if (!categoryForm.name) {
      alert('Please fill in category name')
      return
    }

    if (editingCategory) {
      const updatedCategories = categories.map(cat =>
        cat.id === editingCategory.id
          ? { ...editingCategory, ...categoryForm }
          : cat
      )
      setCategories(updatedCategories)
      alert('Category updated successfully!')
    } else {
      const newCategory = {
        id: categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
        ...categoryForm
      }
      setCategories([...categories, newCategory])
      alert('Category added successfully!')
    }
    setCategoryImagePreview(null)
    setShowCategoryModal(false)
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const completedOrders = orders.filter(o => o.status === 'completed').length

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-primary-600">{orders.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 mb-2">Pending Orders</h3>
          <p className="text-3xl font-bold text-orange-600">{pendingOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 mb-2">Completed Orders</h3>
          <p className="text-3xl font-bold text-green-600">{completedOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-primary-600">{formatRWF(totalRevenue)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-4 font-semibold whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-4 font-semibold whitespace-nowrap ${
                activeTab === 'products'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-4 font-semibold whitespace-nowrap ${
                activeTab === 'categories'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-4 font-semibold whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="p-6">
            {orders.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.customer.fullName} • {order.customer.phone}
                        </p>
                        <p className="text-sm text-gray-600">{order.customer.address}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary-600">
                          {formatRWF(order.total)}
                        </p>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="mt-2 px-3 py-1 border border-gray-300 rounded"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Items:</h4>
                      <ul className="space-y-1">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-600">
                            {item.name} x{item.quantity} - {formatRWF(item.price * item.quantity)}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Payment: {order.paymentMethod.toUpperCase()}</p>
                      <p>Delivery Zone: {order.deliveryZone}</p>
                      {order.transactionId && (
                        <p>Transaction ID: {order.transactionId}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Products ({products.length})</h2>
              <button
                onClick={handleAddProduct}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                + Add Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4">ID</th>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Stock</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{product.id}</td>
                      <td className="py-3 px-4 font-semibold">{product.name}</td>
                      <td className="py-3 px-4 capitalize">{product.category}</td>
                      <td className="py-3 px-4">{formatRWF(product.price)}</td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${
                          product.stock === 0 ? 'text-red-600' :
                          product.stock < 10 ? 'text-orange-600' :
                          'text-green-600'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-primary-600 hover:text-primary-700 mr-3 font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Categories ({categories.length})</h2>
              <button
                onClick={handleAddCategory}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                + Add Category
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category.id} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-4 mb-4">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div className={`flex items-center justify-center w-16 h-16 bg-primary-50 rounded ${category.image ? 'hidden' : ''}`}>
                      <span className="text-3xl">{category.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.nameRw}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Traffic Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm text-gray-600 mb-1">Today's Views</h3>
                <p className="text-2xl font-bold text-blue-600">{analyticsSummary.todayViews}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="text-sm text-gray-600 mb-1">This Week</h3>
                <p className="text-2xl font-bold text-purple-600">{analyticsSummary.weekViews}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-sm text-gray-600 mb-1">Total Views</h3>
                <p className="text-2xl font-bold text-green-600">{analyticsSummary.totalViews}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="text-sm text-gray-600 mb-1">Active Sessions</h3>
                <p className="text-2xl font-bold text-orange-600">{analyticsSummary.activeSessions}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Most Viewed Pages */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Most Viewed Pages</h3>
                <div className="space-y-2">
                  {analyticsSummary.mostViewedPages.length > 0 ? (
                    analyticsSummary.mostViewedPages.map((page, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">{page.page}</span>
                        <span className="font-semibold text-primary-600">{page.count}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No data yet</p>
                  )}
                </div>
              </div>

              {/* Popular Products */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Popular Products</h3>
                <div className="space-y-2">
                  {analyticsSummary.popularProducts.length > 0 ? (
                    analyticsSummary.popularProducts.map((item) => {
                      const product = products.find(p => p.id === item.productId)
                      return product ? (
                        <div key={item.productId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">{product.name}</span>
                          <span className="font-semibold text-primary-600">
                            {item.views} views, {item.clicks} clicks
                          </span>
                        </div>
                      ) : null
                    })
                  ) : (
                    <p className="text-gray-500 text-sm">No data yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => {
                  setShowProductModal(false)
                  setImagePreview(null)
                  const fileInput = document.querySelector('input[type="file"]')
                  if (fileInput) fileInput.value = ''
                }}
                className="text-gray-600 hover:text-gray-800 text-3xl font-bold leading-none w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Name (EN) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Professional Swimming Cap"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name (RW)</label>
                  <input
                    type="text"
                    value={productForm.nameRw}
                    onChange={(e) => setProductForm({ ...productForm, nameRw: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Ikofiya y'amazi"
                  />
                </div>
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium mb-2">Slug (URL-friendly)</label>
                <input
                  type="text"
                  value={productForm.slug}
                  onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="auto-generated if empty"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate from name</p>
              </div>

              {/* Category and Brand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Brand</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Speedo, Arena"
                  />
                </div>
              </div>

              {/* Price Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price (RWF) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="5000"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Original Price (RWF)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="6000"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">For showing discount</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="50"
                    min="0"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-sm font-medium mb-2">Description (EN)</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="3"
                  placeholder="Product description in English..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (RW)</label>
                <textarea
                  value={productForm.descriptionRw}
                  onChange={(e) => setProductForm({ ...productForm, descriptionRw: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="3"
                  placeholder="Product description in Kinyarwanda..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Product Image</label>
                <div className="space-y-3">
                  {/* File Upload */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Upload from Computer</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0]
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              alert('Image size must be less than 5MB')
                              e.target.value = ''
                              return
                            }
                            if (!file.type.startsWith('image/')) {
                              alert('Please select a valid image file')
                              e.target.value = ''
                              return
                            }
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              const base64String = reader.result
                              setProductForm(prev => ({ ...prev, image: base64String }))
                              setImagePreview(base64String)
                            }
                            reader.onerror = () => {
                              alert('Error reading file. Please try again.')
                              e.target.value = ''
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-600 file:text-white hover:file:bg-primary-700 file:cursor-pointer cursor-pointer border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP</p>
                  </div>
                  
                  {/* OR Divider */}
                  <div className="flex items-center">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-3 text-sm text-gray-500">OR</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>
                  
                  {/* URL Input */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Enter Image URL</label>
                    <input
                      type="text"
                      value={productForm.image && !productForm.image.startsWith('data:') ? productForm.image : ''}
                      onChange={(e) => {
                        const url = e.target.value
                        setProductForm(prev => ({ ...prev, image: url }))
                        setImagePreview(url)
                      }}
                      onFocus={(e) => {
                        if (productForm.image && productForm.image.startsWith('data:')) {
                          setProductForm(prev => ({ ...prev, image: '' }))
                          setImagePreview(null)
                          e.target.value = ''
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="/images/product.jpg or https://example.com/image.jpg"
                    />
                  </div>
                  
                  {/* Image Preview */}
                  {(imagePreview || productForm.image) && (
                    <div className="mt-3">
                      <label className="block text-xs text-gray-600 mb-2">Preview</label>
                      <div className="relative inline-block">
                        <img
                          src={imagePreview || productForm.image}
                          alt="Product preview"
                          className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            const errorDiv = e.target.nextSibling
                            if (errorDiv) errorDiv.style.display = 'block'
                          }}
                        />
                        <div className="hidden text-red-500 text-sm mt-2">Failed to load image</div>
                        <button
                          type="button"
                          onClick={() => {
                            setProductForm(prev => ({ ...prev, image: '' }))
                            setImagePreview(null)
                            const fileInput = document.querySelector('input[type="file"]')
                            if (fileInput) fileInput.value = ''
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowProductModal(false)
                    setImagePreview(null)
                    const fileInput = document.querySelector('input[type="file"]')
                    if (fileInput) fileInput.value = ''
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProduct}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={() => {
                  setShowCategoryModal(false)
                  setCategoryImagePreview(null)
                }}
                className="text-gray-600 hover:text-gray-800 text-3xl font-bold leading-none w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category Name (EN) <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category Name (RW)</label>
                  <input
                    type="text"
                    value={categoryForm.nameRw}
                    onChange={(e) => setCategoryForm({ ...categoryForm, nameRw: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category Icon (Emoji)</label>
                <input
                  type="text"
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="🏊"
                />
              </div>

              {/* Image Upload for Category */}
              <div>
                <label className="block text-sm font-medium mb-2">Category Image</label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Upload from Computer</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0]
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            alert('Image size must be less than 5MB')
                            e.target.value = ''
                            return
                          }
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            setCategoryForm(prev => ({ ...prev, image: reader.result }))
                            setCategoryImagePreview(reader.result)
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-600 file:text-white hover:file:bg-primary-700 file:cursor-pointer cursor-pointer border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex items-center">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-3 text-sm text-gray-500">OR</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Enter Image URL</label>
                    <input
                      type="text"
                      value={categoryForm.image && !categoryForm.image.startsWith('data:') ? categoryForm.image : ''}
                      onChange={(e) => {
                        setCategoryForm(prev => ({ ...prev, image: e.target.value }))
                        setCategoryImagePreview(e.target.value)
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="/images/category.jpg"
                    />
                  </div>
                  {(categoryImagePreview || categoryForm.image) && (
                    <div className="mt-3">
                      <img
                        src={categoryImagePreview || categoryForm.image}
                        alt="Category preview"
                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowCategoryModal(false)
                    setCategoryImagePreview(null)
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCategory}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {editingCategory ? 'Update Category' : 'Add Category'}
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
