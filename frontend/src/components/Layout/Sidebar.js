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
      <div className="sidebar-header">
        <h3>Navigation</h3>
      </div>
      <ul className="sidebar-menu">
        {menuItems.map(item => (
          <li key={item.path} className={location.pathname === item.path ? 'sidebar-item active' : 'sidebar-item'}>
            <Link to={item.path}>
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;