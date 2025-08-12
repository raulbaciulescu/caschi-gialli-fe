import { httpService } from './http.service';
import { API_ENDPOINTS } from '../config/api';
import { User } from '../types/api';

export interface ProfileUpdateRequest {
  name?: string;
  phone?: string;
  address?: string;
  description?: string;
  services?: string[];
  radius?: number;
  profileImage?: File;
  galleryImages?: File[];
}

export interface CGProfileResponse {
  id: number;
  fullName: string;
  phoneNumber: string;
  address: string;
  serviceRadius: number;
  services: string[];
  profileImageUrl?: string;
  galleryImageUrls?: string[];
  description?: string;
  name?: string; // Alias for fullName
}

class ProfileService {
  /**
   * Get CG public profile data (for viewing other CG profiles)
   */
  public async getCGPublicProfile(cgId: string): Promise<CGProfileResponse> {
    try {
      console.log('Making GET request to:', `${API_ENDPOINTS.CG.PROFILE}?cgId=${cgId}`);
      const response = await httpService.get<CGProfileResponse>(`${API_ENDPOINTS.CG.PROFILE}?cgId=${cgId}`);
      console.log('CG public profile response:', response);
      
      // Normalize the response to ensure we have all needed fields
      const normalizedResponse = {
        ...response,
        name: response.fullName || response.name,
        description: response.description || `Professional ${response.services?.join(', ').toLowerCase() || ''} services.`
      };
      
      return normalizedResponse;
    } catch (error) {
      console.error('Failed to get CG public profile:', error);
      throw new Error('Failed to get CG profile');
    }
  }

  /**
   * Update CG profile with form data including images and CG ID
   */
  public async updateCGProfile(updates: ProfileUpdateRequest): Promise<User> {
    // Expect the backend to derive user identity from session cookie;
    // if the API still requires an explicit id, the caller must supply it in `updates`
    const user = { id: (updates as any)?.id } as any;

    const formData = new FormData();

    // CRITICAL: Add CG ID to the form data
    if (user?.id) {
      formData.append('cgId', user.id.toString());
    }

    // Add text fields
    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'profileImage' || key === 'galleryImages') return;

      if (key === 'services') {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach(item => formData.append(`${key}[]`, item));
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    // Add profile image
    if (updates.profileImage) {
      formData.append('profileImage', updates.profileImage);
    }

    // Add gallery images
    if (updates.galleryImages) {
      updates.galleryImages.forEach((file, index) => {
        formData.append(`galleryImages`, file);
      });
    }

    console.log('Updating CG profile with FormData containing cgId:', user.id);

    const response = await httpService.put<User>(
        API_ENDPOINTS.CG.PROFILE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
    );

    return response;
  }

  /**
   * Upload profile image only
   */
  public async uploadProfileImage(file: File): Promise<string> {
    const user = { id: undefined } as any; // rely on server session; optional id may be added by caller

    const formData = new FormData();
    if (user?.id) {
      formData.append('cgId', user.id.toString());
    }
    formData.append('profileImage', file);

    const response = await httpService.post<{ profileImageUrl: string }>(
        `${API_ENDPOINTS.CG.PROFILE}/upload-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
    );

    return response.profileImageUrl;
  }

  /**
   * Upload gallery images
   */
  public async uploadGalleryImages(files: File[]): Promise<string[]> {
    const user = { id: undefined } as any;

    const formData = new FormData();
    if (user?.id) {
      formData.append('cgId', user.id.toString());
    }
    files.forEach(file => {
      formData.append('galleryImages', file);
    });

    const response = await httpService.post<{ galleryImageUrls: string[] }>(
        `${API_ENDPOINTS.CG.PROFILE}/upload-gallery`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
    );

    return response.galleryImageUrls;
  }

  /**
   * Delete gallery image
   */
  public async deleteGalleryImage(id: number, imageUrl: string): Promise<void> {
    await httpService.delete(`${API_ENDPOINTS.CG.PROFILE}/gallery-image`, {
      data: {
        cgId: id,
        imageUrl
      }
    });
  }

  /**
   * Get current user's CG profile data (for editing own profile) 
   */
  public async getMyCGProfile(cgId?: string): Promise<CGProfileResponse> {
    const targetCgId = cgId; // rely on explicit param or server session

    // Include CG ID as query parameter for GET request
    console.log('Making GET request for own profile to:', `${API_ENDPOINTS.CG.PROFILE}?cgId=${targetCgId}`);
    const response = await httpService.get<CGProfileResponse>(`${API_ENDPOINTS.CG.PROFILE}?cgId=${targetCgId}`);
    console.log('Own CG profile response:', response);
    
    // Transform backend response to User format
    const transformedUser: User = {
      id: 0,
      email: '',
      name: response.fullName || response.name || '',
      type: 'cg' as any,
      location: undefined,
      address: response.address,
      phone: response.phoneNumber,
      phoneNumber: response.phoneNumber,
      profileImage: response.profileImageUrl,
      profileImageUrl: response.profileImageUrl,
      galleryImages: response.galleryImageUrls,
      galleryImageUrls: response.galleryImageUrls,
      services: response.services,
      radius: response.serviceRadius,
      description: response.description,
      createdAt: undefined,
      updatedAt: undefined
    } as any;
    
    return transformedUser;
  }

  /**
   * Get CG profile data for viewing (returns backend format)
   */
  public async getCGProfileForViewing(): Promise<CGProfileResponse> {
    // Use session cookie; backend infers user
    const response = await httpService.get<CGProfileResponse>(`${API_ENDPOINTS.CG.PROFILE}`);
    console.log('CG profile for viewing response:', response);
    return response;
  }
}

export const profileService = new ProfileService();