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
   * Login client - NO /me call!
   */
  public async loginClient(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // Login should return token + user data directly
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
   * Login CG - NO /me call!
   */
  public async loginCG(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // Login should return token + user data directly
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
   * Register client - returns user data directly
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
   * Register CG - returns user data directly
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
   * Logout user
   */
  public async logout(): Promise<void> {
    try {
      await httpService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      httpService.clearToken();
      localStorage.removeItem('user_data');
    }
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    return !!(token && userData);
  }
}

export const authService = new AuthService();