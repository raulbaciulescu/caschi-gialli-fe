import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { 
  HardHat, MapPin, MessageSquare, Shield, ArrowRight, CheckCircle, Users,
  Wrench, Zap, Hammer, Paintbrush, Flower, Sparkles,
  Truck, Monitor, Settings, Wind, Clock, Award
} from 'lucide-react';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const features = [
    {
      icon: MapPin,
      title: t('home.locationBasedMatching'),
      description: t('home.locationBasedMatchingDesc'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: MessageSquare,
      title: t('home.directCommunication'),
      description: t('home.directCommunicationDesc'),
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Shield,
      title: t('home.securePlatform'),
      description: t('home.securePlatformDesc'),
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const categories = [
    { name: t('categories.Plumbing'), icon: Wrench, color: 'from-blue-400 to-blue-500' },
    { name: t('categories.Electrical'), icon: Zap, color: 'from-yellow-400 to-yellow-500' },
    { name: t('categories.Carpentry'), icon: Hammer, color: 'from-amber-400 to-amber-500' },
    { name: t('categories.Painting'), icon: Paintbrush, color: 'from-pink-400 to-pink-500' },
    { name: t('categories.Gardening'), icon: Flower, color: 'from-green-400 to-green-500' },
    { name: t('categories.Cleaning'), icon: Sparkles, color: 'from-cyan-400 to-cyan-500' },
    { name: t('categories.Moving'), icon: Truck, color: 'from-indigo-400 to-indigo-500' },
    { name: t('categories.IT Support'), icon: Monitor, color: 'from-purple-400 to-purple-500' },
    { name: t('categories.Appliance Repair'), icon: Settings, color: 'from-gray-400 to-gray-500' },
    { name: t('categories.HVAC'), icon: Wind, color: 'from-teal-400 to-teal-500' }
  ];

  const benefits = [
    {
      icon: Users,
      title: t('home.trustedProfessionals'),
      description: t('home.trustedProfessionalsDesc')
    },
    {
      icon: Clock,
      title: t('home.quickResponse'),
      description: t('home.quickResponseDesc')
    },
    {
      icon: Award,
      title: t('home.qualityGuaranteed'),
      description: t('home.qualityGuaranteedDesc')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
          <div className="absolute inset-0 bg-pattern opacity-5"></div>
          {/* Floating elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-orange-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-red-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            {/* Logo with enhanced animation */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300 animate-pulse"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
                  <HardHat className="h-12 w-12 text-white drop-shadow-lg" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-300 rounded-full animate-bounce shadow-lg"></div>
                </div>
              </div>
            </div>

            {/* Enhanced title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent drop-shadow-sm">
                {t('home.title')}
              </span>
            </h1>
            
            {/* Subtitle with better typography */}
            <p className="text-xl md:text-2xl lg:text-3xl mb-4 max-w-4xl mx-auto leading-relaxed text-gray-800 font-medium">
              {t('home.subtitle')}
            </p>
            <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-gray-600">
              {t('home.description')}
            </p>

            {/* Enhanced CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {!isAuthenticated ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
                    {/* Client Registration Card */}
                    <Link
                      to="/register-client"
                      className="group relative bg-white text-gray-800 p-8 rounded-2xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl border border-gray-200 text-center"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{t('home.needService')}</h3>
                      <p className="text-gray-600 text-sm mb-4">Find qualified professionals for your projects</p>
                      <div className="flex items-center justify-center text-blue-600 font-semibold">
                        <span className="mr-2">Get Started as Client</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </Link>

                    {/* CG Registration Card */}
                    <Link
                      to="/register-cg"
                      className="group relative bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-8 rounded-2xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-2xl text-center"
                    >
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <HardHat className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{t('home.becomeProvider')}</h3>
                      <p className="text-yellow-100 text-sm mb-4">Join our network of trusted professionals</p>
                      <div className="flex items-center justify-center text-white font-semibold">
                        <span className="mr-2">Become Casco Giallo</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </Link>
                  </div>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="group relative bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 inline-flex items-center justify-center transform hover:scale-105 shadow-2xl min-w-[200px]"
                >
                  <span className="mr-2">{t('home.goToDashboard')}</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('home.howItWorks')}
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('home.howItWorksSubtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                {/* Connection line for desktop */}
                {index < features.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 to-transparent z-0"></div>
                )}
                
                <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 group-hover:border-gray-200">
                  {/* Step number */}
                  <div className="absolute -top-4 left-8 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>
                  
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-gray-100 relative">
        <div className="absolute inset-0 bg-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('home.popularCategories')}
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
              {t('home.popularCategoriesSubtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to="/services"
                className="group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center transform hover:scale-105 border border-gray-100 hover:border-gray-200"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${category.color} rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                  <category.icon className="h-7 w-7 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                  {category.name}
                </span>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('home.whyChoose')}
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              {t('home.whyChooseSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl mb-6 group-hover:from-yellow-200 group-hover:to-orange-200 transition-all duration-300 transform group-hover:scale-110 shadow-lg">
                  <benefit.icon className="h-10 w-10 text-yellow-600" />
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 lg:py-32 bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full"></div>
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              {t('home.readyToStart')}
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-2xl mx-auto">
              {t('home.readyToStartSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/register-client"
                className="group bg-white text-gray-800 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl inline-flex items-center justify-center min-w-[200px] border border-gray-200"
              >
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                <span className="mr-2">{t('home.findServices')}</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/register-cg"
                className="group bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl inline-flex items-center justify-center min-w-[200px]"
              >
                <HardHat className="h-5 w-5 mr-2" />
                <span className="mr-2">{t('home.offerServices')}</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;