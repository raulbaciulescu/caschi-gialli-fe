import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useService } from '../contexts/ServiceContext';
import Map from '../components/Map';
import {
  User, Mail, Phone, MapPin, HardHat, Ruler, Edit3,
  Star, Award, Camera, Image as ImageIcon, Calendar,
  MessageSquare, Share2, ExternalLink
} from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { serviceCategories } = useService();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'gallery' | 'reviews'>('overview');

  if (!user) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">Please log in to access your profile.</p>
            <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-2 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Go to Login
            </button>
          </div>
        </div>
    );
  }

  const mockReviews = [
    {
      id: 1,
      clientName: "Marco Rossi",
      rating: 5,
      comment: "Excellent work! Very professional and completed the job on time.",
      date: "2024-01-15",
      service: "Plumbing"
    },
    {
      id: 2,
      clientName: "Anna Bianchi",
      rating: 5,
      comment: "Great attention to detail and fair pricing. Highly recommended!",
      date: "2024-01-10",
      service: "Electrical"
    },
    {
      id: 3,
      clientName: "Giuseppe Verde",
      rating: 4,
      comment: "Good work overall, arrived on time and cleaned up after the job.",
      date: "2024-01-05",
      service: "Carpentry"
    }
  ];

  const mockGallery = user.galleryImages || [
    'https://images.pexels.com/photos/4491461/pexels-photo-4491461.jpeg',
    'https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg',
    'https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg',
    'https://images.pexels.com/photos/5025639/pexels-photo-5025639.jpeg',
    'https://images.pexels.com/photos/4246119/pexels-photo-4246119.jpeg',
    'https://images.pexels.com/photos/4246267/pexels-photo-4246267.jpeg'
  ];

  const averageRating = mockReviews.reduce((acc, review) => acc + review.rating, 0) / mockReviews.length;

  const tabs = [
    { id: 'overview', label: 'Overview', count: null },
    { id: 'gallery', label: 'Gallery', count: mockGallery.length },
    { id: 'reviews', label: 'Reviews', count: mockReviews.length }
  ];

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
            {/* Cover Image */}
            <div className="h-48 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 relative">
              <div className="absolute inset-0 bg-pattern opacity-10"></div>
              {user.type === 'cg' && (
                  <button
                      onClick={() => navigate('/edit-profile')}
                      className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 px-4 py-2 rounded-lg transition-all duration-200 flex items-center shadow-lg"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="relative px-6 pb-6">
              <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
                {/* Profile Image */}
                <div className="relative -mt-16 mb-4 md:mb-0">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-white shadow-xl">
                    {user.profileImage ? (
                        <img
                            src={user.profileImage}
                            alt={user.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                          <User className="h-12 w-12 text-white" />
                        </div>
                    )}
                  </div>
                  {user.type === 'cg' && (
                      <div className="absolute bottom-2 right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white">
                        <HardHat className="h-4 w-4 text-white" />
                      </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                      <p className="text-lg text-gray-600 mt-1">
                        {user.type === 'cg' ? 'Professional Service Provider' : 'Client'}
                      </p>

                      {user.type === 'cg' && (
                          <div className="flex items-center mt-2 space-x-4">
                            <div className="flex items-center">
                              <Star className="h-5 w-5 text-yellow-400 fill-current" />
                              <span className="ml-1 font-semibold">{averageRating.toFixed(1)}</span>
                              <span className="ml-1 text-gray-500">({mockReviews.length} reviews)</span>
                            </div>
                            <div className="flex items-center text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span className="text-sm">Member since {new Date(user.createdAt).getFullYear()}</span>
                            </div>
                          </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 mt-4 md:mt-0">
                      <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </button>
                      {user.type === 'cg' && (
                          <button className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Contact
                          </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`py-4 px-6 border-b-2 font-medium text-sm transition-all duration-200 ${
                            activeTab === tab.id
                                ? 'border-yellow-500 text-yellow-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                      {tab.label}
                      {tab.count !== null && (
                          <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                              activeTab === tab.id
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
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Contact Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <User className="h-5 w-5 mr-2 text-yellow-600" />
                          Contact Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-400 mr-3" />
                            <span className="text-gray-700">{user.email}</span>
                          </div>
                          {(user.phone || user.phoneNumber) && (
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 text-gray-400 mr-3" />
                                <span className="text-gray-700">{user.phone || user.phoneNumber}</span>
                              </div>
                          )}
                          {user.address && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                                <span className="text-gray-700">{user.address}</span>
                              </div>
                          )}
                        </div>
                      </div>

                      {/* Professional Description */}
                      {user.type === 'cg' && user.description && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                              <Award className="h-5 w-5 mr-2 text-yellow-600" />
                              About Me
                            </h3>
                            <p className="text-gray-700 leading-relaxed">{user.description}</p>
                          </div>
                      )}

                      {/* Services */}
                      {user.type === 'cg' && user.services && user.services.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                              <HardHat className="h-5 w-5 mr-2 text-yellow-600" />
                              Services Offered
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {user.services.map(service => (
                                  <div
                                      key={service}
                                      className="px-3 py-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg font-medium text-center"
                                  >
                                    {service}
                                  </div>
                              ))}
                            </div>
                          </div>
                      )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      {/* Service Area Map */}
                      {user.type === 'cg' && user.location && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                              <MapPin className="h-5 w-5 mr-2 text-yellow-600" />
                              Service Area
                            </h3>
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                              <Map
                                  center={[user.location.lat, user.location.lng]}
                                  zoom={11}
                                  markers={[{
                                    position: [user.location.lat, user.location.lng],
                                    type: 'cg',
                                    popup: 'Service Location'
                                  }]}
                                  showRadius={true}
                                  radius={user.radius || 10}
                                  className="h-48 w-full"
                              />
                            </div>
                            <div className="mt-2 text-sm text-gray-600 flex items-center">
                              <Ruler className="h-4 w-4 mr-1" />
                              Service radius: {user.radius || 10} km
                            </div>
                          </div>
                      )}

                      {/* Quick Stats */}
                      {user.type === 'cg' && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Total Reviews</span>
                                <span className="font-semibold">{mockReviews.length}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Average Rating</span>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                  <span className="font-semibold">{averageRating.toFixed(1)}</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Response Time</span>
                                <span className="font-semibold">{"< 2 hours"}</span>
                              </div>
                            </div>
                          </div>
                      )}
                    </div>
                  </div>
              )}

              {/* Gallery Tab */}
              {activeTab === 'gallery' && (
                  <div>
                    {mockGallery.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {mockGallery.map((image, index) => (
                              <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100 hover:shadow-lg transition-shadow duration-200">
                                <img
                                    src={image}
                                    alt={`Work ${index + 1}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                />
                              </div>
                          ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No gallery images yet</p>
                          {user.type === 'cg' && (
                              <button
                                  onClick={() => navigate('/edit-profile')}
                                  className="mt-4 text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
                              >
                                Add your first images
                              </button>
                          )}
                        </div>
                    )}
                  </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {mockReviews.map((review) => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{review.clientName}</h4>
                                <p className="text-sm text-gray-500">{review.service}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                    ))}
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Profile;