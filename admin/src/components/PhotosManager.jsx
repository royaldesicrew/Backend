import React, { useState, useEffect, useCallback } from 'react';
import { photosAPI } from '../services/api';
import './Manager.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PhotosManager = () => {
  const defaultCategories = ['Luxury Weddings', 'Corporate Events', 'Birthday Celebrations', 'Decor and Design', 'Background Images'];
  const [photosByCategory, setPhotosByCategory] = useState({});
  const [allCategories, setAllCategories] = useState(defaultCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Luxury Weddings');
  const [selectedPhotos, setSelectedPhotos] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);

  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await photosAPI.getAll();
      const photos = response.data.photos || [];
      
      const grouped = {};
      const categoriesFound = new Set();

      photos.forEach(photo => {
        const cat = photo.category || 'Other';
        categoriesFound.add(cat);
        if (!grouped[cat]) {
          grouped[cat] = [];
        }
        grouped[cat].push(photo);
      });

      setPhotosByCategory(grouped);
      const orderedCategories = [
        ...defaultCategories.filter(cat => categoriesFound.has(cat)),
        ...Array.from(categoriesFound).filter(cat => !defaultCategories.includes(cat)).sort()
      ];
      setAllCategories(orderedCategories.length > 0 ? orderedCategories : defaultCategories);
    } catch (err) {
      setError('Failed to load photos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [defaultCategories]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const resetForm = () => {
    setFile(null);
    setTitle('');
    setDescription('');
    setCategory('Luxury Weddings');
    setEditingPhoto(null);
    setShowForm(false);
    setError('');
  };

  const handleEditClick = (photo) => {
    setEditingPhoto(photo);
    setTitle(photo.title);
    setDescription(photo.description || '');
    setCategory(photo.category || 'Luxury Weddings');
    setFile(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingPhoto && (!file || !title)) {
      setError('Please select a photo and enter a title');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    if (file) formData.append('photo', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);

    try {
      if (editingPhoto) {
        await photosAPI.update(editingPhoto._id, formData);
      } else {
        await photosAPI.upload(formData);
      }
      resetForm();
      fetchPhotos();
    } catch (err) {
      setError(editingPhoto ? 'Failed to update photo' : 'Failed to upload photo');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (photoId) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;

    try {
      await photosAPI.delete(photoId);
      fetchPhotos();
    } catch (err) {
      setError('Failed to delete photo');
    }
  };

  const handleMultipleDelete = async () => {
    if (selectedPhotos.size === 0) {
      setError('Please select photos to delete');
      return;
    }

    if (!window.confirm(`Delete ${selectedPhotos.size} photo(s)? This cannot be undone.`)) return;

    try {
      for (const photoId of selectedPhotos) {
        await photosAPI.delete(photoId);
      }
      setSelectedPhotos(new Set());
      fetchPhotos();
    } catch (err) {
      setError('Failed to delete photos');
    }
  };

  const togglePhotoSelection = (photoId) => {
    const newSelected = new Set(selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    setSelectedPhotos(newSelected);
  };

  const getImageUrl = (photoUrl) => {
    if (!photoUrl) {
      return `${API_BASE_URL}/placeholder/400/300?text=No%20Image`;
    }
    if (photoUrl.startsWith('http')) {
      return photoUrl;
    }
    if (photoUrl.startsWith('/')) {
      return `${API_BASE_URL}${photoUrl}`;
    }
    return `${API_BASE_URL}/${photoUrl}`;
  };

  if (loading) return <div className="manager"><p>Loading photos...</p></div>;

  return (
    <div className="manager">
      <div className="manager-header">
        <h2>Photos Manager - Signature Moments</h2>
        <div className="header-actions">
          <button 
            onClick={() => {
              if (showForm) resetForm();
              else setShowForm(true);
            }} 
            className="btn-primary"
          >
            {showForm ? 'Cancel' : '+ Add Photo'}
          </button>
          {selectedPhotos.size > 0 && (
            <button onClick={handleMultipleDelete} className="btn-danger">
              Delete {selectedPhotos.size} Selected
            </button>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="manager-form">
          <h3>{editingPhoto ? 'Edit Photo' : 'Upload New Photo'}</h3>
          <div className="form-group">
            <label>Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {defaultCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter photo title"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter photo description (optional)"
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Photo File {editingPhoto && '(Leave blank to keep current photo)'}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              required={!editingPhoto}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Processing...' : (editingPhoto ? 'Update Photo' : 'Upload Photo')}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="categories-container">
        {allCategories.map(cat => (
          <div key={cat} className="category-section">
            <div className="category-header">
              <h3>{cat}</h3>
              <span className="photo-count">{photosByCategory[cat]?.length || 0} photos</span>
            </div>
            
            {!photosByCategory[cat] || photosByCategory[cat].length === 0 ? (
              <div className="no-photos">
                <p>No photos in this category yet</p>
              </div>
            ) : (
              <div className="photos-grid">
                {photosByCategory[cat].map(photo => (
                  <div key={photo._id} className="photo-card">
                    <div className="photo-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedPhotos.has(photo._id)}
                        onChange={() => togglePhotoSelection(photo._id)}
                      />
                    </div>
                    <img 
                      src={getImageUrl(photo.url)}
                      alt={photo.title}
                      className="photo-image"
                      onError={(e) => {
                        e.target.src = `${API_BASE_URL}/placeholder/400/300?text=${encodeURIComponent(photo.title)}`;
                      }}
                    />
                    <div className="photo-info">
                      <h4>{photo.title}</h4>
                      <p>{photo.description || 'No description'}</p>
                      <span className="photo-category-tag">{photo.category}</span>
                    </div>
                    <div className="photo-actions">
                      <button 
                        onClick={() => handleEditClick(photo)} 
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(photo._id)} 
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotosManager;

