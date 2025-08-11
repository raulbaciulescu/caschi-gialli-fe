import { httpService } from './http.service';
import { API_ENDPOINTS } from '../config/api';
import {
  LoginRequest,
  RegisterClientRequest,
  RegisterCGRequest,
  User,
} from '../types/api';

interface AuthResponse {
  token?: string; // token may be returned for non-cookie flows; optional now
  expiresIn?: string;
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

      // If backend returns a token for hybrid flows, keep it only in memory
      if (response.token) {
        httpService.setToken(response.token.startsWith('Bearer') ? response.token : `Bearer ${response.token}`);
      }

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

      if (response.token) {
        httpService.setToken(response.token.startsWith('Bearer') ? response.token : `Bearer ${response.token}`);
      }

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

      if (response.token) {
        httpService.setToken(response.token.startsWith('Bearer') ? response.token : `Bearer ${response.token}`);
      }

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

      if (response.token) {
        httpService.setToken(response.token.startsWith('Bearer') ? response.token : `Bearer ${response.token}`);
      }

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
    return null; // No longer trusting localStorage for user state
  }

  /**
   * Logout user - only clear localStorage, no API call
   */
  public async logout(): Promise<void> {
    // Call backend to clear HttpOnly cookie if supported
    try {
      await httpService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (err) {
      // Ignore network/401 here, still clear client state
    }
    // Clear client-side memory token
    httpService.clearToken();
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    // Without localStorage, rely on in-memory token presence.
    // When using HttpOnly cookies, prefer server verification flows.
    return false;
  }
}

export const authService = new AuthService();