import { mockUsers } from '../data/mockUsers';
import { CGInRangeParams, CGDisplayData } from './cg.service';

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

class MockCGService {
  /**
   * Mock implementation of getCGInRange - returns data in backend format
   */
  public async getCGInRange(params: CGInRangeParams): Promise<CGDisplayData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const { lat, lng, radius = 50, services } = params;

    // Filter CG users
    const cgUsers = mockUsers.filter(user => user.type === 'cg' && user.location);

    // Calculate distances and filter by range
    const cgInRange = cgUsers
      .map(user => {
        const distance = calculateDistance(lat, lng, user.location!.lat, user.location!.lng);
        
        return {
          user,
          distance
        };
      })
      .filter(({ user, distance }) => {
        // Check if CG is within requested radius
        const withinRadius = distance <= radius;
        
        // Check if CG provides requested services (if specified)
        const hasServices = !services || services.length === 0 || 
          (user.services && services.some(service => user.services!.includes(service)));
        
        // Check if location is within CG's service radius
        const withinCGRadius = distance <= (user.radius || 10);
        
        return withinRadius && hasServices && withinCGRadius;
      })
      .sort((a, b) => a.distance - b.distance) // Sort by distance
      .map(({ user, distance }) => ({
        // Backend format fields
        id: parseInt(user.id.replace('cg-', '')) || Math.floor(Math.random() * 1000),
        fullName: user.name,
        phoneNumber: user.phone || '+39 333 123 4567',
        email: user.email,
        street: user.address || 'Via Roma 123, Roma',
        latitude: user.location!.lat,
        longitude: user.location!.lng,
        serviceRadius: user.radius || 10,
        services: user.services || [],
        
        // Frontend display fields
        name: user.name,
        location: user.location!,
        radius: user.radius || 10,
        description: user.description || `Professional ${(user.services || []).join(', ').toLowerCase()} services.`,
        rating: 4.2 + Math.random() * 0.6, // Mock rating between 4.2-4.8
        reviews: Math.floor(Math.random() * 200) + 50, // Mock reviews 50-250
        price: `€${40 + Math.floor(Math.random() * 40)}-${60 + Math.floor(Math.random() * 40)}/hour`,
        photos: [
          'https://images.pexels.com/photos/4491461/pexels-photo-4491461.jpeg',
          'https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg'
        ],
        distance: Math.round(distance * 10) / 10 // Round to 1 decimal
      }));

    return cgInRange;
  }
}

export const mockCGService = new MockCGService();