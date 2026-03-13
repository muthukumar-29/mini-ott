import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ collapsed }) => {
  const menuItems = [
    { id: 'dashboard', path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'films', path: '/films', icon: '🎬', label: 'Short Films' },
    { id: 'approval', path: '/films/approval', icon: '✅', label: 'Film Approval' },
    { id: 'categories', path: '/categories', icon: '📂', label: 'Categories' },
    { id: 'users', path: '/users', icon: '👥', label: 'Users' },
    { id: 'analytics', path: '/analytics', icon: '📈', label: 'Analytics' },
    { id: 'comments', path: '/comments', icon: '💬', label: 'Comments' },
    { id: 'settings', path: '/settings', icon: '⚙️', label: 'Settings' },
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