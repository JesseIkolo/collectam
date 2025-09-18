/**
 * Fixes userType issues for enterprise users
 * This is a temporary fix until backend properly handles userType
 */

export function fixUserTypeFromRegistration() {
  // Check if we just came from registration
  const registrationData = sessionStorage.getItem('pendingRegistration');
  
  if (registrationData) {
    try {
      const data = JSON.parse(registrationData);
      const currentUser = localStorage.getItem('user');
      
      if (currentUser && data.userType) {
        const user = JSON.parse(currentUser);
        
        // If user doesn't have userType but registration data does
        if (!user.userType && data.userType) {
          user.userType = data.userType;
          localStorage.setItem('user', JSON.stringify(user));
          console.log('🔧 Fixed missing userType from registration:', data.userType);
        }
      }
      
      // Clear registration data
      sessionStorage.removeItem('pendingRegistration');
    } catch (error) {
      console.error('Error fixing userType:', error);
    }
  }
}

export function saveRegistrationData(data: any) {
  // Save registration data temporarily
  sessionStorage.setItem('pendingRegistration', JSON.stringify({
    userType: data.userType,
    timestamp: Date.now()
  }));
  console.log('💾 Saved registration data for userType fix:', data.userType);
}

export function detectUserTypeFromContext(): string | null {
  // Try to detect userType from various sources
  const user = localStorage.getItem('user');
  
  if (user) {
    try {
      const userData = JSON.parse(user);
      
      // If userType is missing but we have clues
      if (!userData.userType) {
        // Check if user has company-related fields
        if (userData.companyName || userData.siret) {
          return 'entreprise';
        }
        
        // Check URL history for clues
        const currentPath = window.location.pathname;
        if (currentPath.includes('/enterprise')) {
          return 'entreprise';
        }
        
        // Default fallback
        return 'menage';
      }
      
      return userData.userType;
    } catch (error) {
      console.error('Error detecting userType:', error);
    }
  }
  
  return null;
}
