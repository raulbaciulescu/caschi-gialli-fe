import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import ClientDashboard from '../components/ClientDashboard';
import CGDashboard from '../components/CGDashboard';

const Dashboard: React.FC = () => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login message if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <p className="text-gray-600 text-lg mb-4">Please log in to access your dashboard.</p>
          <a 
            href="/login" 
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-2 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return user.type === 'client' ? <ClientDashboard /> : <CGDashboard />;
};

export default Dashboard;