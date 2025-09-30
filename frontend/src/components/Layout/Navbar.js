import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from './ThemeToggle'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/signin')
  }

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

        <div className="nav-right">
          <ThemeToggle />
          <div className="user-menu" ref={dropdownRef}>
          <div 
            className="user-info" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="user-avatar">
              {currentUser?.name?.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="user-name">{currentUser?.name}</span>
            <span className={`dropdown-arrow ${isDropdownOpen ? 'up' : 'down'}`}>▼</span>
          </div>
          
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <Link 
                to="/profile" 
                className="dropdown-item"
                onClick={() => setIsDropdownOpen(false)}
              >
                <span className="dropdown-icon">👤</span> My Profile
              </Link>
              <div className="dropdown-divider"></div>
              <button 
                className="dropdown-item"
                onClick={handleLogout}
              >
                <span className="dropdown-icon">🚪</span> Logout
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar