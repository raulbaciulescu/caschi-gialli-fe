import { API_CONFIG } from '../config/api';
import {httpService} from './http.service';
import {API_ENDPOINTS} from '../config/api';
import {AssignCGResponse, ServiceRequestResponse} from '../types/api';

export interface CGInRangeParams {
  lat: number;
  lng: number;
  radius?: number;
  services?: string[];
}

// Updated to match backend response format
export interface CGInRangeResponse {
  id: number;
  fullName: string | null;
  phoneNumber: string | null;
  email: string;
  street: string;
  latitude: number;
  longitude: number;
  serviceRadius: number;
  services: string[];
  profileImageUrl?: string | null;
  galleryImageUrls?: string[] | null;
}

// Extended interface for frontend display (with calculated fields)
export interface CGDisplayData extends CGInRangeResponse {
  name: string; // alias for fullName
  location: { lat: number; lng: number }; // formatted location
  radius: number; // alias for serviceRadius
  description: string; // generated or default
  distance: number; // calculated distance
  fullProfileImageUrl?: string; // Full URL for profile image
  fullGalleryImageUrls?: string[]; // Full URLs for gallery images
}

class CGService {
  /**
   * Get Caschi Gialli in range of specified location
   */
  public async getCGInRange(params: CGInRangeParams): Promise<CGDisplayData[]> {
    try {
      const queryParams = new URLSearchParams({
        lat: params.lat.toString(),
        lng: params.lng.toString(),
      });

      if (params.radius) {
        queryParams.append('radius', params.radius.toString());
      }

      if (params.services && params.services.length > 0) {
        // Add each service as a separate parameter
        params.services.forEach(service => {
          queryParams.append('services', service);
        });
      }

      // Construct the full URL
      const endpoint = API_ENDPOINTS.CG?.IN_RANGE || '/cg/inRange';
      const url = `${endpoint}?${queryParams.toString()}`;

      console.log('Making CG search request to:', url);
      console.log('Search params:', params);

      const response = await httpService.get<CGInRangeResponse[]>(url);

      console.log('CG search response:', response);

      // Transform backend response to frontend format
      return response.map(cg => this.transformCGResponse(cg, params.lat, params.lng));
    } catch (error) {
      console.error('Failed to get CG in range:', error);
      throw new Error('Failed to get service providers in range');
    }
  }

  /**
   * Get available requests for CG (requests they can take)
   */
  public async getAvailableRequests(): Promise<ServiceRequestResponse[]> {
    try {
      const response = await httpService.get<ServiceRequestResponse[]>(
          API_ENDPOINTS.REQUESTS.AVAILABLE_FOR_CG
      );

      return response;
    } catch (error) {
      console.error('Failed to get available requests:', error);
      throw new Error('Failed to get available requests');
    }
  }

  /**
   * Get CG's assigned requests
   */
  public async getMyCGRequests(): Promise<ServiceRequestResponse[]> {
    try {
      console.log('Making request to:', API_ENDPOINTS.REQUESTS.MY_CG_REQUESTS);
      const response = await httpService.get<ServiceRequestResponse[]>(
          API_ENDPOINTS.REQUESTS.MY_CG_REQUESTS
      );
      console.log('My CG requests response:', response);
      return response;
    } catch (error) {
      console.error('Failed to get CG requests:', error);
      throw new Error('Failed to get CG requests');
    }
  }

  /**
   * CG assigns themselves to a request
   */
  public async assignToRequest(requestId: string): Promise<AssignCGResponse> {
    try {
      const response = await httpService.post<AssignCGResponse>(
          API_ENDPOINTS.REQUESTS.ASSIGN_TO_REQUEST,
          { requestId }
      );

      return response;
    } catch (error) {
      console.error('Failed to assign to request:', error);
      throw new Error('Failed to assign to request');
    }
  }

  /**
   * Transform backend CG response to frontend display format
   */
  private transformCGResponse(cg: CGInRangeResponse, searchLat: number, searchLng: number): CGDisplayData {
    // Calculate distance from search location
    const distance = this.calculateDistance(searchLat, searchLng, cg.latitude, cg.longitude);

    // Construct full profile image URL if available
    const fullProfileImageUrl = cg.profileImageUrl
        ? `${cg.profileImageUrl}`
        : undefined;

    // Construct full gallery image URLs if available
    // const fullGalleryImageUrls = cg.galleryImageUrls && cg.galleryImageUrls.length > 0
    //   ? cg.galleryImageUrls.map(url => `${url}`)
    //   : [];
    const fullGalleryImageUrls =[];

    return {
      ...cg,
      name: cg.fullName || cg.email, // Use email as fallback if fullName is null
      location: { lat: cg.latitude, lng: cg.longitude },
      radius: cg.serviceRadius, // Keep this for backward compatibility
      description: `Professional ${cg.services.join(', ').toLowerCase()} services. Contact for detailed consultation.`,
      distance: Math.round(distance * 10) / 10, // Round to 1 decimal
      fullProfileImageUrl, // Full URL for profile image
      fullGalleryImageUrls // Full URLs for gallery images
    };
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}

export const cgService = new CGService();