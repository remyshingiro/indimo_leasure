import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import useBlogStore from '../stores/blogStore'
import LazyImage from '../components/LazyImage'

const BlogPost = () => {
  const { slug } = useParams()
  const { posts, fetchPosts } = useBlogStore()
  const [post, setPost] = useState(null)

  useEffect(() => {
    if (posts.length === 0) fetchPosts()
  }, [posts.length, fetchPosts])

  useEffect(() => {
    const foundPost = posts.find(p => p.slug === slug)
    if (foundPost) {
      setPost(foundPost)
      document.title = `${foundPost.title} | Kigali Swim Shop`
      window.scrollTo(0, 0)
    }
  }, [slug, posts])

  if (!post) return <div className="text-center py-20">Loading...</div>

  return (
    <main className="bg-white pb-24">
      {/* Article Header */}
      <header className="relative w-full h-[40vh] md:h-[60vh] bg-slate-900">
        <LazyImage src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 container mx-auto max-w-4xl z-10">
          <span className="text-sky-400 font-black tracking-widest text-xs uppercase mb-4 block">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-slate-300 font-medium text-sm">
            <span>By {post.author || 'Kigali Swim Shop'}</span>
            <span>•</span>
            <time>{new Date(post.publishedAt).toLocaleDateString()}</time>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Render HTML content securely */}
        <div 
          className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-a:text-sky-600 prose-img:rounded-3xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* 🚀 THE SEO CONVERSION MACHINE: Inject related products */}
        <div className="mt-16 p-8 bg-sky-50 rounded-3xl border border-sky-100 flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Ready to hit the pool?</h3>
            <p className="text-slate-600 mb-0">Get the right gear. Delivered anywhere in Kigali within 24 hours.</p>
          </div>
          <Link to="/products" className="bg-slate-900 text-white font-black px-8 py-4 rounded-xl shadow-lg hover:bg-slate-800 transition transform hover:-translate-y-1">
            Shop Swimming Gear
          </Link>
        </div>
      </article>
    </main>
  )
}

export default BlogPost