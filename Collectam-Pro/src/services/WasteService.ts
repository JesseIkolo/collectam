import { AuthService } from '@/lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface WasteRequest {
  id: string;
  wasteType: string;
  description: string;
  estimatedWeight: number;
  address: string;
  preferredDate: string;
  preferredTime: string;
  urgency: string;
  notes?: string;
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateWasteRequest {
  wasteType: string;
  description: string;
  estimatedWeight: number;
  address: string;
  preferredDate: Date;
  preferredTime: string;
  urgency: string;
  notes?: string;
}

class WasteService {
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = AuthService.getToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        AuthService.logout();
        window.location.href = '/auth/v2/login';
        throw new Error('Session expired');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get all waste requests for the current user
   */
  async getWasteRequests(): Promise<WasteRequest[]> {
    const response = await this.makeRequest('/api/waste-requests');
    return response.data || [];
  }

  /**
   * Create a new waste request
   */
  async createWasteRequest(data: CreateWasteRequest): Promise<WasteRequest> {
    const response = await this.makeRequest('/api/waste-requests', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        preferredDate: data.preferredDate.toISOString(),
      }),
    });
    return response.data;
  }

  /**
   * Update an existing waste request
   */
  async updateWasteRequest(id: string, data: Partial<CreateWasteRequest>): Promise<WasteRequest> {
    const updateData = {
      ...data,
      ...(data.preferredDate && { preferredDate: data.preferredDate.toISOString() }),
    };

    const response = await this.makeRequest(`/api/waste-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    return response.data;
  }

  /**
   * Delete a waste request
   */
  async deleteWasteRequest(id: string): Promise<void> {
    await this.makeRequest(`/api/waste-requests/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Cancel a waste request
   */
  async cancelWasteRequest(id: string): Promise<WasteRequest> {
    const response = await this.makeRequest(`/api/waste-requests/${id}/cancel`, {
      method: 'PATCH',
    });
    return response.data;
  }

  /**
   * Get waste request statistics
   */
  async getWasteStats(): Promise<any> {
    const response = await this.makeRequest('/api/waste-requests/stats');
    return response.data;
  }
}

export const wasteService = new WasteService();
