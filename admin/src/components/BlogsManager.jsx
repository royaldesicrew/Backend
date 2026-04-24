import React, { useState, useEffect, useCallback } from 'react';
import { blogsAPI } from '../services/api';
import './Manager.css';

const BlogsManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await blogsAPI.getAll();
      setBlogs(response.data.blogs || []);
    } catch (err) {
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await blogsAPI.create({ title, content, author });
      setTitle('');
      setContent('');
      setAuthor('');
      setShowForm(false);
      fetchBlogs();
    } catch (err) {
      setError('Failed to create blog');
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      await blogsAPI.delete(blogId);
      fetchBlogs();
    } catch (err) {
      setError('Failed to delete blog');
    }
  };

  if (loading) return <div className="manager"><p>Loading...</p></div>;

  return (
    <div className="manager">
      <div className="manager-header">
        <h2>Blogs Manager</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add Blog'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="manager-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="10"
              required
            ></textarea>
          </div>
          <button type="submit" className="btn-primary">Create</button>
        </form>
      )}

      <div className="blogs-list">
        {blogs.map((blog) => (
          <div key={blog._id} className="blog-item">
            <h3>{blog.title}</h3>
            <p className="blog-meta">By {blog.author} • {new Date(blog.createdAt).toLocaleDateString()}</p>
            <p>{blog.content.substring(0, 150)}...</p>
            <button
              onClick={() => handleDelete(blog._id)}
              className="btn-danger"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogsManager;
