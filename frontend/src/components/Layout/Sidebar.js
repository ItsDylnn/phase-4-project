import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: '📊', label: 'Dashboard' },
    { path: '/my-tasks', icon: '✅', label: 'My Tasks' },
    { path: '/team', icon: '👥', label: 'Team' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">🚀</span>
        <span className="logo-text">TaskTrail</span>
      </div>
      
      <nav className="sidebar-nav-container">
        <ul className="sidebar-nav">
          {menuItems.map(item => (
            <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
              <Link to={item.path}>
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="user-profile">
        <div className="user-avatar">WT</div>
        <div className="user-details">
          <div className="user-name">Wayne Travis</div>
          <div className="user-email">wayne@example.com</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;