import { create } from 'zustand'
import { db } from '../config/firebase'
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'

// Default categories to seed if empty
const defaultCategories = [
  { id: 'caps', name: 'Swimming Caps', nameRw: 'Ingofero zo koga', icon: '🧢' },
  { id: 'goggles', name: 'Goggles', nameRw: 'Amadarubindi', icon: '🥽' },
  { id: 'suits', name: 'Swimsuits', nameRw: 'Imyenda yo koga', icon: '🩱' },
  { id: 'equipment', name: 'Training Gear', nameRw: 'Ibikoresho', icon: '🏊‍♂️' },
]

const useCategoryStore = create((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  // 1. FETCH FROM FIREBASE
  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categoryData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // If DB is empty, use defaults (optional, but helps avoid blank screens)
      if (categoryData.length === 0) {
        set({ categories: defaultCategories, isLoading: false }); 
        // Note: You might want a "seed" button for this later
      } else {
        set({ categories: categoryData, isLoading: false });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  // 2. ADD CATEGORY (Cloud Save)
  addCategory: async (newCategory) => {
    set({ isLoading: true });
    try {
      // Add to Firestore
      const docRef = await addDoc(collection(db, "categories"), newCategory);
      
      // Update Local State
      const categoryWithId = { ...newCategory, id: docRef.id };
      set(state => ({ 
        categories: [...state.categories, categoryWithId],
        isLoading: false 
      }));
    } catch (error) {
      console.error("Error adding category:", error);
      throw error; // Let the UI handle the alert
    } finally {
        set({ isLoading: false });
    }
  },

  // 3. UPDATE CATEGORY
  updateCategory: async (id, updatedData) => {
    try {
      const catRef = doc(db, "categories", id);
      await updateDoc(catRef, updatedData);
      
      set(state => ({
        categories: state.categories.map(c => (c.id === id ? { ...c, ...updatedData } : c))
      }));
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  // 4. DELETE CATEGORY
  deleteCategory: async (categoryId) => {
    try {
      await deleteDoc(doc(db, "categories", categoryId));
      set(state => ({
        categories: state.categories.filter(c => c.id !== categoryId)
      }));
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
}))

export default useCategoryStore