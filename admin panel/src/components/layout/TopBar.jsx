import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './TopBar.css';

const TopBar = ({ onToggleSidebar }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('Searching for:', searchTerm);
      // Implement search functionality
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <button className="toggle-btn" onClick={onToggleSidebar}>
          ☰
        </button>
      </div>
      <div className="top-bar-right">
        <form onSubmit={handleSearch} className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search films, users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <div className="notification-icon" title="Notifications">
          🔔
          <span className="notification-badge"></span>
        </div>
        <div 
          className="profile-menu"
          onMouseEnter={() => setShowProfileMenu(true)}
          onMouseLeave={() => setShowProfileMenu(false)}
        >
          <div className="profile-icon" title="Profile">
            👤
          </div>
          {showProfileMenu && (
            <div className="profile-dropdown">
              <div className="profile-info">
                <div className="profile-name">{user?.name || 'Admin User'}</div>
                <div className="profile-email">{user?.email || 'admin@filmhub.com'}</div>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={() => navigate('/settings')}>
                ⚙️ Settings
              </button>
              <button className="dropdown-item" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
