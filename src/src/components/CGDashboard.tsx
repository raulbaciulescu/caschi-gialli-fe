import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useService } from '../contexts/ServiceContext';
import Map from './Map';
import { MapPin, Clock, DollarSign, Star, MessageSquare, Settings } from 'lucide-react';

const CGDashboard: React.FC = () => {
  const { user } = useAuth();
  const { serviceRequests, findMatches } = useService();
  const [selectedTab, setSelectedTab] = useState<'opportunities' | 'active' | 'completed'>('opportunities');

  if (!user || user.type !== 'cg') return null;

  // Find requests that match this CG's services and location
  const matchingRequests = serviceRequests.filter(request => {
    if (!user.services || !user.location) return false;
    
    const distance = calculateDistance(
      user.location.lat,
      user.location.lng,
      request.location.lat,
      request.location.lng
    );
    
    return distance <= (user.radius || 10) && 
           user.services.includes(request.category) &&
           request.status === 'pending';
  });

  const activeJobs = serviceRequests.filter(request => 
    request.matches?.includes(user.id) && request.status === 'accepted'
  );

  const completedJobs = serviceRequests.filter(request => 
    request.matches?.includes(user.id) && request.status === 'completed'
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

  const tabs = [
    { id: 'opportunities', label: 'Opportunities', count: matchingRequests.length },
    { id: 'active', label: 'Active Jobs', count: activeJobs.length },
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
                <p className="text-sm font-medium text-gray-600">New Opportunities</p>
                <p className="text-2xl font-bold text-gray-900">{matchingRequests.length}</p>
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
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">€1,250</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
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
              {selectedTab === 'opportunities' && (
                <div className="space-y-4">
                  {matchingRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No new opportunities in your area</p>
                    </div>
                  ) : (
                    matchingRequests.map(request => {
                      const distance = calculateDistance(
                        user.location!.lat,
                        user.location!.lng,
                        request.location.lat,
                        request.location.lng
                      );
                      
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
                              <button className="text-yellow-600 hover:text-yellow-700 text-sm font-medium transition-colors">
                                View Details
                              </button>
                              <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1 rounded text-sm hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                                Contact Client
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
                <div className="text-center py-8">
                  <p className="text-gray-500">No active jobs</p>
                </div>
              )}
              
              {selectedTab === 'completed' && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No completed jobs yet</p>
                </div>
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
                      ...matchingRequests.map(request => ({
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
                  <button className="text-yellow-600 hover:text-yellow-700 transition-colors">
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