import { create } from 'zustand'
import { db } from '../config/firebase'
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore'

const useBlogStore = create((set) => ({
  posts: [],
  isLoading: false,
  error: null,

  fetchPosts: async () => {
    set({ isLoading: true, error: null })
    try {
      // Fetch posts ordered by newest first, only if they are marked as 'published'
      const q = query(
        collection(db, "posts"), 
        where("status", "==", "published"),
        orderBy("publishedAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      set({ posts: postsData, isLoading: false })
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      set({ error: error.message, isLoading: false })
    }
  },

  getPostBySlug: (slug) => {
    return useBlogStore.getState().posts.find(post => post.slug === slug);
  }
}))

export default useBlogStore