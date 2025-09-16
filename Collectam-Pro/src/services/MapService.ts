import { AuthService } from '@/lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface CollectorLocation {
  id: string;
  name: string;
  vehicleType: string;
  currentLocation: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  onDuty: boolean;
  phone?: string;
  lastUpdate: string;
}

export interface WasteCollection {
  id: string;
  wasteType: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed';
  urgency: 'low' | 'medium' | 'high';
  scheduledDate: string;
  scheduledTime: string;
  distance: number;
  assignedCollector?: {
    id: string;
    name: string;
    phone?: string;
    estimatedArrival?: string;
  };
  completedAt?: string;
}

class MapService {
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
   * Get active collectors in the area
   */
  async getActiveCollectors(): Promise<CollectorLocation[]> {
    const response = await this.makeRequest('/api/map/collectors');
    return response.data || [];
  }

  /**
   * Get nearby waste collections
   */
  async getNearbyCollections(): Promise<WasteCollection[]> {
    const response = await this.makeRequest('/api/map/collections');
    return response.data || [];
  }

  /**
   * Get collector details by ID
   */
  async getCollectorDetails(id: string): Promise<CollectorLocation> {
    const response = await this.makeRequest(`/api/map/collectors/${id}`);
    return response.data;
  }

  /**
   * Track a specific collection
   */
  async trackCollection(id: string): Promise<WasteCollection> {
    const response = await this.makeRequest(`/api/map/collections/${id}/track`);
    return response.data;
  }
}

export const mapService = new MapService();
