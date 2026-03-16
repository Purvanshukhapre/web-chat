import { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      // Fetch user profile if token exists
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      // This backend doesn't have a profile endpoint, so we'll just set loading to false
      // User data comes from login/register response
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    console.log('Attempting login with:', credentials);
    const data = await authApi.login(credentials);
    console.log('Login response:', data);
    
    // Check multiple possible locations for token
    const token = data.token || data.data?.token;
    
    if (token) {
      localStorage.setItem('token', token);
      setToken(token);
      console.log('Token stored successfully');
      
      // Store user ID and data from response
      const userData = data.data;
      if (userData && userData.id) {
        setUser(userData);
        localStorage.setItem('userId', userData.id);
        console.log('User data stored, userId:', userData.id);
      }
    } else {
      console.error('No token in response:', data);
      console.warn('Backend may not be returning JWT token - check backend configuration');
      throw new Error('No token received from server. Backend issue.');
    }
    return data;
  };

  const register = async (userData) => {
    console.log('Attempting registration with:', userData);
    const data = await authApi.register(userData);
    console.log('Registration response:', data);
    
    // Check multiple possible locations for token
    const token = data.token || data.data?.token;
    
    if (token) {
      localStorage.setItem('token', token);
      setToken(token);
      console.log('Token stored successfully after registration');
      
      // Store user data from response
      const userInfo = data.data;
      if (userInfo && userInfo.id) {
        setUser(userInfo);
        localStorage.setItem('userId', userInfo.id);
        console.log('User data stored after registration, userId:', userInfo.id);
      }
    } else {
      console.error('No token in registration response:', data);
      console.warn('Backend may not be returning JWT token - check backend configuration');
      throw new Error('No token received from server. Backend issue.');
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
