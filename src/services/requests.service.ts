import { httpService } from './http.service';
import { API_ENDPOINTS } from '../config/api';
import { CreateServiceRequestRequest, ServiceRequestResponse } from '../types/api';

class RequestsService {
  /**
   * Create a new service request
   */
  public async createServiceRequest(requestData: CreateServiceRequestRequest): Promise<ServiceRequestResponse> {
    try {
      const response = await httpService.post<ServiceRequestResponse>(
        API_ENDPOINTS.REQUESTS.CREATE,
        requestData
      );
      
      return response;
    } catch (error) {
      console.error('Failed to create service request:', error);
      throw new Error('Failed to create service request');
    }
  }

  /**
   * Get user's service requests
   */
  public async getUserRequests(): Promise<ServiceRequestResponse[]> {
    try {
      const response = await httpService.get<ServiceRequestResponse[]>(
        API_ENDPOINTS.REQUESTS.LIST
      );
      
      return response;
    } catch (error) {
      console.error('Failed to get service requests:', error);
      throw new Error('Failed to get service requests');
    }
  }

  /**
   * Update service request status
   */
  public async updateRequestStatus(requestId: string, status: string): Promise<ServiceRequestResponse> {
    try {
      const response = await httpService.put<ServiceRequestResponse>(
        `${API_ENDPOINTS.REQUESTS.UPDATE}/${requestId}`,
        { status }
      );
      
      return response;
    } catch (error) {
      console.error('Failed to update service request:', error);
      throw new Error('Failed to update service request');
    }
  }

  /**
   * Delete service request
   */
  public async deleteRequest(requestId: string): Promise<void> {
    try {
      await httpService.delete(`${API_ENDPOINTS.REQUESTS.DELETE}/${requestId}`);
    } catch (error) {
      console.error('Failed to delete service request:', error);
      throw new Error('Failed to delete service request');
    }
  }
}

export const requestsService = new RequestsService();