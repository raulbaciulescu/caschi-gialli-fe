import { httpService } from './http.service';
import { API_ENDPOINTS } from '../config/api';
import { User } from '../types/api';

class UserService {
  /**
   * Update user profile
   */
  public async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await httpService.retryRequest(
      () => httpService.put<User>(API_ENDPOINTS.CG.UPDATE_PROFILE, updates)
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to update profile');
  }

  /**
   * Get user profile
   */
  public async getProfile(): Promise<User> {
    const response = await httpService.retryRequest(
      () => httpService.get<User>(API_ENDPOINTS.CG.PROFILE)
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.message || 'Failed to get profile');
  }
}

export const userService = new UserService();