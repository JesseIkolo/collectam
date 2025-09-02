"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Building2, Users, Truck, BarChart3, TrendingUp, AlertTriangle } from "lucide-react";
import { dashboardService, DashboardData } from "@/services/DashboardService";

export function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getAdminDashboard();
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Erreur lors du chargement du dashboard: {error}
        </AlertDescription>
      </Alert>
    );
  }

  const kpis = dashboardData?.data?.kpis || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vue d'ensemble Administrateur</h1>
          <p className="text-muted-foreground">
            Tableau de bord global de la plateforme Collectam
          </p>
        </div>
        <Badge variant="default">Administrateur</Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organisations actives</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.organizations?.active || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{kpis.organizations?.growth || 0} ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.users?.active || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total: {kpis.users?.total || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collectes totales</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.collections?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {kpis.collections?.today || 0} aujourd'hui
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Véhicules actifs</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.vehicles?.active || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total: {kpis.vehicles?.total || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Organizations */}
        <Card>
          <CardHeader>
            <CardTitle>Nouvelles Organisations</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData?.data?.recentActivity?.organizations?.length > 0 ? (
              <div className="space-y-2">
                {dashboardData?.data?.recentActivity?.organizations?.map((org: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">{org.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(org.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={org.status === 'active' ? 'default' : 'secondary'}>
                      {org.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucune nouvelle organisation</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Collections */}
        <Card>
          <CardHeader>
            <CardTitle>Collectes Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData?.data?.recentActivity?.collections?.length > 0 ? (
              <div className="space-y-2">
                {dashboardData?.data?.recentActivity?.collections?.slice(0, 5).map((collection: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">
                        {collection.reportedBy?.firstName} {collection.reportedBy?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {collection.organizationId?.name}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {new Date(collection.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Aucune collecte récente</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics Globales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium">Croissance Organisations</p>
              <Progress value={75} className="w-full" />
              <p className="text-xs text-muted-foreground">75% de l'objectif mensuel</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Adoption Utilisateurs</p>
              <Progress value={60} className="w-full" />
              <p className="text-xs text-muted-foreground">60% d'engagement actif</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Performance Collectes</p>
              <Progress value={85} className="w-full" />
              <p className="text-xs text-muted-foreground">85% de taux de completion</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
