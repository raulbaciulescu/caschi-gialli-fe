import {httpService} from './http.service';
import {API_ENDPOINTS} from '../config/api';
import {User} from '../types/api';

class UserService {
  public async getProfile(): Promise<User> {
    return await httpService.get<User>(API_ENDPOINTS.USERS.PROFILE);
  }

  public async deleteAccount(): Promise<void> {
    await httpService.delete(API_ENDPOINTS.USERS.DELETE_ACCOUNT);
  }
}

export const userService = new UserService();