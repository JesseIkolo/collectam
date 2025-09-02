"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { QrCode, Camera, AlertTriangle, Play, Pause, Truck, Award } from "lucide-react";
import { dashboardService, DashboardData } from "@/services/DashboardService";

export function CollectorDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getCollectorDashboard();
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
        <Card>
          <CardHeader>
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
              <div className="h-2 w-full bg-muted animate-pulse rounded" />
              <div className="h-3 w-32 bg-muted animate-pulse rounded" />
            </div>
          </CardContent>
        </Card>
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

  const collector = dashboardData?.data?.collector || {};
  const missions = dashboardData?.data?.missions || {};
  const vehicle = dashboardData?.data?.vehicle || null;
  const performance = dashboardData?.data?.performance || {};
  const activeMission = missions.active;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bonjour, {collector.name}! 👋
          </h1>
          <p className="text-muted-foreground">
            {collector.organization} - {collector.onDuty ? 'En service' : 'Hors service'}
          </p>
        </div>
        <Badge variant={collector.onDuty ? "default" : "secondary"}>
          Collecteur
        </Badge>
      </div>

      {/* Mission en cours */}
      {activeMission ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Mission en cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium">
                  Véhicule: {activeMission.vehicleId?.licensePlate} ({activeMission.vehicleId?.type})
                </p>
                <p className="text-sm text-muted-foreground">
                  Démarrée: {new Date(activeMission.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progression</span>
                  <span>En cours...</span>
                </div>
                <Progress value={50} className="w-full" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  Scanner QR
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Prendre Photo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Aucune mission active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Aucune mission n'est actuellement assignée. Contactez votre superviseur.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Véhicule assigné */}
      {vehicle && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Mon véhicule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">{vehicle.licensePlate}</span>
                <Badge variant={vehicle.status === 'active' ? 'default' : 'secondary'}>
                  {vehicle.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium">{vehicle.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Carburant</p>
                  <p className="font-medium">{vehicle.fuelLevel || 'N/A'}%</p>
                </div>
              </div>

              {vehicle.maintenanceStatus === 'due' && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Maintenance requise pour ce véhicule
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Missions du jour */}
      <Card>
        <CardHeader>
          <CardTitle>Mes missions du jour</CardTitle>
        </CardHeader>
        <CardContent>
          {missions.today?.length > 0 ? (
            <div className="space-y-3">
              {missions.today.map((mission: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Mission #{index + 1}</p>
                    <p className="text-sm text-muted-foreground">
                      Véhicule: {mission.vehicleId?.licensePlate}
                    </p>
                  </div>
                  <Badge variant={mission.status === 'completed' ? 'default' : 'secondary'}>
                    {mission.status === 'completed' ? 'Terminée' : 'En attente'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune mission programmée aujourd'hui</p>
          )}
        </CardContent>
      </Card>

      {/* Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Mes performances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Missions terminées</p>
              <p className="text-2xl font-bold">{missions.completedToday || 0}</p>
              <p className="text-xs text-muted-foreground">
                Total: {missions.totalCompleted || 0}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Points</p>
              <p className="text-2xl font-bold">{performance.points || 0}</p>
              <p className="text-xs text-muted-foreground">
                Taux: {performance.completionRate?.toFixed(1) || 0}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
