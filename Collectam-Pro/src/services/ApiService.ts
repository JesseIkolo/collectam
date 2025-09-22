import { AuthService } from '@/services/AuthService';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

class ApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  /**
   * Effectuer une requête API générique
   */
  async makeRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = AuthService.getToken();
    
    try {
      const response = await fetch(`${this.baseUrl}/api${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Erreur API:', {
          endpoint,
          status: response.status,
          statusText: response.statusText,
          data
        });

        throw new Error(data.message || `Erreur HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('❌ Erreur réseau:', error);
      throw error;
    }
  }

  /**
   * Requête GET
   */
  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'GET'
    });
  }

  /**
   * Requête POST
   */
  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  /**
   * Requête PUT
   */
  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  /**
   * Requête PATCH
   */
  async patch<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  /**
   * Requête DELETE
   */
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE'
    });
  }
}

// Instance singleton
const apiService = new ApiService();

/**
 * Fonction helper pour les appels API
 * @deprecated Utilisez apiService.makeRequest() à la place
 */
export const apiRequest = apiService.makeRequest.bind(apiService);

export { apiService };
export default apiService;
