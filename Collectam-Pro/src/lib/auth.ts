interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  invitationToken: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      organizationId?: string;
    };
    accessToken: string;
    refreshToken: string;
  };
  error?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export class AuthService {
  static async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', result.data.accessToken);
        localStorage.setItem('refreshToken', result.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        
        // Also store in cookies for middleware
        document.cookie = `accessToken=${result.data.accessToken}; path=/; max-age=${30 * 24 * 60 * 60}`; // 30 days
        document.cookie = `refreshToken=${result.data.refreshToken}; path=/; max-age=${30 * 24 * 60 * 60}`;
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Network error occurred',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', result.data.accessToken);
        localStorage.setItem('refreshToken', result.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        
        // Also store in cookies for middleware
        document.cookie = `accessToken=${result.data.accessToken}; path=/; max-age=${30 * 24 * 60 * 60}`; // 30 days
        document.cookie = `refreshToken=${result.data.refreshToken}; path=/; max-age=${30 * 24 * 60 * 60}`;
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Network error occurred',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Also clear cookies
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    window.location.href = '/auth/v2/login';
  }

  static getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  static getUser(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static isAdmin(): boolean {
    const user = this.getUser();
    return user && (user.role === 'admin' || user.role === 'org_admin');
  }
}
