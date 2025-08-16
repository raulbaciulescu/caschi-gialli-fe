import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useCGRequests } from '../hooks/useCGRequests';
import { requestsService } from '../services/requests.service';
import { useApi } from '../hooks/useApi';
import Map from './Map';
import { MapPin, Clock, DollarSign, Star, MessageSquare, Settings, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const CGDashboard: React.FC = () => {
  const { user } = useAuth();
  const { createChat } = useChat();
  const { addNotification } = useNotifications();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'opportunities' | 'active' | 'completed'>('opportunities');

  const {
    availableRequests,
    myRequests,
    loading,
    error,
    assignLoading,
    loadAvailableRequests,
    loadMyRequests,
    assignToRequest
  } = useCGRequests();

  const completeRequestApi = useApi(requestsService.completeRequest);

  useEffect(() => {
    if (user && user.type === 'cg') {
      console.log('Loading CG requests for user:', user.id);
      loadAvailableRequests();
      loadMyRequests();
    }
  }, [user]);

  // Calculate derived data after myRequests is loaded
  const activeJobs = myRequests.filter(request => request.status === 'accepted' || request.status === 'in_progress');
  const completedJobs = myRequests.filter(request => request.status === 'completed');

  // Debug logging
  useEffect(() => {
    console.log('Available requests:', availableRequests);
    console.log('My requests:', myRequests);
    console.log('Active jobs:', activeJobs);
    console.log('Completed jobs:', completedJobs);
  }, [availableRequests, myRequests, activeJobs, completedJobs]);

  if (!user || user.type !== 'cg') return null;

  const handleContactClient = async (customerId: string, customerName: string) => {
    if (!user) return;

    try {
      console.log('Creating chat between:', user.id, 'and', customerId);
      await createChat([user.id.toString(), customerId.toString()], [user.name, customerName]);
      navigate('/chat');
    } catch (error) {
      console.error('Failed to create chat:', error);
      alert('Failed to start conversation. Please try again.');
    }
  };

  const handleTakeJob = async (requestId: string) => {
    try {
      await assignToRequest(requestId);
      
      // Add success notification
      addNotification({
        type: 'system',
        title: 'Job Accepted!',
        message: 'You have successfully accepted a new job. Check your active jobs.'
      });
      
      // Requests will be automatically refreshed by the hook
    } catch (error) {
      console.error('Failed to take job:', error);
    }
  };

  const handleMarkComplete = async (requestId: string) => {
    try {
      await completeRequestApi.execute(requestId);
      
      // Add success notification
      addNotification({
        type: 'system',
        title: 'Job Completed!',
        message: 'Job has been marked as completed successfully.'
      });
      
      // Refresh the requests after completion
      await loadMyRequests();
    } catch (error) {
      console.error('Failed to complete request:', error);
      alert('Failed to complete request. Please try again.');
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const tabs = [
    { id: 'opportunities', label: t('dashboard.availableJobs'), count: availableRequests.length },
    { id: 'active', label: t('dashboard.activeJobs'), count: activeJobs.length },
    { id: 'completed', label: t('dashboard.completed'), count: completedJobs.length }
  ];

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
              {t('dashboard.welcome')}, {user.name}!
            </h1>
            <p className="text-gray-600 mt-2">{t('dashboard.manageJobs')}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200 border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{t('dashboard.availableJobs')}</p>
                  <p className="text-2xl font-bold text-gray-900">{availableRequests.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200 border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{t('dashboard.activeJobs')}</p>
                  <p className="text-2xl font-bold text-gray-900">{activeJobs.length}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{completedJobs.length}</p>
                </div>
              </div>
            </div>

            {/*<div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200 border border-gray-100">*/}
            {/*  <div className="flex items-center">*/}
            {/*    <div className="p-2 bg-purple-100 rounded-lg">*/}
            {/*      <Star className="h-6 w-6 text-purple-600" />*/}
            {/*    </div>*/}
            {/*    <div className="ml-4">*/}
            {/*      <p className="text-sm font-medium text-gray-600">Rating</p>*/}
            {/*      <p className="text-2xl font-bold text-gray-900">4.8</p>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Jobs */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex">
                  {tabs.map((tab) => (
                      <button
                          key={tab.id}
                          onClick={() => setSelectedTab(tab.id as any)}
                          className={`py-4 px-6 border-b-2 font-medium text-sm transition-all duration-200 ${
                              selectedTab === tab.id
                                  ? 'border-yellow-500 text-yellow-600'
                                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                      >
                        {tab.label}
                        {tab.count > 0 && (
                            <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                                selectedTab === tab.id
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-600'
                            }`}>
                        {tab.count}
                      </span>
                        )}
                      </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {loading && (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 text-yellow-600 mx-auto mb-4 animate-spin" />
                      <p className="text-gray-600">{t('common.loading')}</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                        <p className="text-red-600">{error}</p>
                      </div>
                    </div>
                )}

                {!loading && !error && (
                    <>
                      {selectedTab === 'opportunities' && (
                          <div className="space-y-4">
                            {availableRequests.length === 0 ? (
                                <div className="text-center py-8">
                                  <p className="text-gray-500">{t('dashboard.noAvailableJobs')}</p>
                                  <p className="text-gray-400 text-sm mt-2">{t('dashboard.checkBackLater')}</p>
                                </div>
                            ) : (
                                availableRequests.map(request => {
                                  const distance = user.location ? calculateDistance(
                                      user.location.lat,
                                      user.location.lng,
                                      request.location.lat,
                                      request.location.lng
                                  ) : 0;

                                  return (
                                      <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:border-yellow-300 transition-all duration-200 hover:shadow-md">
                                        <div className="flex items-start justify-between mb-3">
                                          <div>
                                            <h3 className="font-semibold text-gray-900">{request.service}</h3>
                                            <p className="text-sm text-gray-600">{request.category}</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">{distance.toFixed(1)} km away</p>
                                            <p className="text-xs text-gray-500">Posted {new Date(request.createdAt).toLocaleDateString()}</p>
                                          </div>
                                        </div>

                                        <p className="text-gray-700 text-sm mb-3">{request.description}</p>

                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center text-sm text-gray-500">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {request.address || 'Location provided'}
                                          </div>
                                          <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleContactClient(request.customerId, request.customerEmail)}
                                                className="text-yellow-600 hover:text-yellow-700 text-sm font-medium transition-colors"
                                            >
                                              {t('dashboard.contactClient')}
                                            </button>
                                            <button
                                                onClick={() => handleTakeJob(request.id)}
                                                disabled={assignLoading}
                                                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1 rounded text-sm hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center"
                                            >
                                              {assignLoading ? (
                                                  <>
                                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                    {t('dashboard.taking')}
                                                  </>
                                              ) : (
                                                  t('dashboard.takeJob')
                                              )}
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                  );
                                })
                            )}
                          </div>
                      )}

                      {selectedTab === 'active' && (
                          <div className="space-y-4">
                            {activeJobs.length === 0 ? (
                                <div className="text-center py-8">
                                  <p className="text-gray-500">{t('dashboard.noActiveJobs')}</p>
                                  <p className="text-gray-400 text-sm mt-2">{t('dashboard.takeAvailableJobs')}</p>
                                </div>
                            ) : (
                                activeJobs.map(request => (
                                    <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                                      <h3 className="font-semibold text-gray-900">{request.service}</h3>
                                      <p className="text-sm text-gray-600">{request.category}</p>
                                      <p className="text-gray-700 text-sm mt-2">{request.description}</p>
                                      <div className="flex justify-between items-center mt-3">
                                        <span className="text-sm text-gray-500">{request.customerName}</span>
                                        <div className="flex space-x-2">
                                          <button
                                              onClick={() => handleContactClient(request.customerId, request.customerName)}
                                              className="text-yellow-600 hover:text-yellow-700 text-sm font-medium transition-colors flex items-center"
                                          >
                                            <MessageSquare className="h-3 w-3 mr-1" />
                                            {t('dashboard.contactClient')}
                                          </button>
                                          <button
                                              onClick={() => handleMarkComplete(request.id)}
                                              disabled={completeRequestApi.loading}
                                              className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors flex items-center disabled:opacity-50"
                                          >
                                            {completeRequestApi.loading ? (
                                                <>
                                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                  {t('dashboard.completing')}
                                                </>
                                            ) : (
                                                <>
                                                  <CheckCircle className="h-3 w-3 mr-1" />
                                                  {t('dashboard.markComplete')}
                                                </>
                                            )}
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                ))
                            )}
                          </div>
                      )}

                      {selectedTab === 'completed' && (
                          <div className="space-y-4">
                            {completedJobs.length === 0 ? (
                                <div className="text-center py-8">
                                  <p className="text-gray-500">{t('dashboard.noCompletedJobs')}</p>
                                  <p className="text-gray-400 text-sm mt-2">{t('dashboard.completeJobsToReputation')}</p>
                                </div>
                            ) : (
                                completedJobs.map(request => (
                                    <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                                      <h3 className="font-semibold text-gray-900">{request.service}</h3>
                                      <p className="text-sm text-gray-600">{request.category}</p>
                                      <p className="text-gray-700 text-sm mt-2">{request.description}</p>
                                      <div className="flex justify-between items-center mt-3">
                                        <span className="text-sm text-gray-500">{request.customerName}</span>
                                        <span className="text-green-600 text-sm font-medium">{t('dashboard.completed')}</span>
                                      </div>
                                    </div>
                                ))
                            )}
                          </div>
                      )}
                    </>
                )}
              </div>
            </div>

            {/* Service Area Map */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">{t('profile.serviceArea')}</h2>
                </div>
                <div className="p-6">
                  {user.location && (
                      <Map
                          center={[user.location.lat, user.location.lng]}
                          zoom={11}
                          markers={[
                            {
                              position: [user.location.lat, user.location.lng],
                              type: 'cg',
                              popup: t('map.yourLocation')
                            },
                            ...availableRequests.map(request => ({
                              position: [request.location.lat, request.location.lng] as [number, number],
                              type: 'client' as const,
                              popup: `${request.service} - ${request.customerName}`
                            }))
                          ]}
                          showRadius={true}
                          radius={user.radius}
                          className="h-64 w-full rounded-lg"
                      />
                  )}
                </div>
              </div>

              {/* Profile Summary */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">{t('navigation.profile')}</h2>
                    <button className="text-yellow-600 hover:text-yellow-700 transition-colors">
                      <Settings className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t('navigation.services')}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.services?.map(service => (
                            <span key={service} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          {t(`categories.${service}`)}
                        </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600">{user?.serviceRadius ? t('services.serviceRadius', { radius: user.serviceRadius }) : ''}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600">{t('profile.aboutMe')}</p>
                      <p className="text-sm text-gray-900">{user.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CGDashboard;