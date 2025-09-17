"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { QrCode, Camera, AlertTriangle, Play, Pause, Truck, Award, MapPin, Navigation, Clock, CheckCircle, Route, Fuel, Users, Package } from "lucide-react";
import { dashboardService, DashboardData } from "@/services/DashboardService";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import CollectorMapPage from "./pages/collecteur/CollectorMapPage";
import CollectorScannerPage from "./pages/collecteur/CollectorScannerPage";
import CollectorVehiclesPage from "./pages/collecteur/CollectorVehiclesPage";
import CollectorProfilePage from "./pages/collecteur/CollectorProfilePage";
import CollectorHistoryPage from "./pages/collecteur/CollectorHistoryPage";

export function CollectorDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

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
            Dashboard Collecteur 
          </h1>
          <p className="text-muted-foreground">
            Gérez vos tournées et missions de collecte
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/collector/map">
            <Button variant="outline" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Carte Temps Réel
            </Button>
          </Link>
          <Badge variant="default" className="flex items-center gap-1">
            <Truck className="h-3 w-3" />
            Collecteur
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missions du jour</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{missions.today?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {missions.completedToday || 0} terminées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collectes effectuées</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performance.collectionsToday || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total: {performance.totalCollections || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficacité</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performance.completionRate?.toFixed(0) || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Taux de réussite
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points gagnés</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performance.points || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{performance.pointsToday || 0} aujourd'hui
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mission en cours */}
      {activeMission ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-4 w-4 text-green-600" />
              Mission en cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    Tournée #{activeMission.id || '001'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Véhicule: {activeMission.vehicleId?.licensePlate || 'CAM-001'}
                  </p>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  En cours
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progression de la tournée</span>
                  <span>{activeMission.progress || 65}%</span>
                </div>
                <Progress value={activeMission.progress || 65} className="w-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  Scanner QR
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Photo Collecte
                </Button>
                <Link href="/dashboard/collector/map">
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Navigation className="h-4 w-4" />
                    Navigation
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Aucune mission active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <Truck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Aucune mission assignée pour le moment.
              </p>
              <Button variant="outline">
                Contacter le superviseur
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Véhicule assigné */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Mon véhicule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-lg">{vehicle?.licensePlate || 'CAM-001'}</p>
                  <p className="text-sm text-muted-foreground">{vehicle?.type || 'Camion de collecte'}</p>
                </div>
                <Badge variant={vehicle?.status === 'active' ? 'default' : 'secondary'}>
                  {vehicle?.status === 'active' ? 'Actif' : 'Inactif'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Carburant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={vehicle?.fuelLevel || 75} className="flex-1" />
                    <span className="text-sm font-medium">{vehicle?.fuelLevel || 75}%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Kilométrage</p>
                  <p className="font-medium">{vehicle?.mileage || '45,230'} km</p>
                </div>
              </div>

              {(vehicle?.maintenanceStatus === 'due' || Math.random() > 0.7) && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Maintenance programmée dans 500 km
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Carte temps réel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Carte en temps réel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Carte interactive</p>
                  <p className="text-xs text-muted-foreground">Collectes à proximité</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Collectes restantes</p>
                  <p className="font-medium">{missions.remaining || 8}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Distance totale</p>
                  <p className="font-medium">{missions.totalDistance || '12.5'} km</p>
                </div>
              </div>
              <Link href="/dashboard/collector/map">
                <Button className="w-full flex items-center gap-2">
                  <Navigation className="h-4 w-4" />
                  Ouvrir la carte complète
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prochaines collectes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            Prochaines collectes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: 1, address: '123 Rue de la Paix, Douala', type: 'Plastique', time: '09:30', status: 'pending', priority: 'high' },
              { id: 2, address: '45 Avenue Kennedy, Douala', type: 'Organique', time: '10:15', status: 'pending', priority: 'medium' },
              { id: 3, address: '78 Bd de la Liberté, Douala', type: 'Mixte', time: '11:00', status: 'completed', priority: 'low' },
              { id: 4, address: '12 Rue du Commerce, Douala', type: 'Électronique', time: '11:45', status: 'pending', priority: 'high' }
            ].map((collection) => (
              <div key={collection.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{collection.address}</p>
                    <Badge variant="outline" className="text-xs">
                      {collection.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {collection.time}
                    </span>
                    <Badge 
                      variant={collection.priority === 'high' ? 'destructive' : collection.priority === 'medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {collection.priority === 'high' ? 'Urgent' : collection.priority === 'medium' ? 'Normal' : 'Faible'}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {collection.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Button size="sm" variant="outline">
                      Démarrer
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance et Récompenses */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Mes performances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{missions.completedToday || 12}</p>
                  <p className="text-sm text-muted-foreground">Collectes aujourd'hui</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{performance.points || 1250}</p>
                  <p className="text-sm text-muted-foreground">Points totaux</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Objectif mensuel</span>
                  <span>78%</span>
                </div>
                <Progress value={78} className="w-full" />
                <p className="text-xs text-muted-foreground">234/300 collectes ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Équipe & Communication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Superviseur</p>
                  <p className="text-sm text-muted-foreground">Jean Mballa</p>
                </div>
                <Button size="sm" variant="outline">
                  Contacter
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Équipe du jour</p>
                  <p className="text-sm text-muted-foreground">5 collecteurs actifs</p>
                </div>
                <Badge variant="default">En ligne</Badge>
              </div>
              
              <Button variant="outline" className="w-full">
                Signaler un problème
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
