import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Profile.css'

const Profile = ({ users }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, updateUser } = useAuth()

  // If an :id is in the URL, show that user. Otherwise, fallback to currentUser
  const viewedUser = id
    ? users.find(u => u.id === parseInt(id))
    : currentUser

  const [formData, setFormData] = useState({
    name: viewedUser?.name || '',
    email: viewedUser?.email || '',
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
      
      // Update user data
      const updatedUser = {
        ...currentUser,
        name: formData.name,
        email: formData.email
      }
      
      // Update in localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      
      // Update registered users list
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      const updatedUsers = registeredUsers.map(user => 
        user.id === currentUser.id ? updatedUser : user
      )
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers))
      
      // Update context if updateUser function exists
      if (updateUser) {
        updateUser(updatedUser)
      }
      
      setSuccess('Profile updated successfully!')
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch (err) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  if (!viewedUser) {
    return <div>User not found</div>
  }

  const isOwnProfile = !id || currentUser?.id === viewedUser.id

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>{isOwnProfile ? "My Profile" : `${viewedUser.name}'s Profile`}</h1>
        <p>
          {isOwnProfile
            ? "Manage your account information and settings"
            : "Viewing team member details"}
        </p>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          <div className="avatar-initials">
            {viewedUser?.name?.split(' ').map(n => n[0]).join('')}
          </div>
        </div>

        {isOwnProfile ? (
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
                disabled
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
        ) : (
          <div className="profile-info">
            <p><strong>Name:</strong> {viewedUser.name}</p>
            <p><strong>Email:</strong> {viewedUser.email}</p>
            <p><strong>Role:</strong> {viewedUser.role}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
