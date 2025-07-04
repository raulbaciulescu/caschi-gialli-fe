import { httpService } from './http.service';
import { API_ENDPOINTS } from '../config/api';
import {
  LoginRequest,
  RegisterClientRequest,
  RegisterCGRequest,
  User,
} from '../types/api';

interface AuthResponse {
  token: string;
  expiresIn: string;
  user: User;
}

class AuthService {
  /**
   * Login client
   */
  public async loginClient(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await httpService.post<{ token: string; expiresIn: string; user: User }>(
          API_ENDPOINTS.AUTH.LOGIN_CLIENT,
          credentials
      );

      // Store token
      httpService.setToken(response.token);

      // Store user data locally
      localStorage.setItem('user_data', JSON.stringify(response.user));

      return response;
    } catch (error) {
      console.error('Client login failed:', error);
      throw new Error('Client login failed');
    }
  }

  /**
   * Login CG
   */
  public async loginCG(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await httpService.post<{ token: string; expiresIn: string; user: User }>(
          API_ENDPOINTS.AUTH.LOGIN_CG,
          credentials
      );

      // Store token
      httpService.setToken(response.token);

      // Store user data locally
      localStorage.setItem('user_data', JSON.stringify(response.user));

      return response;
    } catch (error) {
      console.error('CG login failed:', error);
      throw new Error('CG login failed');
    }
  }

  /**
   * Register client
   */
  public async registerClient(userData: RegisterClientRequest): Promise<AuthResponse> {
    try {
      const response = await httpService.post<{ token: string; expiresIn: string; user: User }>(
          API_ENDPOINTS.AUTH.REGISTER_CLIENT,
          userData
      );

      // Store token
      httpService.setToken(response.token);

      // Store user data locally
      localStorage.setItem('user_data', JSON.stringify(response.user));

      return response;
    } catch (error) {
      console.error('Client registration failed:', error);
      throw new Error('Client registration failed');
    }
  }

  /**
   * Register CG
   */
  public async registerCG(userData: RegisterCGRequest): Promise<AuthResponse> {
    try {
      const response = await httpService.post<{ token: string; expiresIn: string; user: User }>(
          API_ENDPOINTS.AUTH.REGISTER_CG,
          userData
      );

      // Store token
      httpService.setToken(response.token);

      // Store user data locally
      localStorage.setItem('user_data', JSON.stringify(response.user));

      return response;
    } catch (error) {
      console.error('CG registration failed:', error);
      throw new Error('CG registration failed');
    }
  }

  /**
   * Get user from localStorage (no API call)
   */
  public getUserFromStorage(): User | null {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to parse user data from storage:', error);
      return null;
    }
  }

  /**
   * Logout user - only clear localStorage, no API call
   */
  public async logout(): Promise<void> {
    // Clear token and user data from localStorage
    httpService.clearToken();
    localStorage.removeItem('user_data');
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    const isValid = !!(token && userData);
    
    if (!isValid) {
      console.warn('Authentication check failed:', { 
        hasToken: !!token, 
        hasUserData: !!userData 
      });
    }
    
    return isValid;
  }

  /**
   * Get current user ID safely
   */
  public getCurrentUserId(): string | null {
    try {
      const userData = this.getUserFromStorage();
      if (userData && userData.id) {
        return userData.id.toString();
      }
      console.warn('No user ID found in storage');
      return null;
    } catch (error) {
      console.error('Failed to get current user ID:', error);
      return null;
    }
  }
}

export const authService = new AuthService();