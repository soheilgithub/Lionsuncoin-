import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

// Types
interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  level: number;
  experience: number;
  coins: number;
  achievements: string[];
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    soundEnabled: boolean;
    language: string;
  };
  stats: {
    gamesPlayed: number;
    totalWins: number;
    totalCoinsEarned: number;
    favoriteGame?: string;
  };
  createdAt: string;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  socket: Socket | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
  clearError: () => void;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API endpoints
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://api.lionsuncoin.gaming' 
  : 'http://localhost:3001';

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const isAuthenticated = !!user;

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Socket connection management
  useEffect(() => {
    if (isAuthenticated && !socket) {
      connectSocket();
    } else if (!isAuthenticated && socket) {
      disconnectSocket();
    }

    return () => {
      if (socket) {
        disconnectSocket();
      }
    };
  }, [isAuthenticated]);

  // Initialize authentication
  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('authToken');
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  // Connect socket
  const connectSocket = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const newSocket = io(API_BASE, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    newSocket.on('user_updated', (updatedUser: User) => {
      setUser(updatedUser);
    });

    newSocket.on('auth_error', () => {
      logout();
    });

    setSocket(newSocket);
  };

  // Disconnect socket
  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        return true;
      } else {
        setError(data.message || 'Login failed');
        return false;
      }
    } catch (err) {
      setError('Network error. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      if (userData.password !== userData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }

      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        return true;
      } else {
        setError(data.message || 'Registration failed');
        return false;
      }
    } catch (err) {
      setError('Network error. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setError(null);
    disconnectSocket();
  };

  // Update profile function
  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    try {
      setError(null);
      const token = localStorage.getItem('authToken');

      const response = await fetch(`${API_BASE}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        return true;
      } else {
        setError(data.message || 'Update failed');
        return false;
      }
    } catch (err) {
      setError('Network error. Please try again.');
      return false;
    }
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      setError(null);

      const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        return true;
      } else {
        setError(data.message || 'Reset password failed');
        return false;
      }
    } catch (err) {
      setError('Network error. Please try again.');
      return false;
    }
  };

  // Verify email function
  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      setError(null);

      const response = await fetch(`${API_BASE}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      return response.ok;
    } catch (err) {
      setError('Verification failed');
      return false;
    }
  };

  // Refresh token function
  const refreshToken = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return false;

      const response = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        return true;
      } else {
        logout();
        return false;
      }
    } catch (err) {
      logout();
      return false;
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    error,
    socket,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    verifyEmail,
    refreshToken,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};