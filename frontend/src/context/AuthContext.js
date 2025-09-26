
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
    // In a real app, you would make an API call to your backend
    // For demo purposes, we'll use mock data
    const mockUser = {
      id: 1,
      name: 'Demo User',
      email: email,
      role: 'user'
    };
    
    setCurrentUser(mockUser);
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    return { success: true };
  };

  const signup = async (name, email, password) => {
    // In a real app, you would make an API call to your backend
    // For demo purposes, we'll just create a user object
    const newUser = {
      id: Date.now(),
      name,
      email,
      role: 'user'
    };
    
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
