// API Types and Interfaces

export interface User {
  id: string;
  email: string;
  name: string;
  type: 'client' | 'cg';
  profileImage?: string;
  profileImageUrl?: string;
  phone?: string;
  phoneNumber?: string;
  address?: string;
  services?: string[];
  radius?: number;
  serviceRadius?: number;
  description?: string;
  galleryImages?: string[];
  galleryImageUrls?: string[];
  location?: {
    lat: number;
    lng: number;
  };
  lat?: number;
  lng?: number;
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
  phone: string;
  address?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface RegisterCGRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  address?: string;
  description: string;
  radius: number;
  location?: {
    lat: number;
    lng: number;
  };
  services: string[];
}

export interface CreateServiceRequestRequest {
  category: string;
  service: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  address?: string;
}

export interface ServiceRequestResponse {
  id: string;
  category: string;
  service: string;
  description: string;
  address?: string;
  location: {
    lat: number;
    lng: number;
  };
  customerEmail: string;
  customerName?: string;
  customerId: string;
  createdAt: string;
  status: string;
}

export interface AssignCGRequest {
  requestId: string;
  cgId?: string;
}

export interface AssignCGResponse {
  success: boolean;
  message: string;
  requestId: string;
  cgId: string;
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

export class ApiException extends Error {
  public status: number;
  public code?: string;
  public errors?: Record<string, string[]>;

  constructor(message: string, status: number = 500, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.errors = errors;
  }
}

export interface DeleteAccountRequest {
  confirmText: string;
}

export interface DeleteAccountResponse {
  message: string;
  deletedAt: string;
}
