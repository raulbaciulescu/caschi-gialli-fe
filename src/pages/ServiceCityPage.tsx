import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { useCGInRange } from '../hooks/useCGInRange';
import Map from '../components/Map';
import OnlineStatusIndicator from '../components/OnlineStatusIndicator';
import {
  MapPin, Phone, MessageSquare, User, Star, Clock, CheckCircle,
  Wrench, Zap, Hammer, Paintbrush, Flower, Sparkles, Truck, Monitor,
  Settings, Wind, Home, Grid3X3, Bug, HardHat, ArrowRight, Search,
  Loader2, AlertCircle, Award, Shield, Users
} from 'lucide-react';

// Italian cities with coordinates for SEO pages
const ITALIAN_CITIES = {
  'roma': { name: 'Roma', lat: 41.9028, lng: 12.4964, region: 'Lazio' },
  'milano': { name: 'Milano', lat: 45.4642, lng: 9.1900, region: 'Lombardia' },
  'napoli': { name: 'Napoli', lat: 40.8518, lng: 14.2681, region: 'Campania' },
  'torino': { name: 'Torino', lat: 45.0703, lng: 7.6869, region: 'Piemonte' },
  'palermo': { name: 'Palermo', lat: 38.1157, lng: 13.3613, region: 'Sicilia' },
  'genova': { name: 'Genova', lat: 44.4056, lng: 8.9463, region: 'Liguria' },
  'bologna': { name: 'Bologna', lat: 44.4949, lng: 11.3426, region: 'Emilia-Romagna' },
  'firenze': { name: 'Firenze', lat: 43.7696, lng: 11.2558, region: 'Toscana' },
  'bari': { name: 'Bari', lat: 41.1171, lng: 16.8719, region: 'Puglia' },
  'catania': { name: 'Catania', lat: 37.5079, lng: 15.0830, region: 'Sicilia' },
  'venezia': { name: 'Venezia', lat: 45.4408, lng: 12.3155, region: 'Veneto' },
  'verona': { name: 'Verona', lat: 45.4384, lng: 10.9916, region: 'Veneto' },
  'messina': { name: 'Messina', lat: 38.1938, lng: 15.5540, region: 'Sicilia' },
  'padova': { name: 'Padova', lat: 45.4064, lng: 11.8768, region: 'Veneto' },
  'trieste': { name: 'Trieste', lat: 45.6495, lng: 13.7768, region: 'Friuli-Venezia Giulia' },
  'brescia': { name: 'Brescia', lat: 45.5416, lng: 10.2118, region: 'Lombardia' },
  'taranto': { name: 'Taranto', lat: 40.4668, lng: 17.2725, region: 'Puglia' },
  'prato': { name: 'Prato', lat: 43.8777, lng: 11.0955, region: 'Toscana' },
  'reggio-calabria': { name: 'Reggio Calabria', lat: 38.1113, lng: 15.6619, region: 'Calabria' },
  'modena': { name: 'Modena', lat: 44.6471, lng: 10.9252, region: 'Emilia-Romagna' },
  'reggio-emilia': { name: 'Reggio Emilia', lat: 44.6989, lng: 10.6297, region: 'Emilia-Romagna' },
  'perugia': { name: 'Perugia', lat: 43.1122, lng: 12.3888, region: 'Umbria' },
  'livorno': { name: 'Livorno', lat: 43.5485, lng: 10.3106, region: 'Toscana' },
  'ravenna': { name: 'Ravenna', lat: 44.4173, lng: 12.1971, region: 'Emilia-Romagna' },
  'cagliari': { name: 'Cagliari', lat: 39.2238, lng: 9.1217, region: 'Sardegna' },
  'foggia': { name: 'Foggia', lat: 41.4621, lng: 15.5444, region: 'Puglia' },
  'rimini': { name: 'Rimini', lat: 44.0678, lng: 12.5695, region: 'Emilia-Romagna' },
  'salerno': { name: 'Salerno', lat: 40.6824, lng: 14.7681, region: 'Campania' },
  'ferrara': { name: 'Ferrara', lat: 44.8381, lng: 11.6198, region: 'Emilia-Romagna' },
  'sassari': { name: 'Sassari', lat: 40.7259, lng: 8.5590, region: 'Sardegna' },
  'latina': { name: 'Latina', lat: 41.4677, lng: 12.9037, region: 'Lazio' },
  'giugliano': { name: 'Giugliano in Campania', lat: 40.9267, lng: 14.1934, region: 'Campania' },
  'monza': { name: 'Monza', lat: 45.5845, lng: 9.2744, region: 'Lombardia' },
  'siracusa': { name: 'Siracusa', lat: 37.0755, lng: 15.2866, region: 'Sicilia' },
  'pescara': { name: 'Pescara', lat: 42.4584, lng: 14.2081, region: 'Abruzzo' },
  'bergamo': { name: 'Bergamo', lat: 45.6983, lng: 9.6773, region: 'Lombardia' },
  'vicenza': { name: 'Vicenza', lat: 45.5455, lng: 11.5353, region: 'Veneto' },
  'terni': { name: 'Terni', lat: 42.5635, lng: 12.6450, region: 'Umbria' },
  'forlì': { name: 'Forlì', lat: 44.2226, lng: 12.0401, region: 'Emilia-Romagna' },
  'trento': { name: 'Trento', lat: 46.0748, lng: 11.1217, region: 'Trentino-Alto Adige' },
  'lecce': { name: 'Lecce', lat: 40.3515, lng: 18.1750, region: 'Puglia' },
  'catanzaro': { name: 'Catanzaro', lat: 38.9097, lng: 16.5987, region: 'Calabria' },
  'udinese': { name: 'Udine', lat: 46.0569, lng: 13.2370, region: 'Friuli-Venezia Giulia' },
  'arezzo': { name: 'Arezzo', lat: 43.4633, lng: 11.8796, region: 'Toscana' },
  'cesena': { name: 'Cesena', lat: 44.1391, lng: 12.2431, region: 'Emilia-Romagna' },
  'pesaro': { name: 'Pesaro', lat: 43.9102, lng: 12.9132, region: 'Marche' }
};

