import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useService } from '../contexts/ServiceContext';
import Map from '../components/Map';
import { User, Mail, Phone, MapPin, HardHat, Ruler, Save } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { serviceCategories } = useService();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    description: user?.description || '',
    services: user?.services || [],
    radius: user?.radius || 10
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access your profile.</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      description: user.description || '',
      services: user.services || [],
      radius: user.radius || 10
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 bg-yellow-500 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-yellow-600 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="text-yellow-100">
                    {user.type === 'cg' ? 'Yellow Helmet Professional' : 'Client'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                {user.type === 'cg' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Radius (km)
                      </label>
                      <div className="relative">
                        <Ruler className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          name="radius"
                          value={formData.radius}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          min="1"
                          max="50"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Professional Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Describe your experience and qualifications..."
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Location and Services */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Location</h2>
                
                <div className="border border-gray-300 rounded-md overflow-hidden">
                  {user.location && (
                    <Map
                      center={[user.location.lat, user.location.lng]}
                      zoom={12}
                      markers={[{
                        position: [user.location.lat, user.location.lng],
                        type: user.type,
                        popup: 'Your Location'
                      }]}
                      showRadius={user.type === 'cg'}
                      radius={user.radius}
                      className="h-64 w-full"
                    />
                  )}
                </div>

                {user.type === 'cg' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Categories</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {serviceCategories.map(category => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => isEditing && handleServiceToggle(category)}
                          disabled={!isEditing}
                          className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                            formData.services.includes(category)
                              ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                              : 'border-gray-200 bg-white text-gray-700'
                          } ${!isEditing ? 'cursor-default' : 'hover:border-yellow-300'}`}
                        >
                          <HardHat className="h-3 w-3 mx-auto mb-1" />
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;