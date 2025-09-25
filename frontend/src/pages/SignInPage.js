import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const SignInPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth() // Get the login function from context

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, you would send this to the backend
    // For now, we will use the mock login
    login(email, password)
  }

  return (
    <div className="signin-page-container">
      <div className="signin-card">
        <h1 className="signin-title">TaskTrail</h1>
        <h2 className="signin-subtitle">Sign In</h2>
        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="signin-btn">
            Sign In
          </button>
        </form>
        <div className="contact-admin">
          <p>Don't have an account? <Link to="#" className="contact-link">Contact Admin</Link></p>
        </div>
      </div>
    </div>
  )
}

export default SignInPage