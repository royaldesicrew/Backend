'use client';

import { useState, useEffect } from 'react';
import { blogsAPI } from '@/lib/api';
import { 
  Plus, 
  Search, 
  FileText, 
  Trash2, 
  Edit3, 
  X, 
  Eye,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  ArrowLeft,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BlogsManager() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // View states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: 'Admin',
    image: '',
    published: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await blogsAPI.getAll();
      const blogData = Array.isArray(response.data) ? response.data : (response.data.blogs || []);
      setBlogs(blogData);
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditor = (blog: any = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title || '',
        content: blog.content || '',
        author: blog.author || 'Admin',
        image: blog.image || '',
        published: blog.published || false
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: '',
        content: '',
        author: 'Admin',
        image: '',
        published: false
      });
    }
    setIsEditorOpen(true);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      if (editingBlog) {
        await blogsAPI.update(editingBlog._id, formData);
        setMessage({ type: 'success', text: 'Blog post updated successfully!' });
      } else {
        await blogsAPI.create(formData);
        setMessage({ type: 'success', text: 'Blog post created successfully!' });
      }
      setTimeout(() => {
        setIsEditorOpen(false);
        fetchBlogs();
      }, 1500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      await blogsAPI.delete(id);
      setBlogs(blogs.filter(b => b._id !== id));
    } catch (err) {
      alert('Failed to delete blog');
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isEditorOpen) {
    return (
      <div className="animate-fade-in max-w-5xl mx-auto">
        <button 
          onClick={() => setIsEditorOpen(false)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blogs
        </button>

        <div className="flex flex-col items-center mb-10 text-center relative">
          <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/20 mb-4 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
            <Lock className="w-6 h-6 text-gold" />
          </div>
          <h2 className="text-4xl font-bold text-white tracking-tight">
            {editingBlog ? 'Edit Blog Post' : 'Create New Article'}
          </h2>
          <p className="text-gray-400 mt-2">Draft your next luxury event insights.</p>
        </div>

        {message && (
          <div className={cn(
            "p-4 rounded-xl border flex items-center gap-3 mb-8 animate-fade-in",
            message.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
          )}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass p-8 rounded-2xl border-luxury-border space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-widest font-bold text-gray-500 ml-1">Title</label>
                <input 
                  type="text" 
                  className="w-full bg-transparent border-b border-luxury-border py-4 text-3xl font-bold text-white focus:outline-none focus:border-gold transition-all"
                  placeholder="Enter a captivating title..."
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-1.5 pt-4">
                <label className="text-xs uppercase tracking-widest font-bold text-gray-500 ml-1">Content</label>
                <textarea 
                  rows={15}
                  className="w-full bg-luxury-gray/30 border border-luxury-border rounded-xl p-6 text-gray-300 focus:outline-none focus:border-gold/50 transition-all resize-none leading-relaxed"
                  placeholder="Write your article content here..."
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl border-luxury-border space-y-6">
              <h3 className="font-bold text-white border-b border-luxury-border pb-4">Article Settings</h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Author</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      className="w-full bg-luxury-gray border border-luxury-border rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-gold/50 transition-all"
                      value={formData.author}
                      onChange={e => setFormData({...formData, author: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Cover Image URL</label>
                  <input 
                    type="text" 
                    className="w-full bg-luxury-gray border border-luxury-border rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-gold/50 transition-all"
                    placeholder="https://cloudinary.com/image.jpg"
                    value={formData.image}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                  />
                </div>

                <div className="pt-4 flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <div>
                    <label className="text-xs font-bold text-white uppercase tracking-widest block">Published</label>
                    <p className="text-[10px] text-gray-500 mt-0.5">Visible to everyone</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, published: !formData.published})}
                    className={cn(
                      "w-12 h-6 rounded-full transition-all relative",
                      formData.published ? "bg-gold" : "bg-white/10"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 rounded-full transition-all bg-white",
                      formData.published ? "right-1" : "left-1"
                    )} />
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-luxury-border mt-6">
                <button 
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full bg-gold hover:bg-gold-dark text-luxury-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-gold/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
                  {editingBlog ? 'Update Post' : 'Publish Article'}
                </button>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl border-luxury-border bg-gold/5 border-gold/20">
              <h4 className="text-sm font-bold text-gold uppercase tracking-widest mb-4">Pro Tip</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Use high-quality images in your descriptions to keep readers engaged. Luxury clients appreciate attention to detail.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Blog Writing</h2>
          <p className="text-gray-400">Manage your stories and articles.</p>
        </div>
        <button 
          onClick={() => handleOpenEditor()}
          className="flex items-center gap-2 bg-gold hover:bg-gold-dark text-luxury-black font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-gold/20"
        >
          <Plus className="w-5 h-5" />
          Create New Article
        </button>
      </div>

      {/* Filters & Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input 
          type="text"
          placeholder="Search articles by title or author..."
          className="w-full bg-luxury-gray border border-luxury-border rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-gold/50 transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Blog List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 glass rounded-2xl border-luxury-border animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <div key={blog._id} className="group glass p-6 rounded-2xl border-luxury-border hover:border-gold/30 transition-all flex items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest",
                      blog.published ? "bg-emerald-500/10 text-emerald-400" : "bg-gray-500/10 text-gray-500"
                    )}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors truncate">
                    {blog.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <User className="w-4 h-4" />
                      {blog.author}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <Eye className="w-4 h-4" />
                      {blog.views || 0} Views
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleOpenEditor(blog)}
                    className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-gold hover:bg-gold/10 border border-white/10 transition-all"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(blog._id)}
                    className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-500/10 border border-white/10 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center glass rounded-2xl border-luxury-border">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-white">No articles found</h3>
              <p className="text-gray-500 mt-2">Time to write something extraordinary!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
