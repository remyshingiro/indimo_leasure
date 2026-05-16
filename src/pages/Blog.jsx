import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useBlogStore from '../stores/blogStore'
import useLanguageStore from '../stores/languageStore'
import LazyImage from '../components/LazyImage'

const Blog = () => {
  const { posts, fetchPosts, isLoading } = useBlogStore()
  const language = useLanguageStore((state) => state.language)

  useEffect(() => {
    fetchPosts()
    document.title = "Swimming Guides & Tips in Kigali | Kigali Swim Shop"
  }, [fetchPosts])

  if (isLoading) return <div className="text-center py-20">Loading guides...</div>

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
          {language === 'en' ? 'The Kigali Swimmer\'s Guide' : 'Inyigisho zo Koga Kigali'}
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          {language === 'en' 
            ? 'Everything you need to know about swimming pools, gear, and training in Rwanda.' 
            : 'Ibyo ugomba kumenya byose kubyerekeye koga mu Rwanda.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <article key={post.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
            <Link to={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-slate-100">
              <LazyImage src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </Link>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <time className="text-xs font-bold text-slate-400">
                  {new Date(post.publishedAt).toLocaleDateString('en-RW', { month: 'short', day: 'numeric', year: 'numeric' })}
                </time>
              </div>
              <Link to={`/blog/${post.slug}`}>
                <h2 className="text-xl font-black text-slate-900 leading-tight mb-3 group-hover:text-sky-600 transition-colors line-clamp-2">
                  {post.title}
                </h2>
              </Link>
              <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              <Link to={`/blog/${post.slug}`} className="mt-auto text-sm font-black text-slate-900 flex items-center gap-2 group-hover:text-sky-600 transition-colors">
                Read Article <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Blog