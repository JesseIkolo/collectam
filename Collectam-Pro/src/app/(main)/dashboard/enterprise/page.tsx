"use client";

import React, { useState, useEffect } from 'react';
import { AuthService } from '@/lib/auth';
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
}

export default function EnterprisePage() {
  const [dashboardData, setDashboardData] = useState<EnterpriseDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer les données utilisateur réelles
    const currentUser = AuthService.getUser();
    
    // Simuler des données entreprise avec les vraies infos utilisateur
    setTimeout(() => {
      setDashboardData({
        company: {
          name: currentUser?.companyName || `${currentUser?.firstName} ${currentUser?.lastName}`,
          siret: "12345678901234",
          sector: "Technologie",
          employees: 150,
          sites: 3
        },
        wasteManagement: {
          totalVolume: 2450,
          monthlyVolume: 320,
          wasteTypes: {
            organic: 30,
            recyclable: 45,
            hazardous: 10,
            general: 15
          },
          costSavings: 15600
        },
        collections: {
          scheduled: 12,
          completed: 8,
          pending: 3,
          cancelled: 1
        },
        sustainability: {
          carbonReduction: 1250,
          recyclingRate: 78,
          complianceScore: 92,
          certifications: ["ISO 14001", "OHSAS 18001"]
        },
        recentActivities: [
          {
            id: "1",
            type: "collection",
            description: "Collecte programmée - Site Principal",
            date: "2024-01-15T09:00:00Z",
            status: "completed"
          },
          {
            id: "2",
            type: "report",
            description: "Rapport mensuel généré",
            date: "2024-01-14T16:30:00Z",
            status: "completed"
          },
          {
            id: "3",
            type: "audit",
            description: "Audit de conformité prévu",
            date: "2024-01-20T14:00:00Z",
            status: "scheduled"
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

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
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.sustainability.recyclingRate}%</div>
            <Progress value={dashboardData?.sustainability.recyclingRate} className="mt-2" />
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
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.sustainability.complianceScore}/100</div>
            <Progress value={dashboardData?.sustainability.complianceScore} className="mt-2" />
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
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Recyclable</span>
                    <span className="text-sm font-medium">{dashboardData?.wasteManagement.wasteTypes.recyclable}%</span>
                  </div>
                  <Progress value={dashboardData?.wasteManagement.wasteTypes.recyclable} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Organique</span>
                    <span className="text-sm font-medium">{dashboardData?.wasteManagement.wasteTypes.organic}%</span>
                  </div>
                  <Progress value={dashboardData?.wasteManagement.wasteTypes.organic} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Général</span>
                    <span className="text-sm font-medium">{dashboardData?.wasteManagement.wasteTypes.general}%</span>
                  </div>
                  <Progress value={dashboardData?.wasteManagement.wasteTypes.general} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Dangereux</span>
                    <span className="text-sm font-medium">{dashboardData?.wasteManagement.wasteTypes.hazardous}%</span>
                  </div>
                  <Progress value={dashboardData?.wasteManagement.wasteTypes.hazardous} className="bg-red-100" />
                </div>
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
        </TabsContent>

        <TabsContent value="collections" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Programmées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.collections.scheduled}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Terminées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{dashboardData?.collections.completed}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">En Attente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{dashboardData?.collections.pending}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Annulées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{dashboardData?.collections.cancelled}</div>
              </CardContent>
            </Card>
          </div>
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