// Service categories with Italian translations and icons
const SERVICE_CATEGORIES = {
  'idraulico': { 
    en: 'Plumbing', 
    it: 'Idraulico', 
    icon: Wrench,
    description: {
      it: 'Servizi idraulici professionali: riparazione perdite, installazione sanitari, manutenzione impianti',
      en: 'Professional plumbing services: leak repairs, fixture installation, system maintenance'
    }
  },
  'elettricista': { 
    en: 'Electrical', 
    it: 'Elettricista', 
    icon: Zap,
    description: {
      it: 'Servizi elettrici certificati: impianti elettrici, riparazioni, installazioni sicure',
      en: 'Certified electrical services: electrical systems, repairs, safe installations'
    }
  },
  'falegname': { 
    en: 'Carpentry', 
    it: 'Falegname', 
    icon: Hammer,
    description: {
      it: 'Lavori di falegnameria: mobili su misura, riparazioni legno, installazioni',
      en: 'Carpentry work: custom furniture, wood repairs, installations'
    }
  },
  'imbianchino': { 
    en: 'Painting', 
    it: 'Imbianchino', 
    icon: Paintbrush,
    description: {
      it: 'Servizi di imbiancatura: pittura pareti, decorazioni, ristrutturazioni estetiche',
      en: 'Painting services: wall painting, decorations, aesthetic renovations'
    }
  },
  'giardiniere': { 
    en: 'Gardening', 
    it: 'Giardiniere', 
    icon: Flower,
    description: {
      it: 'Servizi di giardinaggio: manutenzione giardini, potature, progettazione verde',
      en: 'Gardening services: garden maintenance, pruning, green design'
    }
  },
  'pulizie': { 
    en: 'Cleaning', 
    it: 'Pulizie', 
    icon: Sparkles,
    description: {
      it: 'Servizi di pulizia professionale: pulizie domestiche, uffici, post-ristrutturazione',
      en: 'Professional cleaning services: home cleaning, offices, post-renovation'
    }
  },
  'traslochi': { 
    en: 'Moving', 
    it: 'Traslochi', 
    icon: Truck,
    description: {
      it: 'Servizi di trasloco: trasporti, imballaggio, montaggio mobili',
      en: 'Moving services: transport, packing, furniture assembly'
    }
  },
  'informatico': { 
    en: 'IT Support', 
    it: 'Supporto IT', 
    icon: Monitor,
    description: {
      it: 'Assistenza informatica: riparazione PC, installazione software, supporto tecnico',
      en: 'IT assistance: PC repair, software installation, technical support'
    }
  },
  'riparazione-elettrodomestici': { 
    en: 'Appliance Repair', 
    it: 'Riparazione Elettrodomestici', 
    icon: Settings,
    description: {
      it: 'Riparazione elettrodomestici: lavatrici, frigoriferi, forni, lavastoviglie',
      en: 'Appliance repair: washing machines, refrigerators, ovens, dishwashers'
    }
  },
  'climatizzazione': { 
    en: 'HVAC', 
    it: 'Climatizzazione', 
    icon: Wind,
    description: {
      it: 'Servizi di climatizzazione: installazione condizionatori, manutenzione impianti',
      en: 'HVAC services: air conditioning installation, system maintenance'
    }
  }
};

