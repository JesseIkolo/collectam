import { AuthService } from '@/lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface DashboardData {
  success: boolean;
  data: any;
  role: string;
  timestamp: string;
}

export interface KPIData {
  organizations?: {
    total: number;
    active: number;
    growth: number;
  };
  users?: {
    total: number;
    active: number;
  };
  collections?: {
    total: number;
    today: number;
    pending?: number;
  };
  vehicles?: {
    total: number;
    active: number;
  };
  collectors?: {
    total: number;
    active: number;
  };
  missions?: {
    active: number;
    completed: number;
  };
}

export interface AnalyticsData {
  success: boolean;
  data: {
    timeframe: string;
    [key: string]: any;
  };
}

class DashboardService {
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
   * Get dashboard data based on user role
   */
  async getDashboardData(): Promise<DashboardData> {
    return this.makeRequest('/api/dashboard');
  }

  /**
   * Get admin dashboard (global overview)
   */
  async getAdminDashboard(): Promise<DashboardData> {
    return this.makeRequest('/api/dashboard/admin');
  }

  /**
   * Get organization admin dashboard
   */
  async getOrgAdminDashboard(): Promise<DashboardData> {
    return this.makeRequest('/api/dashboard/org-admin');
  }

  /**
   * Get collector dashboard
   */
  async getCollectorDashboard(): Promise<DashboardData> {
    return this.makeRequest('/api/dashboard/collector');
  }

  /**
   * Get user dashboard
   */
  async getUserDashboard(): Promise<DashboardData> {
    return this.makeRequest('/api/dashboard/user');
  }

  /**
   * Get enterprise dashboard (same as user dashboard for now)
   */
  async getEnterpriseDashboard(): Promise<DashboardData> {
    return this.makeRequest('/api/dashboard/user');
  }

  /**
   * Get global analytics (admin only)
   */
  async getGlobalAnalytics(timeframe: string = '30d'): Promise<AnalyticsData> {
    return this.makeRequest(`/api/dashboard/analytics/global?timeframe=${timeframe}`);
  }

  /**
   * Get organization analytics
   */
  async getOrganizationAnalytics(timeframe: string = '30d'): Promise<AnalyticsData> {
    return this.makeRequest(`/api/dashboard/analytics/org?timeframe=${timeframe}`);
  }

  /**
   * Get personal analytics
   */
  async getPersonalAnalytics(timeframe: string = '30d'): Promise<AnalyticsData> {
    return this.makeRequest(`/api/dashboard/analytics/personal?timeframe=${timeframe}`);
  }
}

export const dashboardService = new DashboardService();
