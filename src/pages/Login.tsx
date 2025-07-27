import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import { hashPasswordForAuth } from '../utils/crypto';
import { Mail, Lock, HardHat, AlertCircle, Users, UserCheck } from 'lucide-react';
import { LoginRequest } from '../types/api';

const Login: React.FC = () => {
  const { loginClient, loginCG, isAuthenticated, loading } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });

  const [userType, setUserType] = useState<'client' | 'cg'>('client');

  const clientLoginApi = useApi(loginClient);
  const cgLoginApi = useApi(loginCG);

  // Get the active API based on user type
  const activeApi = userType === 'client' ? clientLoginApi : cgLoginApi;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing
    if (activeApi.error || activeApi.errors) {
      activeApi.reset();
    }
  };

  const handleUserTypeChange = (type: 'client' | 'cg') => {
    setUserType(type);
    // Reset any existing errors when switching user type
    clientLoginApi.reset();
    cgLoginApi.reset();
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) return false;
    if (!/\S+@\S+\.\S+/.test(formData.email)) return false;
    if (!formData.password) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Hash password before sending to backend
      const hashedPassword = await hashPasswordForAuth(formData.password, formData.email);
      
      const credentials = {
        email: formData.email,
        password: hashedPassword
      };

      if (userType === 'client') {
        await clientLoginApi.execute(credentials);
      } else {
        await cgLoginApi.execute(credentials);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return activeApi.errors?.[field]?.[0];
  };

  // Show loading while checking authentication status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Don't render login form if user is authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="max-w-md w-full space-y-8 relative z-10">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="relative">
                <HardHat className="h-12 w-12 text-yellow-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
              {t('auth.signIn')}
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              {t('auth.dontHaveAccount')}{' '}
              <Link to="/register-client" className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors">
                {t('auth.createAccount')}
              </Link>
            </p>
          </div>

          <div className="glass-effect py-8 px-6 shadow-2xl rounded-2xl">
            {/* User Type Selection */}
            <div className="mb-6">
              <div className="flex rounded-lg bg-gray-100 p-1">
                <button
                    type="button"
                    onClick={() => handleUserTypeChange('client')}
                    className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        userType === 'client'
                            ? 'bg-white text-yellow-700 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <Users className="h-4 w-4 mr-2" />
                  {t('auth.client')}
                </button>
                <button
                    type="button"
                    onClick={() => handleUserTypeChange('cg')}
                    className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        userType === 'cg'
                            ? 'bg-white text-yellow-700 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  {t('auth.cascoGiallo')}
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.emailAddress')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${
                          getFieldError('email') ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder={t('auth.enterEmail')}
                      disabled={activeApi.loading}
                  />
                </div>
                {getFieldError('email') && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {getFieldError('email')}
                    </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('common.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${
                          getFieldError('password') ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder={t('auth.enterPassword')}
                      disabled={activeApi.loading}
                  />
                </div>
                {getFieldError('password') && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {getFieldError('password')}
                    </p>
                )}
              </div>

              {activeApi.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {activeApi.error}
                    </p>
                  </div>
              )}

              <button
                  type="submit"
                  disabled={activeApi.loading || !validateForm()}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-2 px-4 rounded-lg hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                {activeApi.loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('auth.signingIn')}
                    </>
                ) : (
                    t('auth.signInAs', { type: userType === 'client' ? t('auth.client') : t('auth.cascoGiallo') })
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t('auth.dontHaveAccount')}{' '}
                <Link to="/register-client" className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors">
                  {t('auth.registerAsClient')}
                </Link>{' '}
                {t('common.or')}{' '}
                <Link to="/register-cg" className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors">
                  {t('auth.becomeACascoGiallo')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Login;