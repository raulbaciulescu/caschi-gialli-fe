import { mockUsers, validateCredentials, emailExists, toUser, MockUser } from '../data/mockUsers';
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

class MockAuthService {
  private generateToken(): string {
    return `Bearer mock-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateId(): string {
    return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Mock login client
   */
  public async loginClient(credentials: LoginRequest): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockUser = validateCredentials(credentials.email, credentials.password);
    
    if (!mockUser) {
      throw new Error('Invalid email or password');
    }

    // Accept both 'client' and 'customer' types for client login
    if (mockUser.type !== 'client' && mockUser.type !== 'customer') {
      throw new Error('Invalid credentials for client login');
    }

    const token = this.generateToken();
    const user = toUser(mockUser);
    
    // Store token and user data
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));

    return {
      token,
      expiresIn: '3600',
      user
    };
  }

  /**
   * Mock login CG
   */
  public async loginCG(credentials: LoginRequest): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockUser = validateCredentials(credentials.email, credentials.password);
    
    if (!mockUser) {
      throw new Error('Invalid email or password');
    }

    if (mockUser.type !== 'cg') {
      throw new Error('Invalid credentials for CG login');
    }

    const token = this.generateToken();
    const user = toUser(mockUser);
    
    // Store token and user data
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));

    return {
      token,
      expiresIn: '3600',
      user
    };
  }

  /**
   * Mock register client
   */
  public async registerClient(userData: RegisterClientRequest): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if email already exists
    if (emailExists(userData.email)) {
      throw new Error('Email already exists');
    }

    const newUser: MockUser = {
      id: this.generateId(),
      email: userData.email,
      password: userData.password,
      name: userData.name,
      type: 'customer', // Use 'customer' to match backend
      location: userData.location,
      lat: userData.location.lat,
      lng: userData.location.lng,
      address: userData.address,
      phone: userData.phone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to mock users (in real app this would be saved to database)
    mockUsers.push(newUser);

    const token = this.generateToken();
    const user = toUser(newUser);
    
    // Store token and user data
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));

    return {
      token,
      expiresIn: '3600',
      user
    };
  }

  /**
   * Mock register CG
   */
  public async registerCG(userData: RegisterCGRequest): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if email already exists
    if (emailExists(userData.email)) {
      throw new Error('Email already exists');
    }

    const newUser: MockUser = {
      id: this.generateId(),
      email: userData.email,
      password: userData.password,
      name: userData.name,
      type: 'cg',
      location: userData.location,
      lat: userData.location.lat,
      lng: userData.location.lng,
      address: userData.address,
      phone: userData.phone,
      services: userData.services,
      radius: userData.radius,
      description: userData.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to mock users
    mockUsers.push(newUser);

    const token = this.generateToken();
    const user = toUser(newUser);
    
    // Store token and user data
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));

    return {
      token,
      expiresIn: '3600',
      user
    };
  }

  /**
   * Get user from localStorage (no API call needed for mock)
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
   * Mock logout
   */
  public async logout(): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
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

export const mockAuthService = new MockAuthService();