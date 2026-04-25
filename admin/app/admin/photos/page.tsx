'use client';

import { useState, useEffect, useRef } from 'react';
import { photosAPI } from '@/lib/api';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  X, 
  Upload,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  'Luxury Wedding',
  'Birthday',
  'Corporate',
  'Design and Decor',
  'Background Images'
];

export default function PhotosManager() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES[0],
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await photosAPI.getAll();
      const photoData = Array.isArray(response.data) ? response.data : (response.data.photos || []);
      setPhotos(photoData);
    } catch (err) {
      console.error('Failed to fetch photos:', err);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (photo: any = null) => {
    if (photo) {
      setEditingPhoto(photo);
      setFormData({
        title: photo.title || '',
        category: photo.category || CATEGORIES[0],
        description: photo.description || ''
      });
      setPreviewUrl(photo.url);
    } else {
      setEditingPhoto(null);
      setFormData({
        title: '',
        category: CATEGORIES[0],
        description: ''
      });
      setPreviewUrl(null);
      setSelectedFile(null);
    }
    setIsModalOpen(true);
    setMessage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('description', formData.description);
    if (selectedFile) {
      data.append('photo', selectedFile);
    }

    try {
      if (editingPhoto) {
        await photosAPI.update(editingPhoto._id, data);
        setMessage({ type: 'success', text: 'Photo updated successfully!' });
      } else {
        if (!selectedFile) throw new Error('Please select an image file');
        await photosAPI.upload(data);
        setMessage({ type: 'success', text: 'Photo uploaded successfully!' });
      }
      setTimeout(() => {
        setIsModalOpen(false);
        fetchPhotos();
      }, 1500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || err.message || 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    
    try {
      await photosAPI.delete(id);
      setPhotos(photos.filter(p => p._id !== id));
    } catch (err) {
      alert('Failed to delete photo');
    }
  };



  const filteredPhotos = photos.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Photos Manager</h2>
          <p className="text-gray-400">Curate and manage your luxury portfolio gallery.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-gold hover:bg-gold-dark text-luxury-black font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-gold/20"
          >
            <Plus className="w-5 h-5" />
            Add New Photo
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text"
            placeholder="Search by title or category..."
            className="w-full bg-luxury-gray border border-luxury-border rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-gold/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setActiveCategory('All')}
            className={cn(
              "px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              activeCategory === 'All' ? "bg-gold text-luxury-black" : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
            )}
          >
            All Categories
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                activeCategory === cat ? "bg-gold text-luxury-black" : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="aspect-[4/5] rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.length > 0 ? (
            filteredPhotos.map((photo) => (
              <div key={photo._id} className="group relative glass rounded-2xl border-luxury-border overflow-hidden hover:border-gold/30 transition-all">
                <div className="aspect-[4/5] relative">
                  <img 
                    src={photo.url} 
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <p className="text-white font-bold truncate">{photo.title}</p>
                    <p className="text-gold text-xs uppercase tracking-widest mt-1">{photo.category}</p>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                    <button 
                      onClick={() => handleOpenModal(photo)}
                      className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-gold hover:text-luxury-black transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(photo._id)}
                      className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-white">No photos found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex justify-center items-start pt-10 md:pt-20 p-4 overflow-y-auto scrollbar-hide">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
              onClick={() => !submitting && setIsModalOpen(false)} 
            />
            
            <motion.div 
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-2xl glass rounded-3xl border-luxury-border shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gold/30" />
            
            <div className="p-8 pb-4 flex flex-col items-center justify-center relative bg-white/5">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute right-6 top-6 p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20 mb-3 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                <Lock className="w-6 h-6 text-gold" />
              </div>
              
              <h3 className="text-2xl font-bold text-white tracking-tight text-center">
                {editingPhoto ? 'Edit Photo Details' : 'Upload New Photo'}
              </h3>
              <p className="text-gray-500 text-sm mt-1">Management Portal</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {message && (
                <div className={cn(
                  "p-4 rounded-xl border flex items-center gap-3 animate-fade-in",
                  message.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                )}>
                  {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <span className="text-sm font-medium">{message.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Upload Area */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-400">Photo Preview</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "aspect-[4/5] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all overflow-hidden relative group",
                      previewUrl ? "border-gold/50" : "border-luxury-border hover:border-gold/30 hover:bg-white/5"
                    )}
                  >
                    {previewUrl ? (
                      <>
                        <img src={previewUrl} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Upload className="w-8 h-8 text-white" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                          <Upload className="w-6 h-6 text-gold" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-white font-medium">Click to upload</p>
                          <p className="text-xs text-gray-500 mt-1">JPG, PNG or WEBP (Max 5MB)</p>
                        </div>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>

                {/* Form Fields */}
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-400">Title</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-luxury-gray border border-luxury-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold/50 transition-all"
                      placeholder="e.g. Wedding Mandap Decor"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-400">Category</label>
                    <div className="space-y-3">
                      <select 
                        className="w-full bg-luxury-gray border border-luxury-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold/50 transition-all appearance-none"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-400">Description (Optional)</label>
                    <textarea 
                      rows={4}
                      className="w-full bg-luxury-gray border border-luxury-border rounded-xl py-3 px-4 text-white focus:outline-none focus:border-gold/50 transition-all resize-none"
                      placeholder="Add some details about this shot..."
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="flex-1 py-4 rounded-xl border border-luxury-border text-white font-bold hover:bg-white/5 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] bg-gold hover:bg-gold-dark text-luxury-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-gold/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    editingPhoto ? 'Save Changes' : 'Upload Photo'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
}
