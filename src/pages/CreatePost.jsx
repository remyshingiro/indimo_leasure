import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';  
import { collection, addDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const CreatePost = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);  
  const [postForm, setPostForm] = useState({ 
    title: '', 
    slug: '', 
    category: 'Guides', 
    image: '', 
    content: '', 
    status: 'published' 
  });

  // 🚀 NEW: Cloudinary Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, 
        { method: 'POST', body: formData }
      );
      
      const data = await response.json();
      
      if (data.secure_url) {
        setPostForm({ ...postForm, image: data.secure_url });
        toast.success('Image uploaded successfully! 📸');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      toast.error('Failed to upload image. Check your internet connection.');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

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
          disabled={isSaving || isUploading}
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

            {/* 🚀 NEW: Cloudinary Image Dropzone */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2">Cover Image</label>
              
              {!postForm.image ? (
                <div className="flex items-center justify-center w-full">
                  <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${isUploading ? 'border-sky-400 bg-sky-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'}`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <span className={`text-2xl mb-2 ${isUploading ? 'animate-bounce' : ''}`}>
                        {isUploading ? '⏳' : '📸'}
                      </span>
                      <p className="text-sm text-slate-500 font-bold">
                        {isUploading ? 'Uploading to Cloudinary...' : 'Click to upload image'}
                      </p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/png, image/jpeg, image/webp" 
                      onChange={handleImageUpload} 
                      disabled={isUploading} 
                    />
                  </label>
                </div>
              ) : (
                <div className="relative mt-2 group">
                  <img 
                    src={postForm.image} 
                    alt="Cover Preview" 
                    className="w-full h-40 object-cover rounded-xl border border-slate-200 shadow-sm" 
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <button 
                      onClick={() => setPostForm({...postForm, image: ''})} 
                      className="bg-white text-red-500 px-4 py-2 rounded-lg shadow-lg font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>

      </main>
    </div>
  );
};

export default CreatePost;