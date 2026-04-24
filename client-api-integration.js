// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Photos API Integration
class PhotosAPI {
  static async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/photos`);
      if (!response.ok) throw new Error('Failed to fetch photos');
      const data = await response.json();
      return data.photos || [];
    } catch (error) {
      console.error('Error fetching photos:', error);
      // Fallback to static photos
      return await this.getStaticPhotos();
    }
  }

  static async getStaticPhotos() {
    try {
      const response = await fetch('static/photos.json');
      const data = await response.json();
      return data.photos || [];
    } catch (error) {
      console.error('Error loading static photos:', error);
      return [];
    }
  }
}

// Blogs API Integration
class BlogsAPI {
  static async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs`);
      if (!response.ok) throw new Error('Failed to fetch blogs');
      const data = await response.json();
      return data.blogs || [];
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return [];
    }
  }
}

// Discounts API Integration
class DiscountsAPI {
  static async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/discounts`);
      if (!response.ok) throw new Error('Failed to fetch discounts');
      const data = await response.json();
      return data.discounts || [];
    } catch (error) {
      console.error('Error fetching discounts:', error);
      return [];
    }
  }

  static async validate(code) {
    try {
      const response = await fetch(`${API_BASE_URL}/discounts/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      if (!response.ok) throw new Error('Invalid discount code');
      return await response.json();
    } catch (error) {
      console.error('Error validating discount:', error);
      return null;
    }
  }
}

// Analytics API Integration
class AnalyticsAPI {
  static async trackPageView() {
    try {
      fetch(`${API_BASE_URL}/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'page_view',
          userAgent: navigator.userAgent,
          ipAddress: 'browser' // IP will be captured by server
        })
      }).catch(err => console.log('Analytics tracking skipped'));
    } catch (error) {
      // Silent error - don't block page for analytics
    }
  }

  static async trackPhotoView(photoId) {
    try {
      fetch(`${API_BASE_URL}/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'photo_view',
          photoId,
          userAgent: navigator.userAgent,
          ipAddress: 'browser'
        })
      }).catch(err => console.log('Photo view tracking skipped'));
    } catch (error) {
      // Silent error
    }
  }

  static async trackBlogView(blogId) {
    try {
      fetch(`${API_BASE_URL}/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'blog_view',
          blogId,
          userAgent: navigator.userAgent,
          ipAddress: 'browser'
        })
      }).catch(err => console.log('Blog view tracking skipped'));
    } catch (error) {
      // Silent error
    }
  }
}

// Initialize tracking when page loads
document.addEventListener('DOMContentLoaded', () => {
  AnalyticsAPI.trackPageView();
});

console.log('✅ API Integration loaded successfully');
