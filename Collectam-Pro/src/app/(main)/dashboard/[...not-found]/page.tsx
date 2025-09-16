"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardNotFound() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to main dashboard instead of showing not found
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-2 text-center">
      <div className="animate-pulse">Redirection...</div>
    </div>
  );
}
