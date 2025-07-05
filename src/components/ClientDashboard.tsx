import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useService } from '../contexts/ServiceContext';
import { useChat } from '../contexts/ChatContext';
import { requestsService } from '../services/requests.service';
import { useApi } from '../hooks/useApi';
import Map from './Map';
import { Plus, MapPin, Clock, CheckCircle, MessageSquare, Star, Trash2, Edit3 } from 'lucide-react';
import { CreateServiceRequestRequest, ServiceRequestResponse } from '../types/api';

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { serviceCategories } = useService();
  const { createChat } = useChat();
  const navigate = useNavigate();

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [userRequests, setUserRequests] = useState<ServiceRequestResponse[]>([]);
  const [requestForm, setRequestForm] = useState<CreateServiceRequestRequest>({
    category: '',
    service: '',
    description: '',
    location: user?.location || { lat: 41.9028, lng: 12.4964 }
  });

  // API hooks
  const createRequestApi = useApi(requestsService.createServiceRequest);
  const getUserRequestsApi = useApi(requestsService.getUserRequests);
  const deleteRequestApi = useApi(requestsService.deleteRequest);
  const completeRequestApi = useApi(requestsService.completeRequest);

  // Load user requests on component mount
  useEffect(() => {
    if (user) {
      loadUserRequests();
    }
  }, [user]);

  const loadUserRequests = async () => {
    try {
      const requests = await getUserRequestsApi.execute();
      setUserRequests(requests);
    } catch (error) {
      console.error('Failed to load user requests:', error);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const newRequest = await createRequestApi.execute(requestForm);
      setUserRequests(prev => [newRequest, ...prev]);

      setShowRequestForm(false);
      setRequestForm({
        category: '',
        service: '',
        description: '',
        location: user.location || { lat: 41.9028, lng: 12.4964 }
      });
    } catch (error) {
      console.error('Failed to create request:', error);
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to delete this request?')) return;

    try {
      await deleteRequestApi.execute(requestId);
      setUserRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Failed to delete request:', error);
    }
  };

  const handleCompleteRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to mark this request as completed?')) return;

    try {
      await completeRequestApi.execute(requestId);
      setUserRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'completed' as const }
          : req
      ));
    } catch (error) {
      console.error('Failed to complete request:', error);
    }
  };

  const handleContactCG = async (cgId: string, cgName: string) => {
    if (!user) return;

    try {
      await createChat([user.id, cgId], [user.name, cgName]);
      navigate('/chat');
    } catch (error) {
      console.error('Failed to create chat:', error);
      alert('Failed to start conversation. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'accepted': return 'text-blue-600 bg-blue-100';
      case 'in_progress': return 'text-purple-600 bg-purple-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'accepted':
      case 'in_progress': return MessageSquare;
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
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-2">Manage your service requests and find professionals</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200 border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userRequests.filter(r => r.status === 'pending').length}
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
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userRequests.filter(r => r.status === 'accepted' || r.status === 'in_progress').length}
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
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userRequests.filter(r => r.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200 border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{userRequests.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Service Requests */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Service Requests</h2>
                  <button
                      onClick={() => setShowRequestForm(true)}
                      disabled={createRequestApi.loading}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 flex items-center transform hover:scale-105 shadow-lg disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Request
                  </button>
                </div>
              </div>

              <div className="p-6">
                {getUserRequestsApi.loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading requests...</p>
                    </div>
                ) : userRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No service requests yet</p>
                      <button
                          onClick={() => setShowRequestForm(true)}
                          className="mt-4 text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
                      >
                        Create your first request
                      </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                      {userRequests.map(request => {
                        const StatusIcon = getStatusIcon(request.status);

                        return (
                            <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:border-yellow-300 transition-all duration-200 hover:shadow-md">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900">{request.service}</h3>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                      <StatusIcon className="h-3 w-3 inline mr-1" />
                                      {request.status}
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{request.category}</p>
                                </div>
                              </div>

                              <p className="text-gray-700 text-sm mb-3">{request.description}</p>

                              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  Location: {request.location.lat.toFixed(4)}, {request.location.lng.toFixed(4)}
                                </div>
                                <div className="text-xs">
                                  {new Date(request.createdAt).toLocaleDateString()}
                                </div>
                              </div>

                              {request.budget && (
                                  <div className="text-sm text-gray-600 mb-3">
                                    Budget: {request.budget.currency} {request.budget.min}-{request.budget.max}
                                  </div>
                              )}

                              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <div className="flex space-x-2">
                                  <button
                                      onClick={() => navigate('/services')}
                                      className="text-yellow-600 hover:text-yellow-700 text-sm font-medium transition-colors"
                                  >
                                    Find Providers
                                  </button>
                                </div>
                                <div className="flex space-x-2">
                                  {request.status === 'in_progress' && (
                                      <button
                                          onClick={() => handleCompleteRequest(request.id)}
                                          disabled={completeRequestApi.loading}
                                          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded text-sm hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 flex items-center"
                                      >
                                        {completeRequestApi.loading ? (
                                            <>
                                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                              Completing...
                                            </>
                                        ) : (
                                            <>
                                              <CheckCircle className="h-3 w-3 mr-1" />
                                              Mark Complete
                                            </>
                                        )}
                                      </button>
                                  )}
                                  {request.status === 'pending' && (
                                      <button
                                          onClick={() => handleDeleteRequest(request.id)}
                                          disabled={deleteRequestApi.loading}
                                          className="text-red-600 hover:text-red-700 text-sm transition-colors disabled:opacity-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                  )}
                                </div>
                              </div>
                            </div>
                        );
                      })}
                    </div>
                )}
              </div>
            </div>

            {/* Map - Only show when modal is NOT open */}
            {!showRequestForm && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Your Location</h2>
                  </div>
                  <div className="p-6">
                    {user?.location && (
                        <Map
                            center={[user.location.lat, user.location.lng]}
                            zoom={12}
                            markers={[
                              {
                                position: [user.location.lat, user.location.lng],
                                type: 'client',
                                popup: 'Your Location'
                              },
                              ...userRequests.map(request => ({
                                position: [request.location.lat, request.location.lng] as [number, number],
                                type: 'client' as const,
                                popup: `${request.service} - ${request.status}`
                              }))
                            ]}
                            className="h-64 w-full rounded-lg"
                        />
                    )}
                  </div>
                </div>
            )}
          </div>

          {/* New Request Modal */}
          {showRequestForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl max-w-md w-full max-h-screen overflow-y-auto shadow-2xl">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">New Service Request</h3>

                    <form onSubmit={handleRequestSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category *
                        </label>
                        <select
                            value={requestForm.category}
                            onChange={(e) => setRequestForm(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                            required
                        >
                          <option value="">Select a category</option>
                          {serviceCategories.map(category => (
                              <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Service Needed *
                        </label>
                        <input
                            type="text"
                            value={requestForm.service}
                            onChange={(e) => setRequestForm(prev => ({ ...prev, service: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                            placeholder="e.g., Fix leaky faucet"
                            required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description *
                        </label>
                        <textarea
                            value={requestForm.description}
                            onChange={(e) => setRequestForm(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                            placeholder="Describe what you need..."
                            required
                        />
                      </div>

                      {createRequestApi.error && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-600 text-sm">{createRequestApi.error}</p>
                          </div>
                      )}

                      <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setShowRequestForm(false)}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                            disabled={createRequestApi.loading}
                        >
                          Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createRequestApi.loading}
                            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 flex items-center"
                        >
                          {createRequestApi.loading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Creating...
                              </>
                          ) : (
                              'Submit Request'
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