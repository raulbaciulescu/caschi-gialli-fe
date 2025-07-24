import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ServiceRequest {
  id: string;
  clientId: string;
  clientName: string;
  category: string;
  service: string;
  location: { lat: number; lng: number };
  address: string;
  description: string;
  status: 'pending' | 'accepted' | 'completed';
  createdAt: Date;
  matches?: string[];
}

interface ServiceOffer {
  id: string;
  cgId: string;
  cgName: string;
  categories: string[];
  location: { lat: number; lng: number };
  radius: number;
  description: string;
}

interface ServiceContextType {
  serviceCategories: string[];
  serviceRequests: ServiceRequest[];
  serviceOffers: ServiceOffer[];
  addServiceRequest: (request: Omit<ServiceRequest, 'id' | 'createdAt' | 'matches'>) => void;
  addServiceOffer: (offer: Omit<ServiceOffer, 'id'>) => void;
  findMatches: (request: ServiceRequest) => ServiceOffer[];
  updateRequestStatus: (requestId: string, status: ServiceRequest['status']) => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const useService = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
};

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const ServiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const serviceCategories = [
    'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Gardening',
    'Cleaning', 'Moving', 'IT Support', 'Appliance Repair', 'HVAC',
    'Roofing', 'Flooring', 'Tiling', 'Masonry', 'Pest Control'
  ];

  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [serviceOffers, setServiceOffers] = useState<ServiceOffer[]>([
    {
      id: '1',
      cgId: 'cg1',
      cgName: 'Mario Rossi',
      categories: ['Plumbing', 'Electrical'],
      location: { lat: 41.9028, lng: 12.4964 },
      radius: 15,
      description: 'Professional plumber and electrician with 15+ years experience.',
    }
  ]);

  const addServiceRequest = (request: Omit<ServiceRequest, 'id' | 'createdAt' | 'matches'>) => {
    const newRequest: ServiceRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date(),
      status: 'pending'
    };
    
    const matches = findMatches(newRequest);
    newRequest.matches = matches.map(match => match.id);
    
    setServiceRequests(prev => [...prev, newRequest]);
  };

  const addServiceOffer = (offer: Omit<ServiceOffer, 'id'>) => {
    const newOffer: ServiceOffer = {
      ...offer,
      id: Date.now().toString()
    };
    setServiceOffers(prev => [...prev, newOffer]);
  };

  const findMatches = (request: ServiceRequest): ServiceOffer[] => {
    return serviceOffers.filter(offer => {
      const distance = calculateDistance(
        request.location.lat,
        request.location.lng,
        offer.location.lat,
        offer.location.lng
      );
      
      return distance <= offer.radius && offer.categories.includes(request.category);
    });
  };

  const updateRequestStatus = (requestId: string, status: ServiceRequest['status']) => {
    setServiceRequests(prev =>
      prev.map(request =>
        request.id === requestId ? { ...request, status } : request
      )
    );
  };

  return (
    <ServiceContext.Provider value={{
      serviceCategories,
      serviceRequests,
      serviceOffers,
      addServiceRequest,
      addServiceOffer,
      findMatches,
      updateRequestStatus
    }}>
      {children}
    </ServiceContext.Provider>
  );
};