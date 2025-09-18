/**
 * Utility functions for user management and type preservation
 */

export interface UserWithType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  userType?: string;
  organizationId?: string;
}

/**
 * Ensures userType is preserved in user data
 */
export function ensureUserType(userData: any, fallbackUserType?: string): UserWithType {
  return {
    ...userData,
    userType: userData.userType || fallbackUserType || 'menage'
  };
}

/**
 * Gets the correct dashboard route based on userType
 */
export function getDashboardRouteByUserType(userType?: string, role?: string): string {
  console.log('🔍 getDashboardRouteByUserType - userType:', userType, 'role:', role);

  // Redirect based on userType first, then role
  switch (userType) {
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
      console.log('⚠️ No userType match, checking role:', role);
      // Fallback based on role
      switch (role) {
        case 'admin':
          return '/dashboard/admin';
        case 'org_admin':
          return '/dashboard/org-admin';
        case 'collector':
          return '/dashboard/collector';
        default:
          console.log('⚠️ No role match, defaulting to user dashboard');
          return '/dashboard/user'; // Default to user dashboard
      }
  }
}

/**
 * Forces the preservation of userType in localStorage
 */
export function forceUserTypePreservation(userData: any, userType: string): void {
  if (userData) {
    const userWithType = ensureUserType(userData, userType);
    localStorage.setItem('user', JSON.stringify(userWithType));
    console.log('🔧 Forced userType preservation:', userWithType);
  }
}
