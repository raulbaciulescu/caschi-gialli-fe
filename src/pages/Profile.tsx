import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { useService } from '../contexts/ServiceContext';
import { profileService } from '../services/profile.service';
import { useApi } from '../hooks/useApi';
import ImageGalleryModal from '../components/ImageGalleryModal';
import Map from '../components/Map';
import {
  User, Mail, Phone, MapPin, HardHat, Ruler, Edit3,
  Star, Award, Camera, Image as ImageIcon, Calendar,
  MessageSquare, Share2, ExternalLink, Loader2, AlertCircle
} from 'lucide-react';

interface CGProfileData {
  id: number;
  fullName: string;
  name?: string;
  phoneNumber: string;
  address: string;
  serviceRadius: number;
  services: string[];
  profileImageUrl?: string;
  galleryImageUrls?: string[];
  description?: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { createChat } = useChat();
  const { serviceCategories } = useService();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cgId } = useParams(); // For viewing other CG profiles

  const [activeTab, setActiveTab] = useState<'overview' | 'gallery' | 'reviews'>('overview');
  const [cgProfile, setCgProfile] = useState<CGProfileData | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [galleryModal, setGalleryModal] = useState<{
    isOpen: boolean;
    images: string[];
    title: string;
    initialIndex: number;
  }>({
    isOpen: false,
    images: [],
    title: '',
    initialIndex: 0
  });

  // API hooks
  const getCGProfileApi = useApi(profileService.getCGPublicProfile);

  // Determine if viewing own profile or another CG's profile
  useEffect(() => {
    console.log('Profile useEffect triggered:', { cgId, user });
    
    if (cgId && user) {
      // Viewing another CG's profile
      const isOwn = cgId === user.id.toString();
      setIsOwnProfile(isOwn);
      console.log('Loading CG profile for cgId:', cgId, 'isOwn:', isOwn);
      loadCGProfile(cgId);
    } else if (user && user.type === 'cg') {
      // Viewing own CG profile - load from backend
      setIsOwnProfile(true);
      console.log('Loading own CG profile from backend for user:', user.id);
      loadCGProfile(user.id.toString());
    } else if (user) {
      // Viewing own profile
      setIsOwnProfile(true);
      console.log('Viewing own client profile for user type:', user.type);
      // For own profile, we don't need to load from backend, use user data
      setCgProfile(null); // Clear any existing CG profile data
    }
  }, [cgId, user]);

  const loadCGProfile = async (targetCgId: string) => {
    try {
      console.log('Loading CG profile for ID:', targetCgId);
      const profile = await getCGProfileApi.execute(targetCgId);
      console.log('CG profile loaded:', profile);
      setCgProfile(profile);
    } catch (error) {
      console.error('Failed to load CG profile:', error);
    }
  };

  const handleContactCG = async () => {
    if (!user || !cgProfile) return;

    try {
      await createChat([user.id, cgProfile.id.toString()], [user.name, cgProfile.fullName]);
      navigate('/chat');
    } catch (error) {
      console.error('Failed to create chat:', error);
      alert('Failed to start conversation. Please try again.');
    }
  };

  const openGallery = (images: string[], title: string, initialIndex: number = 0) => {
    setGalleryModal({
      isOpen: true,
      images,
      title,
      initialIndex
    });
  };

  const closeGallery = () => {
    setGalleryModal({
      isOpen: false,
      images: [],
      title: '',
      initialIndex: 0
    });
  };

  // Show loading only when we're fetching CG profile data
  const isLoading = getCGProfileApi.loading;
  
  if (!user && !cgProfile) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">{t('profile.loginToViewProfile')}</p>
            <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-2 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {t('chat.goToLogin')}
            </button>
          </div>
        </div>
    );
  }

  // Use CG profile data if viewing another CG, otherwise use current user data
  const displayName = cgProfile ? (cgProfile.name || cgProfile.fullName) : user?.name;
  const displayPhone = cgProfile ? cgProfile.phoneNumber : (user?.phone || user?.phoneNumber);
  const displayAddress = cgProfile ? cgProfile.address : user?.address;
  const displayServices = cgProfile ? cgProfile.services : user?.services;
  const displayRadius = cgProfile ? cgProfile.serviceRadius : user?.radius;
  const displayGallery = cgProfile ? cgProfile.galleryImageUrls || [] : (user?.galleryImages || []);
  const displayProfileImage = cgProfile ? cgProfile.profileImageUrl : (user?.profileImage || user?.profileImageUrl);
  const displayDescription = cgProfile ? cgProfile.description : user?.description || 'Professional service provider with years of experience.';
  const displayEmail = !isOwnProfile ? 'Contact via platform' : user?.email;

  // Get location data - prioritize CG profile data, then user data
  const displayLocation = cgProfile ? 
    (user?.location || { lat: 41.9028, lng: 12.4964 }) : // For now, use user location as backend doesn't return coordinates
    user?.location;

  const tabs = [
    { id: 'overview', label: t('profile.overview'), count: null },
    { id: 'gallery', label: t('profile.gallery'), count: displayGallery.length },
    { id: 'reviews', label: t('profile.reviews'), count: null, disabled: true }
  ];

  if (isLoading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-yellow-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
    );
  }

  if (getCGProfileApi.error) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">{t('profile.failedToLoadProfile')}</p>
            <p className="text-red-600 mb-4">{getCGProfileApi.error}</p>
            <button
                onClick={() => navigate('/services')}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-2 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {t('profile.backToServices')}
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
            {/* Profile Info */}
            <div className="px-6 py-6">
              <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
                {/* Profile Image */}
                <div className="relative mb-4 md:mb-0">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-white shadow-xl">
                    {displayProfileImage ? (
                        <img
                            src={displayProfileImage}
                            alt={displayName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                          <User className="h-12 w-12 text-white" />
                        </div>
                    )}
                  </div>
                  {(user?.type === 'cg' || cgProfile) && (
                      <div className="absolute bottom-2 right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white">
                        <HardHat className="h-4 w-4 text-white" />
                      </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{displayName}</h1>
                      <p className="text-lg text-gray-600 mt-1">
                        {(user?.type === 'cg' || cgProfile) ? t('profile.professionalServiceProvider') : t('profile.client')}
                      </p>

                      {/*{user.type === 'cg' && (*/}
                      {/*    <div className="flex items-center mt-2">*/}
                      {/*      <Calendar className="h-4 w-4 mr-1 text-gray-500" />*/}
                      {/*      <span className="text-sm text-gray-500">*/}
                      {/*        Member since {new Date(user?.createdAt || '2024-01-01').getFullYear()}*/}
                      {/*      </span>*/}
                      {/*    </div>*/}
                      {/*)}*/}
                    </div>

                    <div className="flex items-center space-x-3 mt-4 md:mt-0">
                      {isOwnProfile && user?.type === 'cg' && (
                          <button
                              onClick={() => navigate('/edit-profile')}
                              className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                          >
                            <Edit3 className="h-4 w-4 mr-2" />
                            {t('profile.editProfile')}
                          </button>
                      )}
                      {(user?.type === 'cg' || cgProfile) && !isOwnProfile && (
                          <button 
                              onClick={handleContactCG}
                              className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            {t('profile.contact')}
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
                        disabled={tab.disabled}
                        className={`py-4 px-6 border-b-2 font-medium text-sm transition-all duration-200 ${
                            tab.disabled 
                                ? 'border-transparent text-gray-400 cursor-not-allowed'
                                : 
                            activeTab === tab.id
                                ? 'border-yellow-500 text-yellow-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                      {tab.label}
                      {tab.count !== null && (
                          <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                              tab.disabled
                                  ? 'bg-gray-100 text-gray-400'
                                  :
                              activeTab === tab.id
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-600'
                          }`}>
                      {tab.count}
                    </span>
                      )}
                      {tab.disabled && (
                          <span className="ml-2 text-xs text-gray-400">({t('profile.reviewsComingSoon')})</span>
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
                          {t('profile.contactInformation')}
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-400 mr-3" />
                            <span className="text-gray-700">
                              {displayEmail || 'Email not available'}
                            </span>
                          </div>
                          {displayPhone && (
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 text-gray-400 mr-3" />
                                <a 
                                  href={`tel:${displayPhone}`}
                                  className="text-yellow-600 hover:text-yellow-700 transition-colors"
                                >
                                  {displayPhone}
                                </a>
                              </div>
                          )}
                          {displayAddress && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                                <span className="text-gray-700">{displayAddress}</span>
                              </div>
                          )}
                        </div>
                      </div>

                      {/* Professional Description */}
                      {(user?.type === 'cg' || cgProfile) && displayDescription && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                              <Award className="h-5 w-5 mr-2 text-yellow-600" />
                              {t('profile.aboutMe')}
                            </h3>
                            <p className="text-gray-700 leading-relaxed">{displayDescription}</p>
                          </div>
                      )}

                      {/* Services */}
                      {(user?.type === 'cg' || cgProfile) && displayServices && displayServices.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                              <HardHat className="h-5 w-5 mr-2 text-yellow-600" />
                              {t('profile.servicesOffered')}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {displayServices.map(service => (
                                  <div
                                      key={service}
                                      className="px-3 py-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg font-medium text-center"
                                  >
                                    {t(`categories.${service}`)}
                                  </div>
                              ))}
                            </div>
                          </div>
                      )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      {/* Service Area Map */}
                      {(user?.type === 'cg' || cgProfile) && displayLocation && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                              <MapPin className="h-5 w-5 mr-2 text-yellow-600" />
                              {t('profile.serviceArea')}
                            </h3>
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                              <Map
                                  center={[displayLocation.lat, displayLocation.lng]}
                                  zoom={11}
                                  markers={[{
                                    position: [displayLocation.lat, displayLocation.lng],
                                    type: 'cg',
                                    popup: t('map.serviceLocation'),
                                    radius: displayRadius || 10
                                  }]}
                                  showRadius={false}
                                  className="h-48 w-full"
                              />
                            </div>
                            <div className="mt-2 text-sm text-gray-600 flex items-center">
                              <Ruler className="h-4 w-4 mr-1" />
                              {t('services.serviceRadius', { radius: displayRadius || 10 })}
                            </div>
                          </div>
                      )}

                      {/* Quick Stats */}
                      {(user?.type === 'cg' || cgProfile) && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.quickStats')}</h3>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">{t('services.serviceRadius')}</span>
                                <span className="font-semibold">{displayRadius || 10} km</span>
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
                    {displayGallery.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {displayGallery.map((image, index) => (
                              <button
                                  key={index}
                                  onClick={() => openGallery(displayGallery, `${displayName}'s Work Gallery`, index)}
                                  className="aspect-square rounded-lg overflow-hidden bg-gray-100 hover:shadow-lg transition-all duration-200 transform hover:scale-105 group relative"
                              >
                                <img
                                    src={image}
                                    alt={`Work ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-sm font-medium">
                                    View Image
                                  </div>
                                </div>
                              </button>
                          ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">{t('profile.noGalleryImages')}</p>
                          {isOwnProfile && user?.type === 'cg' && (
                              <button
                                  onClick={() => navigate('/edit-profile')}
                                  className="mt-4 text-yellow-600 hover:text-yellow-700 font-medium transition-colors"
                              >
                                {t('profile.addFirstImages')}
                              </button>
                          )}
                        </div>
                    )}
                  </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">{t('profile.reviewsComingSoon')}</p>
                    <p className="text-gray-400 text-sm mt-2">
                      {t('profile.reviewsComingSoonSubtitle')}
                    </p>
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Gallery Modal */}
        <ImageGalleryModal
            images={galleryModal.images}
            isOpen={galleryModal.isOpen}
            onClose={closeGallery}
            initialIndex={galleryModal.initialIndex}
            title={galleryModal.title}
        />
      </div>
  );
};

export default Profile;