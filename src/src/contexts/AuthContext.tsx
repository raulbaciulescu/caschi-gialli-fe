import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { mockAuthService } from '../services/mockAuth.service';
import { User, LoginRequest, RegisterClientRequest, RegisterCGRequest } from '../types/api';

interface AuthContextType {
  user: User | null;
  loginClient: (credentials: LoginRequest) => Promise<void>;
  loginCG: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  registerClient: (userData: RegisterClientRequest) => Promise<void>;
  registerCG: (userData: RegisterCGRequest) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  useMockData: boolean;
  toggleMockData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(() => {
    const saved = localStorage.getItem('use_mock_data');
    return saved ? JSON.parse(saved) : true;
  });

  const getAuthService = () => useMockData ? mockAuthService : authService;

  useEffect(() => {
    localStorage.setItem('use_mock_data', JSON.stringify(useMockData));
  }, [useMockData]);

  useEffect(() => {
    initializeAuth();
  }, [useMockData]);

  const initializeAuth = async () => {
    setLoading(true);
    try {
      const service = getAuthService();
      
      // Check if we have a valid token and user data
      if (service.isAuthenticated()) {
        const userData = service.getUserFromStorage();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Token exists but no user data - clear everything
          await service.logout();
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      // Clear invalid data
      await getAuthService().logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const loginClient = async (credentials: LoginRequest): Promise<void> => {
    try {
      const service = getAuthService();
      const response = await service.loginClient(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Client login failed:', error);
      throw error;
    }
  };

  const loginCG = async (credentials: LoginRequest): Promise<void> => {
    try {
      const service = getAuthService();
      const response = await service.loginCG(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('CG login failed:', error);
      throw error;
    }
  };

  const registerClient = async (userData: RegisterClientRequest): Promise<void> => {
    try {
      const service = getAuthService();
      const response = await service.registerClient(userData);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Client registration failed:', error);
      throw error;
    }
  };

  const registerCG = async (userData: RegisterCGRequest): Promise<void> => {
    try {
      const service = getAuthService();
      const response = await service.registerCG(userData);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('CG registration failed:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await getAuthService().logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const toggleMockData = () => {
    setUseMockData(prev => !prev);
    // Clear current session when switching
    logout();
  };

  return (
    <AuthContext.Provider value={{
      user,
      loginClient,
      loginCG,
      logout,
      registerClient,
      registerCG,
      isAuthenticated,
      loading,
      useMockData,
      toggleMockData,
    }}>
      {children}
    </AuthContext.Provider>
  );
};