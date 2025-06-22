import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  HardHat, MapPin, MessageSquare, Star, Users, Shield,
  Wrench, Zap, Hammer, Paintbrush, Flower, Sparkles,
  Truck, Monitor, Settings, Wind
} from 'lucide-react';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: MapPin,
      title: 'Location-Based Matching',
      description: 'Find qualified professionals within your specified radius'
    },
    {
      icon: MessageSquare,
      title: 'Direct Communication',
      description: 'Chat directly with service providers to discuss your needs'
    },
    {
      icon: Star,
      title: 'Verified Reviews',
      description: 'Read reviews from real customers to make informed decisions'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Safe and secure platform for all your service needs'
    }
  ];

  const categories = [
    { name: 'Plumbing', icon: Wrench },
    { name: 'Electrical', icon: Zap },
    { name: 'Carpentry', icon: Hammer },
    { name: 'Painting', icon: Paintbrush },
    { name: 'Gardening', icon: Flower },
    { name: 'Cleaning', icon: Sparkles },
    { name: 'Moving', icon: Truck },
    { name: 'IT Support', icon: Monitor },
    { name: 'Appliance Repair', icon: Settings },
    { name: 'HVAC', icon: Wind }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <HardHat className="h-20 w-20 text-yellow-700 drop-shadow-lg" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full animate-bounce"></div>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-700 via-yellow-800 to-yellow-900 bg-clip-text text-transparent drop-shadow-sm">
              Caschi Gialli
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-gray-800 font-medium">
              Connect with qualified professionals in your area. 
              Get your projects done by trusted Caschi Gialli.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register-client"
                    className="bg-white text-yellow-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 inline-flex items-center justify-center transform hover:scale-105 shadow-xl border border-yellow-200"
                  >
                    Need a Service
                  </Link>
                  <Link
                    to="/register-cg"
                    className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-yellow-700 hover:to-yellow-800 transition-all duration-300 inline-flex items-center justify-center transform hover:scale-105 shadow-xl"
                  >
                    Become a Casco Giallo
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="bg-white text-yellow-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 inline-flex items-center justify-center transform hover:scale-105 shadow-xl border border-yellow-200"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, secure, and efficient way to connect service providers with customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6 group-hover:bg-yellow-200 transition-all duration-300 transform group-hover:scale-110 shadow-lg">
                  <feature.icon className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Service Categories
            </h2>
            <p className="text-xl text-gray-600">
              Find professionals for all your needs
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                to="/services"
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group transform hover:scale-105 border border-gray-100"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:from-yellow-500 group-hover:to-yellow-700 transition-all duration-300 shadow-md">
                  <category.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">1,000+</div>
              <div className="text-xl text-gray-300">Active Caschi Gialli</div>
            </div>
            <div className="transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">5,000+</div>
              <div className="text-xl text-gray-300">Completed Projects</div>
            </div>
            <div className="transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">4.8★</div>
              <div className="text-xl text-gray-300">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-gray-600">
              Join thousands of satisfied customers and professional service providers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register-client"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Find Services
              </Link>
              <Link
                to="/register-cg"
                className="bg-white text-yellow-700 border-2 border-yellow-500 hover:bg-yellow-50 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Offer Services
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;