import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useService } from '../contexts/ServiceContext';
import { useChat } from '../contexts/ChatContext';
import { analytics } from '../utils/analytics';
import { useNotifications } from '../contexts/NotificationContext';
import { requestsService } from '../services/requests.service';
import { useApi } from '../hooks/useApi';
import Map from './Map';
import { Plus, MapPin, Clock, CheckCircle, MessageSquare, Star, Loader2, AlertCircle } from 'lucide-react';

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { serviceCategories } = useService();
  const { createChat } = useChat();
  const { addNotification } = useNotifications();
  const { t } = useTranslation();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({
    category: '',
    service: '',
    description: '',
    location: user?.location || { lat: 41.9028, lng: 12.4964 },
    address: user?.address || ''
  });

  const createRequestApi = useApi(requestsService.createServiceRequest);
  const getUserRequestsApi = useApi(requestsService.getUserRequests);

  // Load user requests on component mount
  React.useEffect(() => {
    if (user) {
      getUserRequestsApi.execute();
    }
  }, [user]);

  const userRequests = getUserRequestsApi.data || [];

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createRequestApi.execute({
        category: requestForm.category,
        service: requestForm.service,
        description: requestForm.description,
        location: requestForm.location,
        address: requestForm.address
      });

      // Track service request creation
      const city = 'Unknown'; // You can implement city detection here
      analytics.trackServiceRequestCreated(requestForm.category, city);
      
      // Notification will be sent by backend via WebSocket

      setShowRequestForm(false);
      setRequestForm({
        category: '',
        service: '',
        description: '',
        location: user.location || { lat: 41.9028, lng: 12.4964 },
        address: user.address || ''
      });

      // Reload requests
      getUserRequestsApi.execute();
    } catch (error) {
      console.error('Failed to create request:', error);
    }
  };

  const handleContactCG = async (cgId: string, cgName: string) => {
    if (!user) return;
    try {
      await createChat([user.id, cgId], [user.name, cgName]);
      // Notification will be sent by backend via WebSocket
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'accepted': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'accepted': return MessageSquare;
      case 'completed': return CheckCircle;
      default: return Clock;
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
              {t('dashboard.welcome')}, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-2">{t('dashboard.manageRequests')}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200 border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{t('dashboard.pending')}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userRequests.filter((r: any) => r.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200 border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{t('dashboard.in_progress')}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userRequests.filter((r: any) => r.status === 'accepted').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200 border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{t('dashboard.completed')}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userRequests.filter((r: any) => r.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Service Requests */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.serviceRequests')}</h2>
                  <button
                      onClick={() => setShowRequestForm(true)}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 flex items-center transform hover:scale-105 shadow-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('dashboard.newRequest')}
                  </button>
                </div>
              </div>

              <div className="p-6">
                {getUserRequestsApi.loading ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 text-yellow-600 mx-auto mb-4 animate-spin" />
                      <p className="text-gray-600">{t('dashboard.loadingRequests')}</p>
                    </div>
                ) : userRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">{t('dashboard.noRequestsYet')}</p>
                      <button
                          onClick={() => setShowRequestForm(true)}
                          className="mt-4 text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
                      >
                        {t('dashboard.createFirstRequest')}
                      </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                      {userRequests.map((request: any) => {
                        const StatusIcon = getStatusIcon(request.status);

                        return (
                            <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:border-yellow-300 transition-all duration-200 hover:shadow-md">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="font-semibold text-gray-900">{request.service}</h3>
                                  <p className="text-sm text-gray-600">{request.category}</p>
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                  <StatusIcon className="h-3 w-3 inline mr-1" />
                                  {t(`dashboard.${request.status}`)}
                                </div>
                              </div>

                              <p className="text-gray-700 text-sm mb-3">{request.description}</p>

                              <div className="flex items-center text-sm text-gray-500 mb-3">
                                <MapPin className="h-4 w-4 mr-1" />
                                {request.address || `${request.location?.lat?.toFixed(4)}, ${request.location?.lng?.toFixed(4)}`}
                              </div>

                              <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                                {/*<button className="text-yellow-600 hover:text-yellow-700 text-sm font-medium transition-colors">*/}
                                {/*  {t('dashboard.viewDetails')}*/}
                                {/*</button>*/}
                              </div>
                            </div>
                        );
                      })}
                    </div>
                )}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.yourLocation')}</h2>
              </div>
              <div className="p-6">
                {user?.location && (
                    <Map
                        center={[user.location.lat, user.location.lng]}
                        zoom={12}
                        markers={[{
                          position: [user.location.lat, user.location.lng],
                          type: 'client',
                          popup: t('map.yourLocation')
                        }]}
                        className="h-64 w-full rounded-lg"
                    />
                )}
              </div>
            </div>
          </div>

          {/* New Request Modal */}
          {showRequestForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
                <div className="bg-white rounded-2xl max-w-md w-full max-h-screen overflow-y-auto shadow-2xl">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.newServiceRequest')}</h3>

                    <form onSubmit={handleRequestSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('dashboard.category')}
                        </label>
                        <select
                            value={requestForm.category}
                            onChange={(e) => setRequestForm(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                            required
                        >
                          <option value="">{t('dashboard.selectCategory')}</option>
                          {serviceCategories.map(category => (
                              <option key={category} value={category}>{t(`categories.${category}`)}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('dashboard.serviceNeeded')}
                        </label>
                        <input
                            type="text"
                            value={requestForm.service}
                            onChange={(e) => setRequestForm(prev => ({ ...prev, service: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                            placeholder={t('dashboard.serviceNeededPlaceholder')}
                            required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('dashboard.description')}
                        </label>
                        <textarea
                            value={requestForm.description}
                            onChange={(e) => setRequestForm(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                            placeholder={t('dashboard.descriptionPlaceholder')}
                            required
                        />
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setShowRequestForm(false)}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                        >
                          {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={createRequestApi.loading}
                            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center"
                        >
                          {createRequestApi.loading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                {t('dashboard.creating')}
                              </>
                          ) : (
                              t('dashboard.submitRequest')
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default ClientDashboard;