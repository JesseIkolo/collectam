"use client";

import { useState, useEffect } from "react";
import { useWasteRequests } from "@/contexts/WasteRequestContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Calendar, Award, Plus, AlertTriangle, Trash2, Clock, Building } from "lucide-react";
import { dashboardService } from "@/services/DashboardService";
import { wasteService } from "@/services/WasteService";
import Link from "next/link";

interface EnterpriseDashboardData {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  totalWeight: number;
  recentRequests: {
    _id: string;
    wasteType: string;
    status: string;
    address: string;
    preferredDate: string;
    preferredTime: string;
    estimatedWeight: number;
    urgency: string;
  }[];
  carbonFootprintReduced: number;
  pointsEarned: number;
  badges: string[];
}

export function EnterpriseDashboard() {
  const { wasteRequests } = useWasteRequests();
  const [dashboardData, setDashboardData] = useState<EnterpriseDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getEnterpriseDashboard();
        const apiData = response.data;
        
        // Convertir les données API vers le format EnterpriseDashboardData
        const enterpriseData: EnterpriseDashboardData = {
          totalRequests: apiData.reports?.total || wasteRequests.length,
          pendingRequests: apiData.reports?.pending || wasteRequests.filter(r => r.status === 'pending').length,
          completedRequests: apiData.reports?.completed || wasteRequests.filter(r => r.status === 'completed').length,
          totalWeight: apiData.totalWeight || wasteRequests.reduce((sum, r) => sum + r.estimatedWeight, 0),
          recentRequests: apiData.recentRequests || wasteRequests.slice(0, 5).map(r => ({
            _id: r.id,
            wasteType: r.wasteType,
            status: r.status,
            address: r.address,
            preferredDate: r.preferredDate,
            preferredTime: r.preferredTime,
            estimatedWeight: r.estimatedWeight,
            urgency: r.urgency
          })),
          carbonFootprintReduced: apiData.environmentalImpact?.carbonFootprintReduced || wasteRequests.reduce((sum, r) => sum + r.estimatedWeight * 2.3, 0),
          pointsEarned: apiData.points || wasteRequests.filter(r => r.status === 'completed').length * 50,
          badges: ['Entreprise Verte', 'Partenaire Collectam']
        };
        
        setDashboardData(enterpriseData);
      } catch (err) {
        console.error('Erreur lors du chargement du dashboard entreprise:', err);
        setError('Impossible de charger les données du dashboard');
        
        // Fallback avec les données du contexte
        const fallbackData: EnterpriseDashboardData = {
          totalRequests: wasteRequests.length,
          pendingRequests: wasteRequests.filter(r => r.status === 'pending').length,
          completedRequests: wasteRequests.filter(r => r.status === 'completed').length,
          totalWeight: wasteRequests.reduce((sum, r) => sum + r.estimatedWeight, 0),
          recentRequests: wasteRequests.slice(0, 5).map(r => ({
            _id: r.id,
            wasteType: r.wasteType,
            status: r.status,
            address: r.address,
            preferredDate: r.preferredDate,
            preferredTime: r.preferredTime,
            estimatedWeight: r.estimatedWeight,
            urgency: r.urgency
          })),
          carbonFootprintReduced: wasteRequests.reduce((sum, r) => sum + r.estimatedWeight * 2.3, 0),
          pointsEarned: wasteRequests.filter(r => r.status === 'completed').length * 50,
          badges: ['Entreprise Verte', 'Partenaire Collectam']
        };
        setDashboardData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [wasteRequests]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Impossible de charger les données du dashboard entreprise.
        </AlertDescription>
      </Alert>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "En attente", variant: "secondary" as const },
      scheduled: { label: "Programmé", variant: "default" as const },
      in_progress: { label: "En cours", variant: "default" as const },
      completed: { label: "Terminé", variant: "default" as const },
      cancelled: { label: "Annulé", variant: "destructive" as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig = {
      low: { label: "Faible", className: "bg-green-100 text-green-800" },
      medium: { label: "Moyenne", className: "bg-yellow-100 text-yellow-800" },
      high: { label: "Élevée", className: "bg-red-100 text-red-800" }
    };
    
    const config = urgencyConfig[urgency as keyof typeof urgencyConfig] || urgencyConfig.medium;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Entreprise</h1>
          <p className="text-muted-foreground">
            Gérez vos demandes de collecte de déchets d'entreprise
          </p>
        </div>
        <Link href="/dashboard/waste-management">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle demande
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des demandes</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              Toutes vos demandes de collecte
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              Demandes en cours de traitement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Poids total collecté</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalWeight.toFixed(1)} kg</div>
            <p className="text-xs text-muted-foreground">
              Déchets traités par votre entreprise
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impact environnemental</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.carbonFootprintReduced.toFixed(1)} kg CO₂</div>
            <p className="text-xs text-muted-foreground">
              Émissions évitées
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes récentes</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboardData.recentRequests.length === 0 ? (
            <div className="text-center py-8">
              <Trash2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Aucune demande</h3>
              <p className="text-muted-foreground">
                Vous n'avez pas encore créé de demande de collecte.
              </p>
              <Link href="/dashboard/waste-management">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer une demande
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData.recentRequests.map((request) => (
                <div key={request._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Trash2 className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium capitalize">{request.wasteType}</p>
                      <div className="flex items-center text-sm text-muted-foreground space-x-4">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {request.address}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(request.preferredDate).toLocaleDateString('fr-FR')} à {request.preferredTime}
                        </span>
                        <span>{request.estimatedWeight} kg</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getUrgencyBadge(request.urgency)}
                    {getStatusBadge(request.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enterprise Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Certifications Entreprise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {dashboardData.badges.map((badge, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                {badge}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
