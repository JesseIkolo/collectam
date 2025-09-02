"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Calendar, Award, Plus, AlertTriangle } from "lucide-react";
import { dashboardService, DashboardData } from "@/services/DashboardService";

export function UserDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getUserDashboard();
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
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

  const user = dashboardData?.data?.user || {};
  const reports = dashboardData?.data?.reports || {};
  const scheduledCollections = dashboardData?.data?.scheduledCollections || [];
  const impact = dashboardData?.data?.impact || {};
  const rewards = dashboardData?.data?.rewards || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bonjour, {user.name}! 👋
          </h1>
          <p className="text-muted-foreground">
            Votre tableau de bord personnel Collectam
          </p>
        </div>
        <Badge variant="secondary">Utilisateur</Badge>
      </div>

      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle>Bienvenue sur Collectam</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scheduledCollections.length > 0 && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm">
                  Prochaine collecte: {new Date(scheduledCollections[0].scheduledDate).toLocaleDateString()}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-green-600" />
              <span className="text-sm">{user.points || 0} points écologiques</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Report Button */}
      <Button className="w-full flex items-center gap-2" size="lg">
        <Plus className="h-4 w-4" />
        Signaler un déchet
      </Button>

      {/* Reports Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total signalements</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.pending || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collectés</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.completed || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Scheduled Collections */}
      {scheduledCollections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mes collectes programmées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scheduledCollections.map((collection: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Collecte programmée</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(collection.scheduledDate).toLocaleDateString()} à {new Date(collection.scheduledDate).toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge variant="secondary">Programmée</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Environmental Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Mon impact environnemental</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-green-600">
                {impact.wasteCollected?.toFixed(1) || 0} kg
              </div>
              <p className="text-sm text-muted-foreground">Déchets collectés</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-blue-600">
                {impact.co2Saved?.toFixed(1) || 0} kg
              </div>
              <p className="text-sm text-muted-foreground">CO₂ évité</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-green-500">
                {impact.treesEquivalent || 0}
              </div>
              <p className="text-sm text-muted-foreground">Arbres équivalents</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rewards */}
      <Card>
        <CardHeader>
          <CardTitle>Mes récompenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Points totaux</span>
              <span className="text-lg font-bold">{rewards.points || 0}</span>
            </div>
            
            {rewards.badges?.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Badges obtenus</p>
                <div className="grid grid-cols-3 gap-2">
                  {rewards.badges.map((badge: any, index: number) => (
                    <Badge key={index} variant="secondary" className="justify-center py-2">
                      {badge.icon} {badge.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {rewards.nextReward && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Prochain badge</p>
                <p className="text-sm text-muted-foreground">
                  {rewards.nextReward.name} - {rewards.nextReward.pointsNeeded} points restants
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
