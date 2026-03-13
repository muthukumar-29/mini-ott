import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ collapsed }) => {
  const menuItems = [
    { id: 'dashboard', path: '/dashboard', icon: '📊', label: 'Dashboard', end: true },
    { id: 'films', path: '/films', icon: '🎬', label: 'Short Films', end: true },
    { id: 'approval', path: '/films/approval', icon: '✅', label: 'Film Approval', end: true },
    { id: 'categories', path: '/categories', icon: '📂', label: 'Categories', end: true },
    { id: 'users', path: '/users', icon: '👥', label: 'Users', end: true },
    { id: 'analytics', path: '/analytics', icon: '📈', label: 'Analytics', end: true },
    { id: 'comments', path: '/comments', icon: '💬', label: 'Comments', end: true },
    { id: 'settings', path: '/settings', icon: '⚙️', label: 'Settings', end: true },
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">🎥</div>
          {!collapsed && <span className="logo-text">FilmHub</span>}
        </div>
      </div>
      <nav className="sidebar-menu">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="menu-item">
              <NavLink
                to={item.path}
                end={item.end}
                className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
              >
                <span className="menu-icon">{item.icon}</span>
                {!collapsed && <span className="menu-text">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;