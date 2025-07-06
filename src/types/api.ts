// API Types and Interfaces

export interface User {
  id: string;
  email: string;
  name: string;
  type: 'client' | 'cg';
  profileImage?: string;
  location?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterClientRequest {
  email: string;
  password: string;
  name: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface RegisterCGRequest {
  email: string;
  password: string;
  name: string;
  location?: {
    lat: number;
    lng: number;
  };
  services?: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}