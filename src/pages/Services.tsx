import React, { useState } from 'react';
import { useService } from '../contexts/ServiceContext';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import Map from '../components/Map';
import { Search, MapPin, Star, MessageSquare, Filter, HardHat, Wrench, Zap, Hammer, Paintbrush, Flower, Sparkles, Truck, Monitor, Settings, Wind, Home, Grid3X3, ToyBrick as Brick, Bug } from 'lucide-react';

const Services: React.FC = () => {
  const { serviceCategories, serviceOffers } = useService();
  const { user } = useAuth();
  const { createChat } = useChat();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);

  // Service category icons mapping
  const categoryIcons: Record<string, React.ComponentType<any>> = {
    'Plumbing': Wrench,
    'Electrical': Zap,
    'Carpentry': Hammer,
    'Painting': Paintbrush,
    'Gardening': Flower,
    'Cleaning': Sparkles,
    'Moving': Truck,
    'IT Support': Monitor,
    'Appliance Repair': Settings,
    'HVAC': Wind,
    'Roofing': Home,
    'Flooring': Grid3X3,
    'Tiling': Grid3X3,
    'Masonry': Brick,
    'Pest Control': Bug
  };

  const filteredOffers = serviceOffers.filter(offer => {
    const matchesCategory = !selectedCategory || offer.categories.includes(selectedCategory);
    const matchesSearch = !searchQuery || 
      offer.cgName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const handleContactCG = (cgId: string, cgName: string) => {
    if (!user) return;
    const chatId = createChat([user.id, cgId], [user.name, cgName]);
    // In a real app, this would navigate to the chat
    alert(`Chat created with ${cgName}! Check your messages.`);
  };

  return (
    <div className="min-h-screen py-8 relative">
      <div className="absolute inset-0 bg-pattern opacity-5"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
            Find Caschi Gialli
          </h1>
          <p className="text-gray-700 mt-2">Browse professional service providers in your area</p>
        </div>

        {/* Filters */}
        <div className="glass-effect rounded-xl shadow-lg mb-8">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, service, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="lg:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">All Categories</option>
                  {serviceCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={() => setShowMap(!showMap)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                  showMap
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg'
                    : 'glass-effect text-gray-700 hover:bg-yellow-50 border border-gray-200'
                }`}
              >
                <MapPin className="h-4 w-4 inline mr-2" />
                {showMap ? 'Hide Map' : 'Show Map'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Providers List */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {filteredOffers.length === 0 ? (
                <div className="text-center py-12">
                  <HardHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No service providers found</p>
                  <p className="text-gray-400">Try adjusting your search criteria</p>
                </div>
              ) : (
                filteredOffers.map(offer => (
                  <div key={offer.id} className="glass-effect rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                            <HardHat className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{offer.cgName}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium text-gray-700 ml-1">{offer.rating}</span>
                              </div>
                              <span className="text-gray-300">•</span>
                              <span className="text-sm text-gray-600">{offer.reviews} reviews</span>
                            </div>
                          </div>
                        </div>
                        
                        {offer.price && (
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">{offer.price}</p>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-700 mb-4">{offer.description}</p>
                      
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-600 mb-2">Services:</p>
                        <div className="flex flex-wrap gap-2">
                          {offer.categories.map(category => {
                            const IconComponent = categoryIcons[category] || HardHat;
                            return (
                              <span
                                key={category}
                                className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full flex items-center space-x-1 transition-all duration-200 hover:bg-yellow-200"
                              >
                                <IconComponent className="h-3 w-3" />
                                <span>{category}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          Service radius: {offer.radius} km
                        </div>
                        
                        {user && (
                          <button
                            onClick={() => handleContactCG(offer.cgId, offer.cgName)}
                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 flex items-center transform hover:scale-105 shadow-lg"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Contact
                          </button>
                        )}
                      </div>
                      
                      {offer.photos && offer.photos.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-3 gap-2">
                            {offer.photos.slice(0, 3).map((photo, index) => (
                              <img
                                key={index}
                                src={photo}
                                alt={`Work by ${offer.cgName}`}
                                className="w-full h-20 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Map */}
          {showMap && (
            <div className="lg:col-span-1">
              <div className="glass-effect rounded-xl shadow-lg sticky top-8">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Service Providers Map</h2>
                </div>
                <div className="p-6">
                  <Map
                    center={[41.9028, 12.4964]}
                    zoom={10}
                    markers={filteredOffers.map(offer => ({
                      position: [offer.location.lat, offer.location.lng],
                      type: 'cg',
                      popup: `${offer.cgName} - ${offer.categories.join(', ')}`
                    }))}
                    className="h-96 w-full rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;