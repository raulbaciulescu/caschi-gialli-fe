import { CreateServiceRequestRequest, ServiceRequestResponse } from '../types/api';

// Mock storage for service requests
let mockRequests: ServiceRequestResponse[] = [];

class MockRequestsService {
  private generateId(): string {
    return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create a new service request (mock)
   */
  public async createServiceRequest(requestData: CreateServiceRequestRequest): Promise<ServiceRequestResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get user data from localStorage
    const userData = localStorage.getItem('user_data');
    if (!userData) {
      throw new Error('User not authenticated');
    }

    const user = JSON.parse(userData);

    const newRequest: ServiceRequestResponse = {
      id: this.generateId(),
      clientId: user.id,
      clientName: user.name,
      category: requestData.category,
      service: requestData.service,
      description: requestData.description,
      location: requestData.location,
      address: requestData.address,
      urgency: requestData.urgency || 'medium',
      budget: requestData.budget,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockRequests.push(newRequest);
    
    return newRequest;
  }

  /**
   * Get user's service requests (mock)
   */
  public async getUserRequests(): Promise<ServiceRequestResponse[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Get user data from localStorage
    const userData = localStorage.getItem('user_data');
    if (!userData) {
      throw new Error('User not authenticated');
    }

    const user = JSON.parse(userData);
    
    // Return requests for this user
    return mockRequests.filter(request => request.clientId === user.id);
  }

  /**
   * Update service request status (mock)
   */
  public async updateRequestStatus(requestId: string, status: string): Promise<ServiceRequestResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const requestIndex = mockRequests.findIndex(req => req.id === requestId);
    if (requestIndex === -1) {
      throw new Error('Service request not found');
    }

    mockRequests[requestIndex] = {
      ...mockRequests[requestIndex],
      status: status as any,
      updatedAt: new Date().toISOString()
    };

    return mockRequests[requestIndex];
  }

  /**
   * Delete service request (mock)
   */
  public async deleteRequest(requestId: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const requestIndex = mockRequests.findIndex(req => req.id === requestId);
    if (requestIndex === -1) {
      throw new Error('Service request not found');
    }

    mockRequests.splice(requestIndex, 1);
  }

  /**
   * Get all requests (for CG dashboard)
   */
  public async getAllRequests(): Promise<ServiceRequestResponse[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [...mockRequests];
  }
}

export const mockRequestsService = new MockRequestsService();