const ServiceCityPage: React.FC = () => {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const { createChat } = useChat();
  const { data: cgInRange, loading, error, searchCGInRange } = useCGInRange();
  const navigate = useNavigate();
  const params = useParams();
  
  const [cityData, setCityData] = useState<any>(null);
  const [serviceData, setServiceData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Parse URL parameters
  useEffect(() => {
    const urlPath = window.location.pathname.slice(1); // Remove leading slash
    const parts = urlPath.split('-');
    
    if (parts.length >= 2) {
      const servicePart = parts[0];
      const cityPart = parts.slice(1).join('-');
      
      // Find matching service
      const service = SERVICE_CATEGORIES[servicePart as keyof typeof SERVICE_CATEGORIES];
      const city = ITALIAN_CITIES[cityPart as keyof typeof ITALIAN_CITIES];
      
      if (service && city) {
        setServiceData({ key: servicePart, ...service });
        setCityData({ key: cityPart, ...city });
      } else {
        // Invalid URL, redirect to services page
        navigate('/services', { replace: true });
      }
    }
  }, [navigate]);

  // Add link back to general services with current search
  const handleBackToServices = () => {
    if (cityData && serviceData) {
      const searchParams = new URLSearchParams();
      searchParams.set('category', serviceData.en);
      searchParams.set('lat', cityData.lat.toString());
      searchParams.set('lng', cityData.lng.toString());
      navigate(`/services?${searchParams.toString()}`);
    } else {
      navigate('/services');
    }
  };

  // Set SEO meta data
  useEffect(() => {
    if (serviceData && cityData) {
      const isItalian = i18n.language === 'it';
      const serviceName = isItalian ? serviceData.it : serviceData.en;
      const cityName = cityData.name;
      
      // Set page title
      const title = isItalian 
        ? `${serviceName} ${cityName} - Trova Professionisti Qualificati | Caschi Gialli`
        : `${serviceName} ${cityName} - Find Qualified Professionals | Caschi Gialli`;
      document.title = title;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        const description = isItalian
          ? `Trova i migliori ${serviceName.toLowerCase()} a ${cityName}. Professionisti qualificati e verificati per servizi a domicilio. Preventivi gratuiti e assistenza 24/7.`
          : `Find the best ${serviceName.toLowerCase()} in ${cityName}. Qualified and verified professionals for home services. Free quotes and 24/7 assistance.`;
        metaDescription.setAttribute('content', description);
      }
      
      // Update canonical URL
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', `https://caschigialli.it/${serviceData.key}-${cityData.key}`);
      }
    }
  }, [serviceData, cityData, i18n.language]);

  // Search for CGs when city/service data is available
  useEffect(() => {
    if (cityData && serviceData) {
      const searchParams = {
        lat: cityData.lat,
        lng: cityData.lng,
        radius: 25, // 25km radius for city searches
        services: [serviceData.en] // Use English service name for API
      };
      
      console.log('Searching for CGs in city:', searchParams);
      searchCGInRange(searchParams);
    }
  }, [cityData, serviceData, searchCGInRange]);

  const handleContactCG = async (cgId: string, cgName: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await createChat([user.id, cgId], [user.name, cgName]);
      navigate('/chat');
    } catch (error) {
      console.error('Failed to create chat:', error);
      alert('Failed to start conversation. Please try again.');
    }
  };

  const handleViewProfile = (cgId: string) => {
    const cgData = filteredOffers.find(offer => offer.id.toString() === cgId);
    if (cgData) {
      sessionStorage.setItem('cgProfileData', JSON.stringify(cgData));
    }
    navigate(`/profile/${cgId}`);
  };

  // Filter offers based on search query
  const filteredOffers = cgInRange.filter(offer => {
    if (!searchQuery) return true;
    return offer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           offer.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Show loading or error states
  if (!serviceData || !cityData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-yellow-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  const isItalian = i18n.language === 'it';
  const serviceName = isItalian ? serviceData.it : serviceData.en;
  const cityName = cityData.name;
  const ServiceIcon = serviceData.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO-Optimized Hero Section */}
      <section className="relative bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 py-16 lg:py-24">
        <div className="absolute inset-0 bg-pattern opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li><Link to="/" className="hover:text-yellow-600 transition-colors">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li>
                <button 
                  onClick={handleBackToServices}
                  className="hover:text-yellow-600 transition-colors"
                >
                  {isItalian ? 'Servizi' : 'Services'}
                </button>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-yellow-600 font-medium">{serviceName} {cityName}</li>
            </ol>
          </nav>

          <div className="text-center">
            {/* Service Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                <ServiceIcon className="h-10 w-10 text-white" />
              </div>
            </div>

            {/* SEO-Optimized Headlines */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              {isItalian ? (
                <>
                  <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    {serviceName}
                  </span>
                  <br />
                  <span className="text-gray-800">a {cityName}</span>
                </>
              ) : (
                <>
                  <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    {serviceName}
                  </span>
                  <br />
                  <span className="text-gray-800">in {cityName}</span>
                </>
              )}
            </h1>
            
            <p className="text-xl md:text-2xl mb-4 max-w-4xl mx-auto text-gray-700 leading-relaxed">
              {isItalian 
                ? `Trova i migliori ${serviceName.toLowerCase()} a ${cityName}. Professionisti qualificati e verificati per servizi a domicilio.`
                : `Find the best ${serviceName.toLowerCase()} in ${cityName}. Qualified and verified professionals for home services.`
              }
            </p>
            
            <p className="text-lg mb-8 max-w-3xl mx-auto text-gray-600">
              {serviceData.description[isItalian ? 'it' : 'en']}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => document.getElementById('professionals')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center"
              >
                <Search className="h-5 w-5 mr-2" />
                {isItalian ? `Trova ${serviceName}` : `Find ${serviceName}`}
              </button>
              
              {!user && (
                <Link
                  to="/register-client"
                  className="bg-white text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  <Users className="h-5 w-5 mr-2" />
                  {isItalian ? 'Registrati Gratis' : 'Register Free'}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {isItalian 
                ? `Perché Scegliere i Nostri ${serviceName} a ${cityName}?`
                : `Why Choose Our ${serviceName} in ${cityName}?`
              }
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {isItalian ? 'Professionisti Verificati' : 'Verified Professionals'}
              </h3>
              <p className="text-gray-600">
                {isItalian 
                  ? 'Tutti i nostri professionisti sono verificati e qualificati per garantire servizi di qualità.'
                  : 'All our professionals are verified and qualified to ensure quality services.'
                }
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {isItalian ? 'Risposta Rapida' : 'Quick Response'}
              </h3>
              <p className="text-gray-600">
                {isItalian 
                  ? 'Ricevi risposte dai professionisti entro poche ore dalla tua richiesta.'
                  : 'Get responses from professionals within hours of your request.'
                }
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:from-yellow-200 group-hover:to-yellow-300 transition-all duration-300">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {isItalian ? 'Qualità Garantita' : 'Quality Guaranteed'}
              </h3>
              <p className="text-gray-600">
                {isItalian 
                  ? 'Lavoro di alta qualità supportato dalla garanzia della nostra piattaforma.'
                  : 'High-quality work backed by our platform guarantee.'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professionals Section */}
      <section id="professionals" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {isItalian 
                ? `${serviceName} Disponibili a ${cityName}`
                : `Available ${serviceName} in ${cityName}`
              }
            </h2>
            
            {/* Search Bar */}
            <div className="max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={isItalian ? 'Cerca per nome o descrizione...' : 'Search by name or description...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {loading && (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 text-yellow-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">
                {isItalian ? 'Ricerca professionisti...' : 'Searching professionals...'}
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Professionals List */}
              <div className="space-y-6">
                {filteredOffers.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                    <HardHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-2">
                      {isItalian 
                        ? `Nessun ${serviceName.toLowerCase()} trovato a ${cityName}`
                        : `No ${serviceName.toLowerCase()} found in ${cityName}`
                      }
                    </p>
                    <p className="text-gray-400 mb-6">
                      {isItalian 
                        ? 'Prova ad espandere la ricerca o controlla altre città'
                        : 'Try expanding your search or check other cities'
                      }
                    </p>
                    <Link
                      to="/services"
                      className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium"
                    >
                      <button 
                        onClick={handleBackToServices}
                        className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium"
                      >
                        {isItalian ? 'Cerca in Tutte le Città' : 'Search All Cities'}
                      </button>
                      <ArrowRight className="h-4 w-4 ml-1" />
                  </div>
                ) : (
                  <>
                    <div className="text-sm text-gray-600 mb-4">
                      {isItalian 
                        ? `${filteredOffers.length} ${serviceName.toLowerCase()} trovati a ${cityName}`
                        : `${filteredOffers.length} ${serviceName.toLowerCase()} found in ${cityName}`
                      }
                    </div>

                    {filteredOffers.map(offer => (
                      <div key={offer.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="relative w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                                <OnlineStatusIndicator 
                                  userId={offer.id.toString()}
                                  size="sm"
                                  className="absolute top-0 right-0"
                                />
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
                                  <OnlineStatusIndicator 
                                    userId={offer.id.toString()}
                                    size="sm"
                                    showText={true}
                                  />
                                  <span className="text-sm text-blue-600 font-medium">
                                    {offer.distance.toFixed(1)} km {isItalian ? 'di distanza' : 'away'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-4">{offer.description}</p>

                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                              {offer.services.map(service => (
                                <span
                                  key={service}
                                  className={`px-3 py-1 text-sm rounded-full flex items-center space-x-1 ${
                                    service === serviceData.en 
                                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                                      : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  <ServiceIcon className="h-3 w-3" />
                                  <span>{isItalian ? SERVICE_CATEGORIES[Object.keys(SERVICE_CATEGORIES).find(k => SERVICE_CATEGORIES[k as keyof typeof SERVICE_CATEGORIES].en === service) as keyof typeof SERVICE_CATEGORIES]?.it || service : service}</span>
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-1" />
                              {isItalian 
                                ? `Raggio di servizio: ${offer.serviceRadius} km`
                                : `Service radius: ${offer.serviceRadius} km`
                              }
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewProfile(offer.id.toString())}
                                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                              >
                                <User className="h-4 w-4 mr-1" />
                                {isItalian ? 'Profilo' : 'Profile'}
                              </button>

                              {(!user || user.type === 'client' || user.type === 'customer') && (
                                <button
                                  onClick={() => handleContactCG(offer.id.toString(), offer.name)}
                                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 flex items-center transform hover:scale-105 shadow-lg"
                                >
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  {user ? (isItalian ? 'Contatta' : 'Contact') : (isItalian ? 'Accedi per Contattare' : 'Login to Contact')}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Map */}
              <div className="lg:sticky lg:top-8">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {isItalian ? `Mappa ${serviceName} ${cityName}` : `${serviceName} Map ${cityName}`}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {isItalian 
                        ? `${filteredOffers.length} professionisti nella zona`
                        : `${filteredOffers.length} professionals in the area`
                      }
                    </p>
                  </div>
                  <div className="p-6">
                    <Map
                      center={[cityData.lat, cityData.lng]}
                      zoom={11}
                      markers={[
                        {
                          position: [cityData.lat, cityData.lng],
                          type: 'client',
                          popup: isItalian ? `Centro ${cityName}` : `${cityName} Center`
                        },
                        ...filteredOffers.map(offer => ({
                          position: [offer.location.lat, offer.location.lng] as [number, number],
                          type: 'cg' as const,
                          popup: `${offer.name} - ${offer.distance.toFixed(1)}km`
                        }))
                      ]}
                      className="h-96 w-full rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            {isItalian 
              ? `Hai Bisogno di un ${serviceName} a ${cityName}?`
              : `Need a ${serviceName} in ${cityName}?`
            }
          </h2>
          <p className="text-xl mb-8 text-white/90">
            {isItalian 
              ? 'Connettiti con professionisti qualificati nella tua zona in pochi minuti'
              : 'Connect with qualified professionals in your area within minutes'
            }
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-white text-gray-800 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                {isItalian ? 'Vai alla Dashboard' : 'Go to Dashboard'}
              </Link>
            ) : (
              <>
                <Link
                  to="/register-client"
                  className="bg-white text-gray-800 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center"
                >
                  <Users className="h-5 w-5 mr-2" />
                  {isItalian ? 'Registrati come Cliente' : 'Register as Client'}
                </Link>
                <Link
                  to="/register-cg"
                  className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center"
                >
                  <HardHat className="h-5 w-5 mr-2" />
                  {isItalian ? 'Diventa Casco Giallo' : 'Become Casco Giallo'}
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Structured Data for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": `${serviceName} ${cityName}`,
          "description": serviceData.description[isItalian ? 'it' : 'en'],
          "provider": {
            "@type": "Organization",
            "name": "Caschi Gialli",
            "url": "https://caschigialli.it"
          },
          "areaServed": {
            "@type": "City",
            "name": cityName,
            "addressRegion": cityData.region,
            "@id": `https://caschigialli.it/${serviceData.key}-${cityData.key}`
          },
          "serviceType": serviceName,
          "url": `https://caschigialli.it/${serviceData.key}-${cityData.key}`,
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "150"
          }
        })
      }} />
    </div>
  );
};

export default ServiceCityPage;