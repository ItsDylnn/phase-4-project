import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { currentUser } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/">
            <span className="logo-icon">🚀</span>
            TaskTrail
          </Link>
        </div>
        
        <ul className="nav-menu">
          <li className={location.pathname === '/' ? 'nav-item active' : 'nav-item'}>
            <Link to="/">
              <span className="nav-icon">📊</span>
              Dashboard
            </Link>
          </li>
          <li className={location.pathname === '/my-tasks' ? 'nav-item active' : 'nav-item'}>
            <Link to="/my-tasks">
              <span className="nav-icon">✅</span>
              My Tasks
            </Link>
          </li>
          <li className={location.pathname === '/team' ? 'nav-item active' : 'nav-item'}>
            <Link to="/team">
              <span className="nav-icon">👥</span>
              Team
            </Link>
          </li>
        </ul>

        <div className="user-info">
          <div className="user-avatar">
            {currentUser?.name?.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="user-name">{currentUser?.name}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;