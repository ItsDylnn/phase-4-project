import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Auth.css'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [step, setStep] = useState(1) // 1: email, 2: reset password
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { resetPassword } = useAuth()
  const navigate = useNavigate()

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setError('')
      setLoading(true)
      
      // Check if email exists
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      const userExists = existingUsers.find(u => u.email === email)
      
      if (userExists) {
        setStep(2)
      } else {
        setError('Email not found. Please check your email address.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    }
    
    setLoading(false)
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match')
    }
    
    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters long')
    }
    
    try {
      setError('')
      setLoading(true)
      
      const result = resetPassword(email, newPassword)
      
      if (result.success) {
        alert('Password reset successfully! You can now sign in with your new password.')
        navigate('/signin')
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError('Failed to reset password. Please try again.')
    }
    
    setLoading(false)
  }

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h1 className="auth-title">TaskTrail</h1>
        <h2 className="auth-subtitle">
          {step === 1 ? 'Forgot Password' : 'Reset Password'}
        </h2>
        {error && <div className="error-message">{error}</div>}
        
        {step === 1 ? (
          <form onSubmit={handleEmailSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Checking...' : 'Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="auth-form">
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
              <div className="password-hint">Password must be at least 6 characters long</div>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
        
        <div className="auth-links">
          <p>
            Remember your password? <Link to="/signin">Sign in</Link>
          </p>
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage