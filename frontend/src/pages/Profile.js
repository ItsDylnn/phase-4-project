import React, { useState, useContext } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import '../styles/Profile.css'

const Profile = () => {
  const { currentUser, updateUser } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      return setError('New passwords do not match')
    }

    try {
      setIsLoading(true)
      // In a real app, you would make an API call here
      // await updateUser(formData)
      
      // For demo purposes, we'll just show a success message
      setSuccess('Profile updated successfully!')
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
      
      // Refresh user data
      // await refreshUser()
      
    } catch (err) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your account information and settings</p>
      </div>
      
      <div className="profile-card">
        <div className="profile-avatar">
          <div className="avatar-initials">
            {currentUser?.name?.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="profile-form">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled // Email is typically not editable
            />
          </div>
          
          <div className="password-section">
            <h3>Change Password</h3>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password to change it"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Leave blank to keep current"
              />
            </div>
            
            {formData.newPassword && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                />
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile
