import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import './Analytics.css';

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getDashboard();
      setStats(response.data);
    } catch (err) {
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="analytics"><p>Loading...</p></div>;
  if (error) return <div className="analytics"><p className="error">{error}</p></div>;

  return (
    <div className="analytics">
      <h2>Dashboard Overview</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Visitors</h3>
          <p className="stat-value">{stats?.totalVisitors || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Total Photos</h3>
          <p className="stat-value">{stats?.totalPhotos || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Total Blogs</h3>
          <p className="stat-value">{stats?.totalBlogs || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Active Discounts</h3>
          <p className="stat-value">{stats?.activeDiscounts || 0}</p>
        </div>
      </div>

      <div className="analytics-section">
        <h3>Recent Activity</h3>
        <p className="placeholder">Analytics data will appear here</p>
      </div>

      <div className="analytics-section">
        <h3>Popular Pages</h3>
        <p className="placeholder">Page analytics will appear here</p>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
