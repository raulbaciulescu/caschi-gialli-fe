import React, { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import { HardHat, Home, User, MessageSquare, Settings, LogOut, Bell } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <HardHat className="h-8 w-8 text-yellow-500" />
              <span className="text-xl font-bold text-gray-900">Caschi Gialli</span>
            </Link>

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
            </nav>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <button className="p-2 text-gray-400 hover:text-gray-500 transition-colors">
                    <Bell className="h-5 w-5" />
                  </button>
                  <div className="relative group">
                    <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 transition-colors">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center overflow-hidden">
                        {(user?.profileImageUrl || user?.profileImage) ? (
                          <img
                            src={user.profileImageUrl || user.profileImage}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <span className="hidden md:block">{user?.name}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
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
                    </div>
                  </div>
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Mobile Navigation */}
      {isAuthenticated && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="flex justify-around items-center py-2">
            <Link
              to="/dashboard"
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;