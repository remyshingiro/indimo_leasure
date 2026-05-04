import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase'; // Adjust path if needed
import { collection, addDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const CreatePost = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [postForm, setPostForm] = useState({ 
    title: '', 
    slug: '', 
    category: 'Guides', 
    image: '', 
    content: '', 
    status: 'published' 
  });

  const handleSavePost = async () => {
    if (!postForm.title || !postForm.content) return toast.error('Title and Content are required');
    
    setIsSaving(true);
    try {
      const postData = {
        title: postForm.title,
        slug: postForm.slug || postForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: postForm.category,
        image: postForm.image,
        content: postForm.content,
        status: postForm.status,
        author: 'Kigali Swim Shop',
        publishedAt: new Date().toISOString()
      };

      // 1. Save to Firebase
      await addDoc(collection(db, "posts"), postData);
      toast.success('Blog post published! 🚀');

      // 2. Trigger Cloudflare Rebuild
      const webhookUrl = import.meta.env.VITE_DEPLOY_WEBHOOK_URL;
      if (webhookUrl) {
        fetch(webhookUrl, { method: 'POST' })
          .then(() => console.log('Cloudflare rebuild triggered for new blog post!'))
          .catch((err) => console.error('Failed to trigger rebuild:', err));
      }

      // 3. Send them back to the Admin Dashboard
      navigate('/admin'); 

    } catch (error) {
      toast.error("Failed to publish post: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin')}
            className="text-slate-500 hover:text-slate-900 transition-colors"
          >
            ← Back to Admin
          </button>
          <h1 className="text-xl font-black text-slate-900 tracking-tight border-l border-slate-200 pl-4">
            Write New Article
          </h1>
        </div>
        <button 
          onClick={handleSavePost} 
          disabled={isSaving}
          className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-2.5 rounded-xl font-black uppercase tracking-widest shadow-lg transition-all disabled:opacity-50"
        >
          {isSaving ? 'Publishing...' : 'Publish Post 🚀'}
        </button>
      </header>

      {/* Main Editor Area */}
      <main className="max-w-4xl mx-auto mt-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Content Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <input 
              type="text" 
              value={postForm.title}
              onChange={(e) => setPostForm({...postForm, title: e.target.value})}
              className="w-full text-4xl font-black text-slate-900 placeholder-slate-300 outline-none mb-6"
              placeholder="Post Title..."
            />
            
            <textarea 
              value={postForm.content}
              onChange={(e) => setPostForm({...postForm, content: e.target.value})}
              className="w-full min-h-[500px] text-lg text-slate-700 outline-none resize-y"
              placeholder="Start writing your guide here... (You can use HTML like <h2> or <b>)"
            />
          </div>
        </div>

        {/* Right Column: Meta Settings */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-4">Post Settings</h3>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">Category</label>
              <select 
                value={postForm.category}
                onChange={(e) => setPostForm({...postForm, category: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none"
              >
                <option value="Guides">Guides</option>
                <option value="News">News</option>
                <option value="Tips">Tips</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">Status</label>
              <select 
                value={postForm.status}
                onChange={(e) => setPostForm({...postForm, status: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">Cover Image URL</label>
              <input 
                type="text" 
                value={postForm.image}
                onChange={(e) => setPostForm({...postForm, image: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none text-sm"
                placeholder="https://..."
              />
              {postForm.image && (
                <img src={postForm.image} alt="Preview" className="mt-3 w-full h-32 object-cover rounded-xl border border-slate-200" />
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default CreatePost;