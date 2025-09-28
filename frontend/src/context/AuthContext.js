
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on initial load
  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Check if user exists in localStorage from previous signup
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = existingUsers.find(u => u.email === email);
    
    if (user) {
      // Use existing user data
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true };
    } else {
      // Create new user for demo purposes
      const newUser = {
        id: Date.now(),
        name: email.split('@')[0], // Use email prefix as name
        email: email,
        role: 'user'
      };
      
      setCurrentUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      // Also add to registered users
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      
      return { success: true };
    }
  };

  const signup = async (name, email, password) => {
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userExists = existingUsers.find(u => u.email === email);
    
    if (userExists) {
      return { success: false, message: 'User already exists' };
    }
    
    const newUser = {
      id: Date.now(),
      name,
      email,
      role: 'user'
    };
    
    // Add to registered users
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    // Set as current user
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    updateUser,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
