import { httpService } from './http.service';
import { API_ENDPOINTS } from '../config/api';
import { User } from '../types/api';

class UserService {
  /**
   * Update user profile
   */
  public async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await httpService.put<User>(API_ENDPOINTS.USERS.UPDATE_PROFILE, updates);

    // Update local storage with new user data
    localStorage.setItem('user_data', JSON.stringify(response));

    return response;
  }

  /**
   * Get user profile
   */
  public async getProfile(): Promise<User> {
    const response = await httpService.get<User>(API_ENDPOINTS.USERS.PROFILE);
    return response;
  }
}

export const userService = new UserService();