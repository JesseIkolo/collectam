"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Truck, 
  Users, 
  Activity, 
  Clock, 
  BarChart3, 
  CreditCard
} from "lucide-react";
import Link from "next/link";
import { AuthService } from '@/lib/auth';

// Import des pages
import FleetPage from "./fleet/page";
import MapPage from "./map/page";
import AnalyticsPage from "./analytics/page";
import BillingPage from "./billing/page";
import SettingsPage from "./settings/page";

const navigation = [
  { name: 'Vue d\'ensemble', href: '/dashboard/business', icon: BarChart3, current: true },
  { name: 'Carte Temps Réel', href: '/dashboard/business/map', icon: MapPin, current: false },
  { name: 'Gestion de Flotte', href: '/dashboard/business/fleet', icon: Truck, current: false },
  { name: 'Analytics', href: '/dashboard/business/analytics', icon: Activity, current: false },
  { name: 'Facturation', href: '/dashboard/business/billing', icon: CreditCard, current: false },
  { name: 'Paramètres', href: '/dashboard/business/settings', icon: Settings, current: false },
];

export default function BusinessDashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🏢 Chargement des données dashboard business...');
      
      // Récupérer les données réelles de l'utilisateur
      const currentUser = AuthService.getUser();
      const userSubscription = currentUser?.subscription;
      
      // Mapping des plans
      const planMapping = {
        'business-monthly': 'Mensuel',
        'business-quarterly': 'Trimestriel',
        'business-yearly': 'Annuel'
      };

      // Récupérer les données de flotte réelles
      const token = localStorage.getItem('accessToken');
      const [collectorsResponse, vehiclesResponse, statsResponse] = await Promise.allSettled([
        fetch('/api/business-collectors', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/business-vehicles', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/business-subscription/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      // Traiter les données des collecteurs
      let collectorsData = [];
      if (collectorsResponse.status === 'fulfilled' && collectorsResponse.value.ok) {
        const collectorsResult = await collectorsResponse.value.json();
        collectorsData = collectorsResult.data || [];
      }

      // Traiter les données des véhicules
      let vehiclesData = [];
      if (vehiclesResponse.status === 'fulfilled' && vehiclesResponse.value.ok) {
        const vehiclesResult = await vehiclesResponse.value.json();
        vehiclesData = vehiclesResult.data || [];
      }

      // Traiter les statistiques
      let statsData = {};
      if (statsResponse.status === 'fulfilled' && statsResponse.value.ok) {
        const statsResult = await statsResponse.value.json();
        statsData = statsResult.data || {};
      }

      // Calculer les métriques réelles
      const activeCollectors = collectorsData.filter((c: any) => c.status === 'actif').length;
      const activeVehicles = vehiclesData.filter((v: any) => v.status === 'actif').length;

      // Calculer la date d'expiration de l'abonnement
      const subscriptionDate = userSubscription?.createdAt ? new Date(userSubscription.createdAt) : new Date();
      const planDuration = userSubscription?.planId === 'business-yearly' ? 365 : 
                          userSubscription?.planId === 'business-quarterly' ? 90 : 30;
      const expirationDate = new Date(subscriptionDate.getTime() + (planDuration * 24 * 60 * 60 * 1000));
      const daysLeft = Math.max(0, Math.ceil((expirationDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)));

      setDashboardData({
        subscription: {
          plan: userSubscription?.planId ? 
            planMapping[userSubscription.planId as keyof typeof planMapping] || 'Mensuel' :
            'Mensuel',
          status: userSubscription?.status || 'active',
          daysLeft,
          expiresAt: expirationDate.toISOString()
        },
        fleet: {
          totalVehicles: vehiclesData.length,
          activeVehicles,
          totalCollectors: collectorsData.length,
          activeCollectors
        },
        stats: {
          totalCollections: statsData.totalCollections || 0,
          totalWeight: statsData.totalWeight || 0,
          averageResponseTime: statsData.averageResponseTime || 0,
          customerSatisfaction: statsData.customerSatisfaction || 0
        }
      });

      console.log('✅ Données dashboard business chargées:', {
        collectors: collectorsData.length,
        vehicles: vehiclesData.length,
        activeCollectors,
        activeVehicles
      });

    } catch (error) {
      console.error('❌ Erreur chargement dashboard business:', error);
      // Fallback avec données minimales
      const currentUser = AuthService.getUser();
      const userSubscription = currentUser?.subscription;
      
      setDashboardData({
        subscription: {
          plan: 'Mensuel',
          status: 'active',
          daysLeft: 30,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        fleet: {
          totalVehicles: 0,
          activeVehicles: 0,
          totalCollectors: 0,
          activeCollectors: 0
        },
        stats: {
          totalCollections: 0,
          totalWeight: 0,
          averageResponseTime: 0,
          customerSatisfaction: 0
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Déterminer quelle page afficher selon l'URL
  const renderCurrentPage = () => {
    switch (pathname) {
      case '/dashboard/business/fleet':
        return <FleetPage />;
      case '/dashboard/business/map':
        return <MapPage />;
      case '/dashboard/business/analytics':
        return <AnalyticsPage />;
      case '/dashboard/business/billing':
        return <BillingPage />;
      case '/dashboard/business/settings':
        return <SettingsPage />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => {
    if (loading) {
      return (
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">Dashboard Business</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Vue d'ensemble de votre activité de collecte
          </p>
        </div>

        {/* Subscription Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Statut de l'Abonnement</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <span>Plan {dashboardData?.subscription.plan}</span>
              <span className="text-sm text-muted-foreground">
                {dashboardData?.subscription.daysLeft} jours restants
              </span>
            </div>
            <Progress 
              value={(dashboardData?.subscription.daysLeft / 90) * 100} 
              className="mb-2" 
            />
            <p className="text-sm text-muted-foreground">
              Expire le {new Date(dashboardData?.subscription.expiresAt).toLocaleDateString('fr-FR')}
            </p>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Véhicules</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.fleet.totalVehicles}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData?.fleet.activeVehicles} actifs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collecteurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.fleet.totalCollectors}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData?.fleet.activeCollectors} en service
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Missions Actives</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.stats.totalCollections}</div>
              <p className="text-xs text-muted-foreground">
                Assignées aux collecteurs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps Réponse</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.stats.averageResponseTime}h</div>
              <p className="text-xs text-muted-foreground">
                Temps moyen
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="truncate">Gestion de Flotte</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Gérez vos véhicules et assignez des collecteurs
              </p>
              <Link href="/dashboard/business/fleet">
                <Button className="w-full">
                  <Truck className="w-4 h-4 mr-2" />
                  Voir la flotte
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="truncate">Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Analysez les performances de votre équipe
              </p>
              <Link href="/dashboard/business/analytics">
                <Button className="w-full" variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Voir les rapports
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="truncate">Facturation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Gérez votre abonnement et vos factures
              </p>
              <Link href="/dashboard/business/billing">
                <Button className="w-full" variant="outline">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Voir la facturation
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return renderCurrentPage();
}
