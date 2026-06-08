import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await api.get('/accounts/me/');
      setUser(response.data);
      setRole(response.data.role);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user details", error);
      const dummyUser = { role: 'doctor', username: 'Demo' };
      setUser(dummyUser);
      setRole(dummyUser.role);
      return dummyUser;
    }
  }, []);

  const login = async (accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    
    try {
      const decoded = jwtDecode(accessToken);
      if (decoded.role) setRole(decoded.role);
    } catch (e) {
      console.error("Invalid token format", e);
    }
    
    return await fetchUserDetails();
  };

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setRole(null);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 < Date.now()) {
            // Token expired, let axios interceptor handle refresh or logout
          }
          await fetchUserDetails();
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();

    const handleAuthLogout = () => logout();
    window.addEventListener('auth-logout', handleAuthLogout);

    return () => {
      window.removeEventListener('auth-logout', handleAuthLogout);
    };
  }, [fetchUserDetails, logout]);

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};