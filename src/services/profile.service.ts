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
   * ONLY called when viewing someone else's profile - NOT for own profile
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
   * Returns updated user data directly from backend - NO ADDITIONAL API CALLS NEEDED
   */
  public async updateCGProfile(updates: ProfileUpdateRequest): Promise<User> {
    // Get current user data to extract CG ID
    const userData = localStorage.getItem('user_data');
    if (!userData) {
      throw new Error('User not authenticated');
    }

    const user = JSON.parse(userData);

    const formData = new FormData();

    // CRITICAL: Add CG ID to the form data
    formData.append('cgId', user.id.toString());

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

    // Return updated user data - will be handled by context
    console.log('Profile update response:', response);

    return response;
  }

  /**
   * Upload profile image only
   */
  public async uploadProfileImage(file: File): Promise<string> {
    // Get current user data to extract CG ID
    const userData = localStorage.getItem('user_data');
    if (!userData) {
      throw new Error('User not authenticated');
    }

    const user = JSON.parse(userData);

    const formData = new FormData();
    formData.append('cgId', user.id.toString()); // Include CG ID
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
    // Get current user data to extract CG ID
    const userData = localStorage.getItem('user_data');
    if (!userData) {
      throw new Error('User not authenticated');
    }

    const user = JSON.parse(userData);

    const formData = new FormData();
    formData.append('cgId', user.id.toString()); // Include CG ID
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
  public async deleteGalleryImage(imageUrl: string): Promise<void> {
    // Get current user data to extract CG ID
    const userData = localStorage.getItem('user_data');
    if (!userData) {
      throw new Error('User not authenticated');
    }

    const user = JSON.parse(userData);

    await httpService.delete(`${API_ENDPOINTS.CG.PROFILE}/gallery-image`, {
      data: {
        cgId: user.id.toString(), // Include CG ID
        imageUrl
      }
    });
  }
}

export const profileService = new ProfileService();