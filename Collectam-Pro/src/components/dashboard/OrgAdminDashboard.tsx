"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Users, Truck, MapPin, Calendar, AlertTriangle, CheckCircle } from "lucide-react";
import { dashboardService, DashboardData } from "@/services/DashboardService";

export function OrgAdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getOrgAdminDashboard();
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
  const activeMissions = dashboardData?.data?.activeMissions || [];
  const vehicleLocations = dashboardData?.data?.vehicleLocations || [];
  const alerts = dashboardData?.data?.alerts || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord Organisation</h1>
          <p className="text-muted-foreground">
            Gestion des collecteurs, véhicules et missions
          </p>
        </div>
        <Badge variant="secondary">Admin Organisation</Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collecteurs actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.collectors?.active || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total: {kpis.collectors?.total || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Véhicules en service</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.vehicles?.active || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total: {kpis.vehicles?.total || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collectes aujourd'hui</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.collections?.today || 0}</div>
            <p className="text-xs text-muted-foreground">
              {kpis.collections?.pending || 0} en attente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missions actives</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.missions?.active || 0}</div>
            <p className="text-xs text-muted-foreground">
              {kpis.missions?.completed || 0} terminées
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert: any, index: number) => (
            <Alert key={index}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {alert.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <Tabs defaultValue="missions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="missions">Missions en cours</TabsTrigger>
          <TabsTrigger value="vehicles">Véhicules</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="missions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Missions en cours</CardTitle>
            </CardHeader>
            <CardContent>
              {activeMissions.length > 0 ? (
                <div className="space-y-3">
                  {activeMissions.map((mission: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {mission.assignedTo?.firstName} {mission.assignedTo?.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Véhicule: {mission.vehicleId?.licensePlate} ({mission.vehicleId?.type})
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Démarrée: {new Date(mission.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="default">En cours</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucune mission en cours</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>État des véhicules</CardTitle>
            </CardHeader>
            <CardContent>
              {vehicleLocations.length > 0 ? (
                <div className="space-y-3">
                  {vehicleLocations.map((vehicle: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{vehicle.licensePlate}</p>
                        <p className="text-sm text-muted-foreground">Type: {vehicle.type}</p>
                        {vehicle.location?.coordinates && (
                          <p className="text-xs text-muted-foreground">
                            Position: {vehicle.location.coordinates[1].toFixed(4)}, {vehicle.location.coordinates[0].toFixed(4)}
                          </p>
                        )}
                      </div>
                      <Badge variant={vehicle.status === 'active' ? 'default' : 'secondary'}>
                        {vehicle.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucun véhicule actif</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Planning du jour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full">Planifier nouvelle mission</Button>
                <div className="text-center text-muted-foreground">
                  Fonctionnalité de planning en cours de développement
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
