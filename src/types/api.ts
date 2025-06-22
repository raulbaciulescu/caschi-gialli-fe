// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterClientRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface RegisterCGRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
  location: {
    lat: number;
    lng: number;
  };
  services: string[];
  radius: number;
  description: string;
}

// API Response for login (only token)
export interface AuthResponse {
  token: string;
  expiresIn: string;
}

// API Response for register (token + user data)
export interface RegisterResponse {
  token: string;
  expiresIn: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  type: 'client' | 'cg';
  location?: { lat: number; lng: number };
  address?: string;
  phone?: string;
  avatar?: string;
  services?: string[];
  radius?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Error Types
export class ApiException extends Error {
  public status: number;
  public errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.errors = errors;
  }
}