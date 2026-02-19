import { create } from 'zustand'
import { auth, db } from '../config/firebase' 
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
  isLoading: true, 
  error: null,

  // 1. AUTO-LOGIN LISTENER (Runs when app starts)
  initializeAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      set({ isLoading: true });
      
      if (currentUser) {
        // Fetch the user's extra profile data (name, phone, role) from Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        let profileData = {};
        if (userDocSnap.exists()) {
          profileData = userDocSnap.data();
        }

        // Merge Auth data with Firestore Database data
        const mergedUser = {
          uid: currentUser.uid,
          email: currentUser.email,
          ...profileData
        };
        
        // 🔓 Check the role from the database! (Or fallback to the hardcoded email just in case)
        const isAdmin = mergedUser.role === 'admin' || currentUser.email === 'admin@kigaliswim.com';
        
        set({ user: mergedUser, isAdmin, isLoading: false });
      } else {
        set({ user: null, isAdmin: false, isLoading: false });
      }
    });
    return unsubscribe; 
  },

  // 2. LOGIN FUNCTION
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;

      // Fetch the role and details from Firestore upon explicit login
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      let profileData = {};
      if (userDocSnap.exists()) {
        profileData = userDocSnap.data();
      }

      const mergedUser = {
        uid: currentUser.uid,
        email: currentUser.email,
        ...profileData
      };

      const isAdmin = mergedUser.role === 'admin' || currentUser.email === 'admin@kigaliswim.com';

      set({ user: mergedUser, isAdmin, isLoading: false });
      return true; 
    } catch (err) {
      console.error(err);
      let errorMessage = "Failed to login.";
      if (err.code === 'auth/invalid-credential') errorMessage = "Wrong email or password.";
      if (err.code === 'auth/too-many-requests') errorMessage = "Too many failed attempts. Try later.";
      
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage); 
    }
  },

  // 3. REGISTER FUNCTION
  signUp: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const currentUser = userCredential.user;

      const newUserProfile = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        createdAt: new Date().toISOString(),
        role: 'customer' // Defaults to customer
      };

      await setDoc(doc(db, "users", currentUser.uid), newUserProfile);

      const mergedUser = {
        uid: currentUser.uid,
        ...newUserProfile
      };

      set({ user: mergedUser, isAdmin: false, isLoading: false });
      return mergedUser;
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