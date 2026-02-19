import { create } from 'zustand'
import { db } from '../config/firebase'
import { collection, getDocs, addDoc, doc, updateDoc, query, where } from 'firebase/firestore'

const useOrderStore = create((set, get) => ({
  orders: [],
  userOrders: [],
  isLoading: false,
  error: null,

  // 1. ADMIN: Fetch all orders (Sorted newest first)
  fetchAllOrders: async () => {
    set({ isLoading: true, error: null })
    try {
      const snapshot = await getDocs(collection(db, "orders"))
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      
      set({ orders: ordersData, isLoading: false })
    } catch (error) {
      console.error("Error fetching orders:", error)
      set({ error: error.message, isLoading: false })
    }
  },

  // 2. CUSTOMER: Fetch only their personal orders
  fetchUserOrders: async (userId) => {
    if (!userId) return;
    set({ isLoading: true, error: null })
    try {
      const q = query(collection(db, "orders"), where("userId", "==", userId))
      const snapshot = await getDocs(q)
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      
      ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      
      set({ userOrders: ordersData, isLoading: false })
    } catch (error) {
      console.error("Error fetching user orders:", error)
      set({ error: error.message, isLoading: false })
    }
  },

  // 3. CHECKOUT: Create a new order
  createOrder: async (orderData) => {
    set({ isLoading: true, error: null })
    try {
      const newOrder = {
        ...orderData,
        status: 'pending', 
        createdAt: new Date().toISOString()
      }
      
      const docRef = await addDoc(collection(db, "orders"), newOrder)
      
      set(state => ({ 
        orders: [{ id: docRef.id, ...newOrder }, ...state.orders],
        isLoading: false 
      }))
      
      return docRef.id 
    } catch (error) {
      console.error("Error creating order:", error)
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  // 4. ADMIN: Update order status
  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId)
      await updateDoc(orderRef, { 
        status: newStatus,
        updatedAt: new Date().toISOString()
      })
      
      set(state => ({
        orders: state.orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      }))
    } catch (error) {
      console.error("Error updating order status:", error)
      throw error
    }
  }
}))

export default useOrderStore