import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useService } from '../contexts/ServiceContext';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { useCGInRange } from '../hooks/useCGInRange';
import Map from '../components/Map';
import { Search, MapPin, Star, MessageSquare, HardHat, Wrench, Zap, Hammer, Paintbrush, Flower, Sparkles, Truck, Monitor, Settings, Wind, Home, Grid3X3, ToyBrick as Brick, Bug, Loader2, AlertCircle, User } from 'lucide-react';

const Services: React.FC = () => {
  const { serviceCategories } = useService();
  const { user } = useAuth();
  const { createChat } = useChat();
  const { data: cgInRange, loading, error, searchCGInRange, reset } = useCGInRange();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number } | null>(null);

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

  // Initialize search location from user data
  useEffect(() => {
    if (user) {
      const userLocation = user.location || (user.lat && user.lng ? { lat: user.lat, lng: user.lng } : null);
      if (userLocation) {
        setSearchLocation(userLocation);
      }
    }
  }, [user]);

  // Initial search when component mounts and we have a location
  useEffect(() => {
    if (searchLocation) {
      handleSearch();
    }
  }, [searchLocation]);

  const handleSearch = async () => {
    if (!searchLocation) {
      console.warn('No search location available');
      return;
    }

    try {
      const searchParams = {
        lat: searchLocation.lat,
        lng: searchLocation.lng,
        radius: 50, // Fixed large radius to get all CGs in reasonable area
        services: selectedCategory ? [selectedCategory] : undefined
      };

      console.log('Searching with params:', searchParams);
      await searchCGInRange(searchParams);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    console.log('Location selected:', { lat, lng });
    setSearchLocation({ lat, lng });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Auto-search when category changes
    if (searchLocation) {
      setTimeout(() => {
        const searchParams = {
          lat: searchLocation.lat,
          lng: searchLocation.lng,
          radius: 50, // Fixed large radius
          services: category ? [category] : undefined
        };
        searchCGInRange(searchParams);
      }, 100);
    }
  };

  const filteredOffers = cgInRange.filter(offer => {
    if (!searchQuery) return true;

    return offer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const handleContactCG = async (cgId: string, cgName: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // Create chat and navigate to chat page
      const chatId = await createChat([user.id, cgId], [user.name, cgName]);
      navigate('/chat');
    } catch (error) {
      console.error('Failed to create chat:', error);
      alert('Failed to start conversation. Please try again.');
    }
  };

  const handleViewProfile = (cgId: string) => {
    // Navigate to profile page with CG ID
    navigate(`/profile/${cgId}`);
  };

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
              Find Caschi Gialle
            </h1>
            <p className="text-gray-600 mt-2">Browse professional service providers in your area</p>
          </div>

          {/* Search Controls */}
          <div className="bg-white rounded-xl shadow-lg mb-8 border border-gray-100">
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <div className="lg:col-span-2">
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

                <div>
                  <select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">All Categories</option>
                    {serviceCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1">
                  {searchLocation ? (
                      <div className="text-sm text-green-600 bg-green-50 p-2 rounded-lg flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        Searching near: {searchLocation.lat.toFixed(4)}, {searchLocation.lng.toFixed(4)}
                      </div>
                  ) : (
                      <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded-lg flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {user ? 'Loading your location...' : 'Click on map to set search location'}
                      </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                      onClick={handleSearch}
                      disabled={!searchLocation || loading}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center"
                  >
                    {loading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Search className="h-4 w-4 mr-2" />
                    )}
                    Search
                  </button>

                  <button
                      onClick={() => setShowMap(!showMap)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                          showMap
                              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg'
                              : 'bg-white text-gray-700 hover:bg-yellow-50 border border-gray-200'
                      }`}
                  >
                    <MapPin className="h-4 w-4 inline mr-2" />
                    {showMap ? 'Hide Map' : 'Show Map'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Service Providers List */}
            <div className="lg:col-span-2">
              {loading && (
                  <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 text-yellow-600 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-600">Searching for service providers...</p>
                  </div>
              )}

              {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                      <p className="text-red-600">{error}</p>
                    </div>
                    <button
                        onClick={() => reset()}
                        className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
                    >
                      Clear error and try again
                    </button>
                  </div>
              )}

              {!loading && !error && (
                  <div className="space-y-6">
                    {filteredOffers.length === 0 ? (
                        <div className="text-center py-12">
                          <HardHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg">
                            {cgInRange.length === 0 ? 'No service providers found in this area' : 'No providers match your search'}
                          </p>
                          <p className="text-gray-400">
                            {cgInRange.length === 0 ? 'Try changing location or expanding your search' : 'Try adjusting your search criteria'}
                          </p>
                        </div>
                    ) : (
                        <>
                          <div className="text-sm text-gray-600 mb-4">
                            Found {filteredOffers.length} service provider{filteredOffers.length !== 1 ? 's' : ''}
                          </div>

                          {filteredOffers.map(offer => (
                              <div key={offer.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border border-gray-100">
                                <div className="p-6">
                                  <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                                        {/* Profile image would come from offer data if available */}
                                        <HardHat className="h-8 w-8 text-white" />
                                      </div>
                                      <div>
                                        <h3 className="text-xl font-semibold text-gray-900">{offer.name}</h3>
                                        <div className="flex items-center space-x-2 mt-1">
                                          <span className="text-sm text-blue-600 font-medium">{offer.distance}km away</span>
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
                                      {offer.services.map(service => {
                                        const IconComponent = categoryIcons[service] || HardHat;
                                        return (
                                            <span
                                                key={service}
                                                className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full flex items-center space-x-1 transition-all duration-200 hover:bg-yellow-200"
                                            >
                                    <IconComponent className="h-3 w-3" />
                                    <span>{service}</span>
                                  </span>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center text-sm text-gray-500">
                                      <MapPin className="h-4 w-4 mr-1" />
                                      Service radius: {offer.serviceRadius} km
                                    </div>

                                    <div className="flex items-center space-x-2">
                                      <button
                                          onClick={() => handleViewProfile(offer.id.toString())}
                                          className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                                      >
                                        <User className="h-4 w-4 mr-1" />
                                        View Profile
                                      </button>

                                      <button
                                          onClick={() => handleContactCG(offer.id.toString(), offer.name)}
                                          className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 flex items-center transform hover:scale-105 shadow-lg"
                                      >
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        {user ? 'Contact' : 'Login to Contact'}
                                      </button>
                                    </div>
                                  </div>

                                  {offer.photos && offer.photos.length > 0 && (
                                      <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="grid grid-cols-3 gap-2">
                                          {offer.photos.slice(0, 3).map((photo, index) => (
                                              <img
                                                  key={index}
                                                  src={photo}
                                                  alt={`Work by ${offer.name}`}
                                                  className="w-full h-20 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                                              />
                                          ))}
                                        </div>
                                      </div>
                                  )}
                                </div>
                              </div>
                          ))}
                        </>
                    )}
                  </div>
              )}
            </div>

            {/* Map */}
            {showMap && (
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-lg sticky top-8 border border-gray-100">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-900">Service Providers Map</h2>
                      <p className="text-sm text-gray-600 mt-1">Click to change search location</p>
                      <p className="text-xs text-yellow-600 mt-1">
                        Yellow circles show each provider's service radius
                      </p>
                    </div>
                    <div className="p-6">
                      <Map
                          center={searchLocation ? [searchLocation.lat, searchLocation.lng] : [41.9028, 12.4964]}
                          zoom={10}
                          onLocationSelect={handleLocationSelect}
                          markers={[
                            ...(searchLocation ? [{
                              position: [searchLocation.lat, searchLocation.lng] as [number, number],
                              type: 'client' as const,
                              popup: 'Search Location'
                            }] : []),
                            ...filteredOffers.map(offer => {
                              console.log(`Creating marker for ${offer.name} with serviceRadius: ${offer.serviceRadius}`);
                              return {
                                position: [offer.location.lat, offer.location.lng] as [number, number],
                                type: 'cg' as const,
                                popup: `${offer.name} - ${offer.distance}km away - Service radius: ${offer.serviceRadius}km`,
                                // CRITICAL: Pass serviceRadius directly from backend data
                                radius: offer.serviceRadius
                              };
                            })
                          ]}
                          showRadius={false} // No global search radius
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