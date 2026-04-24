import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PhotosManager from '../components/PhotosManager';
import BlogsManager from '../components/BlogsManager';
import DiscountsManager from '../components/DiscountsManager';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="dashboard">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <div className="dashboard-content">
        {activeTab === 'overview' && <AnalyticsDashboard />}
        {activeTab === 'photos' && <PhotosManager />}
        {activeTab === 'blogs' && <BlogsManager />}
        {activeTab === 'discounts' && <DiscountsManager />}
      </div>
    </div>
  );
};

export default Dashboard;
