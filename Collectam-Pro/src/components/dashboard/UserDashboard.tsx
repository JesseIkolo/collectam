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

interface UserDashboardData {
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
  badgesUnlocked: number;
  achievements: { icon: string; name: string }[];
}

export function UserDashboard() {
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getRecentRequests } = useWasteRequests();
  const [recentWasteRequests, setRecentWasteRequests] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [getRecentRequests]);

  const loadDashboardData = async () => {
    try {
      // Récupérer les données depuis le contexte
      const recentRequests = getRecentRequests(3);
  
      // Mock data pour le dashboard utilisateur
      const mockDashboardData: UserDashboardData = {
        totalRequests: recentRequests.length + 9,
        pendingRequests: recentRequests.filter(r => r.status === 'pending').length + 1,
        completedRequests: recentRequests.filter(r => r.status === 'completed').length + 6,
        totalWeight: recentRequests.reduce((sum, r) => sum + r.estimatedWeight, 0) + 40,
        recentRequests: recentRequests.map(req => ({
          _id: req.id,
          wasteType: req.wasteType.toLowerCase(),
          status: req.status,
          address: req.address,
          preferredDate: req.preferredDate,
          preferredTime: req.preferredTime,
          estimatedWeight: req.estimatedWeight,
          urgency: req.urgency
        })),
        carbonFootprintReduced: 15.2,
        pointsEarned: 120,
        badgesUnlocked: 3,
        achievements: [
          { icon: "", name: "Éco-débutant" },
          { icon: "", name: "Recycleur" },
          { icon: "", name: "Champion du tri" }
        ]
      };
      setDashboardData(mockDashboardData);
      setRecentWasteRequests(mockDashboardData.recentRequests);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement du dashboard');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Chargement...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
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

  // Utiliser directement les données mockées
  const totalRequests = dashboardData?.totalRequests || 0;
  const pendingRequests = dashboardData?.pendingRequests || 0;
  const completedRequests = dashboardData?.completedRequests || 0;
  const totalWeight = dashboardData?.totalWeight || 0;
  const pointsEarned = dashboardData?.pointsEarned || 0;
  const achievements = dashboardData?.achievements || [];

  return (
    <div className="space-y-6">
      {/* Header avec informations utilisateur */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground">
            Bienvenue, voici un aperçu de votre activité
          </p>
        </div>
        
        <Button asChild>
          <Link href="/dashboard/user/waste-management">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle demande
          </Link>
        </Button>  
        <Button>
          <Badge variant="outline">
            {0} points
          </Badge>
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demandes totales</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              +2 depuis le mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              À traiter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminées</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedRequests}</div>
            <p className="text-xs text-muted-foreground">
              Ce mois-ci
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Poids total</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWeight} kg</div>
            <p className="text-xs text-muted-foreground">
              Déchets collectés
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Demandes récentes */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentWasteRequests.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Aucune demande récente
              </p>
            ) : (
              recentWasteRequests.map((request) => (
                <div key={request._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div>
                      <p className="font-medium">{request.wasteType}</p>
                      <p className="text-sm text-muted-foreground">{request.preferredDate}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{request.status}</Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Impact environnemental */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Impact environnemental</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>CO2 économisé</span>
                <span className="font-bold">{Math.round(totalWeight * 0.5)} kg</span>
              </div>
              <div className="flex justify-between">
                <span>Déchets recyclés</span>
                <span className="font-bold">{totalWeight} kg</span>
              </div>
              <div className="flex justify-between">
                <span>Arbres sauvés</span>
                <span className="font-bold">{Math.round(totalWeight * 0.1)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Récompenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Points totaux</span>
                <span className="font-bold text-lg">{pointsEarned}</span>
              </div>
              {achievements && achievements.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Badges obtenus:</p>
                  <div className="flex flex-wrap gap-2">
                    {achievements.map((badge, index) => (
                      <Badge key={`badge-${index}-${badge.name}`} variant="secondary">
                        {badge.icon} {badge.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Continuez à recycler pour débloquer des badges !
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
