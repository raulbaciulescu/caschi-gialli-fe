import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '../config/api';
import { ApiException } from '../types/api';

class HttpService {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
      // Enable cookie-based auth (HttpOnly cookies) when the backend is configured for it
      withCredentials: true,
      // Optional XSRF support if backend sets a CSRF cookie (adjust names to your backend)
      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-CSRF-Token',
    });

    this.setupInterceptors();
    // Stop loading token from localStorage for improved security
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = this.token; // Token already includes "Bearer "
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401) {
          this.clearToken();
          // Don't redirect automatically, let the app handle it
        }

        // Transform error to ApiException
        const apiError = this.transformError(error);
        return Promise.reject(apiError);
      }
    );
  }

  private transformError(error: any): ApiException {
    if (error.response) {
      const { status, data } = error.response;
      return new ApiException(
        data?.message || 'An error occurred',
        status,
        data?.errors
      );
    } else if (error.request) {
      return new ApiException('Network error - please check your connection', 0);
    } else {
      return new ApiException(error.message || 'Unknown error occurred', 0);
    }
  }

  // Keep token only in memory; do not persist to localStorage
  private loadTokenFromStorage(): void {}

  public setToken(token: string): void {
    this.token = token;
  }

  public clearToken(): void {
    this.token = null;
    // Clean up any legacy storage if present
    try {
      localStorage.removeItem('auth_token');
    } catch {}
  }

  // HTTP Methods
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }
}

export const httpService = new HttpService();