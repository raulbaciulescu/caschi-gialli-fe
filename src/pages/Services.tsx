import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useService} from '../contexts/ServiceContext';
import {useAuth} from '../contexts/AuthContext';
import {useChat} from '../contexts/ChatContext';
import {useNotifications} from '../contexts/NotificationContext';
import {analytics} from '../utils/analytics';
import OnlineStatusIndicator from '../components/OnlineStatusIndicator';
import {useCGInRange} from '../hooks/useCGInRange';
import Map from '../components/Map';
import {
  AlertCircle,
  Bug,
  Flower,
  Grid3X3,
  Hammer,
  HardHat,
  Home,
  Loader2,
  MapPin,
  MessageSquare,
  Monitor,
  Paintbrush,
  Search,
  Settings,
  Sparkles,
  ToyBrick as Brick,
  Truck,
  User,
  Wind,
  Wrench,
  Zap
} from 'lucide-react';

const Services: React.FC = () => {
  const { serviceCategories } = useService();
  const { user } = useAuth();
  const { createChat } = useChat();
  const { data: cgInRange, loading, error, searchCGInRange, reset } = useCGInRange();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Scroll to top when component mounts
  // Set page title and meta description for SEO
  React.useEffect(() => {
    document.title = 'Trova Caschi Gialli - Professionisti Qualificati nella Tua Zona | Caschi Gialli';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Cerca e trova professionisti qualificati nella tua zona: idraulici, elettricisti, imbianchini, giardinieri. Servizi a domicilio affidabili in tutta Italia.');
    }
  }, []);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Current location obtained:', { lat: latitude, lng: longitude });
        setSearchLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Unable to get your location. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Location access was denied.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            break;
        }
        alert(errorMessage + ' Using default location (Rome).');
        // Fallback to Rome coordinates
        setSearchLocation({ lat: 41.9028, lng: 12.4964 });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

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
        console.log('Using user location from profile:', userLocation);
        setSearchLocation(userLocation);
      }
    } else {
      // User not logged in, try to get current location
      console.log('User not logged in, attempting to get current location');
      getCurrentLocation();
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
  };

  // Auto-search when category or location changes
  useEffect(() => {
    if (searchLocation) {
      // Update URL when search parameters change
      updateURLWithSearchParams();
      
      const searchParams = {
        lat: searchLocation.lat,
        lng: searchLocation.lng,
        radius: 50, // Fixed large radius
        services: selectedCategory ? [selectedCategory] : undefined
      };
      console.log('Auto-searching with params:', searchParams);
      searchCGInRange(searchParams);
    }
  }, [selectedCategory, searchLocation]);

  // Function to update URL with search parameters
  const updateURLWithSearchParams = () => {
    if (!searchLocation) return;

    // Try to find matching city and redirect to SEO URL
    const city = findCityFromCoordinates(searchLocation.lat, searchLocation.lng);
    
    if (city && selectedCategory) {
      const serviceSlug = selectedCategory.toLowerCase();
      const citySlug = city.toLowerCase();
      
      console.log(`Redirecting to SEO URL: /${serviceSlug}/${citySlug}`);
      
      // Track the SEO page visit
      analytics.trackSEOPageVisit(selectedCategory, city, 'search');
      
      navigate(`/${serviceSlug}/${citySlug}`);
    }
  };

  // Function to find city from coordinates
  const findCityFromCoordinates = (lat: number, lng: number): string | null => {
    const cities = [
      { name: 'Rome', lat: 41.9028, lng: 12.4964 },
      { name: 'Milan', lat: 45.4642, lng: 9.1900 },
      { name: 'Naples', lat: 40.8518, lng: 14.2681 },
      { name: 'Bologna', lat: 44.4949, lng: 11.3426 },
      { name: 'Florence', lat: 43.7696, lng: 11.2558 },
      { name: 'Turin', lat: 45.0703, lng: 7.6869 },
      { name: 'Palermo', lat: 38.1157, lng: 13.3613 },
      { name: 'Genoa', lat: 44.4056, lng: 8.9463 },
      { name: 'Bari', lat: 41.1171, lng: 16.8719 },
      { name: 'Catania', lat: 37.5079, lng: 15.0830 }
    ];

    // Find closest city within 50km radius
    for (const city of cities) {
      const distance = calculateDistance(lat, lng, city.lat, city.lng);
      if (distance <= 50) {
        return city.name;
      }
    }
    
    return null;
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

  const filteredOffers = cgInRange.filter(offer => {
    // Filter by search query
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
      // Track CG contact
      analytics.trackCGContact(cgId, cgName, 'chat');
      
      // Create chat and navigate to chat page
      const chatId = await createChat([user.id, cgId], [user.name, cgName]);
      
      // Notification will be sent by backend via WebSocket
      
      navigate('/chat');
    } catch (error) {
      console.error('Failed to create chat:', error);
      alert('Failed to start conversation. Please try again.');
    }
  };

  const handleViewProfile = (cgId: string) => {
    console.log('Navigating to profile for CG ID:', cgId);
    
    // Track profile view
    analytics.trackProfileView(cgId, user?.type || 'anonymous');
    
    // Find the CG data from current search results
    const cgData = filteredOffers.find(offer => offer.id.toString() === cgId);
    
    // Store CG data in sessionStorage for profile page to use
    if (cgData) {
      sessionStorage.setItem('cgProfileData', JSON.stringify(cgData));
    }
    
    // Navigate to profile page with CG ID
    navigate(`/profile/${cgId}`);
  };

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
              {t('services.title')}
            </h1>
            <p className="text-gray-600 mt-2">{t('services.subtitle')}</p>
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
                        placeholder={t('services.searchPlaceholder')}
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
                    <option value="">{t('services.allCategories')}</option>
                    {serviceCategories.map(category => (
                        <option key={category} value={category}>{t(`categories.${category}`)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1">
                  {searchLocation ? (
                      <div className="text-sm text-green-600 bg-green-50 p-2 rounded-lg flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {user ? 
                          t('services.searchNear', { lat: searchLocation.lat.toFixed(4), lng: searchLocation.lng.toFixed(4) }) :
                          `Searching near your current location: ${searchLocation.lat.toFixed(4)}, ${searchLocation.lng.toFixed(4)}`
                        }
                      </div>
                  ) : (
                      <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded-lg flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {user ? t('common.loading') : 'Getting your location...'}
                      </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {!user && (
                    <button
                      onClick={getCurrentLocation}
                      disabled={loading}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Use My Location
                    </button>
                  )}
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
                    {t('common.search')}
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
                    {showMap ? t('services.hideMap') : t('services.showMap')}
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
                    <p className="text-gray-600">{t('services.searchingProviders')}</p>
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
                            {cgInRange.length === 0 ? t('services.noProvidersFound') : t('services.noProvidersMatch')}
                          </p>
                          <p className="text-gray-400">
                            {cgInRange.length === 0 ? t('services.tryExpandingSearch') : t('services.tryAdjustingCriteria')}
                          </p>
                        </div>
                    ) : (
                        <>
                          <div className="text-sm text-gray-600 mb-4">
                            {t('services.foundProviders', { count: filteredOffers.length })}
                          </div>

                          {filteredOffers.map(offer => (
                              <div key={offer.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border border-gray-100">
                                <div className="p-6">
                                  <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                                        {/* Online Status Indicator */}
                                        <div className="absolute top-0 right-0">
                                          {/*<OnlineStatusIndicator */}
                                          {/*  userId={offer.id.toString()}*/}
                                          {/*  size="sm"*/}
                                          {/*/>*/}
                                        </div>
                                        {offer.fullProfileImageUrl ? (
                                            <img
                                                src={`${offer.fullProfileImageUrl}?ts=${Date.now()}`}
                                                alt={offer.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                  e.currentTarget.style.display = 'none';
                                                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                }}
                                            />
                                        ) : null}
                                        <HardHat className={`h-8 w-8 text-white ${offer.fullProfileImageUrl ? 'hidden' : ''}`} />
                                      </div>
                                      <div>
                                        <h3 className="text-xl font-semibold text-gray-900">{offer.name}</h3>
                                        <div className="flex items-center space-x-2 mt-1">
                                          {/*<OnlineStatusIndicator */}
                                          {/*  userId={offer.id.toString()}*/}
                                          {/*  size="sm"*/}
                                          {/*  showText={true}*/}
                                          {/*/>*/}
                                          <span className="text-sm text-blue-600 font-medium">{t('services.kmAway', { distance: offer.distance })}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/*{offer.price && (*/}
                                    {/*    <div className="text-right">*/}
                                    {/*      <p className="text-lg font-semibold text-gray-900">{offer.price}</p>*/}
                                    {/*    </div>*/}
                                    {/*)}*/}
                                  </div>

                                  <p className="text-gray-700 mb-4">{offer.description}</p>

                                  <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-600 mb-2">{t('navigation.services')}:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {offer.services.map(service => {
                                        const IconComponent = categoryIcons[service] || HardHat;
                                        return (
                                            <span
                                                key={service}
                                                className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full flex items-center space-x-1 transition-all duration-200 hover:bg-yellow-200"
                                            >
                                              <IconComponent className="h-3 w-3" />
                                              <span>{t(`categories.${service}`)}</span>
                                            </span>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center text-sm text-gray-500">
                                      <MapPin className="h-4 w-4 mr-1" />
                                      {t('services.serviceRadius', { radius: offer.serviceRadius })}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                      <button
                                          onClick={() => handleViewProfile(offer.id.toString())}
                                          className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                                      >
                                        <User className="h-4 w-4 mr-1" />
                                        {t('services.viewProfile')}
                                      </button>

                                      {/* Only show contact button if user is not a CG or if not logged in */}
                                      {(!user || user.type === 'client' || user.type === 'customer') && (
                                          <button
                                              onClick={() => handleContactCG(offer.id.toString(), offer.name)}
                                              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 flex items-center transform hover:scale-105 shadow-lg"
                                          >
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            {user ? t('services.contact') : t('services.loginToContact')}
                                          </button>
                                      )}
                                    </div>
                                  </div>

                                  {/*{offer.photos && offer.photos.length > 0 && (*/}
                                  {/*    <div className="mt-4 pt-4 border-t border-gray-200">*/}
                                  {/*      <div className="grid grid-cols-3 gap-2">*/}
                                  {/*        {offer.photos.slice(0, 3).map((photo, index) => (*/}
                                  {/*            <img*/}
                                  {/*                key={index}*/}
                                  {/*                src={photo}*/}
                                  {/*                alt={`Work by ${offer.name}`}*/}
                                  {/*                className="w-full h-20 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"*/}
                                  {/*            />*/}
                                  {/*        ))}*/}
                                  {/*      </div>*/}
                                  {/*    </div>*/}
                                  {/*)}*/}
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
                      <h2 className="text-xl font-semibold text-gray-900">{t('services.searchAreaTitle')}</h2>
                      <p className="text-sm text-gray-600 mt-1">{t('services.searchAreaSubtitle')}</p>
                      <p className="text-xs text-yellow-600 mt-1">
                        {t('services.searchAreaNote')}
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
                              popup: t('map.searchLocation')
                            }] : []),
                            ...filteredOffers.map(offer => {
                              console.log(`Creating marker for ${offer.name} with serviceRadius: ${offer.serviceRadius}`);
                              return {
                                position: [offer.location.lat, offer.location.lng] as [number, number],
                                type: 'cg' as const,
                                popup: `${offer.name} - ${t('services.kmAway', { distance: offer.distance })}`,
                                radius: offer.serviceRadius
                              };
                            })
                          ]}
                          showRadius={false}
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