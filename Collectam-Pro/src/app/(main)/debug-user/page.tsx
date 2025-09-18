"use client";

import React, { useState, useEffect } from 'react';
import { AuthService } from '@/lib/auth';
import { getDashboardRouteByUserType } from '@/lib/user-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function DebugUserPage() {
  const [user, setUser] = useState<any>(null);
  const [dashboardRoute, setDashboardRoute] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const currentUser = AuthService.getUser();
    setUser(currentUser);
    
    if (currentUser) {
      const route = getDashboardRouteByUserType(currentUser.userType, currentUser.role);
      setDashboardRoute(route);
    }
  }, []);

  const goToDashboard = () => {
    if (dashboardRoute) {
      router.push(dashboardRoute);
    }
  };

  const clearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Debug User Information</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Current User Data</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard Route</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            <strong>Calculated Route:</strong> {dashboardRoute}
          </p>
          <p className="mb-4">
            <strong>User Type:</strong> {user?.userType || 'undefined'}
          </p>
          <p className="mb-4">
            <strong>Role:</strong> {user?.role || 'undefined'}
          </p>
          
          <div className="flex gap-4">
            <Button onClick={goToDashboard} disabled={!dashboardRoute}>
              Go to Dashboard
            </Button>
            <Button variant="outline" onClick={clearStorage}>
              Clear Storage
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>localStorage Contents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <strong>accessToken:</strong> {localStorage.getItem('accessToken') ? 'Present' : 'Missing'}
            </div>
            <div>
              <strong>refreshToken:</strong> {localStorage.getItem('refreshToken') ? 'Present' : 'Missing'}
            </div>
            <div>
              <strong>user:</strong>
              <pre className="bg-gray-100 p-2 rounded text-xs mt-1">
                {localStorage.getItem('user') || 'Missing'}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Routes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button variant="outline" onClick={() => router.push('/dashboard/user')}>
              User Dashboard
            </Button>
            <Button variant="outline" onClick={() => router.push('/dashboard/enterprise')}>
              Enterprise Dashboard
            </Button>
            <Button variant="outline" onClick={() => router.push('/dashboard/business')}>
              Business Dashboard
            </Button>
            <Button variant="outline" onClick={() => router.push('/dashboard/collector')}>
              Collector Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
