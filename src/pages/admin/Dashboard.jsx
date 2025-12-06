import { useState, useEffect } from 'react'
import { products, categories } from '../../data/products'
import { formatRWF } from '../../utils/currency'

const AdminDashboard = () => {
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState('orders')
  const [productList, setProductList] = useState(products)
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  
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
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    // Load orders from localStorage
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    setOrders(storedOrders)

    // Load products from localStorage if exists, otherwise use default
    const storedProducts = JSON.parse(localStorage.getItem('adminProducts') || 'null')
    if (storedProducts && storedProducts.length > 0) {
      setProductList(storedProducts)
    } else {
      // Initialize with default products
      localStorage.setItem('adminProducts', JSON.stringify(products))
    }
  }, [])

  // Save products to localStorage whenever productList changes
  useEffect(() => {
    if (productList.length > 0) {
      localStorage.setItem('adminProducts', JSON.stringify(productList))
    }
  }, [productList])

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
    // Get image from product.image or first item in images array
    const existingImage = product.image || (product.images && product.images.length > 0 ? product.images[0] : '')
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
      image: existingImage,
      sizes: product.sizes || [],
      colors: product.colors || []
    })
    setImagePreview(existingImage)
    setShowProductModal(true)
  }

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      const updatedProducts = productList.filter(p => p.id !== productId)
      setProductList(updatedProducts)
      alert('Product deleted successfully!')
    }
  }

  const handleSaveProduct = () => {
    // Validation
    if (!productForm.name || !productForm.price || !productForm.stock) {
      alert('Please fill in all required fields: Name, Price, and Stock')
      return
    }

    // Prepare image data - ensure both image and images fields are set
    const imageData = productForm.image || ''
    const imagesArray = imageData ? [imageData] : []

    if (editingProduct) {
      // Update existing product
      const updatedProducts = productList.map(p =>
        p.id === editingProduct.id
          ? {
              ...editingProduct,
              ...productForm,
              price: Number(productForm.price),
              originalPrice: Number(productForm.originalPrice || productForm.price),
              stock: Number(productForm.stock),
              inStock: Number(productForm.stock) > 0,
              image: imageData, // Ensure image field is set
              images: imagesArray // Ensure images array is set
            }
          : p
      )
      setProductList(updatedProducts)
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
        image: imageData, // Ensure image field is set
        images: imagesArray // Ensure images array is set
      }
      setProductList([...productList, newProduct])
      alert('Product added successfully!')
    }
    setImagePreview(null)
    setShowProductModal(false)
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
          <div className="flex">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-4 font-semibold ${
                activeTab === 'orders'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-4 font-semibold ${
                activeTab === 'products'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Products
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
              <h2 className="text-xl font-bold">Products ({productList.length})</h2>
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
                  {productList.map((product) => (
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
                  // Reset file input
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
                          console.log('File input changed', e.target.files)
                          const file = e.target.files[0]
                          if (file) {
                            console.log('File selected:', file.name, file.type, file.size)
                            // Validate file size (max 5MB)
                            if (file.size > 5 * 1024 * 1024) {
                              alert('Image size must be less than 5MB')
                              e.target.value = ''
                              return
                            }
                            // Validate file type
                            if (!file.type.startsWith('image/')) {
                              alert('Please select a valid image file')
                              e.target.value = ''
                              return
                            }
                            // Convert to base64
                            console.log('Reading file as data URL...')
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              const base64String = reader.result
                              console.log('File read successfully, base64 length:', base64String.length)
                              setProductForm(prev => {
                                console.log('Updating productForm with image')
                                return { ...prev, image: base64String }
                              })
                              setImagePreview(base64String)
                              console.log('Image preview set')
                            }
                            reader.onerror = (error) => {
                              console.error('Error reading file:', error)
                              alert('Error reading file. Please try again.')
                              e.target.value = ''
                            }
                            reader.readAsDataURL(file)
                          } else {
                            console.log('No file selected')
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
                      value={(() => {
                        // Show URL only if it's not a base64 image
                        if (productForm.image && !productForm.image.startsWith('data:image')) {
                          return productForm.image
                        }
                        return ''
                      })()}
                      onChange={(e) => {
                        const url = e.target.value.trim()
                        console.log('URL input changed:', url)
                        // When user types URL, clear base64 and set URL
                        setProductForm(prev => {
                          console.log('Updating productForm with URL')
                          return { ...prev, image: url }
                        })
                        setImagePreview(url || null)
                        console.log('Image preview set to URL')
                      }}
                      onFocus={(e) => {
                        // Clear base64 image when user focuses on URL field
                        if (productForm.image && productForm.image.startsWith('data:image')) {
                          setProductForm(prev => ({ ...prev, image: '' }))
                          setImagePreview(null)
                          e.target.value = ''
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="/images/product.jpg or https://example.com/image.jpg"
                    />
                    {productForm.image && productForm.image.startsWith('data:image') && (
                      <p className="text-xs text-green-600 mt-1">✓ Image uploaded from computer (click URL field to switch to URL)</p>
                    )}
                    {!productForm.image && (
                      <p className="text-xs text-gray-500 mt-1">Enter a URL or upload a file above</p>
                    )}
                  </div>
                  
                  {/* Image Preview */}
                  {(() => {
                    const currentImage = imagePreview || productForm.image
                    return currentImage ? (
                      <div className="mt-3">
                        <label className="block text-xs text-gray-600 mb-2">
                          Preview
                          {productForm.image && productForm.image.startsWith('data:image') && (
                            <span className="ml-2 text-green-600 text-xs">(Uploaded - will be saved to localStorage)</span>
                          )}
                          {productForm.image && !productForm.image.startsWith('data:image') && productForm.image.length > 0 && (
                            <span className="ml-2 text-blue-600 text-xs">(URL - from {productForm.image.startsWith('http') ? 'external source' : 'public/images folder'})</span>
                          )}
                        </label>
                        <div className="relative inline-block">
                          <img
                            src={currentImage}
                            alt="Product preview"
                            className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200"
                            onError={(e) => {
                              console.error('Image failed to load:', currentImage)
                              e.target.style.display = 'none'
                              const errorDiv = e.target.nextSibling
                              if (errorDiv) errorDiv.style.display = 'block'
                            }}
                            onLoad={() => {
                              console.log('Image loaded successfully:', currentImage.substring(0, 50) + '...')
                            }}
                          />
                          <div className="hidden text-red-500 text-sm mt-2">Failed to load image. Please check the URL or try uploading again.</div>
                          <button
                            type="button"
                            onClick={() => {
                              setProductForm(prev => ({ ...prev, image: '' }))
                              setImagePreview(null)
                              // Reset file input
                              const fileInput = document.querySelector('input[type="file"]')
                              if (fileInput) fileInput.value = ''
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-lg z-10"
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                        {editingProduct && (
                          <p className="text-xs text-gray-500 mt-2">
                            Current product image - upload a new one or change URL to replace
                          </p>
                        )}
                      </div>
                    ) : null
                  })()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowProductModal(false)
                    setImagePreview(null)
                    // Reset file input
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
    </div>
  )
}

export default AdminDashboard



