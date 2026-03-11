import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import './MainLayout.css';

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="main-layout">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <TopBar onToggleSidebar={toggleSidebar} />
        <div className="content-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
