import React from 'react';
import './Navbar.css';

const Navbar = ({ activeTab, setActiveTab, onLogout }) => {
  const tabs = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'photos', label: 'Photos' },
    { id: 'blogs', label: 'Blogs' },
    { id: 'discounts', label: 'Discounts' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Admin Panel</h2>
        <p>Royal Desi Crew</p>
      </div>

      <div className="navbar-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="navbar-footer">
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
