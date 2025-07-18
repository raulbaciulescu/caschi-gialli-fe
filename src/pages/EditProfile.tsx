import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useService } from '../contexts/ServiceContext';
import { profileService } from '../services/profile.service';
import { useApi } from '../hooks/useApi';
import ImageUpload from '../components/ImageUpload';
import Map from '../components/Map';
import {
  User, Mail, Phone, MapPin, HardHat, Ruler, Save,
  ArrowLeft, Camera, Image as ImageIcon, Trash2,
  AlertCircle, CheckCircle, Star, Award, Loader2
} from 'lucide-react';

const EditProfile: React.FC = () => {
  const { user, isAuthenticated, updateUserData } = useAuth();
  const { serviceCategories } = useService();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    description: '',
    services: [] as string[],
    radius: 0
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [currentGallery, setCurrentGallery] = useState<string[]>([]);
  const [currentProfileImage, setCurrentProfileImage] = useState<string>('');
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');

  const updateProfileApi = useApi(profileService.updateCGProfile);
  const deleteImageApi = useApi(profileService.deleteGalleryImage);
  const getCGProfileApi = useApi(profileService.getMyCGProfile);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    if (user.type !== 'cg') {
      navigate('/dashboard');
      return;
    }

    // Load current CG profile data from backend
    loadCGProfile();
  }, [isAuthenticated, user, navigate]);

  const loadCGProfile = async () => {
    if (!user) return;

    try {
      console.log('Loading CG profile from backend...');
      const cgProfile = await getCGProfileApi.execute();

      // Populate form with backend data
      setFormData({
        name: cgProfile.name || '',
        phone: cgProfile.phone || cgProfile.phoneNumber || '',
        address: cgProfile.address || '',
        description: cgProfile.description || '', // Description from backend
        services: cgProfile.services || [], // Services already selected
        radius: cgProfile.serviceRadius || 10
      });

      setCurrentGallery(cgProfile.galleryImageUrls || []);
      setCurrentProfileImage(cgProfile.profileImageUrl || '');
      setProfileImagePreview(cgProfile.profileImageUrl || '');

      console.log('CG profile loaded:', cgProfile);
    } catch (error) {
      console.error('Failed to load CG profile:', error);
      // Fallback to user data if backend call fails
      setFormData({
        name: user.name || '',
        phone: user.phone || user.phoneNumber || '',
        address: user.address || '',
        description: user.description || '',
        services: user.services || [],
        radius: user.radius || 10
      });
      setCurrentGallery(user.galleryImages || []);
      setCurrentProfileImage(user.profileImage || '');
      setProfileImagePreview(user.profileImage || '');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'radius') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 10 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
          ? prev.services.filter(s => s !== service)
          : [...prev.services, service]
    }));
  };

  const handleProfileImageSelect = (files: File[]) => {
    if (files.length > 0) {
      setProfileImage(files[0]);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleGalleryImagesSelect = (files: File[]) => {
    setGalleryImages(files);
  };

  const handleDeleteExistingImage = async (imageUrl: string) => {
    try {
      await deleteImageApi.execute(imageUrl);
      setCurrentGallery(prev => prev.filter(url => url !== imageUrl));
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      const updateData = {
        ...formData,
        profileImage: profileImage || undefined,
        galleryImages: galleryImages.length > 0 ? galleryImages : undefined
      };

      console.log('Updating profile with data:', updateData);
      const updatedUser = await updateProfileApi.execute(updateData);

      // Use the new updateUserData method to update context and localStorage
      updateUserData(updatedUser);

      navigate('/profile');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (!user || user.type !== 'cg') {
    return null;
  }

  if (getCGProfileApi.loading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-yellow-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">{t('editProfile.loadingProfileData')}</p>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
                onClick={() => navigate('/profile')}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              {t('editProfile.backToProfile')}
            </button>

            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <HardHat className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
                  {t('editProfile.title')}
                </h1>
                <p className="text-gray-600 mt-1">{t('editProfile.subtitle')}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Image Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Camera className="h-5 w-5 mr-2 text-yellow-600" />
                  {t('editProfile.profileImage')}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{t('editProfile.profileImageSubtitle')}</p>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Current Profile Image */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                      {(profileImagePreview || currentProfileImage) ? (
                          <img
                              src={profileImagePreview || currentProfileImage}
                              alt="Profile"
                              className="w-full h-full object-cover"
                          />
                      ) : (
                          <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                            <User className="h-12 w-12 text-white" />
                          </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Area */}
                  <div className="flex-1">
                    <ImageUpload
                        onImageSelect={handleProfileImageSelect}
                        multiple={false}
                        maxFiles={1}
                        maxSizeMB={5}
                        loading={updateProfileApi.loading}
                        className="h-32 min-h-32"
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <Camera className="h-8 w-8 text-yellow-600 mb-2" />
                        <p className="text-sm font-medium text-gray-900">{t('editProfile.updateProfilePhoto')}</p>
                        <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
                      </div>
                    </ImageUpload>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2 text-yellow-600" />
                  {t('editProfile.basicInformation')}
                </h2>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('editProfile.fullNameRequired')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                        required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('editProfile.phoneNumberRequired')}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                        required
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('editProfile.address')}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('editProfile.serviceRadiusRequired')}
                  </label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                        type="number"
                        name="radius"
                        value={formData.radius}
                        onChange={handleInputChange}
                        min="1"
                        max="50"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                        required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Description */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-600" />
                  {t('editProfile.professionalDescription')}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{t('editProfile.professionalDescriptionSubtitle')}</p>
              </div>

              <div className="p-6">
              <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                  placeholder={t('editProfile.descriptionPlaceholder')}
                  required
              />
                <div className="mt-2 text-sm text-gray-500">
                  {t('editProfile.charactersCount', { count: formData.description.length })}
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <HardHat className="h-5 w-5 mr-2 text-yellow-600" />
                  {t('editProfile.serviceCategoriesRequired')}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{t('editProfile.serviceCategoriesSubtitle')}</p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {serviceCategories.map(category => (
                      <button
                          key={category}
                          type="button"
                          onClick={() => handleServiceToggle(category)}
                          className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                              formData.services.includes(category)
                                  ? 'border-yellow-500 bg-yellow-50 text-yellow-700 shadow-lg'
                                  : 'border-gray-200 bg-white text-gray-700 hover:border-yellow-300 hover:shadow-md'
                          }`}
                      >
                        <HardHat className="h-4 w-4 mx-auto mb-1" />
                        {t(`categories.${category}`)}
                      </button>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  {formData.services.length > 0 
                    ? t('editProfile.selectedServices', { services: formData.services.map(s => t(`categories.${s}`)).join(', ') })
                    : t('edit.selectedServicesNone')}
                </div>
              </div>
            </div>

            {/* Gallery Images */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2 text-yellow-600" />
                  {t('editProfile.workGallery')}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{t('editProfile.workGallerySubtitle')}</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Current Gallery Images */}
                {currentGallery.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">{t('editProfile.currentGallery')}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {currentGallery.map((imageUrl, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                <img
                                    src={imageUrl}
                                    alt={`Gallery ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                  type="button"
                                  onClick={() => handleDeleteExistingImage(imageUrl)}
                                  disabled={deleteImageApi.loading}
                                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 disabled:opacity-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                        ))}
                      </div>
                    </div>
                )}

                {/* Upload New Images */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    {currentGallery.length > 0 ? t('editProfile.addMoreImages') : t('editProfile.uploadWorkPhotos')}
                  </h3>
                  <ImageUpload
                      onImageSelect={handleGalleryImagesSelect}
                      multiple={true}
                      maxFiles={10}
                      maxSizeMB={5}
                      loading={updateProfileApi.loading}
                  >
                    <div className="flex flex-col items-center">
                      <ImageIcon className="h-8 w-8 text-yellow-600 mb-2" />
                      <p className="text-sm font-medium text-gray-900">
                        {currentGallery.length > 0 ? t('editProfile.addMorePhotos') : t('editProfile.uploadWorkPhotos')}
                      </p>
                      <p className="text-xs text-gray-500">{t('editProfile.showBestProjects')}</p>
                    </div>
                  </ImageUpload>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {updateProfileApi.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-red-600">{updateProfileApi.error}</p>
                  </div>
                </div>
            )}

            {/* Success Display */}
            {updateProfileApi.data && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <p className="text-green-600">{t('editProfile.profileUpdatedSuccessfully')}</p>
                  </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pb-8">
              <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                  disabled={updateProfileApi.loading}
              >
                {t('common.cancel')}
              </button>
              <button
                  type="submit"
                  disabled={updateProfileApi.loading}
                  className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center font-medium"
              >
                {updateProfileApi.loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('editProfile.updating')}
                    </>
                ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {t('editProfile.saveChanges')}
                    </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default EditProfile;