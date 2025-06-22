import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import { useService } from '../contexts/ServiceContext';
import Map from '../components/Map';
import { MapPin, User, Mail, Phone, Lock, HardHat, Ruler, AlertCircle } from 'lucide-react';
import { RegisterCGRequest } from '../types/api';

const RegisterCG: React.FC = () => {
  const { registerCG } = useAuth();
  const { serviceCategories } = useService();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<RegisterCGRequest>({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    location: { lat: 41.9028, lng: 12.4964 },
    services: [],
    radius: 10,
    description: ''
  });
  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const registerApi = useApi(registerCG);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else if (name === 'radius') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 10 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear validation errors when user starts typing
    if (validationErrors[name] || registerApi.error || registerApi.errors) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
      registerApi.reset();
    }
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
    if (validationErrors.services) {
      setValidationErrors(prev => ({ ...prev, services: '' }));
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, location: { lat, lng } }));
    if (validationErrors.location) {
      setValidationErrors(prev => ({ ...prev, location: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (formData.password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.location) errors.location = 'Please select your location on the map';
    if (formData.services.length === 0) errors.services = 'Please select at least one service category';
    if (!formData.description.trim()) errors.description = 'Description is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await registerApi.execute(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return validationErrors[field] || registerApi.errors?.[field]?.[0];
  };

  return (
    <div className="min-h-screen py-12 relative">
      <div className="absolute inset-0 bg-pattern opacity-10"></div>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-effect rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-6 py-8 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <h1 className="text-3xl font-bold">Become a Casco Giallo</h1>
            <p className="text-yellow-100 mt-2">Join our network of trusted professionals</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${
                        getFieldError('name') ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                      disabled={registerApi.loading}
                    />
                  </div>
                  {getFieldError('name') && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {getFieldError('name')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${
                        getFieldError('email') ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email"
                      disabled={registerApi.loading}
                    />
                  </div>
                  {getFieldError('email') && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {getFieldError('email')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${
                        getFieldError('phone') ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your phone number"
                      disabled={registerApi.loading}
                    />
                  </div>
                  {getFieldError('phone') && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {getFieldError('phone')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address (Optional)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your address"
                      disabled={registerApi.loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${
                        getFieldError('password') ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter your password"
                      disabled={registerApi.loading}
                    />
                  </div>
                  {getFieldError('password') && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {getFieldError('password')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${
                        getFieldError('confirmPassword') ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Confirm your password"
                      disabled={registerApi.loading}
                    />
                  </div>
                  {getFieldError('confirmPassword') && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {getFieldError('confirmPassword')}
                    </p>
                  )}
                </div>
              </div>

              {/* Location and Services */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Service Area & Location</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Your Location *
                  </label>
                  <p className="text-sm text-gray-600 mb-2">Click on the map to set your base location</p>
                  
                  <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg">
                    <Map
                      center={[formData.location.lat, formData.location.lng]}
                      zoom={10}
                      onLocationSelect={handleLocationSelect}
                      markers={[{
                        position: [formData.location.lat, formData.location.lng],
                        type: 'cg',
                        popup: 'Your Location'
                      }]}
                      showRadius={true}
                      radius={formData.radius}
                      className="h-64 w-full"
                    />
                  </div>
                  {getFieldError('location') && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {getFieldError('location')}
                    </p>
                  )}
                  
                  <div className="text-sm text-green-600 bg-green-50 p-2 rounded-lg mt-2">
                    ✓ Location: {formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Radius (km) *
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
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your service radius"
                      disabled={registerApi.loading}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Maximum distance you're willing to travel for jobs</p>
                </div>
              </div>
            </div>

            {/* Service Categories */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Service Categories *</h3>
              <p className="text-sm text-gray-600">Select all services you can provide</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {serviceCategories.map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleServiceToggle(category)}
                    disabled={registerApi.loading}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                      formData.services.includes(category)
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700 shadow-lg'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-yellow-300 hover:shadow-md'
                    }`}
                  >
                    <HardHat className="h-4 w-4 mx-auto mb-1" />
                    {category}
                  </button>
                ))}
              </div>
              {getFieldError('services') && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {getFieldError('services')}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Professional Description *</h3>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${
                  getFieldError('description') ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe your experience, qualifications, and what makes you stand out..."
                disabled={registerApi.loading}
              />
              {getFieldError('description') && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {getFieldError('description')}
                </p>
              )}
            </div>

            {registerApi.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {registerApi.error}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                disabled={registerApi.loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={registerApi.loading}
                className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center"
              >
                {registerApi.loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  'Join Caschi Gialli'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterCG;