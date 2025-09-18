interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  invitationToken?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  companyName?: string;
  userType?: string;
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
        document.cookie = `accessToken=${result.data.accessToken}; path=/; max-age=${24 * 60 * 60}`; // 24 hours
        document.cookie = `refreshToken=${result.data.refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
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
        document.cookie = `accessToken=${result.data.accessToken}; path=/; max-age=${24 * 60 * 60}`; // 24 hours
        document.cookie = `refreshToken=${result.data.refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
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

  static getCurrentUser(): any | null {
    return this.getUser();
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static isAdmin(): boolean {
    const user = this.getUser();
    return user && (user.role === 'admin' || user.role === 'org_admin');
  }

  static getDashboardRoute(): string {
    const user = this.getUser();
    console.log('🔍 getDashboardRoute - User data:', user);
    
    if (!user) return '/auth/v2/login';

    console.log('🔍 getDashboardRoute - userType:', user.userType, 'role:', user.role);

    // Redirect based on userType first, then role
    switch (user.userType) {
      case 'collectam-business':
        console.log('✅ Redirecting to business dashboard');
        return '/dashboard/business';
      case 'collecteur':
        console.log('✅ Redirecting to collector dashboard');
        return '/dashboard/collector';
      case 'menage':
        console.log('✅ Redirecting to user dashboard');
        return '/dashboard/user';
      case 'entreprise':
        console.log('✅ Redirecting to enterprise dashboard');
        return '/dashboard/enterprise';
      default:
        console.log('⚠️ No userType match, checking role:', user.role);
        // Fallback based on role
        switch (user.role) {
          case 'admin':
            return '/dashboard/admin';
          case 'org_admin':
            return '/dashboard/org-admin';
          case 'collector':
            return '/dashboard/collector';
          default:
            console.log('⚠️ No role match, staying on main dashboard');
            return '/dashboard'; // Stay on main dashboard for fallback
        }
    }
  }
}
