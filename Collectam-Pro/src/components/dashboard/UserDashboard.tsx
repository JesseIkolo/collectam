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
import { DonutChart, CustomLineChart } from "@/components/charts";

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
  statusDistribution?: {
    pending: number;
    scheduled: number;
    in_progress: number;
    completed: number;
    cancelled: number;
  };
  trend7Days?: { name: string; value: number }[];
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
      setLoading(true);
      console.log('🏠 Chargement des données dashboard ménage...');
      
      // Récupérer les vraies données depuis l'API
      const token = localStorage.getItem('accessToken');
      const [wasteRequestsResponse, userStatsResponse] = await Promise.allSettled([
        fetch('/api/waste-collection-requests/user', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/user/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      // Traiter les demandes de collecte
      let userRequests = [];
      if (wasteRequestsResponse.status === 'fulfilled' && wasteRequestsResponse.value.ok) {
        const requestsResult = await wasteRequestsResponse.value.json();
        userRequests = requestsResult.data || [];
      } else {
        // Fallback vers le contexte si l'API n'est pas disponible
        userRequests = getRecentRequests(10);
      }

      // Traiter les statistiques utilisateur
      let userStats: any = {};
      if (userStatsResponse.status === 'fulfilled' && userStatsResponse.value.ok) {
        const statsResult = await userStatsResponse.value.json();
        userStats = statsResult.data || {};
      }

      // Calculer les métriques réelles
      const totalWeight = userRequests.reduce((sum: number, req: any) => sum + (req.estimatedWeight || 0), 0);
      const pendingRequests = userRequests.filter((r: any) => r.status === 'pending').length;
      const completedRequests = userRequests.filter((r: any) => r.status === 'completed').length;
      const scheduledRequests = userRequests.filter((r: any) => r.status === 'scheduled').length;
      const inProgressRequests = userRequests.filter((r: any) => r.status === 'in_progress').length;
      const cancelledRequests = userRequests.filter((r: any) => r.status === 'cancelled').length;
      
      // Tendance 7 jours (nombre de demandes créées par jour)
      const trend7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const key = d.toISOString().slice(0, 10);
        const label = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
        const count = userRequests.filter((req: any) => (req.createdAt || '').startsWith(key)).length;
        return { name: label, value: count };
      });
      
      // Prendre les 3 demandes les plus récentes
      const recentRequests = userRequests
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)
        .map((req: any) => ({
          _id: req._id || req.id,
          wasteType: req.wasteType,
          status: req.status,
          address: req.address,
          preferredDate: req.preferredDate,
          preferredTime: req.preferredTime,
          estimatedWeight: req.estimatedWeight,
          urgency: req.urgency
        }));

      const dashboardData: UserDashboardData = {
        totalRequests: userRequests.length,
        pendingRequests,
        completedRequests,
        totalWeight,
        recentRequests,
        carbonFootprintReduced: Math.round(totalWeight * 0.8), // Estimation basée sur le poids
        pointsEarned: userStats.pointsEarned || (completedRequests * 10),
        badgesUnlocked: userStats.badgesUnlocked || Math.floor(completedRequests / 3),
        achievements: userStats.achievements || (completedRequests > 0 ? [
          { icon: "🌱", name: "Éco-débutant" }
        ] : []),
        statusDistribution: {
          pending: pendingRequests,
          scheduled: scheduledRequests,
          in_progress: inProgressRequests,
          completed: completedRequests,
          cancelled: cancelledRequests
        },
        trend7Days
      };

      setDashboardData(dashboardData);
      setRecentWasteRequests(recentRequests);

      console.log('✅ Données dashboard ménage chargées:', {
        totalRequests: userRequests.length,
        pendingRequests,
        completedRequests,
        totalWeight
      });

    } catch (err) {
      console.error('❌ Erreur chargement dashboard ménage:', err);
      
      // Fallback avec données du contexte
      const recentRequests = getRecentRequests(3);
      const fallbackData: UserDashboardData = {
        totalRequests: recentRequests.length,
        pendingRequests: recentRequests.filter(r => r.status === 'pending').length,
        completedRequests: recentRequests.filter(r => r.status === 'completed').length,
        totalWeight: recentRequests.reduce((sum, r) => sum + r.estimatedWeight, 0),
        recentRequests: recentRequests.map(req => ({
          _id: req.id,
          wasteType: req.wasteType,
          status: req.status,
          address: req.address,
          preferredDate: req.preferredDate,
          preferredTime: req.preferredTime,
          estimatedWeight: req.estimatedWeight,
          urgency: req.urgency
        })),
        carbonFootprintReduced: 0,
        pointsEarned: 0,
        badgesUnlocked: 0,
        achievements: []
      };
      
      setDashboardData(fallbackData);
      setRecentWasteRequests(fallbackData.recentRequests);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement du dashboard');
    } finally {
      setLoading(false);
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
        
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/user/waste-management">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle demande
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="/dashboard/user/map">
              <MapPin className="h-4 w-4 mr-2" />
              Carte Temps Réel
            </Link>
          </Button>
          
          <Button variant="ghost">
            <Badge variant="outline">
              {pointsEarned} points
            </Badge>
          </Button>
        </div>
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
              Total des demandes
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
              Collectes terminées
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

      {/* Visualisations */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Répartition des statuts */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des statuts</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={[
                { name: 'Terminées', value: dashboardData?.statusDistribution?.completed || 0, color: '#10b981' },
                { name: 'Programmées', value: dashboardData?.statusDistribution?.scheduled || 0, color: '#3b82f6' },
                { name: 'En cours', value: dashboardData?.statusDistribution?.in_progress || 0, color: '#f59e0b' },
                { name: 'En attente', value: dashboardData?.statusDistribution?.pending || 0, color: '#6b7280' },
                { name: 'Annulées', value: dashboardData?.statusDistribution?.cancelled || 0, color: '#ef4444' },
              ].filter(item => item.value > 0)}
              size="md"
              centerText={`${dashboardData?.totalRequests || 0}`}
            />
          </CardContent>
        </Card>

        {/* Tendance 7 jours */}
        <Card>
          <CardHeader>
            <CardTitle>Tendance des demandes (7 jours)</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomLineChart
              data={dashboardData?.trend7Days || []}
              color="#3b82f6"
              height={260}
            />
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
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{Math.round(totalWeight * 0.5)}</div>
                <div className="text-xs text-muted-foreground">kg CO2 économisé</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{totalWeight}</div>
                <div className="text-xs text-muted-foreground">kg recyclés</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">{Math.round(totalWeight * 0.1)}</div>
                <div className="text-xs text-muted-foreground">arbres sauvés</div>
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
