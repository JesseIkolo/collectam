import { AuthService } from '@/services/AuthService';

export interface WasteRequest {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
    };
  };
  wasteType: 'organic' | 'plastic' | 'paper' | 'glass' | 'metal' | 'electronic' | 'hazardous' | 'mixed';
  description: string;
  estimatedWeight: number;
  address: string;
  coordinates: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  preferredDate: string;
  preferredTime: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  assignedCollector?: string;
  scheduledDate?: string;
  completedAt?: string;
  collectionDetails?: {
    actualWeight?: number;
    collectedBy?: string;
    photos?: Array<{
      url: string;
      description?: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CollectorStats {
  totalAssigned: number;
  completed: number;
  inProgress: number;
  scheduled: number;
  completionRate: number;
  totalWeight: number;
  recentCollections: WasteRequest[];
}

export interface CreateWasteRequestData {
  wasteType: string;
  description: string;
  estimatedWeight: number;
  address: string;
  preferredDate: string;
  preferredTime: string;
  urgency: string;
  notes?: string;
  coordinates?: [number, number];
}

class WasteRequestService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const token = AuthService.getToken();
    
    const response = await fetch(`${this.baseUrl}/api${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Erreur API:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        endpoint
      });
      
      // Afficher les erreurs de validation détaillées
      if (errorData.errors && Array.isArray(errorData.errors)) {
        const errorMessages = errorData.errors.map((err: any) => err.msg).join(', ');
        throw new Error(`${errorData.message}: ${errorMessages}`);
      }
      
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // ==================== USER/HOUSEHOLD METHODS ====================

  /**
   * Get all waste requests for the current user (household)
   */
  async getUserRequests(): Promise<WasteRequest[]> {
    console.log('🗑️ Récupération des demandes de l\'utilisateur...');
    const response = await this.makeRequest('/waste-requests');
    return response.data || [];
  }

  /**
   * Create a new waste request (household users)
   */
  async createRequest(data: CreateWasteRequestData): Promise<WasteRequest> {
    console.log('🗑️ Création d\'une nouvelle demande de collecte...', data);
    const response = await this.makeRequest('/waste-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  /**
   * Update an existing waste request
   */
  async updateRequest(id: string, data: Partial<CreateWasteRequestData>): Promise<WasteRequest> {
    console.log('🗑️ Mise à jour de la demande:', id);
    const response = await this.makeRequest(`/waste-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  /**
   * Cancel a waste request
   */
  async cancelRequest(id: string, reason?: string): Promise<WasteRequest> {
    console.log('🗑️ Annulation de la demande:', id);
    const response = await this.makeRequest(`/waste-requests/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
    return response.data;
  }

  /**
   * Delete a waste request
   */
  async deleteRequest(id: string): Promise<void> {
    console.log('🗑️ Suppression de la demande:', id);
    await this.makeRequest(`/waste-requests/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get user's waste request statistics
   */
  async getUserStats(): Promise<any> {
    console.log('📊 Récupération des statistiques utilisateur...');
    const response = await this.makeRequest('/waste-requests/stats');
    return response.data;
  }

  // ==================== COLLECTOR METHODS ====================

  /**
   * Get all requests assigned to the current collector
   */
  async getAssignedRequests(): Promise<WasteRequest[]> {
    console.log('📋 Récupération des demandes assignées au collecteur...');
    const response = await this.makeRequest('/waste-requests/assigned');
    return response.data || [];
  }

  /**
   * Start collection process (collector marks as in_progress)
   */
  async startCollection(requestId: string): Promise<WasteRequest> {
    console.log('🚛 Démarrage de la collecte:', requestId);
    const response = await this.makeRequest(`/waste-requests/${requestId}/start`, {
      method: 'PATCH',
    });
    return response.data;
  }

  /**
   * Complete collection process (collector marks as completed)
   */
  async completeCollection(
    requestId: string, 
    data: {
      actualWeight?: number;
      notes?: string;
      photos?: Array<{ url: string; description?: string }>;
    }
  ): Promise<WasteRequest> {
    console.log('✅ Finalisation de la collecte:', requestId, data);
    const response = await this.makeRequest(`/waste-requests/${requestId}/complete`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  /**
   * Get collector's statistics and performance data
   */
  async getCollectorStats(): Promise<CollectorStats> {
    console.log('📊 Récupération des statistiques du collecteur...');
    const response = await this.makeRequest('/waste-requests/collector/stats');
    return response.data;
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get waste type display name in French
   */
  getWasteTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'organic': 'Organique',
      'plastic': 'Plastique',
      'paper': 'Papier/Carton',
      'glass': 'Verre',
      'metal': 'Métal',
      'electronic': 'Électronique',
      'hazardous': 'Déchets Dangereux',
      'mixed': 'Mixte'
    };
    return labels[type] || type;
  }

  /**
   * Get status display name in French
   */
  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'En attente',
      'scheduled': 'Programmé',
      'in_progress': 'En cours',
      'completed': 'Terminé',
      'cancelled': 'Annulé'
    };
    return labels[status] || status;
  }

  /**
   * Get urgency display name in French
   */
  getUrgencyLabel(urgency: string): string {
    const labels: { [key: string]: string } = {
      'low': 'Faible',
      'medium': 'Normal',
      'high': 'Urgent'
    };
    return labels[urgency] || urgency;
  }

  /**
   * Get status color variant for badges
   */
  getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
      case 'completed':
        return 'default'; // Green
      case 'in_progress':
        return 'secondary'; // Blue
      case 'scheduled':
        return 'outline'; // Gray
      case 'cancelled':
        return 'destructive'; // Red
      default:
        return 'outline';
    }
  }

  /**
   * Get urgency color variant for badges
   */
  getUrgencyVariant(urgency: string): 'default' | 'secondary' | 'destructive' {
    switch (urgency) {
      case 'high':
        return 'destructive'; // Red
      case 'medium':
        return 'default'; // Blue
      case 'low':
        return 'secondary'; // Gray
      default:
        return 'secondary';
    }
  }
}

export const wasteRequestService = new WasteRequestService();
