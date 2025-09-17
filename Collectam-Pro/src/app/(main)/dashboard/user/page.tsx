"use client";

import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { EnterpriseDashboard } from "@/components/dashboard/EnterpriseDashboard";
import { AuthService } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const [userType, setUserType] = useState<string>('menage');
  const router = useRouter();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      // Redirect Business users to their proper dashboard
      if (currentUser.userType === 'collectam-business') {
        router.push('/dashboard/business');
        return;
      }
      
      setUserType(currentUser.userType || 'menage');
    }
  }, [router]);

  // Render appropriate dashboard based on user type
  if (userType === 'entreprise') {
    return <EnterpriseDashboard />;
  }

  return <UserDashboard />;
}
