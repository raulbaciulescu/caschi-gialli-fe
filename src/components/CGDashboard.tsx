import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { useCGRequests } from '../hooks/useCGRequests';
import Map from './Map';
import { MapPin, Clock, DollarSign, Star, MessageSquare, Settings, CheckCircle, AlertCircle, User } from 'lucide-react';

const CGDashboard: React.FC = () => {
  const { user } = useAuth();
  const { createChat } = useChat();
  const navigate = useNavigate();
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

  const [selectedTab, setSelectedTab] = useState<'opportunities' | 'active' | 'completed'>('opportunities');

  useEffect(() => {
    if (user && user.type === 'cg') {
      loadAvailableRequests();
      loadMyRequests();
    }
  }, [user, loadAvailableRequests, loadMyRequests]);

  if (!user || user.type !== 'cg') return null;

  const activeJobs = myRequests.filter(request =>
      request.status === 'accepted' || request.status === 'in_progress'
  );

  const completedJobs = myRequests.filter(request =>
      request.status === 'completed'
  );

  function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  const handleContactClient = async (clientId: string, clientName: string) => {
    try {
      await createChat([user.id, clientId], [user.name, clientName]);
      navigate('/chat');
    } catch (error) {
      console.error('Failed to create chat:', error);
      alert('Failed to start conversation. Please try again.');
    }
  };

  const handleAssignToRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to take this job?')) return;

    try {
      const result = await assignToRequest(requestId);
      alert(`Successfully assigned to request: ${result.message}`);
    } catch (error) {
      console.error('Failed to assign to request:', error);
    }
  };

  const tabs = [
    { id: 'opportunities', label: 'Available Jobs', count: availableRequests.length },
    { id: 'active', label: 'My Active Jobs', count: activeJobs.length },
    { id: 'completed', label: 'Completed', count: completedJobs.length }
  ];

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-600 mt-2">Manage your jobs and find new opportunities</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200 border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available Jobs</p>
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
                  <p className="text-sm font-medium text-gray-600">Active Jobs</p>
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
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{completedJobs.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200 border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{myRequests.length}</p>
                </div>
              </div>
            </div>
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
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading requests...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
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
                                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                  <p className="text-gray-500">No available jobs in your area</p>
                                  <p className="text-gray-400 text-sm mt-2">Check back later for new opportunities</p>
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
                                          <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                                                <User className="h-5 w-5 text-white" />
                                              </div>
                                              <div>
                                                <h3 className="font-semibold text-gray-900">{request.service}</h3>
                                                <p className="text-sm text-gray-600">{request.category} • {request.clientName}</p>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">{distance.toFixed(1)} km away</p>
                                            <p className="text-xs text-gray-500">Posted {new Date(request.createdAt).toLocaleDateString()}</p>
                                          </div>
                                        </div>

                                        <p className="text-gray-700 text-sm mb-3">{request.description}</p>

                                        <div className="flex items-center text-sm text-gray-500 mb-3">
                                          <MapPin className="h-4 w-4 mr-1" />
                                          Location: {request.location.lat.toFixed(4)}, {request.location.lng.toFixed(4)}
                                        </div>

                                        {request.budget && (
                                            <div className="text-sm text-gray-600 mb-3">
                                              Budget: {request.budget.currency} {request.budget.min}-{request.budget.max}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                          <button
                                              onClick={() => handleContactClient(request.clientId, request.clientName)}
                                              className="text-yellow-600 hover:text-yellow-700 text-sm font-medium transition-colors"
                                          >
                                            Contact Client
                                          </button>
                                          <button
                                              onClick={() => handleAssignToRequest(request.id)}
                                              disabled={assignLoading}
                                              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded text-sm hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 flex items-center"
                                          >
                                            {assignLoading ? (
                                                <>
                                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                                  Taking...
                                                </>
                                            ) : (
                                                'Take Job'
                                            )}
                                          </button>
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
                                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                  <p className="text-gray-500">No active jobs</p>
                                  <p className="text-gray-400 text-sm mt-2">Take on some available jobs to get started</p>
                                </div>
                            ) : (
                                activeJobs.map(request => (
                                    <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all duration-200 hover:shadow-md">
                                      <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                                            <User className="h-5 w-5 text-white" />
                                          </div>
                                          <div>
                                            <h3 className="font-semibold text-gray-900">{request.service}</h3>
                                            <p className="text-sm text-gray-600">{request.category} • {request.clientName}</p>
                                          </div>
                                        </div>
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            request.status === 'accepted' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                        }`}>
                                          {request.status === 'accepted' ? 'Accepted' : 'In Progress'}
                                        </div>
                                      </div>

                                      <p className="text-gray-700 text-sm mb-3">{request.description}</p>

                                      <div className="flex items-center justify-between">
                                        {/*<div className="text-sm text-gray-500">*/}
                                        {/*  Started: {new Date(request.updatedAt).toLocaleDateString()}*/}
                                        {/*</div>*/}
                                        <button
                                            onClick={() => handleContactClient(request.clientId, request.clientName)}
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                                        >
                                          Contact Client
                                        </button>
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
                                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                  <p className="text-gray-500">No completed jobs yet</p>
                                  <p className="text-gray-400 text-sm mt-2">Complete some jobs to build your reputation</p>
                                </div>
                            ) : (
                                completedJobs.map(request => (
                                    <div key={request.id} className="border border-gray-200 rounded-lg p-4 bg-green-50">
                                      <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center overflow-hidden">
                                            <CheckCircle className="h-5 w-5 text-white" />
                                          </div>
                                          <div>
                                            <h3 className="font-semibold text-gray-900">{request.service}</h3>
                                            <p className="text-sm text-gray-600">{request.category} • {request.clientName}</p>
                                          </div>
                                        </div>
                                        <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                          Completed
                                        </div>
                                      </div>

                                      <p className="text-gray-700 text-sm mb-3">{request.description}</p>

                                      <div className="text-sm text-gray-500">
                                        Completed: {new Date(request.updatedAt).toLocaleDateString()}
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
                  <h2 className="text-xl font-semibold text-gray-900">Service Area</h2>
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
                              popup: 'Your Location'
                            },
                            ...availableRequests.map(request => ({
                              position: [request.location.lat, request.location.lng] as [number, number],
                              type: 'client' as const,
                              popup: `${request.service} - ${request.clientName}`
                            }))
                          ]}
                          showRadius={true}
                          radius={user.radius || 10}
                          className="h-64 w-full rounded-lg"
                      />
                  )}
                </div>
              </div>

              {/* Profile Summary */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
                    <button
                        onClick={() => navigate('/profile')}
                        className="text-yellow-600 hover:text-yellow-700 transition-colors"
                    >
                      <Settings className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Services</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.services?.map(service => (
                            <span key={service} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                          {service}
                        </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600">Service Radius</p>
                      <p className="text-sm text-gray-900">{user.radius} km</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600">Description</p>
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