"use client";

import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { EnterpriseDashboard } from "@/components/dashboard/EnterpriseDashboard";
import { AuthService } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function UserPage() {
  const [userType, setUserType] = useState<string>('menage');

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUserType(currentUser.userType || 'menage');
    }
  }, []);

  // Render appropriate dashboard based on user type
  if (userType === 'entreprise') {
    return <EnterpriseDashboard />;
  }

  return <UserDashboard />;
}
