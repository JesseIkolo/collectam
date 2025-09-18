"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  Users, 
  Truck, 
  Settings, 
  CreditCard,
  TrendingUp,
  Activity,
  CheckCircle
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
      // Récupérer les données réelles de l'utilisateur
      const currentUser = AuthService.getUser();
      const userSubscription = currentUser?.subscription;
      
      // Mapping des plans
      const planMapping = {
        'business-monthly': 'Mensuel',
        'business-quarterly': 'Trimestriel',
        'business-yearly': 'Annuel'
      };
      
      setTimeout(() => {
        setDashboardData({
          subscription: {
            plan: userSubscription?.planId ? 
              planMapping[userSubscription.planId as keyof typeof planMapping] || 'Mensuel' :
              'Mensuel',
            status: 'active',
            daysLeft: 45,
            expiresAt: '2024-04-15'
          },
          fleet: {
            totalVehicles: 8,
            activeVehicles: 6,
            totalCollectors: 12,
            activeCollectors: 9
          },
          stats: {
            totalCollections: 234,
            totalWeight: 1567,
            averageResponseTime: 18,
            customerSatisfaction: 4.8
          }
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
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
              <CardTitle className="text-sm font-medium">Collectes</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.stats.totalCollections}</div>
              <p className="text-xs text-muted-foreground">
                Ce mois
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.stats.customerSatisfaction}/5</div>
              <p className="text-xs text-muted-foreground">
                Note moyenne
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
