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

  // Load user from localStorage on first render
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // ---- LOGIN ----
  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // if backend uses cookies
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, message: errorData.message || 'Login failed' };
      }

      const data = await res.json();

      setCurrentUser(data.user);
      localStorage.setItem('currentUser', JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, message: 'Network error' };
    }
  };

  // ---- SIGNUP ----
  const signup = async (name, email, password) => {
    try {
      const res = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, message: errorData.message || 'Signup failed' };
      }

      const data = await res.json();

      setCurrentUser(data.user);
      localStorage.setItem('currentUser', JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (err) {
      console.error('Signup error:', err);
      return { success: false, message: 'Network error' };
    }
  };

  // ---- LOGOUT ----
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
