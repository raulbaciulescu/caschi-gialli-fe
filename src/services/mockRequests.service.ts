import { CreateServiceRequestRequest, ServiceRequestResponse } from '../types/api';

// Mock storage for service requests
let mockRequests: ServiceRequestResponse[] = [];

class MockRequestsService {
  private generateId = (): string => {
    return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create a new service request (mock)
   */
  public createServiceRequest = async (requestData: CreateServiceRequestRequest): Promise<ServiceRequestResponse> => {
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
  public getUserRequests = async (): Promise<ServiceRequestResponse[]> => {
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
  public updateRequestStatus = async (requestId: string, status: string): Promise<ServiceRequestResponse> => {
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
  public deleteRequest = async (requestId: string): Promise<void> => {
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
  public getAllRequests = async (): Promise<ServiceRequestResponse[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [...mockRequests];
  }

  /**
   * Assign CG to request (mock)
   */
  public assignCGToRequest = async (requestId: string, cgId: string, cgName: string): Promise<ServiceRequestResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const requestIndex = mockRequests.findIndex(req => req.id === requestId);
    if (requestIndex === -1) {
      throw new Error('Service request not found');
    }

    // Check if request is already assigned
    if (mockRequests[requestIndex].assignedCGId) {
      throw new Error('Request is already assigned to another CG');
    }

    // Check if request is still pending
    if (mockRequests[requestIndex].status !== 'pending') {
      throw new Error('Request is no longer available');
    }

    mockRequests[requestIndex] = {
      ...mockRequests[requestIndex],
      assignedCGId: cgId,
      assignedCGName: cgName,
      status: 'accepted',
      updatedAt: new Date().toISOString()
    };

    return mockRequests[requestIndex];
  }
}

export const mockRequestsService = new MockRequestsService();