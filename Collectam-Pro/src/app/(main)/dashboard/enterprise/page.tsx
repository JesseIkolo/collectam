"use client";

import React, { useState, useEffect } from 'react';
import { AuthService } from '@/lib/auth';
import { CustomPieChart, ProgressRing, DonutChart, CustomLineChart } from '@/components/charts';
import { 
  Building2, 
  Users, 
  Truck, 
  BarChart3, 
  Calendar,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  Recycle,
  DollarSign,
  FileText,
  Settings,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

interface EnterpriseDashboardData {
  company: {
    name: string;
    siret: string;
    sector: string;
    employees: number;
    sites: number;
  };
  wasteManagement: {
    totalVolume: number;
    monthlyVolume: number;
    wasteTypes: {
      organic: number;
      recyclable: number;
      hazardous: number;
      general: number;
    };
    costSavings: number;
  };
  collections: {
    scheduled: number;
    completed: number;
    pending: number;
    cancelled: number;
  };
  sustainability: {
    carbonReduction: number;
    recyclingRate: number;
    complianceScore: number;
    certifications: string[];
  };
  recentActivities: {
    id: string;
    type: string;
    description: string;
    date: string;
    status: string;
  }[];
  trend30Days?: { name: string; value: number }[];
}

export default function EnterprisePage() {
  const [dashboardData, setDashboardData] = useState<EnterpriseDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🏢 Chargement des données dashboard entreprise...');
      
      // Récupérer les données utilisateur réelles
      const currentUser = AuthService.getUser();
      const token = localStorage.getItem('accessToken');

      // Récupérer les données réelles de l'entreprise
      const [wasteRequestsResponse, statsResponse, complianceResponse] = await Promise.allSettled([
        fetch('/api/waste-collection-requests/user', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/enterprise/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/enterprise/compliance', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      // Traiter les demandes de collecte
      let wasteRequests = [];
      if (wasteRequestsResponse.status === 'fulfilled' && wasteRequestsResponse.value.ok) {
        const wasteRequestsResult = await wasteRequestsResponse.value.json();
        wasteRequests = wasteRequestsResult.data || [];
      }

      // Traiter les statistiques
      let enterpriseStats: any = {};
      if (statsResponse.status === 'fulfilled' && statsResponse.value.ok) {
        const statsResult = await statsResponse.value.json();
        enterpriseStats = statsResult.data || {};
      }

      // Traiter les données de conformité
      let complianceData: any = {};
      if (complianceResponse.status === 'fulfilled' && complianceResponse.value.ok) {
        const complianceResult = await complianceResponse.value.json();
        complianceData = complianceResult.data || {};
      }

      // Calculer les métriques réelles
      const totalVolume = wasteRequests.reduce((sum: number, req: any) => sum + (req.estimatedWeight || 0), 0);
      const monthlyVolume = wasteRequests
        .filter((req: any) => new Date(req.createdAt).getMonth() === new Date().getMonth())
        .reduce((sum: number, req: any) => sum + (req.estimatedWeight || 0), 0);

      const collections = {
        scheduled: wasteRequests.filter((req: any) => req.status === 'scheduled').length,
        completed: wasteRequests.filter((req: any) => req.status === 'completed').length,
        pending: wasteRequests.filter((req: any) => req.status === 'pending').length,
        cancelled: wasteRequests.filter((req: any) => req.status === 'cancelled').length
      };

      // Calculer la répartition des types de déchets
      const wasteTypeCounts = wasteRequests.reduce((acc: any, req: any) => {
        const type = req.wasteType || 'general';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      const totalRequests = wasteRequests.length;
      const wasteTypes = {
        organic: Math.round(((wasteTypeCounts.organic || 0) / totalRequests) * 100) || 0,
        recyclable: Math.round(((wasteTypeCounts.plastic + wasteTypeCounts.paper + wasteTypeCounts.glass + wasteTypeCounts.metal || 0) / totalRequests) * 100) || 0,
        hazardous: Math.round(((wasteTypeCounts.hazardous || 0) / totalRequests) * 100) || 0,
        general: Math.round(((wasteTypeCounts.mixed || wasteTypeCounts.other || 0) / totalRequests) * 100) || 0
      };

      // Créer les activités récentes basées sur les vraies données
      const recentActivities = wasteRequests
        .slice(0, 3)
        .map((req: any, index: number) => ({
          id: req._id || `activity-${index}`,
          type: "collection",
          description: `Collecte ${req.wasteType} - ${req.address?.substring(0, 30)}...`,
          date: req.createdAt || new Date().toISOString(),
          status: req.status || "pending"
        }));

      // Build 30-day trend of number of requests per day
      const days = Array.from({ length: 30 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (29 - i));
        const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
        const label = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
        const count = wasteRequests.filter((req: any) => (req.createdAt || '').startsWith(key)).length;
        return { name: label, value: count };
      });

      setDashboardData({
        company: {
          name: currentUser?.companyName || `${currentUser?.firstName} ${currentUser?.lastName}`,
          siret: currentUser?.siret || "Non renseigné",
          sector: currentUser?.sector || "Non spécifié",
          employees: enterpriseStats.employees || 1,
          sites: enterpriseStats.sites || 1
        },
        wasteManagement: {
          totalVolume,
          monthlyVolume,
          wasteTypes,
          costSavings: enterpriseStats.costSavings || Math.round(totalVolume * 2.5) // Estimation
        },
        collections,
        sustainability: {
          carbonReduction: Math.round(totalVolume * 0.8), // Estimation basée sur le poids
          recyclingRate: complianceData.recyclingRate || Math.min(95, Math.round((wasteTypes.recyclable / 100) * 100)),
          complianceScore: complianceData.complianceScore || 85,
          certifications: complianceData.certifications || []
        },
        recentActivities,
        trend30Days: days
      });

      console.log('✅ Données dashboard entreprise chargées:', {
        totalRequests: wasteRequests.length,
        totalVolume,
        collections
      });

    } catch (error) {
      console.error('❌ Erreur chargement dashboard entreprise:', error);
      
      // Fallback avec données minimales
      const currentUser = AuthService.getUser();
      setDashboardData({
        company: {
          name: currentUser?.companyName || `${currentUser?.firstName} ${currentUser?.lastName}`,
          siret: "Non renseigné",
          sector: "Non spécifié",
          employees: 1,
          sites: 1
        },
        wasteManagement: {
          totalVolume: 0,
          monthlyVolume: 0,
          wasteTypes: { organic: 0, recyclable: 0, hazardous: 0, general: 0 },
          costSavings: 0
        },
        collections: {
          scheduled: 0,
          completed: 0,
          pending: 0,
          cancelled: 0
        },
        sustainability: {
          carbonReduction: 0,
          recyclingRate: 0,
          complianceScore: 0,
          certifications: []
        },
        recentActivities: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">Dashboard Entreprise</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {dashboardData?.company.name} - Gestion des déchets d'entreprise
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/enterprise/reports">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Rapports
            </Button>
          </Link>
          <Link href="/dashboard/enterprise/settings">
            <Button>
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </Button>
          </Link>
        </div>
      </div>

      {/* Company Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Informations Entreprise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">SIRET</p>
              <p className="font-medium">{dashboardData?.company.siret}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Secteur</p>
              <p className="font-medium">{dashboardData?.company.sector}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Employés</p>
              <p className="font-medium">{dashboardData?.company.employees}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sites</p>
              <p className="font-medium">{dashboardData?.company.sites}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.wasteManagement.totalVolume} kg</div>
            <p className="text-xs text-muted-foreground">
              +{dashboardData?.wasteManagement.monthlyVolume} kg ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Recyclage</CardTitle>
            <Recycle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex justify-center">
            <ProgressRing
              value={dashboardData?.sustainability.recyclingRate || 0}
              size={100}
              color="#10b981"
              label="Recyclage"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Économies</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.wasteManagement.costSavings.toLocaleString()} XOF</div>
            <p className="text-xs text-muted-foreground">
              Par rapport à l'année dernière
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Conformité</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex justify-center">
            <ProgressRing
              value={dashboardData?.sustainability.complianceScore || 0}
              size={100}
              color="#3b82f6"
              label="Conformité"
            />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="collections">Collectes</TabsTrigger>
          <TabsTrigger value="sustainability">Durabilité</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Waste Types Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition des Déchets</CardTitle>
                <CardDescription>Distribution par type de déchet</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomPieChart
                  data={[
                    { 
                      name: 'Recyclable', 
                      value: dashboardData?.wasteManagement.wasteTypes.recyclable || 0, 
                      color: '#10b981' 
                    },
                    { 
                      name: 'Organique', 
                      value: dashboardData?.wasteManagement.wasteTypes.organic || 0, 
                      color: '#84cc16' 
                    },
                    { 
                      name: 'Général', 
                      value: dashboardData?.wasteManagement.wasteTypes.general || 0, 
                      color: '#6b7280' 
                    },
                    { 
                      name: 'Dangereux', 
                      value: dashboardData?.wasteManagement.wasteTypes.hazardous || 0, 
                      color: '#ef4444' 
                    }
                  ].filter(item => item.value > 0)}
                  size="md"
                />
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Activités Récentes</CardTitle>
                <CardDescription>Dernières actions sur votre compte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData?.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {activity.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {activity.status === 'scheduled' && <Clock className="h-4 w-4 text-blue-500" />}
                      {activity.status === 'pending' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* 30-day Requests Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Tendance des demandes (30 jours)</CardTitle>
              <CardDescription>Nombre de demandes créées par jour</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomLineChart
                data={dashboardData?.trend30Days || []}
                color="#3b82f6"
                height={260}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statut des Collectes</CardTitle>
            </CardHeader>
            <CardContent>
              <DonutChart
                data={[
                  { name: 'Terminées', value: dashboardData?.collections.completed || 0, color: '#10b981' },
                  { name: 'Programmées', value: dashboardData?.collections.scheduled || 0, color: '#3b82f6' },
                  { name: 'En Attente', value: dashboardData?.collections.pending || 0, color: '#f59e0b' },
                  { name: 'Annulées', value: dashboardData?.collections.cancelled || 0, color: '#ef4444' }
                ].filter(item => item.value > 0)}
                size="md"
                centerText={`${(dashboardData?.collections.completed || 0) + (dashboardData?.collections.scheduled || 0) + (dashboardData?.collections.pending || 0) + (dashboardData?.collections.cancelled || 0)}`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sustainability" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Impact Environnemental</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Réduction CO2</p>
                  <p className="text-2xl font-bold">{dashboardData?.sustainability.carbonReduction} kg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taux de recyclage</p>
                  <p className="text-2xl font-bold">{dashboardData?.sustainability.recyclingRate}%</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {dashboardData?.sustainability.certifications.map((cert, index) => (
                  <Badge key={index} variant="outline" className="mr-2">
                    {cert}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Avancées</CardTitle>
              <CardDescription>Analyses détaillées disponibles dans la section dédiée</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/enterprise/analytics">
                <Button>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Voir les Analytics Complètes
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/enterprise/waste-management">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Gestion des Déchets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Planifier et suivre les collectes</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/enterprise/sites">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Gestion des Sites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Gérer vos différents sites</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/enterprise/compliance">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Conformité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Suivi réglementaire</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/enterprise/reports">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Rapports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Rapports détaillés</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
