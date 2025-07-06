import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import ClientDashboard from '../components/ClientDashboard';
import CGDashboard from '../components/CGDashboard';

const Dashboard: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Show login message if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <p className="text-gray-600 text-lg mb-4">{t('dashboard.loginToAccessDashboard')}</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-2 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {t('dashboard.goToLogin')}
          </button>
        </div>
      </div>
    );
  }

  return user.type === 'client' || user.type === 'customer' ? <ClientDashboard /> : <CGDashboard />;
};

export default Dashboard;