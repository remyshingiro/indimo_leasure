import { create } from 'zustand'
import { db } from '../config/firebase'
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'

// Import your old mock data so we can upload it once
import { products as mockProducts } from '../data/products' 

const useProductStore = create((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  // 1. FETCH PRODUCTS (This is what App.jsx is looking for!)
  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id, 
        ...doc.data()
      }));

      if (productsData.length === 0) {
        set({ products: [], isLoading: false });
      } else {
        set({ products: productsData, isLoading: false });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  // 2. HELPER FUNCTIONS (Frontend Search/Filter)
  // These now run on the 'products' array we fetched from Firebase
  getProductBySlug: (slug) => {
    return get().products.find(p => p.slug === slug)
  },

  getProductsByCategory: (category) => {
    const products = get().products
    if (!category) return products
    return products.filter(p => p.category === category)
  },

  searchProducts: (query) => {
    const products = get().products
    const lowerQuery = query.toLowerCase()
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      (p.nameRw && p.nameRw.toLowerCase().includes(lowerQuery)) ||
      p.description.toLowerCase().includes(lowerQuery)
    )
  },

  // 3. ADMIN ACTIONS (Save to Real Cloud)
  addProduct: async (newProduct) => {
    set({ isLoading: true });
    try {
      const docRef = await addDoc(collection(db, "products"), newProduct);
      const productWithId = { ...newProduct, id: docRef.id };
      
      set(state => ({ 
        products: [...state.products, productWithId],
        isLoading: false 
      }));
      alert('Product Saved to Cloud!');
    } catch (error) {
      console.error("Error adding:", error);
      alert('Failed to save');
      set({ isLoading: false });
    }
  },

  updateProduct: async (id, updatedData) => {
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, updatedData);
      
      set(state => ({
        products: state.products.map(p => (p.id === id ? { ...p, ...updatedData } : p))
      }));
      alert('Product Updated!');
    } catch (error) {
      console.error("Error updating:", error);
      alert("Failed to update");
    }
  },

  deleteProduct: async (productId) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await deleteDoc(doc(db, "products", productId));
      set(state => ({
        products: state.products.filter(p => p.id !== productId)
      }));
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete");
    }
  },

  // 4. UPLOAD TOOL (The Button)
  seedProducts: async () => {
    const currentProducts = get().products;
    if (currentProducts.length > 0) return alert("Database already has data!");
    
    if(!window.confirm("Upload mock data to Firebase?")) return;

    set({ isLoading: true });
    try {
      const uploadPromises = mockProducts.map(product => {
        const { id, ...productData } = product; 
        return addDoc(collection(db, "products"), productData);
      });
      await Promise.all(uploadPromises);
      await get().fetchProducts();
      alert("Success! Mock data uploaded.");
    } catch (error) {
      console.error("Seeding error:", error);
    } finally {
      set({ isLoading: false });
    }
  }
}))

export default useProductStore