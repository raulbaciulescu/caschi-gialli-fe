import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/auth.service';
import LanguageSwitcher from './LanguageSwitcher';
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
  updateUserData: (userData: User) => void; // New method to update user data
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
  const { t } = useTranslation();

  // Normalize user data to handle both backend formats
  const normalizeUser = (userData: any): User => {
    return {
      ...userData,
      // Ensure we have location object
      location: userData.location || (userData.lat && userData.lng ? { lat: userData.lat, lng: userData.lng } : undefined),
      // Normalize type field (backend returns 'customer', frontend expects 'client')
      type: userData.type === 'customer' ? 'client' : userData.type,
      // Ensure profile image is available
      profileImage: userData.profileImageUrl || userData.profileImage
    };
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    setLoading(true);
    try {
      // Check if we have a valid token and user data
      if (authService.isAuthenticated()) {
        const userData = authService.getUserFromStorage();
        if (userData) {
          setUser(normalizeUser(userData));
          setIsAuthenticated(true);
        } else {
          // Token exists but no user data - clear everything
          await authService.logout();
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
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // New method to update user data without API calls
  const updateUserData = (userData: User) => {
    console.log('Updating user data in context:', userData);
    console.log('Current user data before update:', user);
    
    // CRITICAL: Merge new data with existing user data to preserve everything
    const mergedUserData = {
      ...user, // Keep all existing data
      ...userData, // Override with new data from update
      updatedAt: userData.updatedAt || new Date().toISOString()
    };
    
    console.log('Merged user data:', mergedUserData);
    const normalizedUser = normalizeUser(mergedUserData);
    setUser(normalizedUser);
    localStorage.setItem('user_data', JSON.stringify(normalizedUser));
    console.log('User data updated successfully in context and localStorage:', normalizedUser);
  };

  const loginClient = async (credentials: LoginRequest): Promise<void> => {
    try {
      const response = await authService.loginClient(credentials);
      setUser(normalizeUser(response.user));
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Client login failed:', error);
      throw error;
    }
  };

  const loginCG = async (credentials: LoginRequest): Promise<void> => {
    try {
      const response = await authService.loginCG(credentials);
      setUser(normalizeUser(response.user));
      setIsAuthenticated(true);
    } catch (error) {
      console.error('CG login failed:', error);
      throw error;
    }
  };

  const registerClient = async (userData: RegisterClientRequest): Promise<void> => {
    try {
      const response = await authService.registerClient(userData);
      setUser(normalizeUser(response.user));
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Client registration failed:', error);
      throw error;
    }
  };

  const registerCG = async (userData: RegisterCGRequest): Promise<void> => {
    try {
      const response = await authService.registerCG(userData);
      setUser(normalizeUser(response.user));
      setIsAuthenticated(true);
    } catch (error) {
      console.error('CG registration failed:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
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
        updateUserData, // Expose the new method
      }}>
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          {isAuthenticated ? (
              <nav className="hidden md:flex space-x-8">
                <Link
                    to="/"
                    className={`${
                        isActive('/') ? 'text-yellow-600' : 'text-gray-500 hover:text-gray-700'
                    } px-3 py-2 text-sm font-medium transition-colors`}
                >
                  {t('navigation.home')}
                </Link>
                <Link
                    to="/services"
                    className={`${
                        isActive('/services') ? 'text-yellow-600' : 'text-gray-500 hover:text-gray-700'
                    } px-3 py-2 text-sm font-medium transition-colors`}
                >
                  {t('navigation.services')}
                </Link>
                {isAuthenticated && (
                    <>
                      <Link
                          to="/dashboard"
                          className={`${
                              isActive('/dashboard') ? 'text-yellow-600' : 'text-gray-500 hover:text-gray-700'
                          } px-3 py-2 text-sm font-medium transition-colors`}
                      >
                        {t('navigation.dashboard')}
                      </Link>
                      <Link
                          to="/chat"
                          className={`${
                              isActive('/chat') ? 'text-yellow-600' : 'text-gray-500 hover:text-gray-700'
                          } px-3 py-2 text-sm font-medium transition-colors`}
                      >
                        {t('navigation.messages')}
                      </Link>
                    </>
                )}
                          <Link
                              to="/profile"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            {t('navigation.profile')}
                          </Link>
                          <button
                              onClick={handleLogout}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            {t('common.logout')}
                          </button>
                  <div className="flex items-center space-x-2">
                    <Link
                        to="/login"
                        className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium transition-colors"
                    >
                      {t('common.login')}
                    </Link>
                    <Link
                        to="/register-client"
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      {t('navigation.getStarted')}
                    </Link>
                  </div>
                    className={`flex flex-col items-center p-2 ${
                        isActive('/dashboard') ? 'text-yellow-600' : 'text-gray-500'
                    }`}
                >
                  <Home className="h-5 w-5" />
                  <span className="text-xs mt-1">{t('navigation.dashboard')}</span>
                </Link>
                <Link
                    to="/services"
                    className={`flex flex-col items-center p-2 ${
                        isActive('/services') ? 'text-yellow-600' : 'text-gray-500'
                    }`}
                >
                  <HardHat className="h-5 w-5" />
                  <span className="text-xs mt-1">{t('navigation.services')}</span>
                </Link>
                <Link
                    to="/chat"
                    className={`flex flex-col items-center p-2 ${
                        isActive('/chat') ? 'text-yellow-600' : 'text-gray-500'
                    }`}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-xs mt-1">{t('navigation.messages')}</span>
                </Link>
                <Link
                    to="/profile"
                    className={`flex flex-col items-center p-2 ${
                        isActive('/profile') ? 'text-yellow-600' : 'text-gray-500'
                    }`}
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs mt-1">{t('navigation.profile')}</span>
                </Link>
          ) : null}
        </div>
        {children}
      </AuthContext.Provider>
  );
};