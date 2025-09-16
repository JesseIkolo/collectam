"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/auth";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { EnterpriseDashboard } from "@/components/dashboard/EnterpriseDashboard";
import { CollectorDashboard } from "@/components/dashboard/CollectorDashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = AuthService.getUser();
      console.log('🔍 Dashboard - User role:', currentUser?.role, 'userType:', currentUser?.userType);
      
      if (!currentUser) {
        router.push('/auth/v2/login');
        return;
      }

      setUser(currentUser);
      setLoading(false);

      // Only redirect for admin and org_admin roles
      switch (currentUser.role) {
        case 'admin':
          router.push('/dashboard/admin');
          break;
        case 'org_admin':
          router.push('/dashboard/org-admin');
          break;
        // collector and user stay on main dashboard page
      }
    };

    // Check immediately
    checkAuth();
    
    // Also check when localStorage changes (after login)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [router]);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Render appropriate dashboard based on user role and type
  switch (user.role) {
    case 'collector':
      return <CollectorDashboard />;
    case 'user':
      if (user.userType === 'entreprise') {
        return <EnterpriseDashboard />;
      }
      return <UserDashboard />;
    default:
      return <UserDashboard />;
  }
}
