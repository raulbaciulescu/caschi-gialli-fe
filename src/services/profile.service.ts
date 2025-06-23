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

export interface ProfileImageResponse {
  profileImageUrl: string;
  galleryImageUrls: string[];
}

class ProfileService {
  /**
   * Update CG profile with form data including images
   */
  public async updateCGProfile(updates: ProfileUpdateRequest): Promise<User> {
    const formData = new FormData();

    // Add text fields
    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'profileImage' || key === 'galleryImages') return;
      
      if (Array.isArray(value)) {
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

    const response = await httpService.put<User>(
      API_ENDPOINTS.USERS.UPDATE_PROFILE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Update local storage
    localStorage.setItem('user_data', JSON.stringify(response));
    
    return response;
  }

  /**
   * Upload profile image only
   */
  public async uploadProfileImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('profileImage', file);

    const response = await httpService.post<{ profileImageUrl: string }>(
      `${API_ENDPOINTS.USERS.PROFILE}/upload-image`,
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
    const formData = new FormData();
    files.forEach(file => {
      formData.append('galleryImages', file);
    });

    const response = await httpService.post<{ galleryImageUrls: string[] }>(
      `${API_ENDPOINTS.USERS.PROFILE}/upload-gallery`,
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
    await httpService.delete(`${API_ENDPOINTS.USERS.PROFILE}/gallery-image`, {
      data: { imageUrl }
    });
  }

  /**
   * Get profile data
   */
  public async getProfile(): Promise<User> {
    const response = await httpService.get<User>(API_ENDPOINTS.USERS.PROFILE);
    return response;
  }
}

export const profileService = new ProfileService();