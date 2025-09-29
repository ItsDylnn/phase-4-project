
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
      // Check password
      if (user.password === password) {
        // Remove password from user object before setting current user
        const { password: _, ...userWithoutPassword } = user;
        setCurrentUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        return { success: true };
      } else {
        return { success: false, message: 'Invalid password.' };
      }
    } else {
      // User must sign up first
      return { success: false, message: 'No account found. Please sign up first.' };
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
      password, // Store password for login validation
      role: 'user'
    };
    
    // Add to registered users (with password)
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    // Set as current user (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
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

  const resetPassword = (email, newPassword) => {
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = existingUsers.findIndex(u => u.email === email);
    
    if (userIndex !== -1) {
      existingUsers[userIndex].password = newPassword;
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
      return { success: true, message: 'Password reset successfully!' };
    } else {
      return { success: false, message: 'Email not found.' };
    }
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    updateUser,
    resetPassword,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
