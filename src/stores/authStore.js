import { create } from 'zustand'
import { auth, db } from '../config/firebase' // Import the Firebase tools we setup
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

const useAuthStore = create((set) => ({
  user: null,
  isAdmin: false,
  isLoading: true, // Start true to check login status on load
  error: null,

  // 1. AUTO-LOGIN LISTENER (Runs when app starts)
  initializeAuth: () => {
    // Firebase automatically checks if the user has a valid token in the browser
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      set({ isLoading: true });
      
      if (currentUser) {
        // User is logged in! Check if they are the Admin
        // (You can also fetch extra profile data from Firestore here if needed)
        const isAdmin = currentUser.email === 'admin@kigaliswim.com';
        
        set({ user: currentUser, isAdmin, isLoading: false });
      } else {
        // User is logged out
        set({ user: null, isAdmin: false, isLoading: false });
      }
    });
    return unsubscribe; // Return cleanup function
  },

  // 2. LOGIN FUNCTION
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // Ask Firebase to log in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const isAdmin = user.email === 'admin@kigaliswim.com';

      set({ user, isAdmin, isLoading: false });
      return true; // Success!
    } catch (err) {
      console.error(err);
      let errorMessage = "Failed to login.";
      if (err.code === 'auth/invalid-credential') errorMessage = "Wrong email or password.";
      if (err.code === 'auth/too-many-requests') errorMessage = "Too many failed attempts. Try later.";
      
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage); // Throw so the UI knows it failed
    }
  },

  // 3. REGISTER FUNCTION
  signUp: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Create the Account in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;

      // 2. Save their extra details (Name, Phone) to Firestore Database
      // We create a document in the 'users' collection with their unique User ID (uid)
      await setDoc(doc(db, "users", user.uid), {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        createdAt: new Date().toISOString(),
        role: 'customer'
      });

      // 3. Update Store
      set({ user, isAdmin: false, isLoading: false });
      return user;
    } catch (err) {
      console.error(err);
      let errorMessage = "Failed to register.";
      if (err.code === 'auth/email-already-in-use') errorMessage = "This email is already registered.";
      if (err.code === 'auth/weak-password') errorMessage = "Password should be at least 6 characters.";

      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  // 4. LOGOUT FUNCTION
  signOut: async () => {
    try {
      await signOut(auth);
      set({ user: null, isAdmin: false });
    } catch (err) {
      console.error(err);
    }
  }
}))

export default useAuthStore