"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/auth";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const user = AuthService.getUser();
    console.log('🔍 Dashboard redirect - User role:', user?.role);
    
    if (!user) {
      router.push('/auth/v2/login');
      return;
    }

    // Redirect based on role
    switch (user.role) {
      case 'admin':
        router.push('/dashboard/admin');
        break;
      case 'org_admin':
        router.push('/dashboard/org-admin');
        break;
      case 'collector':
        router.push('/dashboard/collector');
        break;
      case 'user':
        router.push('/dashboard/user');
        break;
      default:
        console.error('Unknown role:', user.role);
        router.push('/dashboard/collector'); // Default fallback
    }
  }, [router]);

  return (
    <div className="p-4">
      <div className="animate-pulse">Redirection en cours...</div>
    </div>
  );
}
