interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: 'menage' | 'collecteur' | 'collectam-business' | 'entreprise';
  role: 'user' | 'collector' | 'org_admin' | 'admin';
  companyName?: string;
  subscription?: {
    plan: string;
    expiry: string;
    price: number;
    currency: string;
    startDate: string;
    isActive: boolean;
  };
}

class AuthService {
  private static readonly TOKEN_KEY = 'accessToken';
  private static readonly USER_KEY = 'userData';

  /**
   * Get the stored authentication token
   */
  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Store authentication token
   */
  static setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Remove authentication token
   */
  static removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Get the stored user data
   */
  static getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(this.USER_KEY);
    if (!userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  /**
   * Store user data
   */
  static setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Remove user data
   */
  static removeUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get dashboard route based on user type
   */
  static getDashboardRoute(): string {
    const user = this.getUser();
    if (!user) return '/auth/v2/login';

    switch (user.userType) {
      case 'collecteur':
        return '/dashboard/collector';
      case 'collectam-business':
        return '/dashboard/business';
      case 'entreprise':
        return '/dashboard/enterprise';
      case 'menage':
      default:
        return '/dashboard';
    }
  }

  /**
   * Logout user
   */
  static logout(): void {
    this.removeToken();
    this.removeUser();
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/v2/login';
    }
  }

  /**
   * Login user with credentials
   */
  static async login(email: string, password: string): Promise<{ success: boolean; message?: string; user?: User }> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const payload = data.data || {};
        const accessToken = payload.accessToken || payload.token;
        const apiUser = payload.user || data.user || {};
        const mappedUser: User = {
          _id: apiUser._id || apiUser.id,
          firstName: apiUser.firstName,
          lastName: apiUser.lastName,
          email: apiUser.email,
          phone: apiUser.phone,
          userType: apiUser.userType,
          role: apiUser.role,
          companyName: apiUser.companyName,
          subscription: apiUser.subscription
        };
        if (!accessToken) {
          return { success: false, message: 'Token manquant dans la réponse du serveur' };
        }
        this.setToken(accessToken);
        this.setUser(mappedUser);
        return { success: true, user: mappedUser };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  }

  /**
   * Register new user
   */
  static async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    userType: string;
    companyName?: string;
  }): Promise<{ success: boolean; message?: string; user?: User }> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const payload = data.data || {};
        const accessToken = payload.accessToken || payload.token;
        const apiUser = payload.user || data.user || {};
        const mappedUser: User = {
          _id: apiUser._id || apiUser.id,
          firstName: apiUser.firstName,
          lastName: apiUser.lastName,
          email: apiUser.email,
          phone: apiUser.phone,
          userType: apiUser.userType,
          role: apiUser.role,
          companyName: apiUser.companyName,
          subscription: apiUser.subscription
        };
        if (!accessToken) {
          return { success: false, message: 'Token manquant dans la réponse du serveur' };
        }
        this.setToken(accessToken);
        this.setUser(mappedUser);
        return { success: true, user: mappedUser };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  }
}

export { AuthService };
export type { User };
